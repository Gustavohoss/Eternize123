
'use client';

import React from 'react';
import NextLink from 'next/link';
import { Crown, Infinity, Check, ChevronRight, ShieldCheck, CreditCard, Users, Headphones, Lock, Zap, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PricingSection() {
  return (
    <section className="py-24 md:py-32 bg-[#0a0a0a] border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full mb-6">
            <Crown className="w-3 h-3 text-primary" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60">Escolha seu plano</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase mb-6">Uma memória que dura para sempre</h2>
          <p className="text-white/40 text-sm md:text-base max-w-xl mx-auto font-medium leading-relaxed">
            Pague uma vez e guarde essa história para sempre. Sem mensalidades, sem surpresas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* 1 Semana */}
          <div className="bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] p-8 flex flex-col transition-all duration-500 hover:border-white/10 group">
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black italic uppercase tracking-tight">1 semana</h3>
                <p className="text-white/30 text-[11px] font-medium max-w-[200px]">Acesso por 1 semana. Todas as funcionalidades incluídas.</p>
              </div>
              <div className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-[10px] font-black text-white/40 uppercase">1s</div>
            </div>

            <div className="mb-8 pt-2 border-t border-white/5">
              <div className="flex items-baseline gap-1.5 pt-6">
                <span className="text-4xl font-black">R$ 21,00</span>
                <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">/por 1 semana</span>
              </div>
            </div>

            <div className="space-y-3.5 mb-10 flex-1">
              {[
                "Contador em tempo real",
                "Texto dedicado",
                "URL personalizada",
                "QR Code exclusivo",
                "Até 4 fotos",
                "Suporte 24 horas",
                "Música dedicada",
                "Módulos extras"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-white/40" strokeWidth={3} />
                  </div>
                  <span className="text-[13px] font-bold text-white/40">{item}</span>
                </div>
              ))}
            </div>

            <NextLink href="/criador" className="w-full h-14 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all active:scale-95 gap-2">
              Criar minha página <ChevronRight className="w-4 h-4" />
            </NextLink>
          </div>

          {/* Vitalício */}
          <div className="relative bg-[#0c0c0c] border-2 border-primary/30 rounded-[2.5rem] p-8 flex flex-col transition-all duration-500 shadow-[0_0_80px_rgba(225,29,72,0.15)] group scale-[1.02] z-10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-red-800 text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-2xl shadow-primary/40 animate-pulse">
              <Star className="w-3 h-3 fill-current" /> MAIS POPULAR
            </div>

            <div className="flex justify-between items-start mb-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black italic uppercase tracking-tight">Para sempre</h3>
                <p className="text-white/40 text-[11px] font-medium max-w-[200px]">Sem prazo. Sua história fica guardada para sempre.</p>
              </div>
              <div className="bg-primary/20 border border-primary/30 px-3 py-1 rounded-lg text-[10px] font-black text-primary uppercase flex items-center gap-1">
                <Infinity className="w-3 h-3" /> Vitalício
              </div>
            </div>

            <div className="mb-8 pt-2 border-t border-white/5">
              <div className="flex items-baseline gap-1.5 pt-6">
                <span className="text-4xl font-black text-white">R$ 29,77</span>
                <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest">/uma vez</span>
              </div>
            </div>

            <div className="space-y-3.5 mb-10 flex-1">
              {[
                "Contador em tempo real",
                "Texto dedicado",
                "URL personalizada",
                "QR Code exclusivo",
                "Até 8 fotos",
                "Suporte 24 horas",
                "Música dedicada",
                "Módulos extras",
                "Acesso Ilimitado"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(225,29,72,0.2)]">
                    <Check className="w-3 h-3 text-primary" strokeWidth={4} />
                  </div>
                  <span className="text-[13px] font-bold text-white/80">{item}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <NextLink href="/criador" className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-red-900 flex items-center justify-center font-black uppercase tracking-widest text-xs shadow-[0_15px_30px_rgba(225,29,72,0.4)] hover:brightness-110 transition-all active:scale-95 gap-2 text-white">
                Criar minha página <ChevronRight className="w-4 h-4" />
              </NextLink>
              <p className="text-[9px] text-center text-white/20 font-bold uppercase tracking-[0.2em]">Sem mensalidades. Pague uma vez, guarde para sempre.</p>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex flex-col items-center gap-4 group">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/5 transition-all">
              <ShieldCheck className="w-6 h-6 text-white/40 group-hover:text-primary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white/60">Pagamento seguro</span>
          </div>
          <div className="flex flex-col items-center gap-4 group">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/5 transition-all">
              <CreditCard className="w-6 h-6 text-white/40 group-hover:text-primary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white/60">Cartão ou Pix</span>
          </div>
          <div className="flex flex-col items-center gap-4 group">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/5 transition-all">
              <Users className="w-6 h-6 text-white/40 group-hover:text-primary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white/60">+75.000 casais</span>
          </div>
          <div className="flex flex-col items-center gap-4 group">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/5 transition-all">
              <Headphones className="w-6 h-6 text-white/40 group-hover:text-primary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white/60">Suporte 24 horas</span>
          </div>
        </div>
      </div>
    </section>
  );
}
