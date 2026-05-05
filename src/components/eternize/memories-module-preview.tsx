
'use client';

import React from 'react';
import Image from 'next/image';
import { Heart, Sparkles, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Memory {
  id: string;
  title: string;
  date: string;
  description: string;
  photo: string;
}

interface MemoriesModulePreviewProps {
  memories?: Memory[];
}

export function MemoriesModulePreview({ memories }: MemoriesModulePreviewProps) {
  const dummyMemories: Memory[] = [
    {
      id: '1',
      title: 'Nosso primeiro encontro',
      date: '13 de fevereiro, 2022',
      description: 'Foi num café pequeno no centro. Eu estava nervosa, mas seu sorriso me deixou à vontade na hora.',
      photo: 'https://picsum.photos/seed/mem-1/400/400'
    },
    {
      id: '2',
      title: 'Viagem para o litoral',
      date: '09 de julho, 2022',
      description: 'Três dias com os pés na areia, sem pressa. A melhor viagem da minha vida até então.',
      photo: 'https://picsum.photos/seed/mem-2/400/400'
    }
  ];

  const displayMemories = memories && memories.length > 0 ? memories : dummyMemories;

  return (
    <div className="bg-[#050508] text-white min-h-full overflow-x-hidden relative pb-24">
      {/* Grão/Ruído no fundo */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")` }} />

      {/* Header da Seção */}
      <div className="flex flex-col items-center pt-16 pb-12 px-4 relative z-10">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-red-500/10 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
          <Heart className="w-5 h-5 text-red-500 opacity-70 fill-current" />
        </div>
        <h1 className="font-['Dancing_Script'] text-5xl mb-2 bg-gradient-to-br from-white to-red-400 bg-clip-text text-transparent">Memórias</h1>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px w-8 bg-red-500/30"></div>
          <span className="text-red-500/40 text-xs">❤</span>
          <div className="h-px w-8 bg-red-500/30"></div>
        </div>
        <p className="text-white/40 text-sm text-center max-w-[280px] font-medium leading-relaxed">Reviva os momentos especiais da sua história.</p>
      </div>

      {/* Timeline Container */}
      <div className="relative max-w-[450px] mx-auto px-4">
        
        {/* Linha pontilhada vertical central */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px border-l border-dashed border-white/10 z-0" />

        {displayMemories.map((memory, index) => {
          const isEven = index % 2 === 0;
          return (
            <div key={memory.id} className="flex w-full items-start mb-16 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${index * 0.1}s` }}>
              
              {/* Layout alternado */}
              <div className={cn("flex-1 pt-4", isEven ? "pr-4 text-right" : "order-last pl-4 text-left")}>
                <span className="text-4xl font-bold opacity-5 block leading-none mb-2 font-headline">{(index + 1).toString().padStart(2, '0')}</span>
                <p className="font-['Space_Mono'] text-[10px] text-red-500 uppercase tracking-tighter mb-1 font-bold">{memory.date}</p>
                <h3 className="text-white font-black text-sm uppercase tracking-tight mb-2 leading-tight">{memory.title}</h3>
                <p className="text-white/40 text-[11px] leading-relaxed font-medium line-clamp-4">{memory.description}</p>
              </div>

              {/* Centro: Indicador */}
              <div className="w-10 flex flex-col items-center pt-8 shrink-0">
                <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.4)] border border-red-400/20">
                  <Heart className="w-3 h-3 text-white fill-current" />
                </div>
              </div>

              {/* Lado da Polaroid */}
              <div className={cn("flex-1", isEven ? "pl-4" : "order-first pr-4")}>
                <div 
                  className={cn(
                    "bg-white p-2 shadow-2xl transition-transform hover:scale-105 duration-300 transform",
                    isEven ? "rotate-2" : "-rotate-2"
                  )}
                >
                  <div className="aspect-square relative overflow-hidden bg-neutral-100">
                    {memory.photo ? (
                      <Image src={memory.photo} fill className="object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-neutral-300 gap-2">
                        <Camera className="w-6 h-6" />
                        <span className="text-[8px] font-black uppercase">Sem foto</span>
                      </div>
                    )}
                  </div>
                  <p className="font-['Dancing_Script'] text-neutral-800 text-center mt-2 text-[10px] font-bold truncate px-1">
                    {memory.title}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Footer da Timeline */}
        <div className="flex flex-col items-center mt-4 gap-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500/5 border border-white/5">
            <Sparkles className="w-4 h-4 text-red-500/40" />
          </div>
          <p className="font-['Space_Mono'] text-[10px] text-white/20 uppercase tracking-[0.3em]">{displayMemories.length} memórias</p>
        </div>

      </div>
    </div>
  );
}
