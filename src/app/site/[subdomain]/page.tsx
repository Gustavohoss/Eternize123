
import React from 'react';
import { Metadata } from 'next';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';
import SiteClient from './SiteClient';

function getDb() {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  return getFirestore(app);
}

interface Props {
  params: Promise<{ subdomain: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subdomain } = await params;
  const db = getDb();
  
  // Define o domínio base. Prioriza variável de ambiente, depois o domínio final.
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eternizee.shop';
  
  try {
    const siteRef = doc(db, 'published_sites', subdomain);
    const siteSnap = await getDoc(siteRef);

    if (!siteSnap.exists()) {
      return { title: 'Site não encontrado | Eternize' };
    }

    const siteData = siteSnap.data();
    const config = JSON.parse(siteData.contentJson || '{}');
    
    // Verifica se existe foto personalizada na subcoleção media
    const metaPhotoSnap = await getDoc(doc(db, 'published_sites', subdomain, 'media', 'meta_preview'));
    const hasCustomPhoto = metaPhotoSnap.exists();

    const title = config.metaTitle || siteData.name || 'Um presente especial para você';
    const description = 'Abra para ver a surpresa que preparei... ❤️';
    
    // Cache busting: adicionamos um timestamp para forçar o WhatsApp a atualizar a imagem quando ela mudar
    const lastUpdate = siteData.updatedAt ? siteData.updatedAt.toMillis() : Date.now();
    
    // URL absoluta para a imagem com parâmetro de versão para burlar o cache
    const imageUrl = hasCustomPhoto 
      ? `${baseUrl}/api/site/${subdomain}/preview?v=${lastUpdate}`
      : 'https://s3.typebotstorage.com/public/workspaces/cm7vfrzsh0001xixq5auwzryb/typebots/cmor2i57p000007huwd9cnpp5/blocks/rnrd9dgoh72piuhxaqenuibb?v=1777891185088';
    
    return {
      title: title,
      description: description,
      openGraph: {
        title: title,
        description: description,
        url: `${baseUrl}/site/${subdomain}`,
        siteName: 'Eternize',
        type: 'website',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: description,
        images: [imageUrl],
      }
    };
  } catch (e) {
    return { title: 'Eternize | Presente Especial' };
  }
}

export default async function PublishedSitePage({ params }: Props) {
  const { subdomain } = await params;
  return <SiteClient subdomain={subdomain} />;
}
