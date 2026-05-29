
'use client';

import React from 'react';
import { Mail, Check, Crown, Lock, Infinity, Zap, HelpCircle, ChevronRight, ChevronLeft, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StepPlansProps {
  selectedPlan: 'forever' | '1w';
  onPlanChange: (plan: 'forever' | '1w') => void;
  onBack: () => void;
  onFinish: () => void;
}

export function StepPlans({ selectedPlan, onPlanChange, onBack, onFinish }: StepPlansProps) {
  return (
    <div className="space-y-8 md:space-y-10 flex flex-col items-center md:items-start w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="space-y-3 text-center md:text-left w-full">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="bg-white/5 p-2 rounded-2xl border border-white/10">
            <Mail className="w-5 h-5 md:w-6 md:h-6 text-white/80" />
          </div>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight">Escolha seu plano</h2>
        </div>
        <p className="text-xs md:text-base text-white/40 font-medium max-w-xl">
          Selecione o plano que melhor atende às suas necessidades. Você poderá editar sua página quantas vezes quiser após o pagamento.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* 1 Week Plan */}
        <div 
          onClick={() => onPlanChange('1w')}
          className={cn(
            "relative bg-[#0c0c0c] border rounded-[2rem] p-8 flex flex-col gap-6 transition-all duration-300 cursor-pointer group",
            selectedPlan === '1w' ? "border-primary/50 ring-1 ring-primary/20" : "border-white/5 hover:border-white/10"
          )}
        >
          <div className="space-y-1">
            <h3 className="text-xl font-black text-white">1 semana</h3>
            <p className="text-xs text-white/30 font-medium">Acesso por 1 semana. Todas as funcionalidades incluídas.</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">R$ 19,90</span>
            </div>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-wider">/por 1 semana</p>
          </div>

          <div className="space-y-3 pt-2">
            {[
              "Contador em tempo real",
              "Texto dedicado",
              "Até 4 fotos",
              "Edições ilimitadas ✍️",
              "URL personalizada",
              "Música dedicada",
              "Fundo dinâmico"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="bg-white/5 p-0.5 rounded-full">
                  <Check className="w-3 h-3 text-white/20" />
                </div>
                <span className="text-[11px] font-bold text-white/40">{feature}</span>
              </div>
            ))}
          </div>

          <Button 
            variant="outline" 
            className={cn(
              "mt-4 w-full h-12 rounded-2xl font-black text-xs uppercase tracking-widest transition-all",
              selectedPlan === '1w' ? "bg-white text-black border-none" : "bg-white/5 border-white/5 text-white/30"
            )}
          >
            {selectedPlan === '1w' ? '✓ Selecionado' : 'Selecionar'}
          </Button>
        </div>

        {/* Forever Plan */}
        <div 
          onClick={() => onPlanChange('forever')}
          className={cn(
            "relative bg-[#0c0c0c] border rounded-[2rem] p-8 flex flex-col gap-6 transition-all duration-300 cursor-pointer group shadow-[0_0_40px_rgba(225,29,72,0.1)]",
            selectedPlan === 'forever' ? "border-primary ring-2 ring-primary/20 scale-[1.02]" : "border-white/5 hover:border-white/10"
          )}
        >
          <div className="absolute -top-3 right-8 bg-primary text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest text-white flex items-center gap-1.5 shadow-xl">
            <Crown className="w-2.5 h-2.5 fill-current" /> Recomendado
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-black text-white">Para sempre</h3>
            <p className="text-xs text-white/30 font-medium">Sem prazo. Sua história fica guardada para sempre.</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">R$ 27,00</span>
            </div>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-wider">∞ /uma vez</p>
          </div>

          <div className="space-y-3 pt-2">
            {[
              "Contador em tempo real",
              "Texto dedicado",
              "Até 8 fotos",
              "Edições ilimitadas ✍️",
              "URL personalizada",
              "Música dedicada",
              "Fundo dinâmico",
              "Acesso ilimitado"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="bg-primary/20 p-0.5 rounded-full">
                  <Check className="w-3 h-3 text-primary" strokeWidth={4} />
                </div>
                <span className="text-[11px] font-bold text-white/70">{feature}</span>
              </div>
            ))}
          </div>

          <Button 
            className={cn(
              "mt-4 w-full h-12 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl",
              selectedPlan === 'forever' ? "bg-primary text-white hover:bg-primary/90" : "bg-white/5 text-white/30"
            )}
          >
            {selectedPlan === 'forever' ? '✓ Selecionado' : 'Selecionar'}
          </Button>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
        <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-wider">
          <Lock className="w-3.5 h-3.5 text-primary" /> Pagamento seguro
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-wider">
          <Infinity className="w-3.5 h-3.5 text-primary" /> Sem assinatura
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 text-primary" /> Acesso imediato
        </div>
      </div>

      {/* FAQ Link */}
      <button className="flex items-center gap-2 text-[11px] font-black text-white/60 hover:text-white transition-colors group">
        <HelpCircle className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" /> FAQ rápido
      </button>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-2 gap-4 w-full pt-6">
        <Button 
          onClick={onBack} 
          variant="outline" 
          className="h-14 rounded-2xl border-white/10 bg-white/5 font-black text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-3 group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Voltar etapa
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
