'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface SpotifyWrappedViewProps {
  pageTitle: string;
  totalDays: number;
  onClose: () => void;
  onComplete: () => void;
}

export function SpotifyWrappedView({ pageTitle, totalDays, onClose, onComplete }: SpotifyWrappedViewProps) {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const [isReveal, setIsReveal] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [daysDisplay, setDaysDisplay] = useState(0);

  const barCount = 20;
  const centerIndex = (barCount - 1) / 2;

  // Lógica de Sequência de Slides
  useEffect(() => {
    if (currentSlide === 1) {
      // Inicia Slide 1
      const timerActive = setTimeout(() => setIsActive(true), 100);
      const timerReveal = setTimeout(() => {
        setIsReveal(true);
        setShowProgress(true);
        
        const timerProgressStart = setTimeout(() => {
          const interval = setInterval(() => {
            setProgress(prev => {
              if (prev >= 100) {
                clearInterval(interval);
                // Transição para o Slide 2
                setTimeout(() => {
                  setIsReveal(false);
                  setIsActive(false);
                  setTimeout(() => {
                    setCurrentSlide(2);
                    setProgress(0);
                  }, 800);
                }, 500);
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
    } else if (currentSlide === 2) {
      // Inicia Slide 2
      const timerActive = setTimeout(() => setIsActive(true), 100);
      const timerReveal = setTimeout(() => {
        setIsReveal(true);
        
        const timerProgressStart = setTimeout(() => {
          // Inicia contagem de dias
          const duration = 2500;
          const startTime = Date.now();
          const animateDays = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const p = Math.min(elapsed / duration, 1);
            const easeOutCubic = 1 - Math.pow(1 - p, 3);
            setDaysDisplay(Math.floor(easeOutCubic * totalDays));
            if (p < 1) requestAnimationFrame(animateDays);
          };
          animateDays();

          // Preenche barra 2
          const interval = setInterval(() => {
            setProgress(prev => {
              if (prev >= 100) {
                clearInterval(interval);
                setTimeout(onComplete, 1200);
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
    }
  }, [currentSlide, onComplete, totalDays]);

  const columns = useMemo(() => {
    return Array.from({ length: barCount }).map((_, i) => {
      const distFromCenter = Math.abs(i - centerIndex);
      const normalizedDist = distFromCenter - 0.5;
      const maxNormalizedDist = centerIndex - 0.5;
      const retractionPct = 110 - (normalizedDist / maxNormalizedDist) * 90;
      const g = Math.floor(80 + (i * (100 / barCount)));
      const color = `rgb(29, ${g}, 84)`;
      const delay = `${i * 0.03}s`;
      return { i, retractionPct, color, delay, isOdd: i % 2 !== 0 };
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
        .active .wrapped-column { transform: translateY(0%); }
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

      {/* Container de Cortinas */}
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
            <div className="wrapped-half top-half" style={{ backgroundColor: col.color, transitionDelay: col.delay }} />
            <div className="wrapped-half bottom-half" style={{ backgroundColor: col.color, transitionDelay: col.delay }} />
          </div>
        ))}
      </div>

      {/* Overlay de Fundo */}
      <div className={cn(
        "absolute inset-0 bg-black opacity-0 transition-opacity duration-500 z-[5] pointer-events-none",
        isReveal && "opacity-100"
      )} />

      {/* Barras de Progresso */}
      <div className={cn(
        "absolute top-0 left-0 w-full flex gap-1 px-4 py-6 z-30 transition-opacity duration-800",
        showProgress ? "opacity-100" : "opacity-0"
      )}>
        <div className="flex-1 h-[3px] bg-white/30 rounded-full overflow-hidden">
          <div className={cn("h-full bg-white transition-all duration-100", currentSlide > 1 ? "w-full" : "")} style={currentSlide === 1 ? { width: `${progress}%` } : {}} />
        </div>
        <div className="flex-1 h-[3px] bg-white/30 rounded-full overflow-hidden">
          <div className={cn("h-full bg-white transition-all duration-100", currentSlide > 2 ? "w-full" : "w-0")} style={currentSlide === 2 ? { width: `${progress}%` } : {}} />
        </div>
        <div className="flex-1 h-[3px] bg-white/30 rounded-full" />
        <div className="flex-1 h-[3px] bg-white/30 rounded-full" />
      </div>

      {/* Conteúdo do Slide 1 */}
      {currentSlide === 1 && (
        <div className={cn(
          "relative z-20 flex flex-col items-center text-center px-6 transition-all duration-[1200ms]",
          isReveal ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}>
          <h1 className="text-[#1DB954] text-5xl md:text-7xl font-black tracking-tighter mb-4 uppercase italic leading-[1.1] drop-shadow-2xl">
            {pageTitle || 'Edu e Ana'}
          </h1>
          <p className="text-white text-lg md:text-2xl font-bold opacity-90 max-w-[280px] leading-relaxed">
            Os momentos que marcaram essa relação
          </p>
        </div>
      )}

      {/* Conteúdo do Slide 2 */}
      {currentSlide === 2 && (
        <div className={cn(
          "relative z-20 flex flex-col items-center text-center px-6 transition-all duration-[1200ms]",
          isReveal ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}>
          <p className="text-[#b3b3b3] text-xl font-semibold uppercase tracking-wider mb-2">Desde o primeiro sim...</p>
          <div className="flex flex-col items-center my-6">
            <span className="text-[#1DB954] text-8xl font-black leading-none tracking-tighter drop-shadow-[0_0_30px_rgba(29,185,84,0.4)] tabular-nums">
              {daysDisplay.toLocaleString('pt-BR')}
            </span>
            <span className="text-white text-2xl font-bold tracking-[0.2em] mt-2">DIAS</span>
          </div>
          <p className="text-white/80 text-lg font-medium max-w-[280px] leading-relaxed">
            construindo a nossa história e somando momentos inesquecíveis.
          </p>
        </div>
      )}
    </div>
  );
}
