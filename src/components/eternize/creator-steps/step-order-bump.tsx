'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Zap, Flame, ExternalLink, X, CreditCard, RotateCcw } from 'lucide-react';
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
}

const MODULES: ModuleItem[] = [
  {
    id: 'memorias',
    title: 'Memórias',
    description: 'Uma linha do tempo interativa dos momentos mais especiais do casal, com fotos e música por memória.',
    image: 'https://picsum.photos/seed/memories-module/600/800'
  },
  {
    id: 'conquistas',
    title: 'Conquistas',
    description: 'Desbloqueie marcos exclusivos conforme o tempo passa. Mostre ao mundo o nível do amor de vocês.',
    image: 'https://picsum.photos/seed/achievements-module/600/800'
  },
  {
    id: 'curiosidades',
    title: 'Curiosidades',
    description: 'Descubra a fase da lua, a estação do ano e fatos astronômicos do dia em que vocês se conheceram.',
    image: 'https://picsum.photos/seed/curiosities-module/600/800'
  },
  {
    id: 'mapa-astral',
    title: 'Mapa Astral',
    description: 'O alinhamento dos astros e a energia do universo no exato momento em que essa história começou.',
    image: 'https://picsum.photos/seed/astral-module/600/800'
  },
  {
    id: 'jornada',
    title: 'Jornada no Mapa',
    description: 'Um rastro interativo no mapa mundi conectando os lugares onde vocês criaram as melhores lembranças.',
    image: 'https://picsum.photos/seed/journey-module/600/800'
  },
  {
    id: 'roleta',
    title: 'Roleta Surpresa',
    description: 'Um jogo interativo para sortear desafios, encontros e momentos divertidos para fazerem juntos.',
    image: 'https://picsum.photos/seed/roulette-module/600/800'
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
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
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
          Adicione 6 módulos exclusivos ao presente. Você poderá editar e personalizar cada módulo após a compra.
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

      <div className="relative w-full max-w-[450px] mx-auto md:mx-0">
        <div className="overflow-visible" ref={emblaRef}>
          <div className="flex">
            {MODULES.map((module) => (
              <div key={module.id} className="flex-[0_0_85%] min-w-0 px-3">
                <div className="relative aspect-[3/4] bg-[#0c0c0c] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl group">
                  <Image 
                    src={module.image} 
                    fill 
                    className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-110" 
                    alt={module.title} 
                    data-ai-hint="romantic module"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  
                  <div className="absolute bottom-8 left-8 right-8 space-y-4">
                    <h3 className="text-xl font-black text-white">{module.title}</h3>
                    <p className="text-[11px] text-white/60 leading-relaxed font-medium">
                      {module.description}
                    </p>
                    <Button 
                      onClick={() => setPreviewModuleId(module.id)}
                      variant="outline" 
                      className="w-full bg-white/5 border-white/10 rounded-xl h-10 text-[10px] font-bold uppercase tracking-wider hover:bg-white/10 flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-3 h-3" /> Ver módulo
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={scrollPrev}
          className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center hover:bg-black/80 transition-all z-10"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={scrollNext}
          className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center hover:bg-black/80 transition-all z-10"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="flex justify-center gap-1.5 mt-6">
          {MODULES.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                i === selectedIndex ? "w-6 bg-primary" : "w-2 bg-white/10"
              )} 
            />
          ))}
        </div>
      </div>

      <Dialog open={!!previewModuleId} onOpenChange={(open) => !open && setPreviewModuleId(null)}>
        <DialogContent className="max-w-full w-full h-full sm:max-w-[450px] sm:h-[92vh] p-0 bg-black border-none overflow-hidden flex flex-col z-[300] [&>button]:hidden">
          <DialogTitle className="sr-only">Visualização do Módulo</DialogTitle>
          <DialogDescription className="sr-only">Visualize como este módulo exclusivo aparecerá na sua página.</DialogDescription>
          
          <div className="relative h-full flex flex-col">
             <div className="absolute top-6 right-6 z-[350]">
                <DialogClose asChild>
                  <Button className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:bg-black/80 flex items-center justify-center text-white shadow-2xl transition-all active:scale-95">
                    <X className="w-5 h-5" />
                  </Button>
                </DialogClose>
             </div>

             <div className="flex-1 overflow-y-auto no-scrollbar custom-scroll">
                {renderPreviewContent()}
             </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="w-full space-y-4">
        <div 
          onClick={() => onPackToggle(!isPackEnabled)}
          className={cn(
            "w-full bg-[#0c0c0c] border rounded-3xl p-6 flex items-center justify-between cursor-pointer transition-all duration-300",
            isPackEnabled ? "border-primary/50 ring-1 ring-primary/10" : "border-white/5"
          )}
        >
          <div className="space-y-1">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">Adicionar Pack de Módulos</h4>
            <p className="text-[11px] font-bold text-white/40">
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

      <div className="w-full text-center">
        <p className="text-[10px] font-medium text-white/20 uppercase tracking-[0.2em]">
          Disponível para adicionar a qualquer momento em Minhas Páginas
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full pt-6">
        <Button 
          onClick={onBack} 
          variant="outline" 
          className="h-14 rounded-2xl border-white/10 bg-white/5 font-black text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-3 group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Voltar
        </Button>
        <Button 
          onClick={onFinish}
          className="h-14 rounded-2xl bg-[#15803d] hover:bg-[#166534] text-white font-black text-sm transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 group"
        >
          Finalizar <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
}
