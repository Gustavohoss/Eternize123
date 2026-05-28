'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface SpotifyWrappedViewProps {
  pageTitle: string;
  onClose: () => void;
  onComplete: () => void;
}

export function SpotifyWrappedView({ pageTitle, onClose, onComplete }: SpotifyWrappedViewProps) {
  const [isActive, setIsActive] = useState(false);
  const [isReveal, setIsReveal] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);

  const barCount = 20;
  const centerIndex = (barCount - 1) / 2; // 9.5

  useEffect(() => {
    // Inicia Fase 1: Zíper Fechando (quase imediato)
    const timerActive = setTimeout(() => setIsActive(true), 100);
    
    // Inicia Fase 2: Abertura Diamante (Após 1.5s conforme o script)
    const timerReveal = setTimeout(() => {
      setIsReveal(true);
      setShowProgress(true);
      
      // Inicia preenchimento da barra de carregamento (Após 0.8s da abertura)
      const timerProgressStart = setTimeout(() => {
        const interval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              // Transita para os stories após completar
              setTimeout(onComplete, 800);
              return 100;
            }
            return prev + 0.5;
          });
        }, 30);
        return () => clearInterval(interval);
      }, 800);

    }, 1500);

    return () => {
      clearTimeout(timerActive);
      clearTimeout(timerReveal);
    };
  }, [onComplete]);

  // Gera as colunas com a lógica exata do loop
  const columns = useMemo(() => {
    return Array.from({ length: barCount }).map((_, i) => {
      const distFromCenter = Math.abs(i - centerIndex);
      const normalizedDist = distFromCenter - 0.5;
      const maxNormalizedDist = centerIndex - 0.5;
      
      // Fórmula: 110 - (distancia / max) * 90
      const retractionPct = 110 - (normalizedDist / maxNormalizedDist) * 90;
      
      const g = Math.floor(80 + (i * (100 / barCount)));
      const color = `rgb(29, ${g}, 84)`;
      const delay = `${i * 0.03}s`;

      return { 
        i, 
        retractionPct, 
        color, 
        delay,
        isOdd: i % 2 !== 0 
      };
    });
  }, [barCount, centerIndex]);

  return (
    <div className="absolute inset-0 z-[1000] bg-black flex flex-col items-center justify-center overflow-hidden font-sans select-none">
      <style jsx>{`
        .wrapped-column {
          flex: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          transition: transform 0.8s cubic-bezier(0.45, 0.05, 0.55, 0.95);
        }

        .wrapped-column.odd { transform: translateY(-100%); }
        .wrapped-column.even { transform: translateY(100%); }

        .active .wrapped-column { 
          transform: translateY(0%); 
        }

        .wrapped-half {
          flex: 1; 
          width: 100%;
          transition: transform 1.2s cubic-bezier(0.45, 0.05, 0.55, 0.95);
          position: relative; 
        }

        .wrapped-half::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          height: 70%; 
          opacity: 0; 
          transition: opacity 1.2s cubic-bezier(0.45, 0.05, 0.55, 0.95);
          pointer-events: none;
        }

        .top-half::after {
          bottom: 0;
          background: linear-gradient(to bottom, transparent 0%, #000 100%);
        }

        .bottom-half::after {
          top: 0;
          background: linear-gradient(to top, transparent 0%, #000 100%);
        }

        .reveal .top-half { transform: translateY(var(--reveal-up)); }
        .reveal .bottom-half { transform: translateY(var(--reveal-down)); }
        .reveal .wrapped-half::after { opacity: 1; } 
      `}</style>

      {/* Curtain Container - Agora ABSOLUTE */}
      <div className={cn(
        "absolute inset-0 flex z-10 pointer-events-none",
        isActive && "active",
        isReveal && "reveal"
      )}>
        {columns.map((col) => (
          <div 
            key={col.i}
            className={cn("wrapped-column", col.isOdd ? "odd" : "even")}
            style={{ 
              transitionDelay: col.delay,
              // @ts-ignore
              '--reveal-up': `-${col.retractionPct}%`,
              '--reveal-down': `${col.retractionPct}%`
            }}
          >
            <div 
              className="wrapped-half top-half"
              style={{ backgroundColor: col.color, transitionDelay: col.delay }}
            />
            <div 
              className="wrapped-half bottom-half"
              style={{ backgroundColor: col.color, transitionDelay: col.delay }}
            />
          </div>
        ))}
      </div>

      {/* Background Overlay - Agora ABSOLUTE para não vazar do celular */}
      <div className={cn(
        "absolute inset-0 bg-black opacity-0 transition-opacity duration-500 z-[5] pointer-events-none",
        isReveal && "opacity-100"
      )} />

      {/* Progress Bars (Topo) */}
      <div className={cn(
        "absolute top-0 left-0 w-full flex gap-1 px-4 py-6 z-30 transition-opacity duration-800 ease-in-out",
        showProgress ? "opacity-100" : "opacity-0"
      )}>
        <div className="flex-1 h-[3px] bg-white/30 rounded-full overflow-hidden">
          <div className="h-full bg-white transition-all duration-100" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex-1 h-[3px] bg-white/30 rounded-full" />
        <div className="flex-1 h-[3px] bg-white/30 rounded-full" />
        <div className="flex-1 h-[3px] bg-white/30 rounded-full" />
      </div>

      {/* Text Content (Centralizado) */}
      <div className={cn(
        "relative z-20 flex flex-col items-center text-center px-6 transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1)",
        isReveal ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}>
        <h1 className="text-[#1DB954] text-5xl md:text-7xl font-black tracking-tighter mb-4 uppercase italic leading-[1.1] drop-shadow-2xl">
          {pageTitle || 'Edu e Ana'}
        </h1>
        <p className="text-white text-lg md:text-2xl font-bold opacity-90 max-w-[280px] leading-relaxed">
          Os momentos que marcaram essa relação
        </p>
      </div>
    </div>
  );
}
