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
  const totalHours = useMemo(() => (totalDays * 24).toLocaleString('pt-BR'), [totalDays]);

  // Lógica de Sequência de Slides
  useEffect(() => {
    // Início: Fecha o zíper
    const startTimeout = setTimeout(() => {
      setIsActive(true);
      setShowProgress(true);
    }, 100);

    // --- ATO 1: NOMES ---
    const reveal1Timeout = setTimeout(() => {
      setIsReveal(true);
      setIsTextVisible(true);
      
      let p1 = 0;
      const interval1 = setInterval(() => {
        p1 += 0.8;
        setProgress(p1);
        if (p1 >= 100) {
          clearInterval(interval1);
          
          // Transição para o ATO 2
          setTimeout(() => {
            setIsTextVisible(false);
            setIsReveal(false);
            
            setTimeout(() => {
              setCurrentSlide(2);
              setProgress(0);
              
              // --- ATO 2: DIAS ---
              setTimeout(() => {
                setIsReveal(true);
                setIsTextVisible(true);
                
                const duration = 2000;
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

                let p2 = 0;
                const interval2 = setInterval(() => {
                  p2 += 0.8;
                  setProgress(p2);
                  if (p2 >= 100) {
                    clearInterval(interval2);

                    // Transição para o ATO 3 (Elevador)
                    setTimeout(() => {
                      setIsTextVisible(false);
                      setIsReveal(false);
                      
                      setTimeout(() => {
                        setCurrentSlide(3);
                        setProgress(0);
                        setIsTextVisible(true);

                        // --- ATO 3: ELEVADOR ---
                        let p3 = 0;
                        const interval3 = setInterval(() => {
                          p3 += 0.6;
                          setProgress(p3);
                          if (p3 >= 100) {
                            clearInterval(interval3);
                            
                            // Finaliza e vai para Stories
                            setTimeout(() => {
                              setIsActive(false);
                              setTimeout(onComplete, 800);
                            }, 1000);
                          }
                        }, 30);
                      }, 800);
                    }, 500);
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
        .top-half::after { bottom: 0; background: linear-gradient(to bottom, transparent 0%, #000 100%); }
        .bottom-half::after { top: 0; background: linear-gradient(to top, transparent 0%, #000 100%); }
        
        .reveal .top-half { transform: translateY(var(--reveal-up)); }
        .reveal .bottom-half { transform: translateY(var(--reveal-down)); }
        .reveal .wrapped-half::after { opacity: 1; }

        /* Elevador */
        .elevator-track {
          display: flex;
          flex-direction: column;
          height: 200%; 
          width: 100%;
          animation: scrollDown 4s linear infinite;
        }
        .strips-group { height: 100%; display: flex; flex-direction: column; }
        .strip { flex: 1; display: flex; align-items: center; justify-content: center; width: 100%; border-bottom: 2px solid rgba(0, 0, 0, 0.2); }
        .number-text {
          font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
          font-size: min(24vw, 13vh); 
          font-weight: 900;
          line-height: 1;
          letter-spacing: -4px;
        }
        .bg-orange { background-color: #f26f21; color: #111; }
        .bg-orange .number-text { text-shadow: 5px 5px 0px rgba(0, 0, 0, 0.4); }
        .bg-purple { background-color: #3b00db; color: #e5f221; }
        .bg-purple .number-text { text-shadow: 5px 5px 0px rgba(0, 0, 0, 0.5); }
        .bg-black-orange { background-color: #111; color: #f26f21; }
        .bg-black-orange .number-text { text-shadow: 5px 5px 0px #7a3000; }
        .bg-pink { background-color: #d64fc0; color: #111; }
        .bg-pink .number-text { text-shadow: 5px 5px 0px rgba(0, 0, 0, 0.3); }
        .bg-green { background-color: #1ed760; color: #111; }
        .bg-green .number-text { text-shadow: 5px 5px 0px rgba(0, 0, 0, 0.3); }
        .bg-black-yellow { background-color: #111; color: #e5f221; }
        .bg-black-yellow .number-text { text-shadow: 5px 5px 0px #5c6b00; }

        @keyframes scrollDown {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0%); }
        }
      `}</style>

      {/* Container de Cortinas (Zíper) - Apenas nos slides 1 e 2 */}
      {currentSlide < 3 && (
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
      )}

      {/* ATO 3: ELEVADOR */}
      {currentSlide === 3 && (
        <div className="absolute inset-0 z-0 flex flex-col animate-in fade-in duration-700">
           <div className="elevator-track">
              {[1, 2].map((group) => (
                <div key={group} className="strips-group">
                  <div className="strip bg-orange"><span className="number-text">{totalHours}</span></div>
                  <div className="strip bg-purple"><span className="number-text">{totalHours}</span></div>
                  <div className="strip bg-black-orange"><span className="number-text">{totalHours}</span></div>
                  <div className="strip bg-pink"><span className="number-text">{totalHours}</span></div>
                  <div className="strip bg-green"><span className="number-text">{totalHours}</span></div>
                  <div className="strip bg-black-yellow"><span className="number-text">{totalHours}</span></div>
                </div>
              ))}
           </div>
           {/* Overlay de texto para o elevador */}
           <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
              <div className="bg-black/40 backdrop-blur-sm px-6 py-2 rounded-full border border-white/10 mb-4">
                 <p className="text-white font-black text-xs uppercase tracking-[0.3em]">Total de Horas</p>
              </div>
           </div>
        </div>
      )}

      {/* Overlay de Fundo */}
      {currentSlide < 3 && (
        <div className={cn(
          "absolute inset-0 bg-black opacity-0 transition-opacity duration-500 z-[5] pointer-events-none",
          isReveal && "opacity-100"
        )} />
      )}

      {/* Barras de Progresso */}
      <div className={cn(
        "absolute top-0 left-0 w-full flex gap-1 px-4 py-6 z-[100] transition-opacity duration-800",
        showProgress ? "opacity-100" : "opacity-0"
      )}>
        <div className="flex-1 h-[3px] bg-white/20 rounded-full overflow-hidden">
          <div className={cn("h-full bg-white transition-all duration-100", currentSlide > 1 ? "w-full" : "")} style={currentSlide === 1 ? { width: `${progress}%` } : {}} />
        </div>
        <div className="flex-1 h-[3px] bg-white/20 rounded-full overflow-hidden">
          <div className={cn("h-full bg-white transition-all duration-100", currentSlide > 2 ? "w-full" : "w-0")} style={currentSlide === 2 ? { width: `${progress}%` } : {}} />
        </div>
        <div className="flex-1 h-[3px] bg-white/20 rounded-full overflow-hidden">
          <div className={cn("h-full bg-white transition-all duration-100", currentSlide > 3 ? "w-full" : "w-0")} style={currentSlide === 3 ? { width: `${progress}%` } : {}} />
        </div>
        <div className="flex-1 h-[3px] bg-white/20 rounded-full" />
      </div>

      {/* Conteúdo Central (Slides 1 e 2) */}
      {currentSlide < 3 && (
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
      )}
    </div>
  );
}
