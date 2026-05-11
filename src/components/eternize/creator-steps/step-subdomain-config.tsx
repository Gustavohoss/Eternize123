'use client';

import React, { useState, useEffect } from 'react';
import { Link2, ChevronLeft, Lock, Info, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface StepSubdomainConfigProps {
  onBack: () => void;
  onFinish: (subdomain: string, isTest?: boolean) => void;
  initialValue: string;
}

export function StepSubdomainConfig({ onBack, onFinish, initialValue }: StepSubdomainConfigProps) {
  const [subdomain, setSubdomain] = useState('');
  const [randomId] = useState(() => Math.random().toString(36).substring(2, 6));

  useEffect(() => {
    // Sugere um subdomínio baseado no título, mas limpo
    const suggested = initialValue
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
    setSubdomain(suggested || 'meu-presente');
  }, [initialValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
    setSubdomain(value);
  };

  const finalSlug = `${subdomain}-${randomId}`;
  const isFormValid = subdomain.length >= 2;

  return (
    <div className="space-y-8 md:space-y-10 flex flex-col items-center md:items-start w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-3 text-center md:text-left w-full">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="bg-white/5 p-2 rounded-2xl border border-white/10">
            <Link2 className="w-5 h-5 md:w-6 md:h-6 text-white/80" />
          </div>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight">Finalizar Link</h2>
        </div>
        <p className="text-xs md:text-base text-white/40 font-medium max-w-xl">
          Escolha o endereço exclusivo da sua página. O acesso será enviado para o e-mail que você usar no pagamento.
        </p>
      </div>

      <div className="w-full space-y-6">
        <div className="bg-[#0c0c0c] border border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">
              Nome do link desejado
            </label>
            <div className="relative group">
              <Input 
                value={subdomain}
                onChange={handleInputChange}
                placeholder="ex: amamos-para-sempre"
                className="bg-white/5 border-white/10 h-16 md:h-20 pl-6 pr-20 rounded-2xl text-lg md:text-xl font-black focus:border-primary/50 transition-all shadow-inner"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                <span className="text-[10px] font-mono font-bold text-white/30">-{randomId}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
             <p className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">
              Prévia do seu link exclusivo:
            </p>
            <div className="bg-black rounded-2xl p-5 border border-white/5 flex items-center gap-3">
              <Lock className="w-4 h-4 text-primary" />
              <p className="text-xs md:text-sm font-mono font-bold text-white/60 truncate">
                eternizee.shop/site/<span className="text-white">{subdomain}</span><span className="text-white/30">-{randomId}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-start gap-4">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-[11px] font-black uppercase text-primary tracking-widest">Acesso Imediato</p>
            <p className="text-[11px] font-medium text-white/50 leading-relaxed">
              Após a confirmação do pagamento, sua página será liberada e sua conta será criada automaticamente com o e-mail do checkout.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full pt-6">
        <Button 
          onClick={onBack} 
          variant="outline" 
          className="h-14 rounded-2xl border-white/10 bg-white/5 font-black text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-3 group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Voltar
        </Button>
        <Button 
          onClick={() => onFinish(finalSlug)}
          disabled={!isFormValid}
          className="h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-sm transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 group disabled:opacity-50 disabled:grayscale"
        >
          Ir para Pagamento <CheckCircle2 className="w-4 h-4 transition-transform group-hover:scale-110" />
        </Button>
      </div>
    </div>
  );
}