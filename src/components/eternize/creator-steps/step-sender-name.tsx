'use client';

import React from 'react';
import { User, Info } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface StepSenderNameProps {
  senderName: string;
  onSenderNameChange: (name: string) => void;
  onNext: () => void;
}

export function StepSenderName({ senderName, onSenderNameChange, onNext }: StepSenderNameProps) {
  const isFormValid = senderName.trim().length >= 2;

  return (
    <div className="relative z-10 container mx-auto px-4 pt-16 md:pt-20 pb-16 max-w-4xl min-h-[calc(100vh-80px)] flex flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-3 text-center">
          <div className="bg-primary/10 p-3 rounded-2xl border border-primary/20 w-fit mx-auto mb-4">
            <User className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight uppercase italic italic-shadow text-white">Como você se chama?</h2>
          <p className="text-xs md:text-base text-white/40 font-medium">
            Usaremos seu nome para personalizar a tela de entrada do presente.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">
              Seu Nome ou Apelido
            </Label>
            <Input 
              value={senderName} 
              onChange={(e) => onSenderNameChange(e.target.value)} 
              placeholder="Ex: Edu, Maria, Seu Mozão..." 
              className="bg-[#1a1a1a] border-white/10 h-16 rounded-2xl text-lg font-black focus:border-primary/50 transition-all shadow-inner text-white text-center" 
              autoFocus
            />
          </div>

          <div className="bg-primary/5 border border-primary/20 p-5 rounded-2xl flex items-start gap-4">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-[11px] text-white/50 leading-relaxed font-medium">
              Este nome aparecerá para a pessoa assim que ela abrir o link: <br/>
              <span className="text-white font-bold italic">"{senderName || 'Nome'} separou um presente especial!"</span>
            </p>
          </div>

          <Button 
            onClick={onNext} 
            disabled={!isFormValid}
            className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
          >
            Começar Criação
          </Button>
        </div>
      </div>
    </div>
  );
}
