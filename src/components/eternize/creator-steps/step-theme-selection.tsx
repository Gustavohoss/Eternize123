
'use client';

import React, { useState } from 'react';
import NextImage from 'next/image';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import { THEME_OPTIONS, ThemeId } from '@/app/criador/constants';
import { cn } from '@/lib/utils';
import { motion, PanInfo } from 'framer-motion';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';

interface StepThemeSelectionProps {
  selectedTheme: ThemeId;
  onThemeSelect: (theme: ThemeId) => void;
  onNext: () => void;
}

export function StepThemeSelection({ selectedTheme, onThemeSelect, onNext }: StepThemeSelectionProps) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const idx = THEME_OPTIONS.findIndex(t => t.id === selectedTheme);
    return idx >= 0 ? idx : 0;
  });

  const nextStep = () => {
    const nextIdx = (currentIndex + 1) % THEME_OPTIONS.length;
    setCurrentIndex(nextIdx);
    onThemeSelect(THEME_OPTIONS[nextIdx].id as ThemeId);
  };

  const prevStep = () => {
    const prevIdx = (currentIndex - 1 + THEME_OPTIONS.length) % THEME_OPTIONS.length;
    setCurrentIndex(prevIdx);
    onThemeSelect(THEME_OPTIONS[prevIdx].id as ThemeId);
  };

  const handleDragEnd = (e: any, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      prevStep();
    } else if (info.offset.x < -threshold) {
      nextStep();
    }
  };

  const currentTheme = THEME_OPTIONS[currentIndex];

  const getGlowColor = (themeId: string) => {
    switch (themeId) {
      case 'spotify': return 'rgba(30, 215, 96, 0.3)';
      case 'netflix': return 'rgba(153, 27, 27, 0.3)';
      case 'instagram': return 'rgba(139, 92, 246, 0.3)';
      default: return 'rgba(239, 68, 68, 0.3)';
    }
  };

  const getGradient = (themeId: string) => {
    switch (themeId) {
      case 'spotify': return 'linear-gradient(to right, #1db954, #1ed760)';
      case 'netflix': return 'linear-gradient(to right, #991b1b, #ef4444)';
      case 'instagram': return 'linear-gradient(to right, #8b5cf6, #f43f5e)';
      default: return 'linear-gradient(to right, #ef4444, #ec4899)';
    }
  };

  return (
    <div className="relative z-10 container mx-auto px-4 h-[100dvh] flex flex-col items-center justify-between overflow-hidden py-14 md:py-24">
      
      {/* Header Compacto */}
      <div className="w-full max-w-4xl flex flex-col shrink-0 mt-4 md:mt-0 relative z-50">
        <div className="space-y-1 text-center">
          <h2 className="text-xl md:text-4xl font-black tracking-tight uppercase italic italic-shadow">Qual tema você quer usar?</h2>
          <p className="text-[10px] md:text-sm text-white/40 font-medium">Personalizamos tudo para você automaticamente.</p>
        </div>
      </div>

      <div className="relative w-full flex flex-col items-center flex-1 justify-center my-6">
        {/* Dynamic Background Glow */}
        <div 
          className="absolute w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full blur-[100px] md:blur-[150px] -z-10 transition-all duration-700 pointer-events-none" 
          style={{ background: `radial-gradient(${getGlowColor(currentTheme.id)} 0%, transparent 70%)` }}
        />

        <div className="relative flex items-center gap-3 w-full max-w-[520px]">
          <button 
            onClick={prevStep} 
            className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all z-30 active:scale-90"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          <div className="relative flex-1 h-[480px] flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              {THEME_OPTIONS.map((theme, i) => {
                const offset = i - currentIndex;
                const isActive = i === currentIndex;
                
                let displayOffset = offset;
                if (currentIndex === 0 && i === THEME_OPTIONS.length - 1) displayOffset = -1;
                if (currentIndex === THEME_OPTIONS.length - 1 && i === 0) displayOffset = 1;

                const opacity = isActive ? 1 : (Math.abs(displayOffset) === 1 ? 0.45 : 0);
                const scale = isActive ? 1 : 0.74;
                const translateX = displayOffset * 255;
                const zIndex = isActive ? 10 : 5;
                const blur = isActive ? "none" : "blur(1.5px)";
                const shadow = isActive ? `0 32px 80px -8px ${getGlowColor(theme.id)}` : "none";
                const videoId = (theme as any).videoUrl;

                return (
                  <motion.div
                    key={theme.id}
                    initial={false}
                    drag={isActive ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={handleDragEnd}
                    onClick={() => { 
                      if(!isActive) {
                        setCurrentIndex(i);
                        onThemeSelect(theme.id as ThemeId);
                      }
                    }}
                    className={cn(
                      "absolute rounded-[24px] overflow-hidden transition-all duration-700",
                      (isActive || Math.abs(displayOffset) === 1) ? "pointer-events-auto cursor-pointer" : "pointer-events-none"
                    )}
                    style={{
                      width: "255px",
                      height: "453px",
                      zIndex,
                      boxShadow: shadow,
                      left: "50%",
                      top: "50%",
                      touchAction: "none"
                    }}
                    animate={{
                      x: `calc(-50% + ${translateX}px)`,
                      y: "-50%",
                      scale,
                      opacity,
                      filter: blur
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <div className="absolute inset-0 bg-neutral-900 z-0">
                      {videoId ? (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                          <iframe
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full scale-[1.25] border-none"
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&playsinline=1&volume=0`}
                            allow="autoplay; encrypted-media"
                            tabIndex={-1}
                          />
                        </div>
                      ) : (
                        <NextImage src={theme.image} fill className="object-cover" alt={theme.name} priority />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent z-10" />
                    </div>

                    <div className="absolute top-0 inset-x-0 h-[3px] z-20" style={{ background: getGradient(theme.id) }} />
                    
                    {isActive && (
                      <div className="absolute top-[3px] inset-x-0 h-[2px] bg-white/10 z-20">
                        <div className="h-full bg-white/60 animate-progress" />
                      </div>
                    )}

                    <div className="absolute bottom-4 left-3 right-3 flex items-end justify-between z-20">
                      <span 
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-wider" 
                        style={{ background: getGradient(theme.id) }}
                      >
                        {theme.name}
                      </span>
                      
                      {isActive && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white/15 backdrop-blur-sm border border-white/20">
                              <Play className="w-4 h-4 text-white fill-white" />
                            </button>
                          </DialogTrigger>
                          <DialogContent className="fixed inset-0 w-full h-[100dvh] p-0 bg-black border-none overflow-hidden flex flex-col z-[500] translate-x-0 translate-y-0 rounded-none max-w-none">
                            <DialogTitle className="sr-only">Demo {theme.name}</DialogTitle>
                            <DialogDescription className="sr-only">Visualização ao vivo do tema {theme.name}</DialogDescription>
                            <div className="flex-1 relative">
                               <div className="absolute top-6 right-6 z-[600]">
                                  <DialogClose className="p-2.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all border border-white/20 shadow-2xl backdrop-blur-md">
                                     <X className="w-5 h-5" />
                                  </DialogClose>
                               </div>
                               <iframe 
                                 src={(theme as any).demoUrl || "#"} 
                                 className="w-full h-full border-none"
                                 title={`Demo ${theme.name}`}
                               />
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <button 
            onClick={nextStep} 
            className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all z-30 active:scale-90"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center gap-2 mt-8">
          {THEME_OPTIONS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentIndex(i);
                onThemeSelect(THEME_OPTIONS[i].id as ThemeId);
              }}
              className="rounded-full transition-all duration-300"
              style={{
                height: "8px",
                width: currentIndex === i ? "24px" : "8px",
                background: currentIndex === i ? "#1ed760" : "rgba(255, 255, 255, 0.2)"
              }}
            />
          ))}
        </div>
      </div>

      {/* Footer Button */}
      <div className="flex flex-col items-center gap-6 w-full max-w-[320px] shrink-0 z-20 mb-4 md:mb-0">
        <div className="text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">
            Selecionado: <span className="text-white" style={{ color: currentTheme.color }}>{currentTheme.name}</span>
          </p>
        </div>
        <button 
          onClick={onNext} 
          className="w-full text-white h-14 rounded-2xl font-black text-sm shadow-2xl active:scale-95 transition-all uppercase tracking-widest"
          style={{ 
            backgroundColor: currentTheme.color,
            boxShadow: `0 10px 30px ${currentTheme.color}55`
          }}
        >
          Próximo
        </button>
      </div>

      <style jsx global>{`
        @keyframes carousel-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-progress {
          animation: carousel-progress 4s linear infinite;
        }
      `}</style>
    </div>
  );
}
