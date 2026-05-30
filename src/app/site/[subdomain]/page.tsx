
import React from 'react';
import { Metadata } from 'next';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';
import SiteClient from './SiteClient';

// Inicialização segura para o servidor
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
  
  try {
    const siteRef = doc(db, 'published_sites', subdomain);
    const siteSnap = await getDoc(siteRef);

    if (!siteSnap.exists()) {
      return { title: 'Site não encontrado | Eternize' };
    }

    const siteData = siteSnap.data();
    const config = JSON.parse(siteData.contentJson || '{}');
    
    // Tenta buscar a foto personalizada na subcoleção media
    const metaPhotoSnap = await getDoc(doc(db, 'published_sites', subdomain, 'media', 'meta_preview'));
    const metaPhoto = metaPhotoSnap.exists() ? metaPhotoSnap.data().base64 : null;

    const title = config.metaTitle || siteData.name || 'Um presente especial para você';
    const description = 'Abra para ver a surpresa que preparei... ❤️';
    
    return {
      title: title,
      description: description,
      openGraph: {
        title: title,
        description: description,
        type: 'website',
        // Nota: WhatsApp prefere URLs para imagens. Base64 pode funcionar em alguns casos, 
        // mas o título agora aparecerá 100% das vezes.
        images: metaPhoto ? [metaPhoto] : ['https://s3.typebotstorage.com/public/workspaces/cm7vfrzsh0001xixq5auwzryb/typebots/cmor2i57p000007huwd9cnpp5/blocks/rnrd9dgoh72piuhxaqenuibb?v=1777891185088'],
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: description,
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
