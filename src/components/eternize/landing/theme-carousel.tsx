
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import NextImage from 'next/image';
import { ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { THEME_OPTIONS } from '@/app/criador/constants';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';

export function ThemeCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'center', 
    skipSnaps: false,
    duration: 30
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const currentTheme = THEME_OPTIONS[selectedIndex];

  return (
    <div className="relative w-full max-w-[400px] flex flex-col items-center">
      <div className="w-full overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {THEME_OPTIONS.map((theme, i) => {
            const isSelected = selectedIndex === i;
            const videoId = (theme as any).videoUrl;

            return (
              <div 
                key={theme.id} 
                className="flex-[0_0_100%] min-w-0 px-10 flex items-center justify-center transition-opacity duration-500"
                style={{ 
                  opacity: isSelected ? 1 : 0.2,
                  zIndex: isSelected ? 50 : 10
                }}
              >
                <div 
                  className={cn(
                    "relative bg-[#141414] rounded-[24px] overflow-hidden transition-all duration-500 w-full max-w-[280px] aspect-[3/4.8] border-2",
                    isSelected 
                      ? "scale-100 opacity-100" 
                      : "scale-85 opacity-50 border-transparent grayscale-[0.3]"
                  )}
                  style={isSelected ? { 
                    borderColor: theme.color,
                    boxShadow: `0 0 40px ${theme.color}66, 0 0 80px ${theme.color}33`
                  } : {}}
                >
                  <div className={cn(
                    "absolute top-0 left-0 right-0 h-[3px] z-30 transition-opacity duration-500",
                    isSelected ? "opacity-100" : "opacity-0"
                  )} 
                  style={{ background: `linear-gradient(90deg, transparent, ${theme.color}, transparent)` }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-b from-[#1f1f1f] to-[#141414] z-10 overflow-hidden">
                    {videoId ? (
                      <div className="absolute inset-0 pointer-events-none">
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
                        data-ai-hint="theme preview"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-20" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5 z-30">
                    <div className="flex justify-between items-center mb-1">
                      <h2 className="text-white text-lg font-black m-0 font-inter">{theme.name}</h2>
                      <span 
                        className="px-2.5 py-0.5 rounded-full text-[0.6rem] font-black uppercase tracking-wider border"
                        style={{ 
                          backgroundColor: `${theme.color}22`, 
                          color: theme.color, 
                          borderColor: `${theme.color}44` 
                        }}
                      >
                        {theme.badge}
                      </span>
                    </div>

                    <p className="text-[#b3b3b3] text-[10px] font-medium line-clamp-2 leading-relaxed mb-4">
                      {theme.description}
                    </p>

                    <Dialog>
                      <DialogTrigger asChild>
                        <button 
                          className="w-full bg-white/5 border border-white/10 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-white/10 active:scale-95"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Ver demo
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button 
        onClick={scrollPrev}
        className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-90 z-20"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button 
        onClick={scrollNext}
        className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-90 z-20"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      <div className="flex gap-2.5 mt-8 shrink-0 z-20">
        {THEME_OPTIONS.map((theme, i) => (
          <div 
            key={i} 
            className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              i === selectedIndex ? "w-7" : "w-1.5 bg-white/10"
            )} 
            style={i === selectedIndex ? { backgroundColor: theme.color } : {}}
          />
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
          Selecionado: <span className="text-white" style={{ color: currentTheme.color }}>{currentTheme.name}</span>
        </p>
      </div>
    </div>
  );
}
