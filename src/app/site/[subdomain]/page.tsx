
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDocs, collection } from 'firebase/firestore';
import { useDoc, useFirestore } from '@/firebase';
import { DeviceMockup } from '@/components/eternize/device-mockup';
import { Loader2, Heart } from 'lucide-react';

export default function PublishedSitePage() {
  const params = useParams();
  const subdomain = params.subdomain as string;
  const firestore = useFirestore();

  const [siteConfig, setSiteConfig] = useState<any>(null);
  const [isLoadingMedia, setIsLoadingMedia] = useState(true);

  const siteRef = useMemo(() => {
    if (!firestore || !subdomain) return null;
    return doc(firestore, 'published_sites', subdomain);
  }, [firestore, subdomain]);

  const { data: siteData, isLoading: isDocLoading, error } = useDoc(siteRef as any);

  useEffect(() => {
    if (siteData && firestore && siteRef) {
      const fetchMedia = async () => {
        setIsLoadingMedia(true);
        try {
          const config = JSON.parse(siteData.contentJson);
          const mediaSnap = await getDocs(collection(siteRef, 'media'));
          
          const albumPhotos: string[] = [];
          let spotifyCard = '';
          const memoryPhotos: Record<string, string> = {};
          const journeyPhotos: Record<string, string> = {};

          mediaSnap.forEach(doc => {
            const data = doc.data();
            if (data.type === 'album') {
              const idx = parseInt(doc.id.split('_')[1]);
              albumPhotos[idx] = data.base64;
            } else if (data.type === 'spotify') {
              spotifyCard = data.base64;
            } else if (data.type === 'memory') {
              memoryPhotos[doc.id.replace('memory_', '')] = data.base64;
            } else if (data.type === 'journey') {
              journeyPhotos[doc.id.replace('journey_', '')] = data.base64;
            }
          });

          const processedConfig = {
            ...config,
            isPackEnabled: config.isPackEnabled === true || siteData.isPackEnabled === true,
            date: config.date ? new Date(config.date) : undefined,
            uploadedPhotos: albumPhotos.filter(p => !!p),
            spotifyCardPhoto: spotifyCard,
            memories: (config.memories || []).map((m: any) => ({ ...m, photo: memoryPhotos[m.id] || '' })),
            journeyPoints: (config.journeyPoints || []).map((p: any) => ({ ...p, photo: journeyPhotos[p.id] || '' }))
          };

          setSiteConfig(processedConfig);
        } catch (e) {
          console.error("Error fetching media", e);
        } finally {
          setIsLoadingMedia(false);
        }
      };
      fetchMedia();
    }
  }, [siteData, firestore, siteRef]);

  if (isDocLoading || isLoadingMedia || !siteRef) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 text-white">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <Heart className="w-4 h-4 text-primary absolute inset-0 m-auto animate-pulse" />
        </div>
        <p className="text-xs font-black uppercase tracking-[0.3em] animate-pulse">Carregando sua história...</p>
      </div>
    );
  }

  if (error || !siteData) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center text-white">
        <Heart className="w-12 h-12 text-white/10 mb-4" />
        <h1 className="text-2xl font-black mb-2 uppercase italic tracking-tighter">Site não encontrado</h1>
        <p className="text-white/40 text-sm max-w-xs mb-8 font-medium">O link que você acessou pode estar incorreto ou a página foi removida.</p>
        <a href="/" className="px-8 py-3 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all">Criar meu presente</a>
      </div>
    );
  }

  if (siteData.status === 'pending') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="bg-primary/10 p-6 rounded-full mb-8 border border-primary/20 shadow-[0_0_50px_rgba(225,29,72,0.2)] animate-pulse">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
        <h1 className="text-3xl font-black mb-4 uppercase italic tracking-tighter">Quase pronto!</h1>
        <p className="text-white/60 text-base max-w-md mb-10 font-medium leading-relaxed">Estamos aguardando a confirmação do seu pagamento pela <span className="text-white font-bold">PerfectPay</span>.</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden">
      {siteConfig && <DeviceMockup {...siteConfig} isFullscreen />}
    </div>
  );
}
