'use client';

import React from 'react';
import { Share2, Info, Type, ImageIcon, Upload, Check, ChevronLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface StepSharePreviewProps {
  metaTitle: string;
  onMetaTitleChange: (val: string) => void;
  metaPhoto: string;
  onMetaPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  pageTitle: string;
  onBack: () => void;
  onSave: () => void;
}

export function StepSharePreview({ 
  metaTitle, 
  onMetaTitleChange, 
  metaPhoto, 
  onMetaPhotoChange, 
  pageTitle,
  onBack,
  onSave 
}: StepSharePreviewProps) {
  return (
    <div className="space-y-8 md:space-y-10 flex flex-col items-center md:items-start w-full max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-3 text-center md:text-left w-full">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="bg-white/5 p-2 rounded-2xl border border-white/10">
            <Share2 className="w-5 h-5 md:w-6 md:h-6 text-white/80" />
          </div>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight uppercase italic">Prévia do WhatsApp</h2>
        </div>
        <p className="text-xs md:text-base text-white/40 font-medium">Configure como o link aparecerá quando você enviá-lo para alguém.</p>
      </div>

      <div className="w-full space-y-6">
        {/* Mockup do WhatsApp */}
        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Simulação de como vai ficar:</Label>
          <div className="bg-[#0b141a] rounded-2xl p-3 md:p-4 border border-white/5 shadow-2xl">
            <div className="bg-[#005c4b] text-[13px] text-white p-3 rounded-tr-none rounded-tl-xl rounded-bl-xl rounded-br-xl max-w-[90%] ml-auto relative">
               <div className="bg-[#025144] rounded-lg overflow-hidden mb-2 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 relative bg-[#121b22] shrink-0">
                      {metaPhoto ? (
                        <Image src={metaPhoto} fill className="object-cover" alt="Meta" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-20"><ImageIcon className="w-6 h-6" /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pr-3">
                       <p className="text-[#e9edef] font-bold text-[12px] truncate">{metaTitle || pageTitle || 'Eternize | Presente Especial'}</p>
                       <p className="text-[#8696a0] text-[11px] truncate">eternizee.shop</p>
                    </div>
                  </div>
               </div>
               <p className="text-[#e9edef] text-[13px]">Olha o que eu fiz pra você! ❤️</p>
               <span className="text-[9px] text-white/40 absolute bottom-1.5 right-2 italic">12:00 ✓✓</span>
            </div>
          </div>
        </div>

        <div className="bg-[#0c0c0c] border border-white/5 rounded-3xl p-6 space-y-6">
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1 flex items-center gap-2">
              <Type className="w-3 h-3 text-primary" /> Título do Link
            </Label>
            <Input 
              value={metaTitle}
              onChange={(e) => onMetaTitleChange(e.target.value)}
              placeholder="Ex: Um presente especial para você..."
              className="bg-white/5 border-white/10 h-14 rounded-xl font-bold"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1 flex items-center gap-2">
              <ImageIcon className="w-3 h-3 text-primary" /> Foto da Prévia
            </Label>
            <div className="flex items-center gap-5">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0 group">
                {metaPhoto ? (
                  <>
                    <Image src={metaPhoto} fill className="object-cover" alt="Meta" />
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                       <Upload className="w-5 h-5 text-white" />
                       <input type="file" className="hidden" accept="image/*" onChange={onMetaPhotoChange} />
                    </label>
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
                     <Upload className="w-5 h-5 text-white/20" />
                     <input type="file" className="hidden" accept="image/*" onChange={onMetaPhotoChange} />
                  </label>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-[11px] font-bold text-white/60 leading-tight">Dica: Use uma foto quadrada ou em paisagem para o WhatsApp exibir melhor.</p>
                <p className="text-[9px] text-white/20 uppercase tracking-widest">Limite de 1MB para esta foto.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-start gap-3">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-[11px] text-white/50 leading-relaxed font-medium">
            Lembre-se que o WhatsApp às vezes demora alguns minutos para atualizar a prévia após você salvar.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full pt-4">
        <Button onClick={onBack} variant="outline" className="h-14 rounded-2xl border-white/10 bg-white/5 font-black text-sm flex items-center justify-center gap-3 group">
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Voltar
        </Button>
        <Button onClick={onSave} className="h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-sm flex items-center justify-center gap-3 shadow-2xl active:scale-95">
          Salvar Prévia <Check className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
