'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { THEME_OPTIONS, ThemeId } from '@/app/criador/constants';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/lib/utils';

interface StepThemeSelectionProps {
  selectedTheme: ThemeId;
  onThemeSelect: (theme: ThemeId) => void;
  onNext: () => void;
}

export function StepThemeSelection({ selectedTheme, onThemeSelect, onNext }: StepThemeSelectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'center', 
    skipSnaps: false,
    duration: 30
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const currentTheme = THEME_OPTIONS[selectedIndex];
  const themeColor = currentTheme.color;

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);
    onThemeSelect(THEME_OPTIONS[index].id as ThemeId);
  }, [emblaApi, onThemeSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative z-10 container mx-auto px-4 h-[100dvh] flex flex-col items-center justify-between overflow-hidden py-14 md:py-24">
      
      {/* Header Compacto */}
      <div className="w-full max-w-4xl flex flex-col shrink-0 mt-4 md:mt-0">
        <div className="space-y-1 text-center md:text-center">
          <h2 className="text-xl md:text-4xl font-black tracking-tight uppercase italic italic-shadow">Qual tema você quer usar?</h2>
          <p className="text-[10px] md:text-sm text-white/40 font-medium">Personalizamos tudo para você automaticamente.</p>
        </div>
      </div>

      <div className="relative w-full flex flex-col items-center flex-1 min-h-0 justify-center my-6">
        {/* Carousel Container - Peeking enabled */}
        <div className="w-full overflow-visible" ref={emblaRef}>
          <div className="flex">
            {THEME_OPTIONS.map((theme, i) => {
              const isSelected = selectedTheme === theme.id;
              const videoId = (theme as any).videoUrl;

              return (
                <div 
                  key={theme.id} 
                  className="flex-[0_0_72%] sm:flex-[0_0_100%] min-w-0 px-3 sm:px-10 flex items-center justify-center transition-opacity duration-500"
                  style={{ 
                    opacity: isSelected ? 1 : 0.2,
                    zIndex: isSelected ? 50 : 10
                  }}
                >
                  <div 
                    className={cn(
                      "relative bg-[#141414] rounded-[24px] overflow-hidden transition-all duration-500 w-full max-w-[280px] aspect-[3/4.2] border-2",
                      isSelected 
                        ? "scale-100 opacity-100" 
                        : "scale-85 opacity-50 border-transparent grayscale-[0.3]"
                    )}
                    style={isSelected ? { 
                      borderColor: theme.color,
                      boxShadow: `0 0 40px ${theme.color}66, 0 0 80px ${theme.color}33`
                    } : {}}
                  >
                    {/* Top Glow Line */}
                    <div className={cn(
                      "absolute top-0 left-0 right-0 h-[3px] z-30 transition-opacity duration-500",
                      isSelected ? "opacity-100" : "opacity-0"
                    )} 
                    style={{ background: `linear-gradient(90deg, transparent, ${theme.color}, transparent)` }}
                    />

                    {/* Media Area */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#1f1f1f] to-[#141414] z-10">
                      {videoId ? (
                        <div className="absolute inset-0 pointer-events-none">
                          <iframe
                            className="w-full h-full scale-[1.5] border-none"
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&playsinline=1`}
                            allow="autoplay; encrypted-media"
                            tabIndex={-1}
                          />
                        </div>
                      ) : (
                        <Image 
                          src={theme.image} 
                          fill 
                          className="object-cover" 
                          alt={theme.name} 
                          priority
                          data-ai-hint="theme preview"
                        />
                      )}
                      {/* Gradient Overlay for Text */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-20" />
                    </div>

                    {/* Card Body Overlay */}
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

                      <p className="text-[#b3b3b3] text-[10px] leading-snug mb-4 font-medium line-clamp-2">
                        {theme.description}
                      </p>

                      <a 
                        href={(theme as any).demoUrl || "#"} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full bg-white/5 border border-white/10 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-white/10 active:scale-95"
                        onClick={(e) => !(theme as any).demoUrl && e.preventDefault()}
                      >
                        <ExternalLink className="w-3 h-3" />
                        Ver demo
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Arrows (Desktop Only) */}
        <button 
          onClick={scrollPrev}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 items-center justify-center hover:bg-white/10 transition-all active:scale-90 z-20"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button 
          onClick={scrollNext}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 items-center justify-center hover:bg-white/10 transition-all active:scale-90 z-20"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        {/* Pagination Dots */}
        <div className="flex gap-2.5 mt-6 shrink-0 z-20">
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
      </div>

      {/* Footer Button */}
      <div className="flex flex-col items-center gap-6 w-full max-w-[320px] shrink-0 z-20 mb-4 md:mb-0">
        <div className="text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">
            Selecionado: <span className="text-white" style={{ color: themeColor }}>{currentTheme.name}</span>
          </p>
        </div>
        <button 
          onClick={onNext} 
          className="w-full text-white h-14 rounded-2xl font-black text-sm shadow-2xl active:scale-95 transition-all uppercase tracking-widest"
          style={{ 
            backgroundColor: themeColor,
            boxShadow: `0 10px 30px ${themeColor}55`
          }}
        >
          Próximo
        </button>
      </div>
    </div>
  );
}
