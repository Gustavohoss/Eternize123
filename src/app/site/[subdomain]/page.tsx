
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

  // Memo para identificar o tema antes mesmo de carregar as fotos
  const theme = useMemo(() => {
    if (!siteData) return null;
    try {
      const config = JSON.parse(siteData.contentJson);
      return config.selectedTheme;
    } catch {
      return null;
    }
  }, [siteData]);

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
    // LOADING ESPECIAL SPOTIFY
    if (theme === 'spotify') {
      return (
        <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center gap-10 text-white overflow-hidden">
          <div className="relative">
            {/* Efeito de brilho verde ao fundo */}
            <div className="absolute inset-0 bg-[#1DB954]/20 rounded-full blur-3xl animate-pulse scale-150" />
            
            <div className="relative w-24 h-24 flex items-center justify-center">
              {/* Círculo externo pulsante */}
              <div className="absolute inset-0 border-2 border-[#1DB954]/30 rounded-full animate-[ping_2s_infinite]" />
              
              {/* Logo Spotify estilizada */}
              <div className="bg-[#1DB954] rounded-full w-20 h-24 flex items-center justify-center shadow-[0_0_40px_rgba(29,185,84,0.4)]">
                 <svg width="45" height="45" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="20" fill="black"></circle>
                    <path d="M10 26.5 Q20 22 31 24.5" stroke="#1DB954" strokeWidth="2.5" strokeLinecap="round" fill="none"></path>
                    <path d="M9 21 Q20 15.5 32 19" stroke="#1DB954" strokeWidth="2.5" strokeLinecap="round" fill="none"></path>
                    <path d="M8 15 Q20 8 33 13" stroke="#1DB954" strokeWidth="2.5" strokeLinecap="round" fill="none"></path>
                  </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
             <p className="text-[#1DB954] text-[11px] font-black uppercase tracking-[0.5em] animate-pulse">Sintonizando Histórias</p>
             
             {/* Visualizer de áudio animado */}
             <div className="flex gap-1.5 items-end h-6">
                <div className="w-1 bg-[#1DB954] rounded-full animate-[wave-ani_1s_ease-in-out_infinite]" style={{ animationDelay: '0.1s' }} />
                <div className="w-1 bg-[#1DB954] rounded-full animate-[wave-ani_1.2s_ease-in-out_infinite]" style={{ animationDelay: '0.3s' }} />
                <div className="w-1 bg-[#1DB954] rounded-full animate-[wave-ani_0.8s_ease-in-out_infinite]" style={{ animationDelay: '0.5s' }} />
                <div className="w-1 bg-[#1DB954] rounded-full animate-[wave-ani_1.1s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }} />
                <div className="w-1 bg-[#1DB954] rounded-full animate-[wave-ani_0.9s_ease-in-out_infinite]" style={{ animationDelay: '0.4s' }} />
             </div>
          </div>

          <style jsx>{`
            @keyframes wave-ani {
              0%, 100% { height: 10px; }
              50% { height: 24px; }
            }
          `}</style>
        </div>
      );
    }

    // LOADING DEFAULT (PARA OUTROS TEMAS)
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
