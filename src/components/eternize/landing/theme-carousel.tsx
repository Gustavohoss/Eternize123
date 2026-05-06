
'use client';

import React, { useState, useEffect } from 'react';
import NextImage from 'next/image';
import { ChevronLeft, ChevronRight, ExternalLink, X, Play } from 'lucide-react';
import { THEME_OPTIONS } from '@/app/criador/constants';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';

export function ThemeCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextStep = () => setCurrentIndex((prev) => (prev + 1) % THEME_OPTIONS.length);
  const prevStep = () => setCurrentIndex((prev) => (prev - 1 + THEME_OPTIONS.length) % THEME_OPTIONS.length);

  const currentTheme = THEME_OPTIONS[currentIndex];

  // Cores dinâmicas para o glow de fundo baseadas no tema
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
    <div className="relative w-full max-w-[520px] flex flex-col items-center justify-center py-10 gap-6">
      {/* Dynamic Background Glow */}
      <div 
        className="absolute w-[480px] h-[480px] rounded-full blur-[120px] -z-10 transition-all duration-700 pointer-events-none" 
        style={{ background: `radial-gradient(${getGlowColor(currentTheme.id)} 0%, transparent 70%)` }}
      />

      <div className="relative flex items-center gap-3 w-full">
        {/* Prev Button */}
        <button 
          onClick={prevStep} 
          className="flex-shrink-0 w-9 h-9 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all z-30 active:scale-90"
        >
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>

        {/* Carousel Track Area */}
        <div className="relative flex-1 overflow-hidden rounded-2xl h-[480px]">
          <div className="relative w-full h-full flex items-center justify-center">
            {THEME_OPTIONS.map((theme, i) => {
              const offset = i - currentIndex;
              const isActive = i === currentIndex;
              const isAdjacent = Math.abs(offset) === 1 || (currentIndex === 0 && i === THEME_OPTIONS.length - 1) || (currentIndex === THEME_OPTIONS.length - 1 && i === 0);
              
              // Ajuste de offset para loop infinito visual
              let displayOffset = offset;
              if (currentIndex === 0 && i === THEME_OPTIONS.length - 1) displayOffset = -1;
              if (currentIndex === THEME_OPTIONS.length - 1 && i === 0) displayOffset = 1;

              const opacity = isActive ? 1 : (Math.abs(displayOffset) === 1 ? 0.45 : 0);
              const scale = isActive ? 1 : 0.74;
              const translateX = displayOffset * 220;
              const zIndex = isActive ? 10 : 5;
              const blur = isActive ? "none" : "blur(1.5px)";
              const shadow = isActive ? `0 32px 80px -8px ${getGlowColor(theme.id)}` : "none";
              const videoId = (theme as any).videoUrl;

              return (
                <motion.div
                  key={theme.id}
                  onClick={() => { if(!isActive) setCurrentIndex(i); }}
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
                  {/* Media Content */}
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
                      <NextImage 
                        src={theme.image} 
                        fill 
                        className="object-cover" 
                        alt={theme.name} 
                        priority
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent z-10" />
                  </div>

                  {/* Top Accent Border */}
                  <div className="absolute top-0 inset-x-0 h-[3px] z-20" style={{ background: getGradient(theme.id) }} />
                  
                  {/* Progress Bar (Active Only) */}
                  {isActive && (
                    <div className="absolute top-[3px] inset-x-0 h-[2px] bg-white/10 z-20">
                      <div className="h-full bg-white/60 animate-progress" />
                    </div>
                  )}

                  {/* Card Label & Button */}
                  <div className="absolute bottom-4 left-3 right-3 flex items-end justify-between z-20">
                    <span 
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-wider shadow-lg" 
                      style={{ background: getGradient(theme.id) }}
                    >
                      {theme.name}
                    </span>
                    
                    {isActive && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="w-9 h-9 rounded-full flex items-center justify-center bg-white/15 backdrop-blur-sm border border-white/20 hover:bg-white/30 transition-all active:scale-90">
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

        {/* Next Button */}
        <button 
          onClick={nextStep} 
          className="flex-shrink-0 w-9 h-9 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all z-30 active:scale-90"
        >
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center gap-2">
        {THEME_OPTIONS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className="rounded-full transition-all duration-300"
            style={{
              height: "8px",
              width: currentIndex === i ? "24px" : "8px",
              background: currentIndex === i ? "#1ed760" : "rgba(255, 255, 255, 0.2)"
            }}
          />
        ))}
      </div>

      <p className="text-white/40 text-[10px] font-black tracking-[0.2em] uppercase">
        {currentTheme.name} — Eternize
      </p>

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

