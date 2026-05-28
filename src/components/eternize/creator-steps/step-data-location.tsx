
'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Globe, 
  Search, 
  Layout, 
  Hash, 
  Palette, 
  Bold, 
  Zap,
  Box,
  ImageIcon,
  Upload
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { ColorPicker } from '@/components/eternize/color-picker';
import { FONT_OPTIONS, ThemeId } from '@/app/criador/constants';
import { cn } from '@/lib/utils';

interface StepDataLocationProps {
  selectedTheme: ThemeId;
  date?: Date;
  onDateSelect: (date: Date | undefined) => void;
  locationQuery: string;
  onLocationQueryChange: (q: string) => void;
  showSuggestions: boolean;
  onShowSuggestionsChange: (show: boolean) => void;
  filteredCities: string[];
  selectedCountStyle: string;
  onCountStyleChange: (style: string) => void;
  dateFont: string;
  onDateFontChange: (font: string) => void;
  dateIsBold: boolean;
  onDateIsBoldChange: (isBold: boolean) => void;
  dateHasNeon: boolean;
  onDateHasNeonChange: (hasNeon: boolean) => void;
  dateNeonStrength: number;
  onDateNeonStrengthChange: (strength: number) => void;
  dateColor: string;
  onDateColorChange: (color: string) => void;
  dateBoxBgColor: string;
  onDateBoxBgColorChange: (color: string) => void;
  dateBoxBorderColor: string;
  onDateBoxBorderColorChange: (color: string) => void;
  spotifyCardPhoto?: string;
  onSpotifyCardPhotoChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function StepDataLocation({
  selectedTheme,
  date,
  onDateSelect,
  locationQuery,
  onLocationQueryChange,
  showSuggestions,
  onShowSuggestionsChange,
  filteredCities,
  selectedCountStyle,
  onCountStyleChange,
  dateFont,
  onDateFontChange,
  dateIsBold,
  onDateIsBoldChange,
  dateHasNeon,
  onDateHasNeonChange,
  dateNeonStrength,
  onDateNeonStrengthChange,
  dateColor,
  onDateColorChange,
  dateBoxBgColor,
  onDateBoxBgColorChange,
  dateBoxBorderColor,
  onDateBoxBorderColorChange,
  spotifyCardPhoto,
  onSpotifyCardPhotoChange,
}: StepDataLocationProps) {
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) onShowSuggestionsChange(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onShowSuggestionsChange]);

  const isFixedTheme = selectedTheme === 'netflix' || selectedTheme === 'spotify' || selectedTheme === 'instagram';

  return (
    <div className="space-y-8 md:space-y-10 flex flex-col items-center md:items-start">
      <div className="space-y-3 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="bg-white/5 p-2 rounded-2xl border border-white/10">
            <CalendarIcon className="w-5 h-5 md:w-6 md:h-6 text-white/80" />
          </div>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight">Data e localização</h2>
        </div>
        <p className="text-xs md:text-base text-white/40 font-medium max-w-md">Informe quando e onde esse momento especial aconteceu.</p>
      </div>
      
      <div className="space-y-6 md:space-y-8 w-full max-w-md">
        {selectedTheme === 'spotify' && (
          <div className="space-y-4 w-full bg-white/5 p-6 rounded-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Label className="text-[11px] font-black uppercase tracking-wider text-white/60 flex items-center justify-center md:justify-start gap-2">
              <ImageIcon className="w-4 h-4" /> Foto do Card "Sobre o Casal"
            </Label>
            <div className="flex items-center gap-5">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-black border border-white/10 shrink-0 group">
                {spotifyCardPhoto ? (
                  <>
                    <Image src={spotifyCardPhoto} fill className="object-cover" alt="Card" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <label className="cursor-pointer bg-white text-black p-1.5 rounded-full scale-90">
                          <Upload className="w-3 h-3" />
                          <input type="file" className="hidden" accept="image/*" onChange={onSpotifyCardPhotoChange} />
                       </label>
                    </div>
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-white/5 transition-all">
                     <Upload className="w-4 h-4 text-white/20" />
                     <span className="text-[7px] font-black uppercase text-white/20">Subir foto</span>
                     <input type="file" className="hidden" accept="image/*" onChange={onSpotifyCardPhotoChange} />
                  </label>
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <p className="text-[11px] font-bold text-white/80">Esta foto aparecerá no card de estatísticas do Spotify.</p>
                <p className="text-[10px] text-white/30 leading-relaxed">Se não enviar nenhuma, usaremos a primeira foto do seu álbum.</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Label className="text-[11px] font-black uppercase tracking-wider text-white/60 flex items-center justify-center md:justify-start gap-2">
            <Clock className="w-4 h-4" /> Quando essa história de amor começou? <span className="text-primary">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <button className="relative w-full text-left group">
                <CalendarIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-hover:text-primary transition-colors z-10 pointer-events-none" />
                <div className="bg-white/5 border border-white/10 h-14 md:h-16 pl-14 pr-5 rounded-xl text-sm md:text-base font-medium flex items-center group-hover:border-primary/50 transition-all shadow-inner">
                  {date ? date.toLocaleDateString('pt-BR') : <span className="text-white/20">Selecione uma data</span>}
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-none bg-transparent shadow-none" align="start">
              <Calendar selected={date} onSelect={onDateSelect} />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-4">
          <Label className="text-[11px] font-black uppercase tracking-wider text-white/60 flex items-center justify-center md:justify-start gap-2">
            <MapPin className="w-4 h-4" /> Onde foi? <span className="text-white/30 font-medium">(opcional)</span>
          </Label>
          <div className="relative group" ref={suggestionsRef}>
            <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-primary transition-colors" />
            <Input 
              value={locationQuery} 
              onChange={(e) => { onLocationQueryChange(e.target.value); onShowSuggestionsChange(true); }} 
              onFocus={() => onShowSuggestionsChange(true)} 
              placeholder="Pesquisar cidade ou lugar..." 
              className="bg-white/5 border border-white/10 h-14 md:h-16 pl-14 rounded-xl text-sm md:text-base font-medium focus:border-primary/50 transition-all shadow-inner" 
            />
            {showSuggestions && filteredCities.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden z-[100] shadow-[0_30px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
                {filteredCities.map((city) => (
                  <button 
                    key={city} 
                    onClick={() => { onLocationQueryChange(city); onShowSuggestionsChange(false); }} 
                    className="w-full text-left px-5 py-4 text-xs md:text-sm font-bold hover:bg-primary/10 hover:text-primary transition-all border-b border-white/5 last:border-0 flex items-center gap-4 group/item"
                  >
                    <Search className="w-4 h-4 text-white/20 group-hover/item:text-primary transition-colors" />
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {!isFixedTheme && (
        <>
          <div className="space-y-5 w-full max-w-md">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-sm md:text-base font-black tracking-tight">Como mostrar a contagem</h3>
              <p className="text-[11px] text-white/40 font-medium">Escolha como a data será exibida na página.</p>
            </div>
            <RadioGroup 
              defaultValue="padrao" 
              value={selectedCountStyle} 
              onValueChange={onCountStyleChange} 
              className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4"
            >
              {[
                { id: 'padrao', label: 'Padrão', icon: Clock }, 
                { id: 'classico', label: 'Clássico', icon: Layout }, 
                { id: 'simples', label: 'Simples', icon: Hash }, 
                { id: 'data-grande', label: 'Data Grande', icon: CalendarIcon }, 
                { id: 'dias-grandes', label: 'Dias Grandes', icon: Hash },
              ].map((style) => (
                <Label 
                  key={style.id} 
                  className={cn(
                    "relative flex items-center gap-4 p-4 md:p-5 rounded-2xl border cursor-pointer transition-all duration-300", 
                    selectedCountStyle === style.id ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-white/5 bg-white/5 hover:border-white/10"
                  )}
                >
                  <RadioGroupItem value={style.id} className="sr-only" />
                  <div className={cn(
                    "w-4 h-4 md:w-5 md:h-5 rounded-full border flex items-center justify-center transition-colors", 
                    selectedCountStyle === style.id ? "border-primary bg-primary" : "border-white/20 bg-transparent"
                  )}>
                    {selectedCountStyle === style.id && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <style.icon className={cn("w-4 h-4 md:w-5 md:h-5", selectedCountStyle === style.id ? "text-primary" : "text-white/40")} />
                  <span className="text-[11px] md:text-xs font-black">{style.label}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10 w-full max-w-md">
            <div className="flex items-center gap-2 mb-2">
              <Palette className="w-4 h-4 text-primary" />
              <h3 className="text-[11px] font-black uppercase tracking-widest text-white/60">Personalizar Texto do Contador</h3>
            </div>
            
            <div className="space-y-4">
              <Label className="text-[11px] font-bold text-white/50 uppercase">Fonte do Contador</Label>
              <div className="grid grid-cols-2 gap-2">
                {FONT_OPTIONS.map((f) => (
                  <button 
                    key={f.id} 
                    onClick={() => onDateFontChange(f.id)} 
                    className={cn(
                      "px-4 py-3 rounded-xl border text-xs transition-all", 
                      dateFont === f.id ? "border-primary bg-primary/10 text-primary font-bold" : "border-white/10 bg-black/20 text-white/40 hover:border-white/20", 
                      f.class
                    )}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between py-2 border-t border-white/5">
              <div className="flex items-center gap-2">
                <Bold className="w-4 h-4 text-white/40" />
                <Label className="text-[11px] font-bold text-white/50 uppercase cursor-pointer" htmlFor="date-bold-toggle">Negrito</Label>
              </div>
              <Switch id="date-bold-toggle" checked={dateIsBold} onCheckedChange={onDateIsBoldChange} />
            </div>

            <div className="space-y-4 py-2 border-t border-white/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-white/40" />
                  <Label className="text-[11px] font-bold text-white/50 uppercase cursor-pointer" htmlFor="date-neon-toggle">Efeito Neon</Label>
                </div>
                <Switch id="date-neon-toggle" checked={dateHasNeon} onCheckedChange={onDateHasNeonChange} />
              </div>
              {dateHasNeon && (
                <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-[9px] font-black uppercase tracking-wider text-white/40">Força do Neon</Label>
                    <span className="text-[10px] font-black text-primary">{dateNeonStrength}</span>
                  </div>
                  <Slider value={[dateNeonStrength]} onValueChange={(val) => onDateNeonStrengthChange(val[0])} min={2} max={30} step={1} />
                </div>
              )}
            </div>
            
            <div className="space-y-4 pt-4 border-t border-white/5">
              <Label className="text-[11px] font-bold text-white/50 uppercase">Cor da Data (Números)</Label>
              <div className="flex items-center gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-3 bg-white/5 border border-white/10 p-2 rounded-xl hover:bg-white/10 transition-all group">
                      <div className="w-10 h-10 rounded-lg shadow-inner border border-white/10" style={{ backgroundColor: dateColor }} />
                      <div className="text-left pr-4">
                        <p className="text-[10px] font-black uppercase text-white/30 group-hover:text-primary transition-colors">Personalizar</p>
                        <p className="text-xs font-mono font-bold">{dateColor}</p>
                      </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-none bg-transparent shadow-none" align="start">
                    <ColorPicker selectedBgColor={dateColor} onChange={onDateColorChange} />
                  </PopoverContent>
                </Popover>
                <div className="flex flex-wrap gap-1.5">
                  {['#ffffff', '#e11d48', '#ff4da6', '#7c3aed', '#2563eb', '#111111'].map((color) => (
                    <button 
                      key={color} 
                      onClick={() => onDateColorChange(color)} 
                      className={cn("w-6 h-6 rounded-full border transition-transform active:scale-90", dateColor === color ? "border-white scale-110" : "border-white/10")} 
                      style={{ backgroundColor: color }} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10 w-full max-w-md">
            <div className="flex items-center gap-2 mb-2">
              <Box className="w-4 h-4 text-primary" />
              <h3 className="text-[11px] font-black uppercase tracking-widest text-white/60">Personalizar Caixa do Contador</h3>
            </div>

            <div className="space-y-4">
              <Label className="text-[11px] font-bold text-white/50 uppercase">Cor de Fundo da Caixa</Label>
              <div className="flex items-center gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-3 bg-white/5 border border-white/10 p-2 rounded-xl hover:bg-white/10 transition-all group">
                      <div className="w-10 h-10 rounded-lg shadow-inner border border-white/10" style={{ backgroundColor: dateBoxBgColor }} />
                      <div className="text-left pr-4">
                        <p className="text-[10px] font-black uppercase text-white/30 group-hover:text-primary transition-colors">Personalizar</p>
                        <p className="text-xs font-mono font-bold">{dateBoxBgColor}</p>
                      </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-none bg-transparent shadow-none" align="start">
                    <ColorPicker selectedBgColor={dateBoxBgColor} onChange={onDateBoxBgColorChange} />
                  </PopoverContent>
                </Popover>
                <div className="flex flex-wrap gap-1.5">
                  {['#1a1a1a', '#0d0d0d', '#222222', '#333333', '#ffffff', 'transparent'].map((color) => (
                    <button 
                      key={color} 
                      onClick={() => onDateBoxBgColorChange(color)} 
                      className={cn("w-6 h-6 rounded-full border transition-transform active:scale-90", dateBoxBgColor === color ? "border-primary scale-110" : "border-white/10")} 
                      style={color === 'transparent' ? { background: 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%), linear-gradient(45deg, #ccc 25%, white 25%, white 75%, #ccc 75%)', backgroundSize: '10px 10px', backgroundPosition: '0 0, 5px 5px' } : { backgroundColor: color }} 
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <Label className="text-[11px] font-bold text-white/50 uppercase">Cor da Borda da Caixa</Label>
              <div className="flex items-center gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-3 bg-white/5 border border-white/10 p-2 rounded-xl hover:bg-white/10 transition-all group">
                      <div className="w-10 h-10 rounded-lg shadow-inner border border-white/10" style={{ backgroundColor: dateBoxBorderColor }} />
                      <div className="text-left pr-4">
                        <p className="text-[10px] font-black uppercase text-white/30 group-hover:text-primary transition-colors">Personalizar</p>
                        <p className="text-xs font-mono font-bold">{dateBoxBorderColor}</p>
                      </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-none bg-transparent shadow-none" align="start">
                    <ColorPicker selectedBgColor={dateBoxBorderColor} onChange={onDateBoxBorderColorChange} />
                  </PopoverContent>
                </Popover>
                <div className="flex flex-wrap gap-1.5">
                  {['#2a2a2a', '#1a1a1a', '#444444', '#e11d48', '#ffffff', 'transparent'].map((color) => (
                    <button 
                      key={color} 
                      onClick={() => onDateBoxBorderColorChange(color)} 
                      className={cn("w-6 h-6 rounded-full border transition-transform active:scale-90", dateBoxBorderColor === color ? "border-primary scale-110" : "border-white/10")} 
                      style={color === 'transparent' ? { background: 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%), linear-gradient(45deg, #ccc 25%, white 25%, white 75%, #ccc 75%)', backgroundSize: '10px 10px', backgroundPosition: '0 0, 5px 5px' } : { backgroundColor: color }} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {isFixedTheme && (
        <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10 w-full max-w-md">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-1 flex items-center gap-2">
              <Palette className="w-3 h-3" /> Estilo Visual Fixo
            </p>
            <p className="text-[10px] text-white/40 leading-relaxed font-medium">
              {selectedTheme === 'netflix' 
                ? 'No tema Netflix, as cores e fontes são fixas para garantir a identidade cinematográfica original.' 
                : selectedTheme === 'spotify'
                ? 'No tema Spotify, os contadores seguem o design oficial do aplicativo para uma experiência autêntica.'
                : 'No tema Instagram, a visualização segue os padrões visuais oficiais da rede social.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
