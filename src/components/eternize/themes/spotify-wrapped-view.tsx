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
  const [isTextVisible, setIsTextVisible] = useState(false);

  const barCount = 20;
  const centerIndex = (barCount - 1) / 2;

  // Lógica de Sequência de Slides
  useEffect(() => {
    // Início da experiência: Fecha o zíper
    const startTimeout = setTimeout(() => {
      setIsActive(true);
      setShowProgress(true);
    }, 100);

    // Slide 1: Abre o diamante
    const reveal1Timeout = setTimeout(() => {
      setIsReveal(true);
      setIsTextVisible(true);
      
      // Inicia barra 1
      let p = 0;
      const interval = setInterval(() => {
        p += 0.5;
        setProgress(p);
        if (p >= 100) {
          clearInterval(interval);
          
          // Transição para o Slide 2: Fecha o diamante mas mantém o zíper (isActive)
          setTimeout(() => {
            setIsTextVisible(false);
            setIsReveal(false);
            
            // Troca o conteúdo enquanto o diamante está fechado
            setTimeout(() => {
              setCurrentSlide(2);
              setProgress(0);
              
              // Slide 2: Reabre o diamante
              setTimeout(() => {
                setIsReveal(true);
                setIsTextVisible(true);
                
                // Animação dos dias
                const duration = 2500;
                const startTime = Date.now();
                const animateDays = () => {
                  const now = Date.now();
                  const elapsed = now - startTime;
                  const percent = Math.min(elapsed / duration, 1);
                  const easeOutCubic = 1 - Math.pow(1 - percent, 3);
                  setDaysDisplay(Math.floor(easeOutCubic * totalDays));
                  if (percent < 1) requestAnimationFrame(animateDays);
                };
                animateDays();

                // Inicia barra 2
                let p2 = 0;
                const interval2 = setInterval(() => {
                  p2 += 0.5;
                  setProgress(p2);
                  if (p2 >= 100) {
                    clearInterval(interval2);
                    // Finaliza tudo: Fecha o zíper e vai para stories
                    setTimeout(() => {
                      setIsTextVisible(false);
                      setIsReveal(false);
                      setIsActive(false);
                      setTimeout(onComplete, 800);
                    }, 1000);
                  }
                }, 30);
              }, 800);
            }, 800);
          }, 500);
        }
      }, 30);
    }, 1600);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(reveal1Timeout);
    };
  }, [onComplete, totalDays]);

  const columns = useMemo(() => {
    return Array.from({ length: barCount }).map((_, i) => {
      const distFromCenter = Math.abs(i - centerIndex);
      const normalizedDist = distFromCenter - 0.5;
      const maxNormalizedDist = centerIndex - 0.5;
      
      // FÓRMULA 100% CORRIGIDA DO SEU CÓDIGO
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

      {/* Container de Cortinas (Zíper) */}
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

      {/* Overlay de Fundo (Escurece o diamante) */}
      <div className={cn(
        "absolute inset-0 bg-black opacity-0 transition-opacity duration-500 z-[5] pointer-events-none",
        isReveal && "opacity-100"
      )} />

      {/* Barras de Progresso estilo Stories (Topo) */}
      <div className={cn(
        "absolute top-0 left-0 w-full flex gap-1 px-4 py-6 z-30 transition-opacity duration-800",
        showProgress ? "opacity-100" : "opacity-0"
      )}>
        <div className="flex-1 h-[3px] bg-white/20 rounded-full overflow-hidden">
          <div className={cn("h-full bg-white transition-all duration-100", currentSlide > 1 ? "w-full" : "")} style={currentSlide === 1 ? { width: `${progress}%` } : {}} />
        </div>
        <div className="flex-1 h-[3px] bg-white/20 rounded-full overflow-hidden">
          <div className={cn("h-full bg-white transition-all duration-100", currentSlide > 2 ? "w-full" : "w-0")} style={currentSlide === 2 ? { width: `${progress}%` } : {}} />
        </div>
        <div className="flex-1 h-[3px] bg-white/20 rounded-full" />
        <div className="flex-1 h-[3px] bg-white/20 rounded-full" />
      </div>

      {/* Conteúdo Central */}
      <div className={cn(
        "relative z-20 flex flex-col items-center text-center px-6 transition-all duration-1000",
        isTextVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}>
        {currentSlide === 1 ? (
          <>
            <h1 className="text-[#1DB954] text-5xl md:text-7xl font-black tracking-tighter mb-4 uppercase italic leading-[1.1] drop-shadow-2xl">
              {pageTitle || 'Edu e Ana'}
            </h1>
            <p className="text-white text-lg md:text-2xl font-bold opacity-90 max-w-[280px] leading-relaxed">
              Os momentos que marcaram essa relação
            </p>
          </>
        ) : (
          <>
            <p className="text-[#b3b3b3] text-xl font-semibold uppercase tracking-wider mb-2">Desde o primeiro sim...</p>
            <div className="flex flex-col items-center my-6">
              <span className="text-[#1DB954] text-8xl font-black leading-none tracking-tighter drop-shadow-[0_0_40px_rgba(29,185,84,0.4)] tabular-nums">
                {daysDisplay.toLocaleString('pt-BR')}
              </span>
              <span className="text-white text-2xl font-bold tracking-[0.2em] mt-2">DIAS</span>
            </div>
            <p className="text-white/80 text-lg font-medium max-w-[280px] leading-relaxed">
              construindo a nossa história e somando momentos inesquecíveis.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
