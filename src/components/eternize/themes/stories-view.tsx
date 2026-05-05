'use client';

import React from 'react';
import Image from 'next/image';
import { X, Heart, Send } from 'lucide-react';
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
  onPauseToggle
}: StoriesViewProps) {
  if (photos.length === 0) return null;

  return (
    <div className="absolute inset-0 z-[600] bg-black flex flex-col animate-in fade-in duration-500 overflow-hidden">
      <div className="absolute top-4 left-0 right-0 z-[610] px-3 flex gap-1.5 pointer-events-none">
        {photos.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 bg-white/20 rounded-full overflow-hidden">
            <div 
              className={cn("h-full bg-white transition-all duration-100 ease-linear", i < currentIndex ? "w-full" : i === currentIndex ? "" : "w-0")} 
              style={i === currentIndex ? { width: `${progress}%` } : {}} 
            />
          </div>
        ))}
      </div>
      <div className="absolute top-8 left-0 right-0 z-[620] px-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden relative bg-neutral-900">
            <Image src={photos[0]} fill className="object-cover" alt="Profile" />
          </div>
          <div className="flex flex-col">
            <span className="text-white text-xs font-bold leading-tight">{pageTitle || 'Eternize'}</span>
            <span className="text-white/60 text-[10px] font-medium leading-tight">Juntos há {formattedDays} dias</span>
          </div>
        </div>
        <button onClick={onClose} className="p-1 text-white hover:opacity-70 transition-opacity">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="absolute inset-0 z-[605] flex">
        <div className="flex-1 h-full cursor-pointer" onClick={onPrev} />
        <div 
          className="flex-1 h-full cursor-pointer" 
          onMouseDown={() => onPauseToggle(true)} 
          onMouseUp={() => onPauseToggle(false)} 
          onTouchStart={() => onPauseToggle(true)} 
          onTouchEnd={() => onPauseToggle(false)} 
        />
        <div className="flex-1 h-full cursor-pointer" onClick={onNext} />
      </div>
      <div className="flex-1 relative flex flex-col items-center justify-center bg-black">
        <div className={cn("absolute inset-0 transition-all duration-[800ms] ease-in-out", isFading ? "opacity-0 scale-95" : "opacity-100 scale-100")}>
          <Image src={photos[currentIndex]} fill className="object-cover" alt={`Story ${currentIndex}`} priority />
        </div>
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </div>
      <div className="absolute bottom-6 left-0 right-0 z-[620] px-4 flex items-center gap-3">
        <div className="flex-1 bg-transparent border border-white/30 rounded-full h-10 px-4 flex items-center">
          <span className="text-white/60 text-xs">Enviar mensagem</span>
        </div>
        <Heart className="w-6 h-6 text-white" />
        <Send className="w-6 h-6 text-white" />
      </div>
    </div>
  );
}
