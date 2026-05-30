
import { NextResponse } from 'next/server';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

function getDb() {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  return getFirestore(app);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ subdomain: string }> }
) {
  const { subdomain } = await params;
  const db = getDb();

  try {
    // Busca a foto na subcoleção media
    const metaPhotoSnap = await getDoc(doc(db, 'published_sites', subdomain, 'media', 'meta_preview'));
    
    if (!metaPhotoSnap.exists()) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const base64Data = metaPhotoSnap.data().base64;
    
    if (!base64Data) {
        return new NextResponse('Empty data', { status: 404 });
    }

    // Extrai apenas a parte dos dados binários, ignorando o prefixo data:image/...
    const base64Image = base64Data.includes(';base64,') 
      ? base64Data.split(';base64,').pop() 
      : base64Data;

    const buffer = Buffer.from(base64Image, 'base64');

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Length': buffer.length.toString(),
        // Reduzimos o tempo de cache para facilitar testes e atualizações
        'Cache-Control': 'public, max-age=60, s-maxage=60',
      },
    });
  } catch (error) {
    console.error('Error serving preview image:', error);
    return new NextResponse('Error loading image', { status: 500 });
  }
}
