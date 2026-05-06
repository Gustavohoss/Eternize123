
'use client';

import React from 'react';
import NextLink from 'next/link';
import { ListOrdered, CircleDollarSign, QrCode, Heart } from 'lucide-react';

const STEPS = [
  {
    id: 1,
    title: 'Personalize',
    description: 'Personalize sua página com fotos, mensagens, efeitos especiais e muito mais.',
    icon: ListOrdered,
    color: '#e11d48',
    glow: 'rgba(225, 29, 72, 0.4)'
  },
  {
    id: 2,
    title: 'Faça o pagamento',
    description: 'Escolha seu plano preferido e faça o pagamento de forma rápida e segura.',
    icon: CircleDollarSign,
    color: '#be123c',
    glow: 'rgba(190, 18, 60, 0.4)'
  },
  {
    id: 3,
    title: 'Receba seu acesso',
    description: 'Você receberá por email um QR code e link para acessar sua página.',
    icon: QrCode,
    color: '#9f1239',
    glow: 'rgba(159, 18, 57, 0.4)'
  },
  {
    id: 4,
    title: 'Compartilhe o amor',
    description: 'Compartilhe a página com a pessoa amada e surpreenda-a de forma especial.',
    icon: Heart,
    color: '#881337',
    glow: 'rgba(136, 19, 55, 0.4)'
  }
];

export function StepsSection() {
  return (
    <section className="py-24 md:py-32 flex flex-col items-center px-[5%] border-t border-white/5 bg-[#0a0a0a]">
      <div className="w-full max-w-[1100px] text-center">
        
        {/* Layout Mobile (Timeline Vertical) */}
        <div className="flex md:hidden flex-col items-start relative px-6 text-left gap-16">
          <div className="absolute left-[52px] top-10 bottom-10 w-px bg-white/10 z-0" />

          {STEPS.map((step) => (
            <div key={step.id} className="flex gap-8 relative z-10 w-full items-start">
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center font-black text-xl shrink-0 transition-transform active:scale-95"
                style={{ 
                  backgroundColor: step.color,
                  boxShadow: `0 0 30px ${step.glow}`
                }}
              >
                {step.id}
              </div>
              
              <div className="flex-1 pt-2">
                <div className="flex items-center gap-2.5 mb-2">
                  <step.icon className="w-4 h-4" style={{ color: step.color }} />
                  <h3 className="text-lg font-extrabold text-white tracking-tight">{step.title}</h3>
                </div>
                <p className="text-[13.5px] text-white/40 leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Layout (Grid + Dots Line) */}
        <div className="hidden md:block">
          <div className="flex justify-between items-center relative mb-12 px-[10%]">
            <div className="absolute top-1/2 left-[12%] right-[12%] h-0 border-t-2 border-dotted border-white/10 -z-0" />
            
            {STEPS.map((step) => (
              <div 
                key={step.id}
                className="w-[60px] h-[60px] rounded-full flex items-center justify-center font-black text-[22px] z-10"
                style={{ 
                  backgroundColor: step.color,
                  boxShadow: `0 0 30px ${step.glow}`
                }}
              >
                {step.id}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-5 mb-20">
            {STEPS.map((step) => (
              <div key={step.id} className="bg-[#0d0d0d] border border-white/5 rounded-[20px] p-10 flex flex-col items-center transition-all duration-300 hover:border-white/15 hover:-translate-y-1">
                <div className="w-[55px] h-[55px] bg-white/5 border border-white/5 rounded-[14px] flex items-center justify-center mb-6">
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-[18px] font-bold mb-4">{step.title}</h3>
                <p className="text-[13.5px] text-[#888] leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-8 mt-12 md:mt-20">
          <div className="w-[120px] h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_8px_#e11d48] opacity-80" />
          <h2 className="text-[32px] md:text-[42px] font-extrabold leading-tight text-white">
            Uma <span className="text-primary">declaração de amor</span> que<br className="hidden md:block" /> ficará para sempre.
          </h2>
          
          <NextLink href="/criador" className="bg-gradient-to-r from-primary to-red-800 text-white px-10 py-5 rounded-full text-[18px] font-bold inline-flex items-center gap-3 transition-all hover:scale-105 hover:shadow-[0_15px_35px_rgba(225,29,72,0.5)] shadow-[0_10px_25px_rgba(225,29,72,0.3)] group">
            Criar minha página agora →
          </NextLink>
        </div>
      </div>
    </section>
  );
}
