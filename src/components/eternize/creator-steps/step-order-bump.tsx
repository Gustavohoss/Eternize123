
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { ChevronLeft, ChevronRight, ExternalLink, X, CheckCircle2, Heart, Trophy, Star, MapPin, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { MemoriesModulePreview } from '@/components/eternize/memories-module-preview';
import { AchievementsModulePreview } from '@/components/eternize/achievements-module-preview';
import { CuriosidadesModulePreview } from '@/components/eternize/curiosidades-module-preview';
import { RouletteModulePreview } from '@/components/eternize/roulette-module-preview';
import { cn } from '@/lib/utils';

const JourneyModulePreview = dynamic(
  () => import('@/components/eternize/journey-module-preview').then(mod => mod.JourneyModulePreview),
  { ssr: false, loading: () => <div className="flex-1 bg-[#0d1117] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div></div> }
);

interface ModuleItem {
  id: string;
  title: string;
  description: string;
  image: string;
  color: string;
  videoUrl?: string;
}

const MODULES: ModuleItem[] = [
  {
    id: 'memorias',
    title: 'Memórias',
    description: 'Uma linha do tempo interativa dos momentos mais especiais do casal, com fotos e música por memória.',
    image: 'https://picsum.photos/seed/memories-module/600/800',
    color: '#e11d48',
    videoUrl: '0rJ7Muz78eQ'
  },
  {
    id: 'conquistas',
    title: 'Conquistas',
    description: 'Desbloqueie marcos exclusivos conforme o tempo passa. Mostre ao mundo o nível do amor de vocês.',
    image: 'https://picsum.photos/seed/achievements-module/600/800',
    color: '#f97316',
    videoUrl: 'ecCOldZHSlc'
  },
  {
    id: 'curiosidades',
    title: 'Curiosidades',
    description: 'Descubra a fase da lua, a estação do ano e fatos astronômicos do dia em que vocês se conheceram.',
    image: 'https://picsum.photos/seed/curiosities-module/600/800',
    color: '#7c3aed',
    videoUrl: 'D2ZOGUFp25I'
  },
  {
    id: 'jornada',
    title: 'Jornada no Mapa',
    description: 'Um rastro interativo no mapa mundi conectando os lugares onde vocês criaram as melhores lembranças.',
    image: 'https://picsum.photos/seed/journey-module/600/800',
    color: '#10b981',
    videoUrl: 'JRAr-Txiyb0'
  },
  {
    id: 'roleta',
    title: 'Roleta Surpresa',
    description: 'Um jogo interativo para sortear desafios, encontros e momentos divertidos para fazerem juntos.',
    image: 'https://picsum.photos/seed/roulette-module/600/800',
    color: '#f59e0b',
    videoUrl: 'l6tXdAXzkPI'
  }
];

interface StepOrderBumpProps {
  onBack: () => void;
  onFinish: () => void;
  date?: Date;
  isPackEnabled: boolean;
  onPackToggle: (enabled: boolean) => void;
}

export function StepOrderBump({ onBack, onFinish, date, isPackEnabled, onPackToggle }: StepOrderBumpProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [previewModuleId, setPreviewModuleId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [origin, setOrigin] = useState('https://www.eternizee.shop');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const nextStep = () => {
    setCurrentIndex(prev => (prev + 1) % MODULES.length);
  };

  const prevStep = () => {
    setCurrentIndex(prev => (prev - 1 + MODULES.length) % MODULES.length);
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    setStartX(clientX);
    if (containerRef.current) containerRef.current.classList.add('dragging');
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    setDragOffset(clientX - startX);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (containerRef.current) containerRef.current.classList.remove('dragging');

    if (dragOffset < -100) {
      nextStep();
    } else if (dragOffset > 100) {
      prevStep();
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
  }, [isDragging]);

  const currentModule = MODULES[currentIndex];

  const renderPreviewContent = () => {
    switch (previewModuleId) {
      case 'memorias': return <MemoriesModulePreview />;
      case 'conquistas': return <AchievementsModulePreview />;
      case 'curiosidades': return <CuriosidadesModulePreview date={date} />;
      case 'jornada': return <JourneyModulePreview />;
      case 'roleta': return <RouletteModulePreview />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col items-center md:items-start w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className={cn("relative w-full flex flex-col items-center mb-10 mt-6")} ref={containerRef}>
        <div 
          className="absolute w-[400px] h-[400px] rounded-full blur-[120px] -z-10 transition-all duration-700 pointer-events-none" 
          style={{ background: `radial-gradient(${currentModule.color}33 0%, transparent 70%)` }}
        />

        <div className="relative flex items-center gap-3 w-full">
          <button 
            onClick={prevStep} 
            className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all z-30 active:scale-90"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          <div 
            className="relative flex-1 overflow-visible cursor-grab active:cursor-grabbing" 
            style={{ height: '480px' }}
            onMouseDown={handleStart}
            onTouchStart={handleStart}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {MODULES.map((module, i) => {
                const total = MODULES.length;
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
                const shadow = isActive ? `0 0 50px -8px ${module.color}66` : "none";

                return (
                  <div
                    key={module.id}
                    className={cn(
                      "absolute rounded-[28px] overflow-hidden select-none pointer-events-none transition-all duration-500 card-transition",
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
                      border: isActive ? `2px solid ${module.color}` : '1px solid rgba(255,255,255,0.1)',
                      WebkitUserDrag: 'none'
                    }}
                    onClick={() => { if(!isActive && !isDragging) { setCurrentIndex(i); } }}
                  >
                    <div className="absolute inset-0 bg-neutral-900 z-0">
                      {module.videoUrl ? (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                          <iframe
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full scale-[1.3] border-none"
                            src={`https://www.youtube-nocookie.com/embed/${module.videoUrl}?autoplay=1&mute=1&controls=0&loop=1&playlist=${module.videoUrl}&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${encodeURIComponent(origin)}`}
                            allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            title={module.title}
                          />
                        </div>
                      ) : (
                        <Image 
                          src={module.image} 
                          fill 
                          className="object-cover" 
                          alt={module.title} 
                          priority
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                      <h3 className="text-white text-2xl font-black mb-1 font-inter">{module.title}</h3>
                      <p className="text-white/60 text-[10px] leading-relaxed mb-6 font-medium line-clamp-3">
                        {module.description}
                      </p>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewModuleId(module.id);
                        }}
                        className="w-full bg-white/5 border border-white/10 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-white/10 active:scale-95"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Ver módulo
                      </button>
                    </div>
                  </div>
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

        <div className="flex items-center gap-2 mt-8">
          {MODULES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className="rounded-full transition-all duration-300"
              style={{
                height: "6px",
                width: currentIndex === i ? "20px" : "6px",
                background: currentIndex === i ? currentModule.color : "rgba(255, 255, 255, 0.2)"
              }}
            />
          ))}
        </div>
      </div>

      <div className="w-full space-y-6">
        <div 
          onClick={() => onPackToggle(!isPackEnabled)}
          className={cn(
            "w-full bg-[#0c0c0c] border rounded-[3rem] p-7 md:p-8 flex items-center justify-between cursor-pointer transition-all duration-500",
            isPackEnabled ? "border-primary shadow-[0_0_40px_rgba(225,29,72,0.15)]" : "border-white/10"
          )}
        >
          <div className="space-y-1">
            <h4 className="text-base md:text-lg font-black text-white uppercase tracking-tight">ADICIONAR PACK DE MÓDULOS</h4>
            <div className="flex items-center gap-2">
               <span className="text-[10px] md:text-[11px] font-bold text-white/40 uppercase tracking-widest">ADICIONAR POR APENAS</span>
               <span className="text-[11px] md:text-[12px] font-black text-white">R$ 11,99</span>
            </div>
          </div>
          <Switch checked={isPackEnabled} onCheckedChange={onPackToggle} className="scale-110" />
        </div>

        <div className="flex justify-center md:justify-start">
           <p className="text-[10px] font-medium text-white/20 italic flex items-center gap-2">
              <CheckCircle2 className="w-3 h-3" /> Você poderá configurar os módulos após a liberação
           </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full pt-10">
        <Button 
          onClick={onBack} 
          variant="outline" 
          className="h-14 rounded-2xl border-white/10 bg-white/5 font-black text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2 group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Voltar
        </Button>
        <Button 
          onClick={onFinish}
          className="h-14 rounded-2xl bg-[#15803d] hover:bg-[#166534] text-white font-black text-sm transition-all flex items-center justify-center gap-2 shadow-2xl active:scale-95 group"
        >
          Ir para Pagamento <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>

      <Dialog open={!!previewModuleId} onOpenChange={(open) => !open && setPreviewModuleId(null)}>
        <DialogContent className="fixed inset-0 w-full h-[100dvh] p-0 bg-black border-none overflow-hidden flex flex-col z-[500] translate-x-0 translate-y-0 rounded-none max-w-none">
          <DialogTitle className="sr-only">Prévia do Módulo</DialogTitle>
          <DialogDescription className="sr-only">Visualização detalhada do módulo.</DialogDescription>
          <div className="flex-1 overflow-y-auto no-scrollbar relative">
             <div className="absolute top-6 right-6 z-[600]">
                <DialogClose className="p-2.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all border border-white/20 shadow-2xl backdrop-blur-md">
                   <X className="w-5 h-5" />
                </DialogClose>
             </div>
             {renderPreviewContent()}
          </div>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .card-transition {
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .dragging .card-transition {
          transition: none !important;
        }
      `}</style>
    </div>
  );
}
