'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Zap, Flame, ExternalLink, X, CreditCard, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { MemoriesModulePreview } from '@/components/eternize/memories-module-preview';
import { AchievementsModulePreview } from '@/components/eternize/achievements-module-preview';
import { CuriosidadesModulePreview } from '@/components/eternize/curiosidades-module-preview';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/lib/utils';

interface ModuleItem {
  id: string;
  title: string;
  description: string;
  image: string;
  color: string;
}

const MODULES: ModuleItem[] = [
  {
    id: 'memorias',
    title: 'Memórias',
    description: 'Uma linha do tempo interativa dos momentos mais especiais do casal, com fotos e música por memória.',
    image: 'https://picsum.photos/seed/memories-module/600/800',
    color: '#e11d48'
  },
  {
    id: 'conquistas',
    title: 'Conquistas',
    description: 'Desbloqueie marcos exclusivos conforme o tempo passa. Mostre ao mundo o nível do amor de vocês.',
    image: 'https://picsum.photos/seed/achievements-module/600/800',
    color: '#f97316'
  },
  {
    id: 'curiosidades',
    title: 'Curiosidades',
    description: 'Descubra a fase da lua, a estação do ano e fatos astronômicos do dia em que vocês se conheceram.',
    image: 'https://picsum.photos/seed/curiosities-module/600/800',
    color: '#7c3aed'
  },
  {
    id: 'jornada',
    title: 'Jornada no Mapa',
    description: 'Um rastro interativo no mapa mundi conectando os lugares onde vocês criaram as melhores lembranças.',
    image: 'https://picsum.photos/seed/journey-module/600/800',
    color: '#10b981'
  },
  {
    id: 'roleta',
    title: 'Roleta Surpresa',
    description: 'Um jogo interativo para sortear desafios, encontros e momentos divertidos para fazerem juntos.',
    image: 'https://picsum.photos/seed/roulette-module/600/800',
    color: '#f59e0b'
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
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'center',
    skipSnaps: false,
    duration: 30
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [previewModuleId, setPreviewModuleId] = useState<string | null>(null);

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

  const renderPreviewContent = () => {
    switch (previewModuleId) {
      case 'memorias':
        return <MemoriesModulePreview />;
      case 'conquistas':
        return <AchievementsModulePreview />;
      case 'curiosidades':
        return <CuriosidadesModulePreview date={date} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-white/20 p-12 text-center">
            <CreditCard className="w-12 h-12 mb-4 opacity-10" />
            <p className="font-black uppercase tracking-widest text-xs">Prévia em desenvolvimento</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 md:space-y-10 flex flex-col items-center md:items-start w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-3 text-center md:text-left w-full">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="bg-white/5 p-2 rounded-2xl border border-white/10">
            <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-white/80" />
          </div>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight">Pack de Módulos</h2>
        </div>
        <p className="text-xs md:text-base text-white/40 font-medium max-w-xl">
          Adicione 5 módulos exclusivos ao presente. Você poderá editar e personalizar cada módulo após a compra.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="bg-[#3d0b17] border border-primary/20 px-3 py-1.5 rounded-full flex items-center gap-2">
          <Flame className="w-3 h-3 text-primary fill-current" />
          <span className="text-[9px] font-black uppercase text-primary tracking-widest">Oferta Especial — 70% OFF</span>
        </div>
        <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
          <Zap className="w-3 h-3 text-yellow-500 fill-current" />
          <span className="text-[9px] font-black uppercase text-white/50 tracking-widest">Só agora</span>
        </div>
      </div>

      {/* Visual Carousel - Matching StepThemeSelection */}
      <div className="relative w-full flex flex-col items-center">
        <div className="w-full overflow-visible" ref={emblaRef}>
          <div className="flex">
            {MODULES.map((module, i) => {
              const isSelected = selectedIndex === i;
              return (
                <div 
                  key={module.id} 
                  className="flex-[0_0_72%] sm:flex-[0_0_100%] min-w-0 px-3 sm:px-10 flex items-center justify-center transition-opacity duration-500"
                  style={{ 
                    opacity: isSelected ? 1 : 0.2,
                    zIndex: isSelected ? 50 : 10
                  }}
                >
                  <div 
                    className={cn(
                      "relative bg-[#141414] rounded-[24px] overflow-hidden transition-all duration-500 w-full max-w-[280px] aspect-[3/4] border-2",
                      isSelected 
                        ? "scale-100 opacity-100" 
                        : "scale-85 opacity-50 border-transparent grayscale-[0.3]"
                    )}
                    style={isSelected ? { 
                      borderColor: module.color,
                      boxShadow: `0 0 40px ${module.color}66, 0 0 80px ${module.color}33`
                    } : {}}
                  >
                    {/* Top Glow Line */}
                    <div className={cn(
                      "absolute top-0 left-0 right-0 h-[3px] z-30 transition-opacity duration-500",
                      isSelected ? "opacity-100" : "opacity-0"
                    )} 
                    style={{ background: `linear-gradient(90deg, transparent, ${module.color}, transparent)` }}
                    />

                    {/* Media Area */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#1f1f1f] to-[#141414] z-10">
                      <Image 
                        src={module.image} 
                        fill 
                        className="object-cover" 
                        alt={module.title} 
                        priority
                        data-ai-hint="romantic module"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-20" />
                    </div>

                    {/* Card Body Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 z-30">
                      <h3 className="text-white text-lg font-black m-0 font-inter mb-1">{module.title}</h3>
                      <p className="text-[#b3b3b3] text-[10px] leading-snug mb-4 font-medium line-clamp-2">
                        {module.description}
                      </p>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewModuleId(module.id);
                        }}
                        className="w-full bg-white/5 border border-white/10 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-white/10 active:scale-95"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Ver módulo
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Arrows */}
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

        {/* Pagination Dots */}
        <div className="flex gap-2.5 mt-8 shrink-0 z-20">
          {MODULES.map((module, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                i === selectedIndex ? "w-7" : "w-1.5 bg-white/10"
              )} 
              style={i === selectedIndex ? { backgroundColor: module.color } : {}}
            />
          ))}
        </div>
      </div>

      <div className="w-full space-y-4">
        {/* Activation Card */}
        <div 
          onClick={() => onPackToggle(!isPackEnabled)}
          className={cn(
            "w-full bg-[#0c0c0c] border rounded-[2rem] p-7 flex items-center justify-between cursor-pointer transition-all duration-300",
            isPackEnabled ? "border-primary shadow-[0_0_30px_rgba(225,29,72,0.15)] ring-1 ring-primary/20" : "border-white/5"
          )}
        >
          <div className="space-y-1">
            <h4 className="text-sm md:text-base font-black text-white uppercase tracking-wider">ADICIONAR PACK DE MÓDULOS</h4>
            <p className="text-[10px] md:text-[11px] font-bold text-white/40 uppercase tracking-widest">
              Adicionar por apenas <span className="text-white">R$ 7,99</span>
            </p>
          </div>
          <Switch checked={isPackEnabled} onCheckedChange={onPackToggle} />
        </div>

        <div className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 flex items-start gap-4">
          <X className="w-4 h-4 text-white/20 mt-0.5 shrink-0" />
          <p className="text-[11px] font-medium text-white/30 leading-tight">
            Você pode adicionar o Pack de Módulos depois nas configurações da sua página ou em <span className="text-white/60 font-black">Minhas Páginas</span>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full pt-6">
        <Button 
          onClick={onBack} 
          variant="outline" 
          className="h-14 rounded-2xl border-white/10 bg-white/5 font-black text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-3 group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Voltar
        </Button>
        <div className="flex flex-col gap-3">
          <Button 
            onClick={onFinish}
            className="h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-sm transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 group disabled:opacity-50 disabled:grayscale"
          >
            Ir para Pagamento <CheckCircle2 className="w-4 h-4 transition-transform group-hover:scale-110" />
          </Button>
        </div>
      </div>

      {/* Module Preview Modal */}
      <Dialog open={!!previewModuleId} onOpenChange={(open) => !open && setPreviewModuleId(null)}>
        <DialogContent className="fixed inset-0 w-full h-[100dvh] p-0 bg-black border-none overflow-hidden flex flex-col z-[500] translate-x-0 translate-y-0 rounded-none max-w-none">
          <DialogTitle className="sr-only">Prévia do Módulo</DialogTitle>
          <DialogDescription className="sr-only">Visualização detalhada do módulo extra.</DialogDescription>
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
    </div>
  );
}
