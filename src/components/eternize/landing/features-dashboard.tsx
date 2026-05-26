
'use client';

import React, { useState, useEffect } from 'react';
import NextImage from 'next/image';
import { 
  Zap, 
  Star, 
  Music, 
  Clock, 
  Layout, 
  Heart, 
  QrCode, 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  X
} from 'lucide-react';
import { THEME_OPTIONS } from '@/app/criador/constants';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';

export function FeaturesDashboard() {
  const [dashboardTheme, setDashboardTheme] = useState('classic');
  const [previewThemeIndex, setPreviewThemeIndex] = useState(0);
  const [counter, setCounter] = useState({ years: '00', months: '00', days: '00', hours: '00' });
  const [waveformBars, setWaveformBars] = useState<{ height: string; duration: string }[]>([]);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
    
    const updateCounter = () => {
      const start = new Date('2022-02-14T00:00:00');
      const now = new Date();
      const diff = now.getTime() - start.getTime();
      
      const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
      const years = Math.floor(totalDays / 365);
      const months = Math.floor((totalDays % 365) / 30);
      const days = totalDays % 30;
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

      setCounter({
        years: String(years).padStart(2, '0'),
        months: String(months).padStart(2, '0'),
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0')
      });
    };

    updateCounter();
    const interval = setInterval(updateCounter, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setWaveformBars(
      Array.from({ length: 28 }).map(() => ({
        height: `${Math.random() * 80 + 20}%`,
        duration: `${0.8 + Math.random() * 0.8}s`,
      }))
    );
  }, []);

  return (
    <section className="py-24 bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-[900px] mx-auto px-6 flex flex-col gap-4">
        
        <div className="text-center mb-16 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-2">
             <Zap className="w-3 h-3 text-primary fill-primary" />
             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Recursos Poderosos</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            Tudo que sua página precisa
          </h2>
          <p className="text-white/40 text-sm md:text-lg max-xl font-medium leading-relaxed">
            Contador ao vivo, música, temas exclusivos e muito mais — para fazer<br className="hidden md:block" /> alguém chorar de emoção.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Temas */}
          <div className="bg-[#1a1a1a] rounded-[14px] p-6 border border-[#2a2a2a]">
            <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.15em] uppercase text-[#888] mb-2.5">
              <Star className="w-3.5 h-3.5 text-primary" /> TEMAS
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Temas Exclusivos</h3>
            <p className="text-[12px] text-[#666] mb-4">4 estilos únicos para contar a história de vocês do jeito certo</p>
            
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'classic', label: 'Default', color: '#e11d48', icon: '❤️' },
                { id: 'netflix', label: 'Netflix', color: '#e50914', icon: '▶' },
                { id: 'spotify', label: 'Spotify', color: '#1db954', icon: '♫' },
                { id: 'instagram', label: 'Insta', color: '#fd1d1d', icon: '✦', isGradient: true }
              ].map((t) => (
                <div 
                  key={t.id}
                  onClick={() => setDashboardTheme(t.id)}
                  className={cn(
                    "bg-[#111] rounded-xl p-3 cursor-pointer border transition-all duration-200 hover:-translate-y-0.5",
                    dashboardTheme === t.id ? "border-primary" : "border-[#222] hover:border-[#444]"
                  )}
                >
                  <div 
                    className="w-6 h-6 rounded-full mb-2.5" 
                    style={{ 
                      background: t.isGradient ? 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)' : t.color,
                      boxShadow: !t.isGradient ? `0 0 10px ${t.color}66` : 'none'
                    }}
                  />
                  <div className="flex flex-col gap-0.5 mb-2 opacity-30">
                    <div className="h-[3px] bg-white/40 rounded-full w-full" />
                    <div className="h-[3px] bg-white/40 rounded-full w-[60%]" />
                    <div className="h-[3px] bg-white/40 rounded-full w-[80%]" />
                  </div>
                  <div className="text-[9px] font-bold truncate flex items-center gap-1" style={{ color: dashboardTheme === t.id ? '#fff' : '#666' }}>
                    <span style={{ color: t.color }}>{t.icon}</span> {t.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Música */}
          <div className="bg-[#1a1a1a] rounded-[14px] p-6 border border-[#2a2a2a]">
            <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.15em] uppercase text-[#888] mb-2.5">
              <Music className="w-3.5 h-3.5 text-[#1db954]" /> MÚSICA
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Música dedicada</h3>
            <p className="text-[12px] text-[#666] mb-4">A trilha sonora de vocês, sempre tocando em loop</p>
            
            <div className="bg-[#111] rounded-xl p-4 border border-[#222]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1db954] to-[#0f9040] flex items-center justify-center shrink-0">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold truncate">Sua música especial</div>
                  <div className="text-[11px] text-[#666]">Artista favorito</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#1db954] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <Play className="w-3.5 h-3.5 text-black fill-black ml-0.5" />
                </div>
              </div>
              
              <div className="mb-3">
                <div className="h-1 bg-[#2a2a2a] rounded-full overflow-hidden mb-1.5 relative">
                  <div className="h-full bg-[#1db954] rounded-full w-[38%] animate-progress-live" />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-[#555] tabular-nums">
                  <span>1:24</span><span>3:52</span>
                </div>
              </div>

              <div className="flex items-end justify-center gap-0.5 h-7">
                {waveformBars.map((bar, i) => (
                  <div 
                    key={i} 
                    className="w-[3px] bg-[#1db954] rounded-full animate-wave-bar opacity-70"
                    style={{ 
                      height: bar.height,
                      animationDelay: `${i * 0.06}s`,
                      animationDuration: bar.duration
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Contador */}
          <div className="bg-[#1a1a1a] rounded-[14px] p-5 border border-[#2a2a2a]">
            <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.15em] uppercase text-[#888] mb-2.5">
              <Clock className="w-3.5 h-3.5 text-[#888]" /> CONTADOR
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Contador de tempo</h3>
            
            <div className="flex items-center justify-between bg-[#111] rounded-lg p-2.5 mb-3">
              <div className="flex items-center gap-2 text-xs font-bold">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse-heart" />
                Ana & João
              </div>
              <div className="text-[10px] font-bold text-[#555]">14 fev 2022</div>
            </div>

            <div className="grid grid-cols-4 gap-1.5 mb-3">
              {[
                { val: counter.years, label: 'Anos' },
                { val: counter.months, label: 'Meses' },
                { val: counter.days, label: 'Dias' },
                { val: counter.hours, label: 'Hours' }
              ].map((item, i) => (
                <div key={i} className="bg-[#111] rounded-lg py-2.5 px-1 text-center border border-[#222]">
                  <div className="text-[20px] font-bold text-white leading-none mb-1 tabular-nums">{item.val}</div>
                  <div className="text-[8px] text-[#555] uppercase font-black tracking-wider">{item.label}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-[#555]">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-blink-dot" />
              atualizado em tempo real
            </div>
          </div>

          {/* Módulos */}
          <div className="bg-[#1a1a1a] rounded-[14px] p-5 border border-[#2a2a2a]">
            <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.15em] uppercase text-[#888] mb-2.5">
              <Layout className="w-3.5 h-3.5 text-[#888]" /> MÓDULOS EXTRAS
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Módulos Interativos</h3>
            
            <div className="bg-[#111] rounded-xl p-3.5 border border-white/5 mb-3 hover:border-primary/20 transition-colors group">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4 text-primary fill-primary" />
                </div>
                <div className="text-[13px] font-bold">Memórias</div>
              </div>
              <p className="text-[11px] text-[#555] leading-relaxed">Adicione fotos e momentos especiais do casal em uma galeria interativa.</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" style={{ width: '18px', borderRadius: '4px' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[#333]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#333]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#333]" />
              </div>
              <div className="flex gap-1.5">
                <button className="w-7 h-7 rounded-md border border-[#2a2a2a] bg-[#111] flex items-center justify-center text-[#888] hover:border-primary hover:text-primary transition-all"><ChevronLeft className="w-4 h-4" /></button>
                <button className="w-7 h-7 rounded-md border border-[#2a2a2a] bg-[#111] flex items-center justify-center text-[#888] hover:border-primary hover:text-primary transition-all"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-[#1a1a1a] rounded-[14px] p-5 border border-[#2a2a2a]">
            <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.15em] uppercase text-[#888] mb-2.5">
              <QrCode className="w-3.5 h-3.5 text-[#888]" /> QR CODE
            </div>
            <h3 className="text-xl font-bold text-white mb-1">QR Code exclusivo</h3>
            
            <div className="flex gap-3 mb-3">
              <div className="bg-[#111] rounded-xl p-2 border border-[#222] shrink-0">
                <svg width="60" height="60" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
                  <rect width="70" height="70" fill="#111"/>
                  <rect x="5" y="5" width="20" height="20" rx="2" fill="#e11d48"/>
                  <rect x="8" y="8" width="14" height="14" rx="1" fill="#111"/>
                  <rect x="10" y="10" width="10" height="10" rx="1" fill="#e11d48"/>
                  <rect x="45" y="5" width="20" height="20" rx="2" fill="#e11d48"/>
                  <rect x="48" y="8" width="14" height="14" rx="1" fill="#111"/>
                  <rect x="50" y="10" width="10" height="10" rx="1" fill="#e11d48"/>
                  <rect x="5" y="45" width="20" height="20" rx="2" fill="#e11d48"/>
                  <rect x="8" y="48" width="14" height="14" rx="1" fill="#111"/>
                  <rect x="10" y="50" width="10" height="10" rx="1" fill="#e11d48"/>
                  <text x="35" y="40" textAnchor="middle" fontSize="14" fill="#e11d48">♥</text>
                </svg>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[11px] text-[#888] leading-tight mb-2">Escaneie o QR Code para acessar sua página diretamente do celular.</p>
                <div className="flex items-center gap-1.5 text-[10px] font-black text-[#1db954] bg-[#1db95411] px-2.5 py-1 rounded-full w-fit">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1db954]" /> EXCLUSIVO
                </div>
              </div>
            </div>

            <div className="bg-[#111] rounded-xl p-3 border border-[#222]">
              <div className="text-[9px] font-black text-[#555] uppercase tracking-wider mb-0.5">Link da página</div>
              <div className="text-[13px] font-bold text-primary truncate">eternizee.shop/seu-amor</div>
            </div>
          </div>
        </div>

        {/* Feature Theme Focus */}
        <div className="mt-4 bg-gradient-to-br from-[#1a0008] to-[#0d0005] rounded-[14px] p-8 border border-[#2a0010] relative overflow-hidden group">
          <div className="absolute top-[-50%] left-[-20%] w-[60%] h-[150%] bg-[radial-gradient(ellipse,_rgba(225,29,72,0.05)_0%,_transparent_70%)] pointer-events-none" />
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-1.5 bg-[#2a0010] border border-[#4a0020] rounded-full px-3 py-1.5 text-[11px] font-bold text-primary">
              <Star className="w-3 h-3 fill-current" /> Tema {THEME_OPTIONS[previewThemeIndex].name}
            </div>
            <div className="text-[12px] font-bold text-[#555] tabular-nums">0{previewThemeIndex + 1} / 04</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start relative z-10">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#888] mb-3">
                <Heart className="w-3 h-3 text-primary fill-primary" /> Tema
              </div>
              <h2 className="text-5xl font-black text-primary mb-4 tracking-tighter transition-all duration-500" style={{ textShadow: '0 0 40px rgba(225,29,72,0.3)', color: THEME_OPTIONS[previewThemeIndex].color }}>
                {THEME_OPTIONS[previewThemeIndex].name}
              </h2>
              <p className="text-[13.5px] text-[#666] leading-relaxed mb-8 max-w-[320px] font-medium">
                {THEME_OPTIONS[previewThemeIndex].description}
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="bg-primary hover:bg-red-700 text-white px-5 py-3 rounded-lg text-sm font-bold flex items-center gap-2 w-fit transition-all hover:shadow-[0_8px_20px_rgba(225,29,72,0.3)] hover:-translate-y-0.5 active:scale-95" style={{ backgroundColor: THEME_OPTIONS[previewThemeIndex].color }}>
                    <ExternalLink className="w-4 h-4" /> Ver demo ao vivo
                  </button>
                </DialogTrigger>
                <DialogContent className="fixed inset-0 w-full h-[100dvh] p-0 bg-black border-none overflow-hidden flex flex-col z-[500] translate-x-0 translate-y-0 rounded-none max-w-none">
                  <DialogTitle className="sr-only">Demo {THEME_OPTIONS[previewThemeIndex].name}</DialogTitle>
                  <DialogDescription className="sr-only">Visualização ao vivo do tema {THEME_OPTIONS[previewThemeIndex].name}</DialogDescription>
                  <div className="flex-1 relative">
                     <div className="absolute top-6 right-6 z-[600]">
                        <DialogClose className="p-2.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all border border-white/20 shadow-2xl backdrop-blur-md">
                           <X className="w-5 h-5" />
                        </DialogClose>
                     </div>
                     <iframe 
                       src={(THEME_OPTIONS[previewThemeIndex] as any).demoUrl || "#"} 
                       className="w-full h-full border-none"
                       title={`Demo ${THEME_OPTIONS[previewThemeIndex].name}`}
                     />
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="aspect-[4/3] rounded-2xl bg-[#0d0005] border border-[#2a0010] overflow-hidden relative flex items-center justify-center shadow-2xl">
               {(THEME_OPTIONS[previewThemeIndex] as any).videoUrl ? (
                 <div className="absolute inset-0 pointer-events-none">
                   <iframe
                     className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full scale-[1.25] border-none opacity-40 group-hover:opacity-60 transition-opacity"
                     src={`https://www.youtube.com/embed/${(THEME_OPTIONS[previewThemeIndex] as any).videoUrl}?autoplay=1&mute=1&loop=1&playlist=${(THEME_OPTIONS[previewThemeIndex] as any).videoUrl}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&playsinline=1&volume=0&enablejsapi=1&origin=${encodeURIComponent(origin)}&widget_referrer=${encodeURIComponent(origin)}`}
                     allow="autoplay; encrypted-media"
                     tabIndex={-1}
                   />
                 </div>
               ) : (
                 <NextImage 
                   src={THEME_OPTIONS[previewThemeIndex].image} 
                   fill 
                   className="object-cover opacity-20 grayscale-[0.5] group-hover:opacity-30 group-hover:scale-105 transition-all duration-700" 
                   alt="Theme preview" 
                 />
               )}
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,_rgba(225,29,72,0.05)_0%,_transparent_70%)]" />
               <Heart className="w-12 h-12 text-primary opacity-20 group-hover:opacity-40 transition-opacity" />
            </div>
          </div>

          <div className="flex items-center justify-between mt-8 relative z-10">
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((idx) => (
                <div 
                  key={idx} 
                  onClick={() => setPreviewThemeIndex(idx)}
                  className={cn(
                    "h-1.5 rounded-full cursor-pointer transition-all duration-300",
                    previewThemeIndex === idx ? "w-6 bg-primary" : "w-1.5 bg-[#333]"
                  )} 
                  style={{ backgroundColor: previewThemeIndex === idx ? THEME_OPTIONS[idx].color : undefined }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setPreviewThemeIndex((prev) => (prev - 1 + 4) % 4)}
                className="w-8 h-8 rounded-lg border border-[#2a2a2a] bg-[#111] flex items-center justify-center text-[#888] hover:border-primary hover:text-primary transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setPreviewThemeIndex((prev) => (prev + 1) % 4)}
                className="w-8 h-8 rounded-lg border border-[#2a2a2a] bg-[#111] flex items-center justify-center text-[#888] hover:border-primary hover:text-primary transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
