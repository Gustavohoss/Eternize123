
'use client';

import React from 'react';
import Image from 'next/image';
import { Play, Pause, Heart, MoreHorizontal, Shuffle, RotateCcw, SkipBack, SkipForward, Languages, Share2, SkipBack as ChevronDownIcon, Trophy, Star, Sparkles, Compass, Check } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface SpotifyViewProps {
  uploadedPhotos: string[];
  activeHeroIndex: number;
  pageTitle: string;
  totalDays: number;
  timeDiff: any;
  date?: Date;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onPhotoClick: (index: number) => void;
  isLiked: boolean;
  onLikeToggle: () => void;
  isAudioPlaying: boolean;
  onAudioToggle: (playing: boolean) => void;
  dynamicSpotifyColor: string;
  spotifyHeaderOpacity: number;
  onHeaderScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  onShowFullscreen: () => void;
  onCloseFullscreen: () => void;
  showSpotifyFullscreen: boolean;
  message?: string;
  isPackEnabled?: boolean;
  onModuleClick?: (id: string) => void;
  spotifyCardPhoto?: string;
}

const VerifiedBadge = ({ size = 16 }: { size?: number }) => (
  <div className="bg-[#1DB954] rounded-full flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
    <Check className="text-white" style={{ width: size * 0.7, height: size * 0.7 }} strokeWidth={4} />
  </div>
);

