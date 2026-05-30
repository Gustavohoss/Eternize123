'use client';

import React from 'react';
import Image from 'next/image';
import { X, Heart, Send, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StoriesViewProps {
  photos: string[];
  currentIndex: number;
  progress: number;
  isPaused: boolean;
  isFading: boolean;
  pageTitle: string;
  formattedDays: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onPauseToggle: (paused: boolean) => void;
  theme?: string;
}

export function StoriesView({
  photos,
  currentIndex,
  progress,
  isPaused,
  isFading,
  pageTitle,
  formattedDays,
  onClose,
  onPrev,
  onNext,
  onPauseToggle,
  theme = 'instagram'
}: StoriesViewProps) {
  if (photos.length === 0) return null;

  const isNetflix = theme === 'netflix';
  const currentPhoto = photos[currentIndex];
  const profilePhoto = photos[0];

  return (
    <div className="absolute inset-0 z-[600] bg-black flex flex-col animate-in fade-in duration-500 overflow-hidden">
      {/* Barras de progresso no topo */}
      <div className="absolute top-4 left-0 right-0 z-[610] px-3 flex gap-1.5 pointer-events-none">
        {photos.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 bg-white/20 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-100 ease-linear", 
                i < currentIndex ? "w-full" : i === currentIndex ? "" : "w-0",
                isNetflix ? "bg-[#e50914]" : "bg-white"
              )} 
              style={i === currentIndex ? { width: `${progress}%` } : {}} 
            />
          </div>
        ))}
      </div>

      {/* Cabeçalho do Story / Player */}
      <div className="absolute top-8 left-0 right-0 z-[620] px-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {!isNetflix && (
            <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden relative bg-neutral-900">
              {profilePhoto && profilePhoto.length > 0 ? (
                <Image src={profilePhoto} fill className="object-cover" alt="Profile" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <Heart className="w-3 h-3 text-primary" />
                </div>
              )}
            </div>
          )}
          <div className="flex flex-col">
            <span className={cn("text-white font-bold leading-tight", isNetflix ? "text-sm uppercase font-bebas tracking-widest" : "text-xs")}>
              {isNetflix ? `S${currentIndex + 1} : Memória 1` : (pageTitle || 'Eternize')}
            </span>
            <span className="text-white/60 text-[10px] font-medium leading-tight">
              {isNetflix ? 'Eternize Original' : `Juntos há ${formattedDays} dias`}
            </span>
          </div>
        </div>
        <button onClick={onClose} className="p-1 text-white hover:opacity-70 transition-opacity">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Áreas de toque para navegação */}
      <div className="absolute inset-0 z-[605] flex">
        {/* Esquerda: Volta Story */}
        <div className="w-1/3 h-full cursor-pointer" onClick={(e) => { e.stopPropagation(); onPrev(); }} />
        
        {/* Direita: Próximo Story (Segurar para pausar) */}
        <div 
          className="w-2/3 h-full cursor-pointer" 
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          onMouseDown={() => onPauseToggle(true)} 
          onMouseUp={() => onPauseToggle(false)} 
          onTouchStart={() => onPauseToggle(true)} 
          onTouchEnd={() => onPauseToggle(false)} 
        />
      </div>

      {/* Visualização da Imagem */}
      <div className="flex-1 relative flex flex-col items-center justify-center bg-black">
        <div className={cn("absolute inset-0 transition-all duration-[400ms] ease-in-out", isFading ? "opacity-0 scale-95" : "opacity-100 scale-100")}>
          {currentPhoto && currentPhoto.length > 0 ? (
            <Image src={currentPhoto} fill className="object-cover" alt={`Story ${currentIndex}`} priority />
          ) : (
            <div className="w-full h-full bg-neutral-900 flex flex-col items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
                 <Heart className="w-5 h-5 text-white/20" />
              </div>
              <span className="text-[10px] font-black uppercase text-white/20 tracking-widest">Carregando memória...</span>
            </div>
          )}
        </div>
        
        {/* Gradients para leitura */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </div>

      {/* Rodapé do Story (Oculto no Netflix) */}
      {!isNetflix && (
        <div className="absolute bottom-6 left-0 right-0 z-[620] px-4 flex items-center gap-3">
          <div className="flex-1 bg-transparent border border-white/30 rounded-full h-10 px-4 flex items-center">
            <span className="text-white/60 text-xs">Enviar mensagem</span>
          </div>
          <Heart className="w-6 h-6 text-white" />
          <Send className="w-6 h-6 text-white" />
        </div>
      )}

      {/* Indicador de Play no Netflix */}
      {isNetflix && (
        <div className="absolute bottom-10 left-0 right-0 z-[620] px-8 flex items-center justify-center pointer-events-none">
           <div className="flex items-center gap-2 text-white/40">
              <Play className="w-3 h-3 fill-current" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Reproduzindo</span>
           </div>
        </div>
      )}
    </div>
  );
}
