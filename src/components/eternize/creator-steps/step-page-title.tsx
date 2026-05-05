'use client';

import React from 'react';
import { Heart, Palette, Bold, Zap, Info } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ColorPicker } from '@/components/eternize/color-picker';
import { FONT_OPTIONS, ThemeId } from '@/app/criador/constants';
import { cn } from '@/lib/utils';

interface StepPageTitleProps {
  selectedTheme: ThemeId;
  pageTitle: string;
  onPageTitleChange: (title: string) => void;
  titleFont: string;
  onTitleFontChange: (font: string) => void;
  titleIsBold: boolean;
  onTitleIsBoldChange: (isBold: boolean) => void;
  titleHasNeon: boolean;
  onTitleHasNeonChange: (hasNeon: boolean) => void;
  titleNeonStrength: number;
  onTitleNeonStrengthChange: (strength: number) => void;
  titleColor: string;
  onTitleColorChange: (color: string) => void;
}

export function StepPageTitle({
  selectedTheme,
  pageTitle,
  onPageTitleChange,
  titleFont,
  onTitleFontChange,
  titleIsBold,
  onTitleIsBoldChange,
  titleHasNeon,
  onTitleHasNeonChange,
  titleNeonStrength,
  onTitleNeonStrengthChange,
  titleColor,
  onTitleColorChange,
}: StepPageTitleProps) {
  const isFixedTheme = selectedTheme === 'netflix' || selectedTheme === 'spotify' || selectedTheme === 'instagram';

  return (
    <div className="space-y-8 md:space-y-10 flex flex-col items-center md:items-start">
      <div className="space-y-3 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="bg-white/5 p-2 rounded-2xl border border-white/10">
            <Heart className="w-5 h-5 md:w-6 md:h-6 text-white/80" />
          </div>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight">Título da página</h2>
        </div>
        <p className="text-xs md:text-base text-white/40 font-medium max-w-md">
          Escreva o título dedicatório para a página. Ex: João & Maria ou Feliz Aniversário ou etc!
        </p>
      </div>

      <div className="space-y-8 w-full max-w-md">
        <div className="space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-wider text-white/60 text-center md:text-left block">
            Como vai se chamar a história de vocês?
          </Label>
          <Input 
            value={pageTitle} 
            onChange={(e) => onPageTitleChange(e.target.value)} 
            placeholder="NOSSA HISTÓRIA" 
            className="bg-[#1a1a1a] border-white/10 h-14 md:h-16 rounded-xl text-sm md:text-base font-medium focus:border-primary/50 transition-all shadow-inner" 
          />
          
          <div className="bg-[#1a0f02] border border-[#ff9b05]/30 p-4 rounded-xl flex items-start gap-3 mt-4">
            <Info className="w-4 h-4 text-[#ff9b05] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#ff9b05]/80 leading-tight font-medium">
              Evite usar acentos ou caracteres especiais. Use apenas letras, números e espaços.
            </p>
          </div>
        </div>

        {!isFixedTheme ? (
          <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 mb-2"><Palette className="w-4 h-4 text-primary" /><h3 className="text-[11px] font-black uppercase tracking-widest text-white/60">Personalizar Texto</h3></div>
            <div className="space-y-4"><Label className="text-[11px] font-bold text-white/50 uppercase">Fonte do Título</Label><div className="grid grid-cols-2 gap-2">{FONT_OPTIONS.map((f) => (<button key={f.id} onClick={() => onTitleFontChange(f.id)} className={cn("px-4 py-3 rounded-xl border text-xs transition-all", titleFont === f.id ? "border-primary bg-primary/10 text-primary font-bold" : "border-white/10 bg-black/20 text-white/40 hover:border-white/20", f.class)}>{f.name}</button>))}</div></div>
            <div className="flex items-center justify-between py-2 border-t border-white/5"><div className="flex items-center gap-2"><Bold className="w-4 h-4 text-white/40" /><Label className="text-[11px] font-bold text-white/50 uppercase cursor-pointer" htmlFor="bold-toggle">Negrito</Label></div><Switch id="bold-toggle" checked={titleIsBold} onCheckedChange={onTitleIsBoldChange} /></div>
            <div className="space-y-4 py-2 border-t border-white/5">
              <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><Zap className="w-4 h-4 text-white/40" /><Label className="text-[11px] font-bold text-white/50 uppercase cursor-pointer" htmlFor="neon-toggle">Efeito Neon</Label></div><Switch id="neon-toggle" checked={titleHasNeon} onCheckedChange={onTitleHasNeonChange} /></div>
              {titleHasNeon && (<div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-2"><div className="flex items-center justify-between"><Label className="text-[9px] font-black uppercase tracking-wider text-white/40">Força do Neon</Label><span className="text-[10px] font-black text-primary">{titleNeonStrength}</span></div><Slider value={[titleNeonStrength]} onValueChange={(val) => onTitleNeonStrengthChange(val[0])} min={2} max={30} step={1} /></div>)}
            </div>
            <div className="space-y-4 pt-4 border-t border-white/5"><Label className="text-[11px] font-bold text-white/50 uppercase">Cor do Texto</Label><div className="flex items-center gap-4">
                <Popover><PopoverTrigger asChild><button className="flex items-center gap-3 bg-white/5 border border-white/10 p-2 rounded-xl hover:bg-white/10 transition-all group"><div className="w-10 h-10 rounded-lg shadow-inner border border-white/10" style={{ backgroundColor: titleColor }} /><div className="text-left pr-4"><p className="text-[10px] font-black uppercase text-white/30 group-hover:text-primary transition-colors">Personalizar</p><p className="text-xs font-mono font-bold">{titleColor}</p></div></button></PopoverTrigger><PopoverContent className="w-auto p-0 border-none bg-transparent shadow-none" align="start"><ColorPicker selectedBgColor={titleColor} onChange={onTitleColorChange} /></PopoverContent></Popover>
                <div className="flex flex-wrap gap-1.5">{['#ffffff', '#e11d48', '#ff4da6', '#7c3aed', '#2563eb', '#111111'].map((color) => (
                    <button 
                      key={color} 
                      onClick={() => onTitleColorChange(color)} 
                      className={cn("w-6 h-6 rounded-full border transition-transform active:scale-90", titleColor === color ? "border-white scale-110" : "border-white/10")} 
                      style={{ backgroundColor: color }} 
                    />
                  ))}</div>
            </div></div>
          </div>
        ) : (
          <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10 w-full max-w-md">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                <Palette className="w-3 h-3" /> Estilo Visual Fixo
              </p>
              <p className="text-[10px] text-white/40 leading-relaxed font-medium">
                {selectedTheme === 'netflix' 
                  ? 'No tema Netflix, as cores e fontes são fixas para garantir a identidade cinematográfica original.' 
                  : selectedTheme === 'spotify'
                  ? 'No tema Spotify, o título utiliza a fonte oficial DM Sans para uma experiência autêntica.'
                  : 'No tema Instagram, a tipografia segue os padrões visuais oficiais da rede social.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