export function SpotifyView({
  uploadedPhotos,
  activeHeroIndex,
  pageTitle,
  totalDays,
  timeDiff,
  date,
  activeTab,
  onTabChange,
  onPhotoClick,
  isLiked,
  onLikeToggle,
  isAudioPlaying,
  onAudioToggle,
  dynamicSpotifyColor,
  spotifyHeaderOpacity,
  onHeaderScroll,
  onShowFullscreen,
  onCloseFullscreen,
  showSpotifyFullscreen,
  message,
  isPackEnabled = false,
  onModuleClick,
  spotifyCardPhoto = ''
}: SpotifyViewProps) {
  
  const modules = [
    { id: 'memorias', title: 'Memórias', icon: Heart, color: '#e11d48', bg: 'rgba(225, 29, 72, 0.1)' },
    { id: 'conquistas', title: 'Conquistas', icon: Trophy, color: '#eab308', bg: 'rgba(234, 179, 8, 0.1)' },
    { id: 'curiosidades', title: 'Curiosidades', icon: Star, color: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)' },
    { id: 'jornada', title: 'Jornada', icon: Compass, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  ];

  const renderFullscreen = () => (
    <div className="absolute inset-0 z-[500] bg-[#121212] flex flex-col animate-in fade-in duration-500 overflow-hidden no-scrollbar">
      <div className="absolute inset-0 z-0 scale-125 brightness-[0.4] blur-[60px] transition-all duration-1000">
         {uploadedPhotos.length > 0 ? <Image src={uploadedPhotos[activeHeroIndex] || uploadedPhotos[0]} fill className="object-cover" alt="blur-bg" /> : <div className="w-full h-full bg-[#121212]" />}
      </div>
      <div className="relative z-10 flex flex-col h-full px-6 pt-4 no-scrollbar overflow-y-auto">
        <div className="flex items-center justify-between mb-10 shrink-0">
           <button onClick={onCloseFullscreen} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white active:scale-90 transition-transform"><ChevronDownIcon className="w-6 h-6 rotate-90" /></button>
           <div className="text-center min-w-0 px-4"><p className="text-[9px] uppercase font-black tracking-[0.2em] text-white/50 mb-0.5">Tocando de</p><p className="text-[11px] font-black text-white truncate max-w-[150px]">{pageTitle || 'Eternize'}</p></div>
           <button className="text-white/80 active:scale-90 transition-transform"><MoreHorizontal className="w-6 h-6" /></button>
        </div>
        <div className="relative aspect-square w-full mb-12 shrink-0">
          <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl">
            {uploadedPhotos.length > 0 ? <Image src={uploadedPhotos[activeHeroIndex] || uploadedPhotos[0]} fill className="object-cover" alt="Album Cover" /> : <div className="w-full h-full bg-neutral-800 flex items-center justify-center"></div>}
          </div>
        </div>
        <div className="flex items-center justify-between mb-8 shrink-0">
          <div className="min-w-0 pr-4">
            <h2 className="text-[28px] font-black text-white leading-tight tracking-tight truncate font-['DM_Sans']">{activeHeroIndex >= 0 && uploadedPhotos[activeHeroIndex] ? `Memória ${activeHeroIndex + 1}` : (pageTitle || 'Nossa História')}</h2>
            <p className="text-base font-bold text-white/60 truncate font-['DM_Sans']">{pageTitle || 'Eternize'}</p>
          </div>
          <button onClick={onLikeToggle} className={cn("transition-all duration-300", isLiked ? "text-[#1DB954]" : "text-white/80")}>{isLiked ? <Heart className="w-8 h-8 fill-current text-[#1DB954]" /> : <Heart className="w-8 h-8" />}</button>
        </div>
        <div className="mb-8 shrink-0"><div className="w-full h-[4px] bg-white/20 rounded-full relative"><div className="absolute left-0 top-0 h-full bg-white rounded-full w-[45%]" /></div><div className="flex justify-between mt-2 text-[10px] font-black text-white/40 tracking-wider font-['DM_Sans']"><span>1:00</span><span>-3:11</span></div></div>
        <div className="flex items-center justify-between mb-10 shrink-0 px-1"><button className="text-white/40 hover:text-white transition-colors"><Shuffle className="w-6 h-6" /></button><button className="text-white active:scale-90 transition-transform"><SkipBack className="w-8 h-8 fill-current" /></button><button onClick={() => onAudioToggle(!isAudioPlaying)} className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black shadow-2xl active:scale-95 transition-transform">{isAudioPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}</button><button className="text-white active:scale-90 transition-transform"><SkipForward className="w-8 h-8 fill-current" /></button><button className="text-white/40 hover:text-white transition-colors"><RotateCcw className="w-6 h-6" /></button></div>
        {message && (
          <div className="rounded-[24px] p-6 mb-8 shrink-0 shadow-lg group transition-colors duration-700" style={{ backgroundColor: dynamicSpotifyColor }}>
            <div className="flex justify-between items-center mb-6">
              <span className="text-white font-black text-xs uppercase tracking-widest">Letra / Bio</span>
              <div className="flex gap-4 text-white/40"><Languages className="w-5 h-5" /><Share2 className="w-5 h-5" /></div>
            </div>
            <div className="text-white text-xl md:text-2xl font-black leading-snug tracking-tighter opacity-95 line-clamp-6 font-['DM_Sans']" dangerouslySetInnerHTML={{ __html: message }} />
          </div>
        )}
        <div className="h-10 shrink-0" />
      </div>
    </div>
  );

  return (
    <div className="w-full h-full bg-[#121212] text-white font-inter flex flex-col no-scrollbar overflow-hidden">
      {showSpotifyFullscreen && renderFullscreen()}
      
      <div 
        className="absolute top-0 left-0 right-0 z-50 px-6 pt-4 pb-2 flex items-center justify-between transition-all duration-300 pointer-events-none" 
        style={{ 
          backgroundColor: `rgba(18, 18, 18, ${spotifyHeaderOpacity})`,
          backdropFilter: spotifyHeaderOpacity > 0.5 ? 'blur(12px)' : 'none'
        }}
      >
        <div className="pointer-events-auto">
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="20" fill="#1DB954"></circle>
            <path d="M10 26.5 Q20 22 31 24.5" stroke="black" strokeWidth="2.5" strokeLinecap="round" fill="none"></path>
            <path d="M9 21 Q20 15.5 32 19" stroke="black" strokeWidth="2.5" strokeLinecap="round" fill="none"></path>
            <path d="M8 15 Q20 8 33 13" stroke="black" strokeWidth="2.5" strokeLinecap="round" fill="none"></path>
          </svg>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center text-[10px] font-black text-black pointer-events-auto">EZ</div>
      </div>
      
      <div className="flex-1 overflow-y-auto no-scrollbar relative" onScroll={onHeaderScroll}>
        <section className="relative h-[400px]">
          <div className="absolute inset-0">
            {uploadedPhotos.length > 0 ? (
              <Image src={uploadedPhotos[activeHeroIndex] || uploadedPhotos[0]} fill className="object-cover" alt="Hero" priority />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#0d4a2a] to-[#121212]" />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent"></div>
          <div className="absolute bottom-2 left-6 right-6">
            <div className="flex items-center gap-2 mb-1"><VerifiedBadge /><span className="text-white text-[11px] font-bold">Artista verificado</span></div>
            <h1 className="text-white text-5xl font-black leading-[0.9] tracking-tighter mb-1 break-words font-['DM_Sans']">{pageTitle || 'Nossa Playlist'}</h1>
            <p className="text-neutral-300 text-sm font-bold font-['DM_Sans']">{totalDays.toLocaleString('pt-BR')} dias de história</p>
          </div>
        </section>
        
        <div className="px-6 py-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded overflow-hidden relative bg-black shrink-0">{uploadedPhotos.length > 0 && <Image src={uploadedPhotos[activeHeroIndex] || uploadedPhotos[0]} fill className="object-cover" alt="" />}</div>
          <button onClick={onLikeToggle} className="border border-neutral-500 rounded-full px-4 py-1.5 text-xs font-bold text-white hover:border-white transition-colors">{isLiked ? 'Seguindo' : 'Seguir'}</button>
          <div className="flex-1 flex justify-end items-center gap-5">
            <button className="text-neutral-400 hover:text-white"><Shuffle className="w-6 h-6" /></button>
            <button onClick={onShowFullscreen} className="w-14 h-14 bg-[#1DB954] rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-transform"><Play className="w-6 h-6 text-black fill-black ml-1" /></button>
          </div>
        </div>

        {/* CONTADOR PERSONALIZADO ESTILO CARD DISCORD/SPOTIFY */}
        <section className="px-6 mb-10 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
           <div className="w-full bg-[#2b2d31] rounded-[24px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(61,0,117,0.2)] border border-white/5">
              <div className="relative w-full h-[260px]">
                {spotifyCardPhoto ? (
                  <Image src={spotifyCardPhoto} fill className="object-cover" alt="Couple" />
                ) : uploadedPhotos.length > 0 ? (
                  <Image src={uploadedPhotos[0]} fill className="object-cover" alt="Couple" />
                ) : (
                  <div className="w-full h-full bg-neutral-800" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                <div className="absolute top-5 left-5 font-bold text-sm tracking-tight text-white shadow-sm drop-shadow-md">Sobre o casal</div>
              </div>

              <div className="p-5">
                <h2 className="text-3xl font-extrabold text-white tracking-tighter mb-1 font-['DM_Sans'] uppercase italic leading-none">{pageTitle || 'Nossa História'}</h2>
                <p className="text-[#a3a6aa] text-sm font-medium mb-6">Juntos desde <span className="font-bold text-white">{date ? date.getFullYear() : '...'}</span></p>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { val: timeDiff?.years || 0, label: 'Anos' },
                    { val: timeDiff?.months || 0, label: 'Meses' },
                    { val: timeDiff?.days || 0, label: 'Dias' },
                    { val: timeDiff?.hours || 0, label: 'Horas' },
                    { val: timeDiff?.minutes || 0, label: 'Minutos' },
                    { val: timeDiff?.seconds || 0, label: 'Segundos' },
                  ].map((item, i) => (
                    <div key={i} className="bg-[#313338] rounded-xl py-4 flex flex-col items-center justify-center border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                      <span className="text-white text-xl font-bold leading-none mb-1 tabular-nums">{item.val}</span>
                      <span className="text-[#a3a6aa] text-[9px] font-black uppercase tracking-wider">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
           </div>
        </section>

        {/* RETROSPECTIVA CARD */}
        <section className="px-6 mb-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
           <div className="relative w-full rounded-[28px] overflow-hidden border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.6)] group">
              <img 
                src="https://s3.typebotstorage.com/public/workspaces/cm87fx6c6001i920ze1ryoryq/typebots/cmpb8altd00020bkmal2nn1wc/blocks/m8waj0r5v8a3yopdwtk7eox3?v=1779956936120" 
                alt="Retrospectiva"
                className="w-full h-auto block"
              />
              <div className="absolute inset-0 bg-black/60 z-1" />
              <div className="absolute inset-0 z-2 flex flex-col items-center justify-center p-5 text-center">
                 <h2 className="text-4xl font-black text-white tracking-tighter mb-2 font-['DM_Sans']">Sua Retrospectiva</h2>
                 <p className="text-white/80 text-sm font-light mb-8 font-['DM_Sans']">Explore o seu tempo de casal.</p>
                 <button 
                   onClick={onShowFullscreen}
                   className="bg-[#1ed760] text-black px-12 py-4 rounded-full text-sm font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(30,215,96,0.3)]"
                 >
                   Vamos lá
                 </button>
              </div>
           </div>
        </section>

        {activeTab === 'músicas' && (
          <section className="px-6 mb-12">
            <h2 className="text-white text-xl font-black mb-4 font-['DM_Sans']">Populares</h2>
            <div className="space-y-1">
              {uploadedPhotos.length > 0 ? (
                uploadedPhotos.slice(0, 5).map((photo, i) => (
                  <div key={i} className="flex items-center gap-4 group p-2 -mx-2 rounded-md hover:bg-white/10 transition-colors cursor-pointer" onClick={() => onPhotoClick(i)}>
                    <div className="w-4 flex justify-center items-center">
                      <span className="text-neutral-500 text-sm font-bold group-hover:hidden">{i + 1}</span>
                      <Play className="w-3.5 h-3.5 text-white fill-current hidden group-hover:block" />
                    </div>
                    <div className="w-10 h-10 bg-neutral-800 rounded shadow-lg relative overflow-hidden shrink-0">
                      <Image src={photo} fill className="object-cover" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white text-sm font-bold truncate font-['DM_Sans'] tracking-tight">Memória {i + 1}</h3>
                      <p className="text-neutral-500 text-[11px] font-bold font-['DM_Sans'] truncate">{pageTitle || 'Eternize'}</p>
                    </div>
                  </div>
                ))
              ) : (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="flex items-center gap-4 p-2 -mx-2 rounded-md opacity-40">
                    <div className="w-4 flex justify-center items-center"><span className="text-neutral-600 text-sm font-bold">{i + 1}</span></div>
                    <div className="w-10 h-10 bg-neutral-800/50 rounded animate-pulse shrink-0" />
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="h-3 bg-neutral-800/50 rounded w-2/3 animate-pulse" />
                      <div className="h-2 bg-neutral-800/30 rounded w-1/3 animate-pulse" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {message && (
          <section className="px-6 mb-10">
            <h2 className="text-white text-xl font-black mb-4 font-['DM_Sans']">Letra / História</h2>
            <div 
              onClick={onShowFullscreen}
              className="bg-[#181818] rounded-2xl overflow-hidden group cursor-pointer active:scale-[0.98] transition-all relative aspect-square shadow-2xl"
            >
               {uploadedPhotos.length > 0 && (
                 <Image 
                   src={uploadedPhotos[activeHeroIndex] || uploadedPhotos[0]} 
                   fill 
                   className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-60" 
                   alt="Bio background" 
                 />
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
               <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 mb-3">
                     <VerifiedBadge size={14} />
                     <span className="text-[10px] font-black text-white/90 uppercase tracking-[0.2em]">Bio do Artista</span>
                  </div>
                  <div 
                    className="text-white text-base font-bold line-clamp-5 leading-relaxed font-['DM_Sans']"
                    dangerouslySetInnerHTML={{ __html: message }}
                  />
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-widest">
                    <span>Ver letra completa</span>
                    <SkipForward className="w-2 h-2 fill-current" />
                  </div>
               </div>
            </div>
          </section>
        )}

        {isPackEnabled && (
          <section className="px-6 py-8 mt-4 border-t border-white/5 pb-32">
            <h3 className="text-white text-xl font-black mb-6 font-['DM_Sans']">Veja também</h3>
            <div className="flex gap-5 overflow-x-auto no-scrollbar pb-4 -mx-1 px-1 snap-x snap-mandatory">
              {modules.map((mod, i) => (
                <div key={i} onClick={() => onModuleClick?.(mod.id)} className="flex flex-col items-center gap-3 shrink-0 cursor-pointer active:scale-95 transition-transform snap-start">
                  <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-300" style={{ backgroundColor: mod.bg, border: `1px solid ${mod.color}33`, boxShadow: `0 0 20px ${mod.color}22` }}>
                    <mod.icon className="w-8 h-8" style={{ color: mod.color }} />
                  </div>
                  <span className="text-[11px] text-white font-bold tracking-tight text-center max-w-[72px] leading-tight">{mod.title}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
