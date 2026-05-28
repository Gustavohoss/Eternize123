'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface SpotifyWrappedViewProps {
  pageTitle: string;
  onClose: () => void;
  onComplete: () => void;
}

export function SpotifyWrappedView({ pageTitle, onClose, onComplete }: SpotifyWrappedViewProps) {
  const [phase, setPhase] = useState<'intro' | 'active' | 'reveal'>('intro');
  const [progress, setProgress] = useState(0);

  const barCount = 20;
  const centerIndex = (barCount - 1) / 2;

  useEffect(() => {
    // Inicia a fase "active" (zíper fechando) logo ao montar
    const timerActive = setTimeout(() => setPhase('active'), 100);
    
    // Inicia a fase "reveal" (abertura diamante) após o fechamento
    const timerReveal = setTimeout(() => setPhase('reveal'), 1600);

    return () => {
      clearTimeout(timerActive);
      clearTimeout(timerReveal);
    };
  }, []);

  useEffect(() => {
    if (phase === 'reveal') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(onComplete, 1000); // Transita para os stories após o carregamento da barra
            return 100;
          }
          return prev + 0.5;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [phase, onComplete]);

  const columns = useMemo(() => {
    return Array.from({ length: barCount }).map((_, i) => {
      const distFromCenter = Math.abs(i - centerIndex);
      const normalizedDist = distFromCenter - 0.5;
      const maxNormalizedDist = centerIndex - 0.5;
      
      // O centro recua 110%, as bordas recuam 20%
      const retractionPct = 110 - (normalizedDist / maxNormalizedDist) * 90;
      
      const g = Math.floor(80 + (i * (100 / barCount)));
      const color = `rgb(29, ${g}, 84)`;
      const delay = i * 0.03;

      return { i, retractionPct, color, delay };
    });
  }, [barCount, centerIndex]);

  return (
    <div className="absolute inset-0 z-[1000] bg-black flex flex-col items-center justify-center overflow-hidden font-sans select-none">
      {/* Container da Cortina */}
      <div className="absolute inset-0 flex z-10 pointer-events-none">
        {columns.map((col) => (
          <div 
            key={col.i}
            className="flex-1 h-full flex flex-col transition-transform duration-[800ms]"
            style={{ 
              transform: phase === 'intro' 
                ? (col.i % 2 === 0 ? 'translateY(-100%)' : 'translateY(100%)')
                : 'translateY(0%)',
              transitionTimingFunction: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)',
              transitionDelay: `${col.delay}s`
            }}
          >
            <div 
              className="flex-1 w-full relative transition-transform duration-[1200ms]"
              style={{ 
                backgroundColor: col.color,
                transform: phase === 'reveal' ? `translateY(-${col.retractionPct}%)` : 'translateY(0%)',
                transitionTimingFunction: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)',
                transitionDelay: `${col.delay}s`
              }}
            >
               <div className={cn(
                 "absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-black to-transparent transition-opacity duration-[1200ms]",
                 phase === 'reveal' ? "opacity-100" : "opacity-0"
               )} style={{ transitionDelay: `${col.delay}s` }} />
            </div>
            <div 
              className="flex-1 w-full relative transition-transform duration-[1200ms]"
              style={{ 
                backgroundColor: col.color,
                transform: phase === 'reveal' ? `translateY(${col.retractionPct}%)` : 'translateY(0%)',
                transitionTimingFunction: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)',
                transitionDelay: `${col.delay}s`
              }}
            >
               <div className={cn(
                 "absolute inset-x-0 top-0 h-[70%] bg-gradient-to-b from-black to-transparent transition-opacity duration-[1200ms]",
                 phase === 'reveal' ? "opacity-100" : "opacity-0"
               )} style={{ transitionDelay: `${col.delay}s` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Camada de Overlay */}
      <div className={cn(
        "absolute inset-0 bg-black transition-opacity duration-500 z-[5] pointer-events-none",
        phase === 'reveal' ? "opacity-100" : "opacity-0"
      )} />

      {/* Barras de Progresso */}
      <div className={cn(
        "absolute top-0 left-0 width-full flex gap-1 px-4 py-6 z-30 w-full transition-opacity duration-500",
        phase === 'reveal' ? "opacity-100" : "opacity-0"
      )}>
        <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white transition-all duration-100" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex-1 h-1 bg-white/20 rounded-full" />
        <div className="flex-1 h-1 bg-white/20 rounded-full" />
        <div className="flex-1 h-1 bg-white/20 rounded-full" />
      </div>

      {/* Conteúdo de Texto */}
      <div className={cn(
        "relative z-20 flex flex-col items-center text-center px-6 transition-all duration-[1200ms]",
        phase === 'reveal' ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}>
        <h1 className="text-[#1DB954] text-5xl md:text-7xl font-black tracking-tighter mb-4 uppercase italic">
          {pageTitle || 'Edu e Ana'}
        </h1>
        <p className="text-white text-lg md:text-2xl font-bold opacity-90 max-w-xs leading-tight">
          Os momentos que marcaram essa relação
        </p>
      </div>
    </div>
  );
}
