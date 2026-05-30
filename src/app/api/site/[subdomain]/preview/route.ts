
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
    
    // Remove o prefixo "data:image/jpeg;base64," se existir
    const base64Image = base64Data.split(';base64,').pop();
    const buffer = Buffer.from(base64Image, 'base64');

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    return new NextResponse('Error loading image', { status: 500 });
  }
}
