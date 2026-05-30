
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { doc, getDocs, collection } from 'firebase/firestore';
import { useDoc, useFirestore } from '@/firebase';
import { DeviceMockup } from '@/components/eternize/device-mockup';
import { Loader2, Heart } from 'lucide-react';

export default function SiteClient({ subdomain }: { subdomain: string }) {
  const firestore = useFirestore();

  const [siteConfig, setSiteConfig] = useState<any>(null);
  const [isLoadingMedia, setIsLoadingMedia] = useState(true);

  const siteRef = useMemo(() => {
    if (!firestore || !subdomain) return null;
    return doc(firestore, 'published_sites', subdomain);
  }, [firestore, subdomain]);

  const { data: siteData, isLoading: isDocLoading, error } = useDoc(siteRef as any);

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
          const loadedMemories: any[] = [];
          const loadedJourneyPoints: any[] = [];

          mediaSnap.forEach(doc => {
            const data = doc.data();
            if (data.type === 'album') {
              const idx = parseInt(doc.id.split('_')[1]);
              albumPhotos[idx] = data.base64;
            } else if (data.type === 'spotify') {
              spotifyCard = data.base64;
            } else if (data.type === 'memory') {
              loadedMemories.push({
                id: doc.id.replace('memory_', ''),
                title: data.title || '',
                date: data.date || '',
                description: data.description || '',
                photo: data.photo || ''
              });
            } else if (data.type === 'journey') {
              loadedJourneyPoints.push({
                id: doc.id.replace('journey_', ''),
                title: data.title || '',
                date: data.date || '',
                description: data.description || '',
                photo: data.photo || '',
                lat: data.lat,
                lng: data.lng,
                rotation: data.rotation
              });
            }
          });

          const processedConfig = {
            ...config,
            isPackEnabled: config.isPackEnabled === true || siteData.isPackEnabled === true,
            date: config.date ? new Date(config.date) : undefined,
            uploadedPhotos: albumPhotos.filter(p => !!p),
            spotifyCardPhoto: spotifyCard,
            memories: loadedMemories,
            journeyPoints: loadedJourneyPoints
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
    if (theme === 'spotify') {
      return (
        <div className="fixed inset-0 bg-[#000000] flex flex-col items-center justify-center text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(29,185,84,0.08)_0%,transparent_70%)] animate-pulse" />
          <div className="relative flex flex-col items-center gap-12 z-10">
            <div className="relative">
               <div className="absolute inset-0 bg-[#1DB954]/20 rounded-full blur-[40px] animate-pulse scale-150" />
               <div className="w-24 h-24 bg-[#1DB954] rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(29,185,84,0.3)]">
                  <svg width="50" height="50" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="20" fill="black"></circle>
                    <path d="M10 26.5 Q20 22 31 24.5" stroke="#1DB954" strokeWidth="2.8" strokeLinecap="round" fill="none"></path>
                    <path d="M9 21 Q20 15.5 32 19" stroke="#1DB954" strokeWidth="2.8" strokeLinecap="round" fill="none"></path>
                    <path d="M8 15 Q20 8 33 13" stroke="#1DB954" strokeWidth="2.8" strokeLinecap="round" fill="none"></path>
                  </svg>
               </div>
            </div>
            <div className="flex flex-col items-center gap-6">
               <p className="text-[#1DB954] text-[10px] font-black uppercase tracking-[0.6em] animate-pulse">Sintonizando</p>
               <div className="flex gap-1.5 items-end h-8">
                  {[0.1, 0.4, 0.2, 0.5, 0.3, 0.6, 0.2].map((delay, i) => (
                    <div 
                      key={i} 
                      className="w-1.5 bg-[#1DB954] rounded-full animate-wave" 
                      style={{ animationDelay: `${delay}s`, height: '10px' }} 
                    />
                  ))}
               </div>
            </div>
          </div>
          <style jsx>{`
            @keyframes wave {
              0%, 100% { height: 8px; opacity: 0.3; }
              50% { height: 32px; opacity: 1; }
            }
            .animate-wave { animation: wave 1s ease-in-out infinite; }
          `}</style>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white">
        <div className="relative flex flex-col items-center gap-6">
           <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-2 border-white/5 rounded-full" />
              <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin" />
              <Heart className="w-5 h-5 text-primary absolute inset-0 m-auto animate-pulse fill-current" />
           </div>
           <div className="flex flex-col items-center gap-1">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Eternizando</p>
              <div className="flex gap-1">
                 <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                 <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                 <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
           </div>
        </div>
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
