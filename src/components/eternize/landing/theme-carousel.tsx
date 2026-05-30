'use client';

import React, { useState, useEffect, useRef } from 'react';
import NextImage from 'next/image';
import { ChevronLeft, ChevronRight, Play, X, ExternalLink } from 'lucide-react';
import { THEME_OPTIONS } from '@/app/criador/constants';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';

export function ThemeCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [origin, setOrigin] = useState('https://www.eternizee.shop');
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin || 'https://www.eternizee.shop');
    }
  }, []);

  const nextStep = () => {
    setCurrentIndex(prev => (prev + 1) % THEME_OPTIONS.length);
  };

  const prevStep = () => {
    setCurrentIndex(prev => (prev - 1 + THEME_OPTIONS.length) % THEME_OPTIONS.length);
  };

  useEffect(() => {
    if (isDragging || isDialogOpen) return;
    
    const timer = setInterval(() => {
      nextStep();
    }, 4000);

    return () => clearInterval(timer);
  }, [currentIndex, isDragging, isDialogOpen]);

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    setStartX(clientX);
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    let offset = clientX - startX;
    setDragOffset(offset);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset < -100) {
      setCurrentIndex(prev => (prev + 1) % THEME_OPTIONS.length);
    } else if (dragOffset > 100) {
      setCurrentIndex(prev => (prev - 1 + THEME_OPTIONS.length) % THEME_OPTIONS.length);
    }

    setDragOffset(0);
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e);
    const onMouseUp = () => handleEnd();
    const onTouchMove = (e: TouchEvent) => handleMove(e);
    const onTouchEnd = () => handleEnd();

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, dragOffset]);

  // Efeito para garantir que o vídeo atual esteja tocando
  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      currentVideo.load();
      currentVideo.play().catch(() => {});
    }
  }, [currentIndex]);

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
    <div className={cn("relative w-full max-w-[520px] flex flex-col items-center justify-center py-10 gap-6", isDragging && "dragging")} ref={containerRef}>
      <div 
        className="absolute w-[480px] h-[480px] rounded-full blur-[120px] -z-10 transition-all duration-700 pointer-events-none" 
        style={{ background: `radial-gradient(${getGlowColor(currentTheme.id)} 0%, transparent 70%)` }}
      />

      <div className="relative flex items-center gap-3 w-full">
        <button 
          onClick={prevStep} 
          className="flex-shrink-0 w-9 h-9 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all z-30 active:scale-90"
        >
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>

        <div 
          className="relative flex-1 overflow-visible rounded-2xl cursor-grab active:cursor-grabbing" 
          style={{ height: '480px' }}
          onMouseDown={handleStart}
          onTouchStart={handleStart}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {THEME_OPTIONS.map((theme, i) => {
              const total = THEME_OPTIONS.length;
              let offset = i - currentIndex;
              
              if (offset > total / 2) offset -= total;
              if (offset < -total / 2) offset += total;

              const isActive = i === currentIndex;
              
              const translateX = (offset * 255) + dragOffset;
              const distanceFromCenter = Math.abs(translateX) / 255;
              
              let opacity = Math.max(0, 1 - (distanceFromCenter * 0.55));
              if (isActive) opacity = 1 - (distanceFromCenter * 0.5);
              
              const scale = Math.max(0.74, 1 - (distanceFromCenter * 0.26));
              const zIndex = isActive ? 10 : 5;
              const blur = distanceFromCenter < 0.1 ? "none" : "blur(1.5px)";
              const shadow = isActive ? `0 32px 80px -8px ${getGlowColor(theme.id)}` : "none";
              const videoId = (theme as any).videoUrl;
              const localVideo = (theme as any).localVideo;

              return (
                <div
                  key={theme.id}
                  className={cn(
                    "absolute rounded-[24px] overflow-hidden select-none pointer-events-none transition-all duration-500",
                    !isDragging && "card-transition",
                    isActive && "pointer-events-auto"
                  )}
                  style={{
                    width: "255px",
                    height: "453px",
                    zIndex,
                    opacity,
                    filter: blur,
                    boxShadow: shadow,
                    left: "50%",
                    top: "50%",
                    transform: `translateX(calc(-50% + ${translateX}px)) translateY(-50%) scale(${scale})`,
                    WebkitUserDrag: 'none'
                  }}
                  onClick={() => { if(!isActive && !isDragging) { setCurrentIndex(i); } }}
                >
                  <div className="absolute inset-0 bg-neutral-900 z-0">
                    {localVideo ? (
                      <video 
                        ref={el => { videoRefs.current[i] = el; }}
                        key={localVideo}
                        autoPlay 
                        muted 
                        loop 
                        playsInline 
                        webkit-playsinline="true"
                        preload="auto"
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                      >
                        <source src={localVideo} type="video/mp4" />
                      </video>
                    ) : videoId ? (
                      <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <iframe
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full scale-[1.25] border-none opacity-60"
                          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&disablekb=1&modestbranding=1&rel=0&iv_load_policy=3&enablejsapi=1&origin=${encodeURIComponent(origin)}&widget_referrer=${encodeURIComponent(origin)}&playsinline=1`}
                          allow="autoplay"
                          title={theme.name}
                          loading="eager"
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent z-10" />
                  </div>

                  <div className="absolute top-0 inset-x-0 h-[3px] z-20" style={{ background: getGradient(theme.id) }} />
                  
                  {isActive && (
                    <div className="absolute top-[3px] inset-x-0 h-[2px] bg-white/10 z-20">
                      <div className="h-full bg-white/60 animate-progress" />
                    </div>
                  )}

                  <div className="absolute bottom-6 left-4 right-4 z-20 flex flex-col gap-3">
                    <span 
                      className="w-fit px-2.5 py-1 rounded-full text-white text-[11px] font-bold shadow-lg" 
                      style={{ background: getGradient(theme.id) }}
                    >
                      {theme.name}
                    </span>
                    
                    {isActive && (
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <button 
                            className="w-full h-11 rounded-xl flex items-center justify-center gap-2 bg-white text-black font-black text-[10px] uppercase tracking-wider hover:bg-neutral-100 transition-all active:scale-95 pointer-events-auto shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-500"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            Ver demo ao vivo
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
                </div>
              );
            })}
          </div>
        </div>

        <button 
          onClick={nextStep} 
          className="flex-shrink-0 w-9 h-9 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all z-30 active:scale-90"
        >
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        {THEME_OPTIONS.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrentIndex(i);
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

      <p className="text-white/40 text-[10px] font-black tracking-[0.2em] uppercase">
        {currentTheme.name} — Eternize
      </p>

      <style jsx global>{`
        .card-transition {
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .dragging .card-transition {
          transition: none !important;
        }
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
