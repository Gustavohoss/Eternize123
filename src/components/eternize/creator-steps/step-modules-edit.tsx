'use client';

import React from 'react';
import { LayoutGrid, Check, X, CreditCard, Sparkles, Info } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface StepModulesEditProps {
  isPackEnabled: boolean;
  onPackToggle: (enabled: boolean) => void;
  onBack: () => void;
  onNext: () => void;
}

export function StepModulesEdit({ isPackEnabled, onPackToggle, onBack, onNext }: StepModulesEditProps) {
  return (
    <div className="space-y-8 md:space-y-10 flex flex-col items-center md:items-start w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-3 text-center md:text-left w-full">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="bg-white/5 p-2 rounded-2xl border border-white/10">
            <LayoutGrid className="w-5 h-5 md:w-6 md:h-6 text-white/80" />
          </div>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight">Módulos Extras</h2>
        </div>
        <p className="text-xs md:text-base text-white/40 font-medium">
          Personalize quais seções extras aparecerão no presente do seu amor.
        </p>
      </div>

      <div className="w-full space-y-6">
        <div 
          onClick={() => onPackToggle(!isPackEnabled)}
          className={cn(
            "w-full bg-[#0c0c0c] border rounded-3xl p-6 flex flex-col gap-4 cursor-pointer transition-all duration-300",
            isPackEnabled ? "border-primary/50 ring-1 ring-primary/10 shadow-[0_0_30px_rgba(225,29,72,0.1)]" : "border-white/5"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="bg-primary/20 p-2 rounded-xl">
                  <Sparkles className="w-5 h-5 text-primary" />
               </div>
               <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">Pack de Módulos</h4>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    {isPackEnabled ? 'Exibindo no site' : 'Oculto no site'}
                  </p>
               </div>
            </div>
            <Switch checked={isPackEnabled} onCheckedChange={onPackToggle} />
          </div>

          <div className="grid grid-cols-1 gap-2 pt-2">
            {[
              "Módulo de Memórias (Timeline)",
              "Módulo de Conquistas",
              "Módulo de Curiosidades Astronômicas"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check className={cn("w-3.5 h-3.5", isPackEnabled ? "text-primary" : "text-white/20")} strokeWidth={4} />
                <span className={cn("text-[11px] font-bold", isPackEnabled ? "text-white/70" : "text-white/20")}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-start gap-4">
          <Info className="w-5 h-5 text-white/30 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-[11px] font-black uppercase text-white/60 tracking-widest">Configuração Visual</p>
            <p className="text-[11px] font-medium text-white/30 leading-relaxed">
              Ao desativar, os módulos extras não aparecerão no link final do site. Você poderá editá-los individualmente em breve.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
