'use client';

import React from 'react';
import Image from 'next/image';
import { ThumbsUp, Heart, Trophy, Star, MapPin, RotateCcw, Play } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface NetflixViewProps {
  uploadedPhotos: string[];
  activeHeroIndex: number;
  pageTitle: string;
  titleStyle: React.CSSProperties;
  date?: Date;
  message?: string;
  timeDiff: any;
  totalDays: number;
  dateStyle: React.CSSProperties;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onStartExperience: () => void;
  onPhotoClick: (index: number) => void;
  isInList: boolean;
  onListToggle: () => void;
  isPackEnabled?: boolean;
  onModuleClick?: (id: string) => void;
}

export function NetflixView({
  uploadedPhotos,
  activeHeroIndex,
  pageTitle,
  titleStyle,
  date,
  message,
  timeDiff,
  totalDays,
  dateStyle,
  activeTab,
  onTabChange,
  onStartExperience,
  onPhotoClick,
  isInList,
  onListToggle,
  isPackEnabled,
  onModuleClick
}: NetflixViewProps) {
  const modules = [
    { id: 'memorias', title: 'Memórias', icon: Heart, color: 'bg-red-600' },
    { id: 'conquistas', title: 'Conquistas', icon: Trophy, color: 'bg-amber-600' },
    { id: 'curiosidades', title: 'Curiosidades', icon: Star, color: 'bg-purple-600' },
    { id: 'jornada', title: 'Jornada', icon: MapPin, color: 'bg-emerald-600' },
    { id: 'surpresa', title: 'Surpresa', icon: RotateCcw, color: 'bg-orange-600' },
  ];

  return (
    <div className="w-full h-full bg-[#141414] text-white font-inter relative flex flex-col no-scrollbar overflow-y-auto">
      <header className="sticky top-0 z-50 px-4 py-4 flex items-center justify-between bg-gradient-to-b from-black via-black/80 to-transparent">
        <div className="text-[#e50914] font-bebas text-2xl tracking-tighter uppercase">ETERNIZE</div>
        <div className="w-8 h-8 rounded-sm bg-[#e50914] flex items-center justify-center text-[11px] font-black tracking-tight">EZ</div>
      </header>
      
      <section className="relative min-h-[65vh] flex flex-col justify-end -mt-16">
        <div className="absolute inset-0 z-0 bg-cover bg-top transition-all duration-700" style={{ background: 'linear-gradient(135deg, rgb(35, 10, 10) 0%, rgb(15, 15, 15) 100%)' }}>
          {uploadedPhotos.length > 0 && <Image src={uploadedPhotos[activeHeroIndex] || uploadedPhotos[0]} fill className="object-cover opacity-60" alt="Hero" priority />}
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#141414] via-[#141414]/40 to-transparent"></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#141414] via-[#141414]/20 to-transparent"></div>
        
        <div className="relative z-20 px-4 pb-6 pt-48">
          <div className="mb-1">
            <span className="text-[#e50914] text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-1">
              <span className="text-xs">❤️</span> Eternize Original
            </span>
          </div>
          {pageTitle ? (
            <h1 style={titleStyle} className="text-5xl font-bebas uppercase leading-[0.9] mb-3 drop-shadow-2xl tracking-tight break-words">{pageTitle}</h1>
          ) : (
            <div className="w-[70%] h-12 bg-white/10 rounded-sm mb-3 animate-pulse" />
          )}
          
          <div className="flex items-center gap-3 mb-2 text-[12px] font-semibold">
            <span className="text-[#46d369]">98% compatível</span>
            <span className="text-neutral-400 font-medium">{date ? date.getFullYear() : '2026'}</span>
            <span className="text-neutral-400 font-medium">{uploadedPhotos.length || 8} Temporadas</span>
            <div className="border border-neutral-600 px-1 rounded-sm text-[9px] bg-black/40 font-bold">HD</div>
          </div>

          <div className="mb-4">
            {message ? (
              <div className="text-[13px] text-white/70 leading-relaxed line-clamp-3" dangerouslySetInnerHTML={{ __html: message }} />
            ) : (
              <div className="space-y-2 animate-pulse">
                <div className="h-2 bg-white/5 w-full rounded-full" />
                <div className="h-2 bg-white/5 w-full rounded-full" />
                <div className="h-2 bg-white/5 w-2/3 rounded-full" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <button onClick={onStartExperience} className="w-full bg-white text-black py-2.5 rounded flex items-center justify-center gap-2 text-sm font-bold active:scale-95 transition-transform">
              <span className="text-base">▶</span> Reproduzir
            </button>
            <div className="flex gap-2">
              <button onClick={onListToggle} className={cn("flex-1 bg-[#2a2a2a]/80 backdrop-blur-md border border-white/10 py-2.5 rounded font-bold text-xs flex items-center justify-center gap-2 transition-all", isInList ? "text-[#46d369]" : "text-white")}>
                <span className="text-lg leading-none">{isInList ? "✓" : "+"}</span> Minha lista
              </button>
              <button className="w-12 h-11 bg-[#2a2a2a]/80 backdrop-blur-md border border-white/10 rounded flex items-center justify-center transition-all text-white"><ThumbsUp className="w-5 h-5" /></button>
              <button className="w-12 h-11 bg-[#2a2a2a]/80 backdrop-blur-md border border-white/10 rounded flex items-center justify-center transition-all text-white"><Heart className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </section>

      <div className="px-4 py-4 bg-[#141414]">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-[#1e1e1e] rounded-lg p-3 text-center border border-white/5">
            <p style={dateStyle} className="text-2xl font-bebas leading-none mb-1">{timeDiff?.years || 0}</p>
            <p className="text-neutral-500 text-[8px] uppercase tracking-wider font-bold">Anos juntos</p>
          </div>
          <div className="bg-[#1e1e1e] rounded-lg p-3 text-center border border-white/5">
            <p style={dateStyle} className="text-2xl font-bebas leading-none mb-1">{totalDays.toLocaleString('pt-BR')}</p>
            <p className="text-neutral-500 text-[8px] uppercase tracking-wider font-bold">Dias</p>
          </div>
          <div className="bg-[#1e1e1e] rounded-lg p-3 text-center border border-white/5">
            <p style={dateStyle} className="text-2xl font-bebas leading-none mb-1">{date ? format(date, 'dd/MM') : '06/04'}</p>
            <p className="text-neutral-500 text-[8px] uppercase tracking-wider font-bold">Desde</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-2 pb-6">
        <div className="flex gap-8 border-neutral-800 border-b mb-4">
          <button onClick={() => onTabChange('episodios')} className={cn("pb-3 text-sm font-bold tracking-tight transition-all", activeTab === 'episodios' ? "border-b-[3px] border-[#e50914] text-white" : "text-neutral-500")}>Episódios</button>
          <button onClick={() => onTabChange('detalhes')} className={cn("pb-3 text-sm font-bold tracking-tight transition-all", activeTab === 'detalhes' ? "border-b-[3px] border-[#e50914] text-white" : "text-neutral-500")}>Detalhes</button>
        </div>
        
        {activeTab === 'episodios' ? (
          <div className="space-y-6">
            {uploadedPhotos.map((photo, i) => (
              <div key={i} className="flex gap-3 items-center group cursor-pointer" onClick={() => onPhotoClick(i)}>
                <div className="w-32 h-[72px] bg-[#2a2a2a] rounded-md relative overflow-hidden shrink-0">
                  <Image src={photo} fill className="object-cover group-hover:opacity-70 transition-opacity" alt={`Ep ${i}`} />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                     <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center">
                        <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                     </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white mb-0.5 group-hover:text-red-500 transition-colors">{(i + 1)}. Memória {(i + 1)}</p>
                  <p className="text-[10px] text-neutral-500 leading-tight">Capítulo especial da nossa história.</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 pt-2 animate-in fade-in duration-500">
            <div className="flex flex-col gap-3">
              <div className="flex items-baseline gap-2">
                <span className="text-neutral-500 text-[13px] min-w-[100px]">Data de estreia:</span>
                <span className="text-neutral-200 text-[13px]">{date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : '10 de maio de 2019'}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-neutral-500 text-[13px] min-w-[100px]">Gêneros:</span>
                <span className="text-neutral-200 text-[13px]">Romance • Drama • Comédia</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-neutral-500 text-[13px] min-w-[100px]">Direção:</span>
                <span className="text-neutral-200 text-[13px]">Eternize</span>
              </div>
            </div>
            <div className="pt-8 flex items-center gap-3">
              <div className="bg-[#E50914] text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm flex flex-col items-center justify-center leading-none h-9 w-9 shrink-0">
                <span className="text-[7px] mb-0.5">TOP</span>
                <span className="text-lg">10</span>
              </div>
              <span className="text-white text-sm font-black tracking-tight leading-tight uppercase italic italic-shadow">Em alta nos nossos corações</span>
            </div>
          </div>
        )}
      </div>

      {isPackEnabled && (
        <div className="px-4 py-8 border-t border-white/5">
          <h3 className="text-white text-lg font-bold mb-5 tracking-tight">Veja também</h3>
          <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-4 px-4 pb-4">
            {modules.map((mod) => (
              <div 
                key={mod.id} 
                onClick={() => onModuleClick?.(mod.id)}
                className="flex-shrink-0 w-36 group cursor-pointer"
              >
                <div className={cn(
                  "aspect-[1.5/1] rounded-lg mb-2.5 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 duration-300",
                  mod.color
                )}>
                  <mod.icon className="w-8 h-8 text-white/90 fill-current" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[13px] font-bold text-white leading-tight truncate">{mod.title}</p>
                  <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider">Eternize</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="h-20 shrink-0" />
    </div>
  );
}