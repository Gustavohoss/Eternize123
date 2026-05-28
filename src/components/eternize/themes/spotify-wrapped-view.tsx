
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Heart, X } from 'lucide-react';
import Image from 'next/image';

interface SpotifyWrappedViewProps {
  pageTitle: string;
  totalDays: number;
  photos: string[];
  onClose: () => void;
  onComplete: () => void;
}

export function SpotifyWrappedView({ pageTitle, totalDays, photos, onClose, onComplete }: SpotifyWrappedViewProps) {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const [isReveal, setIsReveal] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [daysDisplay, setDaysDisplay] = useState(0);
  const [isTextVisible, setIsTextVisible] = useState(false);
  
  // Estado para os cards do Slide 5
  const [cardStack, setCardStack] = useState<number[]>([]);
  const [removedCards, setRemovedCards] = useState<number[]>([]);

  const barCount = 20;
  const centerIndex = (barCount - 1) / 2;
  const totalHours = useMemo(() => (totalDays * 24).toLocaleString('pt-BR'), [totalDays]);

  // Inicializa a pilha de cards
  useEffect(() => {
    if (photos.length > 0) {
      setCardStack(photos.map((_, i) => i).reverse());
    }
  }, [photos]);

  useEffect(() => {
    // Início: Fecha o zíper (Slide 1)
    const startTimeout = setTimeout(() => {
      setIsActive(true);
      setShowProgress(true);
    }, 100);

    // ATO 1: NOMES
    const reveal1Timeout = setTimeout(() => {
      setIsReveal(true);
      setIsTextVisible(true);
      
      let p1 = 0;
      const interval1 = setInterval(() => {
        p1 += 0.8;
        setProgress(p1);
        if (p1 >= 100) {
          clearInterval(interval1);
          setTimeout(() => {
            setIsTextVisible(false);
            setIsReveal(false);
            setTimeout(() => {
              setCurrentSlide(2);
              setProgress(0);
              
              // ATO 2: DIAS
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
                    setTimeout(() => {
                      setIsTextVisible(false);
                      setIsReveal(false);
                      setTimeout(() => {
                        setIsActive(false); // Abre para o elevador
                        setTimeout(() => {
                          setCurrentSlide(3);
                          setProgress(0);

                          // ATO 3: ELEVADOR
                          let p3 = 0;
                          const interval3 = setInterval(() => {
                            p3 += 0.6;
                            setProgress(p3);
                            if (p3 >= 100) {
                              clearInterval(interval3);
                              setTimeout(() => {
                                setIsActive(true); // Fecha para o diamante
                                setTimeout(() => {
                                  setCurrentSlide(4);
                                  setProgress(0);
                                  
                                  // ATO 4: RESUMO HORAS
                                  setTimeout(() => {
                                    setIsReveal(true);
                                    setIsTextVisible(true);
                                    let p4 = 0;
                                    const interval4 = setInterval(() => {
                                      p4 += 0.8;
                                      setProgress(p4);
                                      if (p4 >= 100) {
                                        clearInterval(interval4);
                                        setTimeout(() => {
                                          setIsTextVisible(false);
                                          setIsReveal(false);
                                          setTimeout(() => {
                                            setCurrentSlide(5);
                                            setProgress(0);
                                            
                                            // ATO 5: CARDS (Manual)
                                            setTimeout(() => {
                                              setIsReveal(true);
                                              setIsTextVisible(true);
                                              // A barra 5 não termina sozinha, termina quando os cards acabam ou tempo expira
                                              let p5 = 0;
                                              const interval5 = setInterval(() => {
                                                p5 += 0.2;
                                                setProgress(p5);
                                                if (p5 >= 100) {
                                                  clearInterval(interval5);
                                                  setTimeout(onComplete, 1000);
                                                }
                                              }, 100);
                                            }, 800);
                                          }, 800);
                                        }, 1200);
                                      }
                                    }, 30);
                                  }, 800);
                                }, 800);
                              }, 3500);
                            }
                          }, 30);
                        }, 400); 
                      }, 500);
                    }, 800);
                  }
                }, 30);
              }, 800);
            }, 800);
          }, 800);
        }
      }, 30);
    }, 1600);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(reveal1Timeout);
    };
  }, [onComplete, totalDays]);

  const handleCardClick = (index: number) => {
    setRemovedCards(prev => [...prev, index]);
    if (removedCards.length + 1 >= photos.length) {
      setTimeout(onComplete, 800);
    }
  };

  const columns = useMemo(() => {
    return Array.from({ length: barCount }).map((_, i) => {
      const distFromCenter = Math.abs(i - centerIndex);
      const normalizedDist = distFromCenter - 0.5;
      const maxNormalizedDist = centerIndex - 0.5;
      const retractionPct = 125 - (normalizedDist / maxNormalizedDist) * 100;
      
      let color;
      if (currentSlide <= 2) {
        const g = Math.floor(80 + (i * (100 / barCount)));
        color = `rgb(29, ${g}, 84)`;
      } else if (currentSlide === 5) {
        const r = Math.floor(180 + (i * (75 / barCount)));
        color = `rgb(${r}, 30, 140)`; // Rosa Spotify
      } else {
        const g = Math.floor(180 + (i * (50 / barCount)));
        color = `rgb(255, ${g}, 0)`;
      }
      
      const delay = `${i * 0.03}s`;
      return { i, retractionPct, color, delay, isOdd: i % 2 !== 0 };
    });
  }, [barCount, centerIndex, currentSlide]);

  return (
    <div className="absolute inset-0 z-[1000] bg-black flex flex-col items-center justify-center overflow-hidden font-sans select-none rounded-[inherit]">
      <style jsx>{`
        .wrapped-column {
          flex: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          transition: transform 0.8s cubic-bezier(0.45, 0.05, 0.55, 0.95);
          min-width: calc(100% / ${barCount} + 0.5px);
          margin-right: -0.5px;
          will-change: transform;
        }
        .wrapped-column.odd { transform: translate3d(0, -100%, 0); }
        .wrapped-column.even { transform: translate3d(0, 100%, 0); }
        .active .wrapped-column { transform: translate3d(0, 0, 0); }
        
        .wrapped-half {
          flex: 1; 
          width: 100%;
          transition: transform 1.2s cubic-bezier(0.45, 0.05, 0.55, 0.95);
          position: relative; 
          will-change: transform;
          backface-visibility: hidden;
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
        
        .reveal .top-half { transform: translate3d(0, var(--reveal-up), 0); }
        .reveal .bottom-half { transform: translate3d(0, var(--reveal-down), 0); }
        .reveal .wrapped-half::after { opacity: 1; }

        .elevator-track {
          display: flex;
          flex-direction: column;
          height: 200%; 
          width: 100%;
          animation: scrollDown 4s linear infinite;
          will-change: transform;
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
          0% { transform: translate3d(0, -50%, 0); }
          100% { transform: translate3d(0, 0%, 0); }
        }

        .polaroid-card {
          position: absolute;
          width: 260px;
          aspect-ratio: 1/1.2;
          background: white;
          padding: 10px 10px 35px 10px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          cursor: pointer;
          transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.5s ease;
          border-radius: 4px;
        }
        .polaroid-card:hover { transform: scale(1.02) rotate(0deg) !important; z-index: 100 !important; }
        .card-removed { transform: translate3d(150%, -50%, 0) rotate(45deg) !important; opacity: 0; }
      `}</style>

      {(currentSlide !== 3 || isActive) && (
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

      {currentSlide === 3 && (
        <div className="absolute inset-0 z-0 flex flex-col animate-in slide-in-from-top duration-1000 ease-out">
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
        </div>
      )}

      {(currentSlide !== 3) && (
        <div className={cn(
          "absolute inset-0 transition-opacity duration-500 z-[5] pointer-events-none",
          isReveal ? "opacity-100" : "opacity-0",
          currentSlide === 4 ? "bg-[radial-gradient(circle_at_50%_50%,rgba(255,230,0,0.1)_0%,#000000_80%)]" : 
          currentSlide === 5 ? "bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,140,0.15)_0%,#000000_80%)]" : "bg-black"
        )} />
      )}

      <div className={cn(
        "absolute top-0 left-0 w-full flex gap-1 px-4 py-6 z-[100] transition-opacity duration-800",
        showProgress ? "opacity-100" : "opacity-0"
      )}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex-1 h-[3px] bg-white/20 rounded-full overflow-hidden">
            <div 
              className={cn("h-full transition-all duration-100", currentSlide > i ? "w-full" : "w-0")} 
              style={currentSlide === i ? { 
                width: `${progress}%`,
                backgroundColor: i === 4 ? '#ffe600' : i === 5 ? '#ff008c' : '#fff'
              } : {
                backgroundColor: i === 4 ? '#ffe600' : i === 5 ? '#ff008c' : '#fff'
              }} 
            />
          </div>
        ))}
      </div>

      <div className={cn(
        "relative z-20 flex flex-col items-center text-center px-6 transition-all duration-1000 w-full h-full justify-center",
        isTextVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}>
        {currentSlide === 1 && (
          <>
            <h1 className="text-[#1DB954] text-5xl md:text-7xl font-black tracking-tighter mb-4 uppercase italic leading-[1.1] drop-shadow-2xl">
              {pageTitle || 'Nossa História'}
            </h1>
            <p className="text-white text-lg md:text-2xl font-bold opacity-90 max-w-[280px] leading-relaxed">
              Os momentos que marcaram essa relação
            </p>
          </>
        )}

        {currentSlide === 2 && (
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

        {currentSlide === 4 && (
          <>
            <span className="text-[#b3b3b3] text-sm md:text-xl font-semibold uppercase tracking-[0.2em] mb-4">Este ano, nós vivemos...</span>
            <h1 className="text-[#ffe600] text-7xl md:text-9xl font-black leading-none tracking-tighter drop-shadow-[0_0_50px_rgba(255,230,0,0.4)] mb-4">
              {totalHours}
            </h1>
            <p className="text-white text-xl md:text-3xl font-bold tracking-tight max-w-[280px] leading-tight">
              horas incríveis juntinhos.
            </p>
          </>
        )}

        {currentSlide === 5 && (
          <div className="flex-1 w-full flex flex-col items-center justify-center relative">
             <div className="absolute top-20 left-0 right-0 text-center animate-in fade-in duration-1000">
                <p className="text-[#ff008c] font-black text-sm uppercase tracking-[0.3em] mb-2">Sua Coleção</p>
                <h2 className="text-white text-3xl font-black tracking-tighter uppercase italic">Top Memórias</h2>
             </div>
             
             <div className="relative w-full h-[400px] flex items-center justify-center mt-10">
                {photos.length > 0 ? (
                  photos.map((photo, i) => {
                    const isRemoved = removedCards.includes(i);
                    const rotation = (i * 5 - 10) % 15;
                    return (
                      <div 
                        key={i}
                        onClick={() => handleCardClick(i)}
                        className={cn(
                          "polaroid-card",
                          isRemoved && "card-removed"
                        )}
                        style={{ 
                          zIndex: i + 10,
                          transform: `rotate(${rotation}deg)`,
                          display: isRemoved && removedCards.indexOf(i) < removedCards.length - 2 ? 'none' : 'block'
                        }}
                      >
                         <div className="w-full aspect-square relative bg-neutral-100 overflow-hidden mb-2">
                            <Image src={photo} fill className="object-cover" alt="" />
                         </div>
                         <div className="flex justify-between items-center px-1">
                            <span className="font-['Dancing_Script'] text-neutral-800 text-sm font-bold">#Momento {i+1}</span>
                            <Heart className="w-3 h-3 text-red-500 fill-current" />
                         </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-white/20 text-xs font-bold uppercase tracking-widest">Nenhuma foto enviada</div>
                )}
             </div>

             <div className="absolute bottom-20 left-0 right-0 text-center animate-pulse">
                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Toque nas fotos para ver a próxima</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
