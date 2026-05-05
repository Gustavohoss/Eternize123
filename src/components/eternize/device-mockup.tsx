'use client';

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { 
  Heart, 
  ImageIcon, 
  Play,
  Pause,
  ThumbsUp,
  ChevronDown,
  Lock,
  Music2,
  X,
  ChevronLeft,
  MoreHorizontal,
  Shuffle,
  RotateCcw,
  SkipBack,
  SkipForward,
  Languages,
  Share2,
  Maximize2,
  Grid as GridIcon,
  Bell,
  UserPlus,
  UserSquare2,
  Check,
  CheckCircle2,
  MessageCircle,
  Send,
  Bookmark,
  Trophy,
  Sparkles,
  Star,
  Compass
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay, EffectCreative } from 'swiper/modules';
import { cn } from '@/lib/utils';
import { intervalToDuration, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MusicPlayer } from './music-player';
import { SparklesCore } from '@/components/ui/sparkles';
import { SmokeBackground } from '@/components/ui/spooky-smoke-animation';
import { FallingPattern } from '@/components/ui/falling-pattern';
import { ThemeId } from '@/app/criador/constants';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-creative';

interface DeviceMockupProps {
  selectedTheme?: ThemeId;
  selectedBgColor: string;
  selectedEffect: string;
  isEmojiRainEnabled: boolean;
  selectedEmojis: string[];
  emojiSize: number;
  emojiRainPosition?: 'behind' | 'front';
  step: string;
  uploadedPhotos: string[];
  pageTitle: string;
  message?: string;
  musicData?: {
    id: string;
    title: string;
    thumb: string;
  };
  date?: Date;
  selectedCountStyle: string;
  photoEffect: 'slide' | 'coverflow' | 'fan';
  titleColor?: string;
  titleFont?: string;
  titleIsBold?: boolean;
  titleHasNeon?: boolean;
  titleNeonStrength?: number;
  cardColor?: string;
  showCard?: boolean;
  titlePosition?: 'top' | 'bottom';
  dateColor?: string;
  dateFont?: string;
  dateIsBold?: boolean;
  dateHasNeon?: boolean;
  dateNeonStrength?: number;
  dateBoxBgColor?: string;
  dateBoxBorderColor?: string;
  messageColor?: string;
  messageFont?: string;
  musicBoxColor?: string;
  musicTextColor?: string;
  musicHasNeon?: boolean;
  musicNeonStrength?: number;
  isAutoPlay?: boolean;

  sparklesDensity?: number;
  sparklesSpeed?: number;
  sparklesColor?: string;
  smokeIntensity?: number;
  smokeColor?: string;
  patternDuration?: number;
  patternDensity?: number;
  patternColor?: string;
  
  isFullscreen?: boolean;
  isPackEnabled?: boolean;
}

const PACK_MODULES = [
  { id: 'memorias', label: 'Memórias', icon: Heart, bgColor: '#ffe4e6', iconColor: '#e11d48' },
  { id: 'conquistas', label: 'Conquistas', icon: Trophy, bgColor: '#fef3c7', iconColor: '#d97706' },
  { id: 'curiosidades', label: 'Curiosidades', icon: Sparkles, bgColor: '#f3e8ff', iconColor: '#7c3aed' },
  { id: 'mapa-astral', label: 'Mapa Astral', icon: Star, bgColor: '#e0f2fe', iconColor: '#0284c7' },
  { id: 'jornada', label: 'Jornada no Mapa', icon: Compass, bgColor: '#d1fae5', iconColor: '#059669' },
  { id: 'roleta', label: 'Roleta Surpresa', icon: RotateCcw, bgColor: '#ffedd5', iconColor: '#ea580c' },
];

export function DeviceMockup({
  selectedTheme = 'classic',
  selectedBgColor,
  selectedEffect,
  isEmojiRainEnabled,
  selectedEmojis,
  emojiSize,
  emojiRainPosition = 'behind',
  step,
  uploadedPhotos,
  pageTitle,
  message,
  musicData,
  date,
  selectedCountStyle,
  photoEffect = 'slide',
  titleColor = '#111111',
  titleFont = 'dancing-script',
  titleIsBold = false,
  titleHasNeon = false,
  titleNeonStrength = 10,
  cardColor = '#ffffff',
  showCard = true,
  titlePosition = 'bottom',
  dateColor = '#ffffff',
  dateFont = 'inter',
  dateIsBold = true,
  dateHasNeon = false,
  dateNeonStrength = 10,
  dateBoxBgColor = '#1a1a1a',
  dateBoxBorderColor = '#2a2a2a',
  messageColor = '#ffffff',
  messageFont = 'inter',
  musicBoxColor = '#0e0e0e',
  musicTextColor = '#ffffff',
  musicHasNeon = false,
  musicNeonStrength = 15,
  isAutoPlay = false,

  sparklesDensity = 120,
  sparklesSpeed = 0.5,
  sparklesColor = '#ffffff',
  smokeIntensity = 0.5,
  smokeColor = '#ffffff',
  patternDuration = 150,
  patternDensity = 1,
  patternColor = '#ffffff',
  
  isFullscreen = false,
  isPackEnabled = false
}: DeviceMockupProps) {
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [timeDiff, setTimeDiff] = useState<any>(null);

  // States for Special Experiences
  const [isIntroActive, setIsIntroActive] = useState(false);
  const [introPhase, setIntroPhase] = useState<'idle' | 'closing' | 'blackout' | 'logo'>('idle');
  const [showStories, setShowStories] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isStoryPaused, setIsStoryPaused] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [activeTab, setActiveTab] = useState<'grid' | 'reels' | 'tagged' | 'músicas' | 'eventos' | 'loja'>('grid');
  const [experienceAutoPlay, setExperienceAutoPlay] = useState(false);
  const [showSpotifyFullscreen, setShowSpotifyFullscreen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isInList, setIsInList] = useState(false);
  
  // Instagram Specific States
  const [isFollowing, setIsFollowing] = useState(false);
  const [hasMessaged, setHasMessaged] = useState(false);
  const [showInstagramPost, setShowInstagramPost] = useState(false);
  const [selectedPostIndex, setSelectedPostIndex] = useState(0);
  const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({});
  const [savedPosts, setSavedPosts] = useState<Record<number, boolean>>({});
  
  // Spotify/Netflix Specific State
  const [isAudioPlaying, setIsAudioPlaying] = useState(isAutoPlay);
  const [dynamicSpotifyColor, setDynamicSpotifyColor] = useState('#1a0a0a');
  const [spotifyHeaderOpacity, setSpotifyHeaderOpacity] = useState(0);

  // Sincroniza o estado de áudio com a configuração de AutoPlay
  useEffect(() => {
    setIsAudioPlaying(isAutoPlay);
  }, [isAutoPlay]);

  useEffect(() => {
    if (selectedTheme === 'spotify') {
      setActiveTab('músicas');
    } else if (selectedTheme === 'instagram') {
      setActiveTab('grid');
    } else {
      setActiveTab('episodios' as any);
    }
  }, [selectedTheme]);

  useEffect(() => {
    if (uploadedPhotos.length === 0) return;
    
    // Pega a cor predominante da foto ativa (ou da primeira) para o fundo do Spotify
    const photoToAnalize = uploadedPhotos[activeHeroIndex] || uploadedPhotos[0];
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.src = photoToAnalize;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = 1;
      canvas.height = 1;
      ctx.drawImage(img, 0, 0, 1, 1);
      
      const pixel = ctx.getImageData(0, 0, 1, 1).data;
      const r = pixel[0];
      const g = pixel[1];
      const b = pixel[2];
      
      const factor = 0.15; 
      const darkenedR = Math.floor(r * factor);
      const darkenedG = Math.floor(g * factor);
      const darkenedB = Math.floor(b * factor);
      
      setDynamicSpotifyColor(`rgb(${darkenedR}, ${darkenedG}, ${darkenedB})`);
    };
  }, [uploadedPhotos, selectedTheme, activeHeroIndex]);

  useEffect(() => {
    if (!date) {
      setTimeDiff(null);
      return;
    }
    const updateCounter = () => {
      const now = new Date();
      if (now < date) {
        setTimeDiff({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const duration = intervalToDuration({ start: date, end: now });
      setTimeDiff({
        years: duration.years || 0,
        months: duration.months || 0,
        days: duration.days || 0,
        hours: duration.hours || 0,
        minutes: duration.minutes || 0,
        seconds: duration.seconds || 0,
      });
    };
    updateCounter();
    const interval = setInterval(updateCounter, 1000);
    return () => clearInterval(interval);
  }, [date]);

  const totalDays = useMemo(() => {
    if (!date) return 26; 
    const now = new Date();
    if (now < date) return 0;
    return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  }, [date]);

  const formattedTotalDays = useMemo(() => {
    if (totalDays >= 1000) {
      return (totalDays / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + 'K';
    }
    return totalDays.toLocaleString('pt-BR');
  }, [totalDays]);

  const getFontFamily = (font: string) => {
    switch (font) {
      case 'pacifico': return "'Pacifico', cursive";
      case 'playfair': return "'Playfair Display', serif";
      case 'inter': return "'Inter', sans-serif";
      case 'dancing-script': return "'Dancing Script', cursive";
      case 'lora': return "'Lora', serif";
      case 'bebas-neue': return "'Bebas Neue', cursive";
      default: return "'Inter', sans-serif";
    }
  };

  const startNetflixExperience = () => {
    if (uploadedPhotos.length === 0) return;
    
    setIsAudioPlaying(true);
    setExperienceAutoPlay(true);
    setIsStoryPaused(false);
    setIsIntroActive(true);
    setIntroPhase('closing');
    setTimeout(() => setIntroPhase('blackout'), 1500);
    setTimeout(() => setIntroPhase('logo'), 1600);
    setTimeout(() => {
      setIsIntroActive(false);
      setIntroPhase('idle');
      setShowStories(true);
      setCurrentStoryIndex(0);
      setStoryProgress(0);
    }, 4500); 
  };

  const startInstagramStories = () => {
    if (uploadedPhotos.length === 0) return;
    setShowStories(true);
    setCurrentStoryIndex(0);
    setStoryProgress(0);
    setIsStoryPaused(false);
    setIsAudioPlaying(true);
  };

  const triggerFade = useCallback((callback: () => void) => {
    setIsFading(true);
    setTimeout(() => {
      callback();
      setIsFading(false);
    }, 800);
  }, []);

  const nextStory = useCallback(() => {
    if (isFading) return;
    if (currentStoryIndex < uploadedPhotos.length - 1) {
      triggerFade(() => {
        setCurrentStoryIndex(prev => prev + 1);
        setStoryProgress(0);
      });
    } else {
      setShowStories(false);
    }
  }, [uploadedPhotos.length, currentStoryIndex, triggerFade, isFading]);

  const prevStory = useCallback(() => {
    if (isFading) return;
    if (currentStoryIndex > 0) {
      triggerFade(() => {
        setCurrentStoryIndex(prev => prev - 1);
        setStoryProgress(0);
      });
    }
  }, [currentStoryIndex, triggerFade, isFading]);

  useEffect(() => {
    if (!showStories || uploadedPhotos.length === 0 || isStoryPaused || isFading) return;
    const intervalTime = 50; 
    const duration = 5000; 
    const step = (intervalTime / duration) * 100;
    const timer = setInterval(() => {
      setStoryProgress(prev => {
        if (prev >= 100) {
          nextStory();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);
    return () => clearInterval(timer);
  }, [showStories, nextStory, uploadedPhotos.length, isStoryPaused, isFading]);

  const togglePause = () => {
    setIsStoryPaused(!isStoryPaused);
  };

  const toggleLikePost = (index: number) => {
    setLikedPosts(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleSavePost = (index: number) => {
    setSavedPosts(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const dateStyle: React.CSSProperties = {
    color: selectedTheme === 'netflix' ? '#e50914' : dateColor,
    fontFamily: selectedTheme === 'netflix' ? "'Bebas Neue', cursive" : getFontFamily(dateFont || 'inter'),
    fontWeight: selectedTheme === 'netflix' ? '400' : (dateIsBold ? '700' : '400'),
    textShadow: selectedTheme === 'netflix' ? 'none' : (dateHasNeon ? `0 0 ${dateNeonStrength!/2}px ${dateColor}, 0 0 ${dateNeonStrength!}px ${dateColor}` : 'none')
  };

  const titleStyle: React.CSSProperties = { 
    color: selectedTheme === 'netflix' ? '#ffffff' : titleColor,
    fontFamily: selectedTheme === 'netflix' ? "'Bebas Neue', cursive" : (selectedTheme === 'spotify' || selectedTheme === 'instagram') ? "'DM Sans', sans-serif" : getFontFamily(titleFont || 'dancing-script'),
    fontWeight: selectedTheme === 'netflix' ? '400' : (selectedTheme === 'spotify' || selectedTheme === 'instagram') ? '900' : (titleIsBold ? '700' : '400'),
    textShadow: selectedTheme === 'netflix' ? 'none' : (titleHasNeon ? `0 0 ${titleNeonStrength!/2}px ${titleColor}, 0 0 ${titleNeonStrength!}px ${titleColor}` : 'none'),
  };

  const slugifiedTitle = (pageTitle || '').toLowerCase().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const EmojiRainLayer = () => (
    isEmojiRainEnabled ? (
      <div 
        className={cn(
          "absolute inset-0 pointer-events-none overflow-hidden",
          emojiRainPosition === 'front' ? "z-[100]" : "z-[15]"
        )}
      >
        {[...Array(15)].map((_, i) => (
          <span 
            key={i} 
            className="absolute animate-fall" 
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `-${Math.random() * 200}px`,
              animationDuration: `${3 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 5}s`,
              fontSize: `${emojiSize}px`,
              opacity: 0.8
            }}
          >
            {selectedEmojis[i % selectedEmojis.length]}
          </span>
        ))}
      </div>
    ) : null
  );

  return (
    <div className={cn(
      "w-full transition-all duration-500 flex flex-col relative", 
      isFullscreen ? "h-full" : "max-w-[400px] mx-auto"
    )}>
      {/* Player Global Unificado */}
      {musicData && (
        <MusicPlayer 
          musicData={musicData} 
          isAutoPlay={isAudioPlaying} 
          hideUI={selectedTheme === 'netflix' || selectedTheme === 'spotify' || selectedTheme === 'instagram'}
          onStateChange={(playing) => setIsAudioPlaying(playing)}
        />
      )}

      {isIntroActive && (
        <div className="absolute inset-0 z-[1000] overflow-hidden bg-black flex items-center justify-center">
          <div className="absolute inset-0 flex z-10 pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "flex-1 h-full transition-all duration-[1200ms] cubic-bezier(0.45, 0.05, 0.55, 0.95)",
                  (i + 1) % 2 !== 0 ? "-translate-y-full" : "translate-y-full",
                  introPhase !== 'idle' && "translate-y-0",
                  (introPhase === 'blackout' || introPhase === 'logo') && "animate-fade-out-bars"
                )}
                style={{
                  backgroundColor: `rgb(${Math.floor(26 + (i * (192 / 30)))}, 0, 0)`,
                  transitionDelay: `${i * 0.02}s`,
                }}
              />
            ))}
          </div>
          <h1 className={cn(
            "logo-text absolute z-20 text-[#E50914] text-4xl md:text-6xl font-bebas tracking-[15px] uppercase transition-all duration-1000 pointer-events-none",
            introPhase === 'logo' ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-90 blur-xl"
          )}>
            ETERNIZE
          </h1>
        </div>
      )}

      {showStories && uploadedPhotos.length > 0 && (
        <div className="absolute inset-0 z-[600] bg-black flex flex-col animate-in fade-in duration-500 overflow-hidden">
          {/* Progress Bars */}
          <div className="absolute top-4 left-0 right-0 z-[610] px-3 flex gap-1.5 pointer-events-none">
            {uploadedPhotos.map((_, i) => (
              <div key={i} className="flex-1 h-0.5 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full bg-white transition-all duration-100 ease-linear",
                    i < currentStoryIndex ? "w-full" : i === currentStoryIndex ? "" : "w-0"
                  )} 
                  style={i === currentStoryIndex ? { width: `${storyProgress}%` } : {}}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-8 left-0 right-0 z-[620] px-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden relative bg-neutral-900">
                <Image src={uploadedPhotos[0]} fill className="object-cover" alt="Profile" />
              </div>
              <div className="flex flex-col">
                <span className="text-white text-xs font-bold leading-tight">{pageTitle || 'Eternize'}</span>
                <span className="text-white/60 text-[10px] font-medium leading-tight">Juntos há {formattedTotalDays} dias</span>
              </div>
            </div>
            <button 
              onClick={() => { setShowStories(false); setIsStoryPaused(false); }}
              className="p-1 text-white hover:opacity-70 transition-opacity"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Touch Interaction Areas */}
          <div className="absolute inset-0 z-[605] flex">
            <div className="flex-1 h-full cursor-pointer" onClick={prevStory} />
            <div className="flex-1 h-full cursor-pointer" onMouseDown={() => setIsStoryPaused(true)} onMouseUp={() => setIsStoryPaused(false)} onTouchStart={() => setIsStoryPaused(true)} onTouchEnd={() => setIsStoryPaused(false)} />
            <div className="flex-1 h-full cursor-pointer" onClick={nextStory} />
          </div>

          {/* Content */}
          <div className="flex-1 relative flex flex-col items-center justify-center bg-black">
            <div className={cn(
              "absolute inset-0 transition-all duration-[800ms] ease-in-out",
              isFading ? "opacity-0 scale-95" : "opacity-100 scale-100"
            )}>
              <Image src={uploadedPhotos[currentStoryIndex]} fill className="object-cover" alt={`Story ${currentStoryIndex}`} priority />
            </div>
            
            {/* Dark Overlays for UI readability */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          </div>

          {/* Bottom Interaction (Optional/Visual Only) */}
          <div className="absolute bottom-6 left-0 right-0 z-[620] px-4 flex items-center gap-3">
             <div className="flex-1 bg-transparent border border-white/30 rounded-full h-10 px-4 flex items-center">
                <span className="text-white/60 text-xs">Enviar mensagem</span>
             </div>
             <Heart className="w-6 h-6 text-white" />
             <Send className="w-6 h-6 text-white" />
          </div>
        </div>
      )}

      {showSpotifyFullscreen && (
        <div className="absolute inset-0 z-[500] bg-[#121212] flex flex-col animate-in fade-in duration-500 overflow-hidden no-scrollbar">
          <div className="absolute inset-0 z-0 scale-125 brightness-[0.4] blur-[60px] transition-all duration-1000">
             {uploadedPhotos.length > 0 ? (
               <Image src={uploadedPhotos[activeHeroIndex] || uploadedPhotos[0]} fill className="object-cover" alt="blur-bg" />
             ) : (
               <div className="w-full h-full bg-[#121212]" />
             )}
          </div>

          <div className="relative z-10 flex flex-col h-full px-6 pt-4 no-scrollbar overflow-y-auto">
            <div className="flex items-center justify-between mb-10 shrink-0">
               <button onClick={() => setShowSpotifyFullscreen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white active:scale-90 transition-transform">
                  <ChevronDown className="w-6 h-6 stroke-[3]" />
               </button>
               <div className="text-center min-w-0 px-4">
                  <p className="text-[9px] uppercase font-black tracking-[0.2em] text-white/50 mb-0.5">Populares</p>
                  <p className="text-[11px] font-black text-white truncate max-w-[150px]">{pageTitle || 'Eternize'}</p>
               </div>
               <button className="text-white/80 active:scale-90 transition-transform">
                  <MoreHorizontal className="w-6 h-6" />
               </button>
            </div>

            <div className="relative aspect-square w-full mb-12 shrink-0 group">
              <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl">
                {uploadedPhotos.length > 0 ? (
                  <Image src={uploadedPhotos[activeHeroIndex] || uploadedPhotos[0]} fill className="object-cover" alt="Album Cover" />
                ) : (
                  <div className="w-full h-full bg-neutral-800 flex items-center justify-center"><ImageIcon className="w-12 h-12 text-white/10" /></div>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="flex items-center justify-between mb-8 shrink-0">
               <div className="min-w-0 pr-4">
                  <h2 className="text-[28px] font-black text-white leading-tight tracking-tight truncate font-['DM_Sans']">{activeHeroIndex >= 0 && uploadedPhotos[activeHeroIndex] ? `Memória ${activeHeroIndex + 1}` : (pageTitle || 'Nossa História')}</h2>
                  <p className="text-base font-bold text-white/60 truncate font-['DM_Sans']">{pageTitle || 'Eternize'}</p>
               </div>
               <button onClick={() => setIsLiked(!isLiked)} className={cn("transition-all duration-300", isLiked ? "text-[#1DB954]" : "text-white/80")}>
                  {isLiked ? <Heart className="w-8 h-8 fill-current text-[#1DB954]" /> : <Heart className="w-8 h-8" />}
               </button>
            </div>

            <div className="mb-8 shrink-0">
              <div className="w-full h-[4px] bg-white/20 rounded-full relative">
                <div className="absolute left-0 top-0 h-full bg-white rounded-full w-[45%]" />
              </div>
              <div className="flex justify-between mt-2 text-[10px] font-black text-white/40 tracking-wider font-['DM_Sans']">
                 <span>1:00</span>
                 <span>-3:11</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-10 shrink-0 px-1">
               <button className="text-white/40 hover:text-white transition-colors"><Shuffle className="w-6 h-6" /></button>
               <button className="text-white active:scale-90 transition-transform"><SkipBack className="w-8 h-8 fill-current" /></button>
               <button 
                onClick={() => setIsAudioPlaying(!isAudioPlaying)}
                className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black shadow-2xl active:scale-95 transition-transform"
               >
                  {isAudioPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
               </button>
               <button className="text-white active:scale-90 transition-transform"><SkipForward className="w-8 h-8 fill-current" /></button>
               <button className="text-white/40 hover:text-white transition-colors"><RotateCcw className="w-6 h-6" /></button>
            </div>

            {message && (
              <div 
                className="rounded-[24px] p-6 mb-8 shrink-0 shadow-lg group transition-colors duration-700"
                style={{ backgroundColor: dynamicSpotifyColor === '#1a0a0a' ? '#E11D48' : dynamicSpotifyColor }}
              >
                 <div className="flex justify-between items-center mb-6">
                    <span className="text-white font-black text-xs uppercase tracking-widest">Letra</span>
                    <div className="flex gap-4 text-black/20">
                       <Languages className="w-5 h-5" />
                       <Share2 className="w-5 h-5" />
                       <Maximize2 className="w-5 h-5" />
                    </div>
                 </div>
                 <div 
                   className="text-white text-xl md:text-2xl font-black leading-snug tracking-tighter opacity-95 line-clamp-6 font-['DM_Sans']"
                   dangerouslySetInnerHTML={{ __html: message }}
                 />
                 <div className="mt-8">
                    <span className="text-white/50 text-[11px] font-black uppercase tracking-widest">Ver mais</span>
                 </div>
              </div>
            )}

            <div className="bg-black/10 rounded-[24px] p-6 mb-12 shrink-0 backdrop-blur-sm">
               <h3 className="text-white text-base font-black mb-5 font-['DM_Sans']">Conheça {pageTitle || 'o casal'}</h3>
               <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x">
                  {uploadedPhotos.length > 0 ? (
                    uploadedPhotos.map((photo, i) => (
                      <div key={i} className="w-[150px] h-[200px] flex-shrink-0 bg-neutral-800 rounded-xl overflow-hidden relative shadow-xl snap-start" onClick={() => setActiveHeroIndex(i)}>
                         <Image src={photo} fill className="object-cover" alt="" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                         <p className="absolute bottom-4 left-4 text-[11px] font-black text-white">{pageTitle || 'Nós'}</p>
                      </div>
                    ))
                  ) : (
                    <div className="w-[150px] h-[200px] flex-shrink-0 bg-neutral-800 rounded-xl flex items-center justify-center border border-white/5">
                       <ImageIcon className="w-8 h-8 text-white/10" />
                    </div>
                  )}
               </div>
            </div>
            
            <div className="h-10 shrink-0" />
          </div>
        </div>
      )}

      {showInstagramPost && (
        <div className="absolute inset-0 z-[500] bg-black flex flex-col animate-in fade-in duration-300 no-scrollbar overflow-y-auto">
          {/* Header do Post */}
          <header className="flex items-center justify-between px-4 py-3 sticky top-0 bg-black z-50 border-b border-white/5">
            <div className="flex items-center gap-3">
              <ChevronLeft className="w-6 h-6" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden relative bg-neutral-900">
                  {uploadedPhotos.length > 0 ? (
                    <Image src={uploadedPhotos[0]} fill className="object-cover" alt="Profile" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><UserSquare2 className="w-4 h-4 text-white/20" /></div>
                  )}
                </div>
                <div className="flex flex-col -space-y-0.5">
                  <div className="flex items-center gap-1">
                     <span className="font-bold text-sm tracking-tight">{pageTitle || 'Usuario'}</span>
                     <svg width="10" height="10" viewBox="0 0 24 24" fill="#0095F6"><circle cx="12" cy="12" r="11"/><path d="M7 12l3.5 3.5L17 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-medium">{date ? format(date, 'dd/MM/yyyy') : '01/05/2026'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <MoreHorizontal className="w-5 h-5 text-white" />
              <button onClick={() => setShowInstagramPost(false)} className="text-white"><X className="w-6 h-6" /></button>
            </div>
          </header>

          {/* Imagem Principal */}
          <div className="relative aspect-square w-full bg-neutral-900">
            <Image src={uploadedPhotos[selectedPostIndex]} fill className="object-cover" alt="Post" />
          </div>

          {/* Ações e Comentários */}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => toggleLikePost(selectedPostIndex)}
                  className="active:scale-125 transition-transform"
                >
                  <Heart className={cn("w-6 h-6", likedPosts[selectedPostIndex] ? "text-red-500 fill-current" : "text-white")} />
                </button>
                <MessageCircle className="w-6 h-6 text-white" />
                <Send className="w-6 h-6 text-white" />
              </div>
              <button 
                onClick={() => toggleSavePost(selectedPostIndex)}
                className="active:scale-125 transition-transform"
              >
                <Bookmark className={cn("w-6 h-6", savedPosts[selectedPostIndex] ? "text-white fill-current" : "text-white")} />
              </button>
            </div>

            <div className="space-y-1.5">
               <p className="text-sm font-bold text-white">
                 {(totalDays + (likedPosts[selectedPostIndex] ? 1 : 0)).toLocaleString('pt-BR')} curtidas
               </p>
               <div className="text-sm">
                  <span className="font-bold mr-2">{pageTitle || 'Usuario'}</span>
                  <span className="text-neutral-200">Juntos desde {date ? format(date, 'dd/MM/yyyy') : '01/05/2026'} ❤️</span>
               </div>
            </div>
          </div>
        </div>
      )}

      {!isFullscreen && (
        <>
          <div className="mb-6 text-center">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Prévia em tempo real</p>
          </div>
          
          <div className="bg-white border-x border-t border-neutral-200 p-2.5 flex items-center justify-center shrink-0 rounded-t-2xl">
            <div className="bg-neutral-100 rounded-full h-8 w-full flex items-center px-4 gap-2 border border-neutral-200 max-w-[400px]">
              <Lock className="w-3 h-3 text-neutral-400" />
              <div className="text-[11px] text-neutral-600 font-medium truncate">eternizee.shop/{slugifiedTitle || 'seu-nome'}</div>
            </div>
          </div>
        </>
      )}

      <div className={cn(
        "relative bg-black border-white/10 shadow-2xl flex-1 overflow-hidden no-scrollbar flex flex-col",
        isFullscreen ? "rounded-none border-none" : "rounded-b-[2.5rem] aspect-[9/19] border-x border-b"
      )}>
        <div className="absolute inset-0 transition-colors duration-500" style={{ backgroundColor: (selectedTheme === 'netflix' || selectedTheme === 'spotify' || selectedTheme === 'instagram') ? (selectedTheme === 'instagram' ? '#000000' : '#121212') : selectedBgColor }}>
          
          <EmojiRainLayer />

          {selectedEffect === 'sparkles' && (selectedTheme === 'classic') && (
            <div className="absolute inset-0 pointer-events-none z-10">
              <SparklesCore background="transparent" minSize={0.4} maxSize={1.2} particleDensity={sparklesDensity} className="w-full h-full" particleColor={sparklesColor} speed={sparklesSpeed} />
            </div>
          )}
          {selectedEffect === 'smoke' && (selectedTheme === 'classic') && (
            <div className="absolute inset-0 pointer-events-none z-10">
              <SmokeBackground smokeColor={smokeColor} backgroundColor={selectedBgColor} intensity={smokeIntensity} />
            </div>
          )}
          {selectedEffect === 'pattern' && (selectedTheme === 'classic') && (
            <div className="absolute inset-0 pointer-events-none z-10 opacity-40">
              <FallingPattern color={patternColor} backgroundColor="transparent" density={patternDensity} duration={patternDuration} className="p-0" />
            </div>
          )}
          
          <div className="absolute inset-0 flex flex-col items-center overflow-y-auto no-scrollbar z-20">
            <div className={cn(
              "w-full flex flex-col items-center min-h-full",
              isFullscreen && "max-w-[480px]"
            )}>
              {selectedTheme === 'instagram' ? (
                <div className="w-full h-full bg-black text-white font-inter flex flex-col no-scrollbar relative">
                  <header className="flex items-center justify-between px-4 py-3 sticky top-0 bg-black z-50">
                    <div className="flex items-center gap-3">
                      <ChevronLeft className="w-6 h-6" />
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-lg tracking-tight truncate max-w-[150px]">{pageTitle || 'Gustavo E Luisa'}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#0095F6"><circle cx="12" cy="12" r="11"/><path d="M7 12l3.5 3.5L17 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </div>
                    <Bell className="w-6 h-6" />
                  </header>

                  <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
                    <section className="px-4 pt-2 pb-4">
                      <div className="flex items-center gap-6 mb-4">
                        <div 
                          className="p-[2.5px] rounded-full ig-gradient cursor-pointer active:scale-95 transition-transform"
                          onClick={startInstagramStories}
                        >
                          <div className="p-[2px] bg-black rounded-full">
                            <div className="w-20 h-20 rounded-full border-2 border-black overflow-hidden relative bg-neutral-900">
                              {uploadedPhotos.length > 0 ? (
                                <Image src={uploadedPhotos[0]} fill className="object-cover" alt="Profile" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center"><UserSquare2 className="w-10 h-10 text-white/20" /></div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-1 flex justify-around text-center">
                          <div><p className="font-bold text-base">{uploadedPhotos.length}</p><p className="text-[10px] text-neutral-400">publicações</p></div>
                          <div><p className="font-bold text-base">{formattedTotalDays}</p><p className="text-[10px] text-neutral-400">dias</p></div>
                          <div><p className="font-bold text-base">{timeDiff?.years || 0}</p><p className="text-[10px] text-neutral-400">anos</p></div>
                        </div>
                      </div>

                      <div className="space-y-0.5 mb-6">
                        <p className="font-bold text-sm">{pageTitle || 'Gustavo E Luisa'}</p>
                        <div 
                          className="text-sm text-neutral-200 leading-tight" 
                          dangerouslySetInnerHTML={{ __html: message || 'Te amo meu amor e quero sempre ficar junto com você' }} 
                        />
                        <p className="text-sm text-neutral-500 pt-1"> Juntos desde {date ? format(date, 'dd/MM/yyyy') : '07/04/2017'}</p>
                        
                        {musicData && (
                          <div className="flex items-center gap-1 py-1 mt-1">
                            <div className="w-4 h-4 rounded ig-gradient flex items-center justify-center">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
                            </div>
                            <p className="text-xs text-neutral-400 truncate max-w-[200px]">{musicData.title}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mb-6">
                        <button 
                          onClick={() => setIsFollowing(!isFollowing)}
                          className={cn(
                            "flex-1 py-1.5 rounded-lg text-sm font-semibold transition active:scale-95",
                            isFollowing 
                              ? "bg-neutral-800 text-white hover:bg-neutral-700" 
                              : "bg-[#0095F6] text-white hover:bg-blue-600"
                          )}
                        >
                          {isFollowing ? 'Seguindo' : 'Seguir'}
                        </button>
                        <button 
                          onClick={() => setHasMessaged(true)}
                          className="flex-1 bg-neutral-800 hover:bg-neutral-700 py-1.5 rounded-lg text-sm font-semibold transition active:scale-95 text-white flex items-center justify-center gap-1.5"
                        >
                          {hasMessaged ? <><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Enviada</> : 'Mensagem'}
                        </button>
                        <button className="px-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition active:scale-95 text-white"><UserPlus className="w-4.5 h-4.5" /></button>
                      </div>
                    </section>

                    <section className="px-4 pb-6 overflow-x-auto no-scrollbar flex gap-4">
                      <div 
                        className="flex flex-col items-center gap-1 shrink-0 cursor-pointer"
                        onClick={startInstagramStories}
                      >
                        <div className="w-16 h-16 rounded-full border border-neutral-800 flex items-center justify-center active:scale-95 transition-transform">
                          <span className="text-3xl font-light text-neutral-400">+</span>
                        </div>
                        <span className="text-[11px] text-neutral-400">Novo</span>
                      </div>
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-1 shrink-0 opacity-40">
                          <div className="w-16 h-16 rounded-full border border-neutral-800 bg-neutral-900/50" />
                          <div className="h-2 w-10 bg-neutral-900 rounded-full" />
                        </div>
                      ))}
                    </section>

                    <div className="flex border-t border-neutral-900">
                      <button 
                        onClick={() => setActiveTab('grid')}
                        className={cn(
                          "flex-1 flex justify-center py-3 transition-all",
                          activeTab === 'grid' ? "border-b border-white" : "text-neutral-500"
                        )}
                      >
                        <GridIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setActiveTab('reels')}
                        className={cn(
                          "flex-1 flex justify-center py-3 transition-all",
                          activeTab === 'reels' ? "border-b border-white" : "text-neutral-500"
                        )}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m2 9 3-3 3 3"/><path d="M13 18H7a2 2 0 0 1-2-2V6"/><path d="m22 15-3 3-3-3"/><path d="M11 6h6a2 2 0 0 1 2 2v10"/></svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-[1.5px] bg-black">
                      {uploadedPhotos.length > 0 ? (
                        uploadedPhotos.map((photo, i) => (
                          <div 
                            key={i} 
                            className="aspect-square relative group cursor-pointer active:opacity-80"
                            onClick={() => {
                              setSelectedPostIndex(i);
                              setShowInstagramPost(true);
                            }}
                          >
                            <Image src={photo} fill className="object-cover" alt="" />
                          </div>
                        ))
                      ) : (
                        [...Array(9)].map((_, i) => (
                          <div key={i} className="aspect-square bg-neutral-900 animate-pulse" />
                        ))
                      )}
                    </div>
                  </div>

                  {musicData && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 rounded-2xl p-3 shadow-2xl z-[100] animate-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-center gap-3">
                        <div className="p-[1px] rounded-lg ig-gradient shrink-0">
                          <div className="w-10 h-10 rounded-lg overflow-hidden relative bg-black">
                            <Image src={uploadedPhotos[0] || musicData.thumb} fill className="object-cover" alt="" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate text-white">{musicData.title}</p>
                          <p className="text-[10px] text-neutral-400 truncate">{pageTitle || 'Nossa História'}</p>
                        </div>
                        <button 
                          onClick={() => setIsAudioPlaying(!isAudioPlaying)}
                          className="text-white hover:scale-110 transition-transform"
                        >
                          {isAudioPlaying ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                          ) : (
                            <Play className="w-5 h-5 fill-current" />
                          )}
                        </button>
                      </div>
                      <div className="mt-2 h-0.5 bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full ig-gradient" style={{ width: isAudioPlaying ? '45%' : '0%', transition: 'width 0.5s ease' }}></div>
                      </div>
                    </div>
                  )}
                </div>
              ) : selectedTheme === 'netflix' ? (
                <div className="w-full h-full bg-[#141414] text-white font-inter relative flex flex-col no-scrollbar overflow-y-auto">
                  <header className="sticky top-0 z-50 px-4 py-4 flex items-center justify-between bg-gradient-to-b from-black via-black/80 to-transparent">
                    <div className="text-[#e50914] font-bebas text-2xl tracking-tighter uppercase">ETERNIZE</div>
                    <div className="w-8 h-8 rounded-sm bg-[#e50914] flex items-center justify-center text-[11px] font-black tracking-tight">EZ</div>
                  </header>
                  <section className="relative min-h-[65vh] flex flex-col justify-end -mt-16">
                    <div className="absolute inset-0 z-0 bg-cover bg-top transition-all duration-700" style={{ background: 'linear-gradient(135deg, rgb(35, 10, 10) 0%, rgb(15, 15, 15) 100%)' }}>
                      {uploadedPhotos.length > 0 && <Image src={uploadedPhotos[activeHeroIndex] || uploadedPhotos[0]} fill className="object-cover opacity-60" alt="Hero" priority />}
                    </div>
                    <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#141414] via-[#141414]/40 to-transparent"></div>
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#141414] via-[#141414]/20 to-transparent"></div>
                    <div className="relative z-20 px-4 pb-6 pt-48">
                      <div className="mb-1"><span className="text-[#e50914] text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-1"><span className="text-xs">❤️</span> Eternize Original</span></div>
                      {pageTitle ? <h1 style={titleStyle} className="text-5xl font-bebas uppercase leading-[0.9] mb-3 drop-shadow-2xl tracking-tight break-words">{pageTitle}</h1> : <div className="w-[70%] h-12 bg-white/10 rounded-sm mb-3 animate-pulse-custom" />}
                      <div className="flex items-center gap-3 mb-2 text-[12px] font-semibold">
                        <span className="text-[#46d369]">98% compatível</span>
                        <span className="text-neutral-400 font-medium">{date ? date.getFullYear() : '2026'}</span>
                        <span className="text-neutral-400 font-medium">{uploadedPhotos.length || 8} Temporadas</span>
                        <div className="border border-neutral-600 px-1 rounded-sm text-[9px] bg-black/40 font-bold">HD</div>
                      </div>
                      <div className="mb-4">{message ? <div className="text-[13px] text-white/70 leading-relaxed line-clamp-3" dangerouslySetInnerHTML={{ __html: message }} /> : <div className="space-y-2 animate-pulse-custom"><div className="h-2 bg-white/5 w-full rounded-full" /><div className="h-2 bg-white/5 w-full rounded-full" /><div className="h-2 bg-white/5 w-2/3 rounded-full" /></div>}</div>
                      <div className="flex flex-col gap-2">
                        <button onClick={startNetflixExperience} className="w-full bg-white text-black py-2.5 rounded flex items-center justify-center gap-2 text-sm font-bold active:scale-95 transition-transform"><span className="text-base">▶</span> Reproduzir</button>
                        <div className="flex gap-2">
                          <button onClick={() => setIsInList(!isInList)} className={cn("flex-1 bg-[#2a2a2a]/80 backdrop-blur-md border border-white/10 py-2.5 rounded font-bold text-xs flex items-center justify-center gap-2 transition-all", isInList ? "text-[#46d369]" : "text-white")}><span className="text-lg leading-none">{isInList ? "✓" : "+"}</span> Minha lista</button>
                          <button className={cn("w-12 h-11 bg-[#2a2a2a]/80 backdrop-blur-md border border-white/10 rounded flex items-center justify-center transition-all text-white")}><ThumbsUp className="w-5 h-5" /></button>
                          <button className={cn("w-12 h-11 bg-[#2a2a2a]/80 backdrop-blur-md border border-white/10 rounded flex items-center justify-center transition-all text-white")}><Heart className="w-5 h-5" /></button>
                        </div>
                      </div>
                    </div>
                  </section>
                  <div className="px-4 py-4 bg-[#141414]">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-[#1e1e1e] rounded-lg p-3 text-center border border-white/5">
                        <p style={dateStyle} className="text-2xl font-bebas leading-none mb-1">
                          {timeDiff?.years || 0}
                        </p>
                        <p className="text-neutral-500 text-[8px] uppercase tracking-wider font-bold">Anos juntos</p>
                      </div>
                      <div className="bg-[#1e1e1e] rounded-lg p-3 text-center border border-white/5">
                        <p style={dateStyle} className="text-2xl font-bebas leading-none mb-1">
                          {totalDays.toLocaleString('pt-BR')}
                        </p>
                        <p className="text-neutral-500 text-[8px] uppercase tracking-wider font-bold">Dias</p>
                      </div>
                      <div className="bg-[#1e1e1e] rounded-lg p-3 text-center border border-white/5">
                        <p style={dateStyle} className="text-2xl font-bebas leading-none mb-1">
                          {date ? format(date, 'dd/MM') : '06/04'}
                        </p>
                        <p className="text-neutral-500 text-[8px] uppercase tracking-wider font-bold">Desde</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 mt-2 pb-20">
                    <div className="flex gap-8 border-neutral-800 border-b mb-4">
                      <button onClick={() => setActiveTab('episodios' as any)} className={cn("pb-3 text-sm font-bold tracking-tight transition-all", activeTab === ('episodios' as any) ? "border-b-[3px] border-[#e50914] text-white" : "text-neutral-500")}>Episódios</button>
                      <button onClick={() => setActiveTab('detalhes' as any)} className={cn("pb-3 text-sm font-bold tracking-tight transition-all", activeTab === ('detalhes' as any) ? "border-b-[3px] border-[#e50914] text-white" : "text-neutral-500")}>Detalhes</button>
                    </div>
                    {activeTab === ('episodios' as any) ? (
                      <div className="space-y-6">{uploadedPhotos.map((photo, i) => (
                        <div key={i} className="flex gap-3 items-center" onClick={() => { setActiveHeroIndex(i); setIsAudioPlaying(true); }}>
                          <div className="w-32 h-[72px] bg-[#2a2a2a] rounded-md relative overflow-hidden"><Image src={photo} fill className="object-cover" alt={`Ep ${i}`} /></div>
                          <div className="flex-1 min-w-0"><p className="text-xs font-bold text-white mb-0.5">{(i + 1)}. Memória {(i + 1)}</p><p className="text-[10px] text-neutral-500 leading-tight">Capítulo especial da nossa história.</p></div>
                        </div>
                      ))}</div>
                    ) : (
                      <div className="space-y-4 pt-2 animate-in fade-in duration-500">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-baseline gap-2">
                            <span className="text-neutral-500 text-[13px] min-w-[100px]">Data de estreia:</span>
                            <span className="text-neutral-200 text-[13px]">{date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : '10 de maio de 2019'}</span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-neutral-500 text-[13px] min-w-[100px]">Gêneros:</span>
                            <span className="text-neutral-200 text-[13px]">Romance • Drama • Comédia</span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-neutral-500 text-[13px] min-w-[100px]">Referências:</span>
                            <span className="text-neutral-200 text-[13px]">({pageTitle || 'Eternize'})</span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-neutral-500 text-[13px] min-w-[100px]">Direção:</span>
                            <span className="text-neutral-200 text-[13px]">Eternize</span>
                          </div>
                        </div>

                        <div className="pt-8 flex items-center gap-3">
                           <div className="bg-[#E50914] text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm flex flex-col items-center justify-center leading-none h-9 w-9 shrink-0">
                              <span className="text-[7px] mb-0.5">TOP</span>
                              <span className="text-lg">10</span>
                           </div>
                           <span className="text-white text-sm font-black tracking-tight leading-tight uppercase italic italic-shadow">Em alta nos nossos corações</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : selectedTheme === 'spotify' ? (
                <div className="w-full h-full bg-[#121212] text-white font-inter relative flex flex-col no-scrollbar overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 right-0 z-50 px-6 pt-4 pb-2 flex items-center justify-between transition-colors duration-300 pointer-events-none"
                    style={{ backgroundColor: spotifyHeaderOpacity > 0 ? `rgba(18, 18, 18, ${spotifyHeaderOpacity})` : 'transparent' }}
                  >
                    <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                      <circle cx="20" cy="20" r="20" fill="#1DB954"></circle>
                      <path d="M10 26.5 Q20 22 31 24.5" stroke="black" strokeWidth="2.5" strokeLinecap="round" fill="none"></path>
                      <path d="M9 21 Q20 15.5 32 19" stroke="black" strokeWidth="2.5" strokeLinecap="round" fill="none"></path>
                      <path d="M8 15 Q20 8 33 13" stroke="black" strokeWidth="2.5" strokeLinecap="round" fill="none"></path>
                    </svg>
                    <div className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center text-[10px] font-black text-black">EZ</div>
                  </div>

                  <div 
                    className="flex-1 overflow-y-auto no-scrollbar relative"
                    onScroll={(e) => {
                      const scrollTop = e.currentTarget.scrollTop;
                      const opacity = Math.min(1, scrollTop / 100);
                      setSpotifyHeaderOpacity(opacity);
                    }}
                  >
                    <section className="relative h-[400px]">
                      <div className="absolute inset-0">
                        {uploadedPhotos.length > 0 ? (
                          <Image src={uploadedPhotos[activeHeroIndex] || uploadedPhotos[0]} fill className="object-cover" alt="Hero" priority />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#0d4a2a] to-[#121212]" />
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent"></div>
                      <div className="absolute bottom-2 left-6 right-6">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="bg-[#1DB954] w-5 h-5 rounded-full flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />
                          </div>
                          <span className="text-white text-[11px] font-bold">Artista verificado</span>
                        </div>
                        <h1 className="text-white text-5xl font-black leading-[0.9] tracking-tighter mb-1 break-words font-['DM_Sans']">
                          {pageTitle || 'Nossa Playlist'}
                        </h1>
                        <p className="text-neutral-300 text-sm font-bold font-['DM_Sans']">
                          {totalDays.toLocaleString('pt-BR')} dias de história
                        </p>
                      </div>
                    </section>

                    <div className="px-6 py-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded overflow-hidden relative bg-black shrink-0">
                          {uploadedPhotos.length > 0 && <Image src={uploadedPhotos[activeHeroIndex] || uploadedPhotos[0]} fill className="object-cover" alt="" />}
                      </div>
                      <button onClick={() => setIsLiked(!isLiked)} className="border border-neutral-500 rounded-full px-4 py-1.5 text-xs font-bold text-white hover:border-white transition-colors">
                        {isLiked ? 'Seguindo' : 'Seguir'}
                      </button>
                      <button className="text-neutral-400 hover:text-white"><MoreHorizontal className="w-6 h-6" /></button>
                      
                      <div className="flex-1 flex justify-end items-center gap-5">
                        <button className="text-neutral-400 hover:text-white"><Shuffle className="w-6 h-6" /></button>
                        <button 
                          onClick={() => {
                            setIsAudioPlaying(true);
                            setShowSpotifyFullscreen(true);
                          }}
                          className="w-14 h-14 bg-[#1DB954] rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-transform"
                        >
                          <Play className="w-6 h-6 text-black fill-black ml-1" />
                        </button>
                      </div>
                    </div>

                    <div className="px-6 mb-6">
                      <div className="flex gap-8 border-white/5 border-b pb-2">
                          {['Músicas', 'Eventos', 'Loja'].map((tab) => (
                            <button 
                              key={tab}
                              onClick={() => setActiveTab(tab.toLowerCase() as any)} 
                              className="relative"
                            >
                              <span className={cn(
                                "font-bold text-sm transition-colors", 
                                activeTab === tab.toLowerCase() ? "text-white" : "text-neutral-400"
                              )}>{tab}</span>
                              {activeTab === tab.toLowerCase() && <div className="absolute -bottom-[10px] left-0 w-full h-[3px] bg-[#1DB954]"></div>}
                            </button>
                          ))}
                      </div>
                    </div>

                    <div className="px-6 mb-8">
                      <div className="grid grid-cols-3 gap-2">
                          <div className="bg-[#181818] rounded-lg p-3 text-center border border-white/5">
                              <p className="font-black text-xl text-[#1DB954] leading-none mb-1">{timeDiff?.years || 0}</p>
                              <p className="text-[8px] text-neutral-400 uppercase font-bold tracking-wider">Anos juntos</p>
                          </div>
                          <div className="bg-[#181818] rounded-lg p-3 text-center border border-white/5">
                              <p className="font-black text-xl text-[#1DB954] leading-none mb-1">{totalDays.toLocaleString('pt-BR')}</p>
                              <p className="text-[8px] text-neutral-400 uppercase font-bold tracking-wider">Dias de história</p>
                          </div>
                          <div className="bg-[#181818] rounded-lg p-3 text-center border border-white/5">
                              <p className="font-black text-xl text-[#1DB954] leading-none mb-1">{date ? format(date, 'dd/MM') : '06/04'}</p>
                              <p className="text-[8px] text-neutral-400 uppercase font-bold tracking-wider">Desde</p>
                          </div>
                      </div>
                    </div>

                    {activeTab === 'músicas' && (
                      <>
                        <section className="px-6 mb-8">
                          <h2 className="text-white text-xl font-black mb-4 font-['DM_Sans']">Populares</h2>
                          <div className="space-y-1">
                            {uploadedPhotos.length > 0 ? (
                              uploadedPhotos.map((photo, i) => (
                                <div 
                                  key={i} 
                                  className="flex items-center gap-4 group p-2 -mx-2 rounded-md hover:bg-white/10 transition-colors cursor-pointer" 
                                  onClick={() => { 
                                    setActiveHeroIndex(i); 
                                    setIsAudioPlaying(true);
                                    setShowSpotifyFullscreen(true); 
                                  }}
                                >
                                  <div className="w-4 flex justify-center items-center">
                                    <span className="text-neutral-500 text-sm font-bold group-hover:hidden">{i + 1}</span>
                                    <Play className="w-3.5 h-3.5 text-white fill-current hidden group-hover:block" />
                                  </div>
                                  <div className="w-10 h-10 bg-neutral-800 rounded shadow-lg relative overflow-hidden shrink-0">
                                    <Image src={photo} fill className="object-cover" alt="" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-white text-sm font-bold truncate font-['DM_Sans'] tracking-tight">Memória {i + 1}</h3>
                                    <p className="text-neutral-500 text-[11px] font-bold font-['DM_Sans'] truncate">{pageTitle || 'Eternize'}</p>
                                  </div>
                                  <span className="text-neutral-500 text-[11px] font-bold font-['DM_Sans']">2:47</span>
                                </div>
                              ))
                            ) : (
                              <div className="flex items-center gap-4 group p-2 -mx-2 rounded-md hover:bg-white/10 transition-colors cursor-pointer" onClick={() => { setIsAudioPlaying(true); setShowSpotifyFullscreen(true); }}>
                                <div className="w-4 flex justify-center items-center">
                                    <span className="text-neutral-500 text-sm font-bold group-hover:hidden">1</span>
                                    <Play className="w-3.5 h-3.5 text-white fill-current hidden group-hover:block" />
                                </div>
                                <div className="w-10 h-10 bg-neutral-800 rounded shadow-lg shrink-0"></div>
                                <div className="flex-1">
                                  <h3 className="text-white text-sm font-bold font-['DM_Sans'] tracking-tight">Nossa Primeira Música</h3>
                                  <p className="text-neutral-500 text-[11px] font-bold font-['DM_Sans']">{pageTitle || 'Eternize'}</p>
                                </div>
                                <span className="text-neutral-500 text-[11px] font-bold font-['DM_Sans']">2:47</span>
                              </div>
                            )}
                          </div>
                        </section>

                        <section className="px-6 pb-32">
                          <div className="bg-[#181818] rounded-[24px] overflow-hidden flex flex-col shadow-2xl border border-white/5 transition-transform duration-500 hover:scale-[1.01]">
                            <div className="relative aspect-square md:aspect-video w-full">
                              {uploadedPhotos.length > 0 ? (
                                <Image src={uploadedPhotos[activeHeroIndex] || uploadedPhotos[0]} fill className="object-cover" alt="About our history" />
                              ) : (
                                <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                                  <ImageIcon className="w-10 h-10 text-white/10" />
                                </div>
                              )}
                              <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[#181818] via-[#181818]/40 to-transparent" />
                            </div>
                            
                            <div className="p-6 pt-2">
                              <div 
                                className="text-neutral-400 text-sm md:text-base leading-relaxed mb-6 font-['DM_Sans'] font-medium" 
                                dangerouslySetInnerHTML={{ __html: message || 'Nossa história começou de um jeito único e especial. Cada momento ao seu lado é uma nova música na nossa playlist da vida.' }} 
                              />
                              
                              <p className="text-[#1DB954] text-[13px] font-black uppercase tracking-wider font-['DM_Sans']">
                                Juntos desde {date ? format(date, 'dd/MM/yyyy') : '10/04/2026'}
                              </p>
                            </div>
                          </div>
                        </section>
                      </>
                    )}
                  </div>

                  {musicData && !showSpotifyFullscreen && (
                    <div className="absolute bottom-6 left-0 right-0 z-[60] px-3 animate-in slide-in-from-bottom-4 duration-500">
                      <div 
                        className="w-full rounded-xl p-2.5 flex flex-col shadow-2xl border border-white/5 cursor-pointer active:scale-[0.98] transition-all overflow-hidden relative"
                        style={{ backgroundColor: dynamicSpotifyColor }}
                        onClick={() => setShowSpotifyFullscreen(true)}
                      >
                        <div className="flex items-center relative z-10">
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 shadow-lg mr-3 relative">
                              {uploadedPhotos.length > 0 ? (
                                <Image src={uploadedPhotos[activeHeroIndex] || uploadedPhotos[0]} fill className="object-cover" alt="Capa" />
                              ) : musicData.thumb ? (
                                <img src={musicData.thumb} alt="Capa" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-neutral-800 flex items-center justify-center"><Music2 className="w-5 h-5 text-white/20" /></div>
                              )}
                          </div>

                          <div className="flex-1 min-w-0 mr-4">
                              <h4 className="text-white text-[13px] font-bold truncate leading-tight font-['DM_Sans']">
                                  {activeHeroIndex >= 0 && uploadedPhotos[activeHeroIndex] ? `Memória ${activeHeroIndex + 1}` : musicData.title}
                              </h4>
                              <p className="text-[#b3b3b3] text-[12px] font-medium truncate mt-0.5 font-['DM_Sans']">
                                  {pageTitle || 'Eternize'}
                              </p>
                          </div>

                          <div className="flex items-center gap-5 pr-2">
                              <button className="text-white/70 hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M5 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path>
                                      <path d="M2 19a1 1 0 0 1 0-1"></path>
                                      <path d="M2 15a4 4 0 0 1 4 4"></path>
                                      <path d="M2 11a8 8 0 0 1 8 8"></path>
                                  </svg>
                              </button>

                              <button 
                                className="text-white hover:scale-105 active:scale-95 transition-transform" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsAudioPlaying(!isAudioPlaying);
                                }}
                              >
                                  {isAudioPlaying ? (
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                        <rect x="5" y="4" width="4" height="16" rx="1"></rect>
                                        <rect x="15" y="4" width="4" height="16" rx="1"></rect>
                                    </svg>
                                  ) : (
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                  )}
                              </button>
                          </div>
                        </div>
                        
                        <div className="mt-2 w-full h-[2px] bg-white/10 rounded-full overflow-hidden relative z-10">
                          <div className="h-full bg-white w-[45%]" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full min-h-full flex flex-col items-center pt-8 px-5 gap-6">
                  <div 
                    style={showCard ? { backgroundColor: cardColor } : { backgroundColor: 'transparent' }} 
                    className={cn("w-full rounded-[8px] z-20 flex flex-col items-center transition-all duration-300", showCard ? "shadow-[0_15px_35px_rgba(0,0,0,0.5)] p-[12px]" : "p-0", showCard && (photoEffect === 'fan' ? "pb-[25px]" : "pb-[20px]"))}
                  >
                    {titlePosition === 'top' && <div className="w-full text-center mb-4"><span style={titleStyle} className="text-[32px] block px-2 tracking-[1px] leading-relaxed break-words">{pageTitle || "Seu Nome"}</span></div>}
                    
                    <div className="w-full aspect-square relative shadow-[inset_0_0_15px_rgba(0,0,0,0.2)] rounded-[4px] overflow-hidden">
                      {uploadedPhotos.length > 0 ? (
                        <Swiper
                          key={photoEffect} 
                          effect={photoEffect === 'slide' ? 'slide' : photoEffect === 'coverflow' ? 'coverflow' : 'creative'}
                          grabCursor={true}
                          centeredSlides={true}
                          slidesPerView={1}
                          loop={true}
                          speed={photoEffect === 'fan' ? 600 : 450}
                          autoplay={{ delay: 3000, disableOnInteraction: false }}
                          modules={[EffectCoverflow, EffectCreative, Autoplay]}
                          watchSlidesProgress={true}
                          className={cn("w-full h-full", photoEffect === 'fan' && "fan-swiper")}
                          coverflowEffect={photoEffect === 'coverflow' ? {
                            rotate: 30,
                            stretch: 0,
                            depth: 100,
                            modifier: 1,
                            slideShadows: true,
                          } : undefined}
                          creativeEffect={photoEffect === 'fan' ? {
                            limitProgress: 4,
                            prev: {
                              translate: [0, "-120%", -500],
                              rotate: [0, 0, 15],
                              opacity: 0,
                            },
                            next: {
                              translate: ["15%", 0, -150],
                              rotate: [0, 0, 5],
                              scale: 0.85,
                              opacity: 1,
                            },
                          } : undefined}
                        >
                          {uploadedPhotos.map((photo, i) => (
                            <SwiperSlide key={i}>
                              <div className="w-full h-full relative">
                                <Image src={photo} fill className="object-cover" alt="" priority />
                              </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#f5f5f5] rounded-[4px]">
                          <ImageIcon className="w-12 h-12 text-black/10" />
                          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-black/10">Sua Foto</span>
                        </div>
                      )}
                    </div>
                    
                    {titlePosition === 'bottom' && <div className="w-full text-center mt-3"><span style={titleStyle} className="text-[32px] block px-2 tracking-[1px] leading-relaxed break-words">{pageTitle || "Seu Nome"}</span></div>}
                  </div>
                  
                  {message && (
                    <div className="w-full px-2 mt-2">
                      <div 
                        style={{ color: messageColor, fontFamily: getFontFamily(messageFont || 'inter') }} 
                        className="text-center text-lg md:text-xl leading-relaxed font-medium" 
                        dangerouslySetInnerHTML={{ __html: message }} 
                      />
                    </div>
                  )}

                  {date && (
                    <div className="w-full py-4 flex flex-col items-center">
                      {selectedCountStyle === 'padrao' && (
                        <div className="w-full flex flex-col items-center">
                          <div className="text-[#888] text-[14px] font-bold uppercase tracking-[4px] mb-8 text-center">
                            UAU, ESTÃO JUNTOS HÁ
                          </div>

                          <div 
                            style={{ backgroundColor: dateBoxBgColor, borderColor: dateBoxBorderColor }} 
                            className="border rounded-[20px] overflow-hidden w-full max-w-[360px] shadow-2xl"
                          >
                            <div className="grid grid-cols-3 relative h-[200px]">
                              <div className="absolute top-1/2 left-[5%] right-[5%] h-px bg-[#333]/40 -translate-y-1/2 z-0" />
                              
                              <div className="absolute left-[33.33%] top-[15%] bottom-[15%] w-px bg-[#333]/40 z-0" />
                              <div className="absolute left-[66.66%] top-[15%] bottom-[15%] w-px bg-[#333]/40 z-0" />

                              {[
                                { val: timeDiff?.years || 0, label: 'ANOS' },
                                { val: timeDiff?.months || 0, label: 'MESES' },
                                { val: timeDiff?.days || 0, label: 'DIAS' },
                                { val: timeDiff?.hours || 0, label: 'HORAS' },
                                { val: timeDiff?.minutes || 0, label: 'MINUTOS' },
                                { val: timeDiff?.seconds || 0, label: 'SEGUNDOS' },
                              ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center justify-center relative z-10 h-[100px]">
                                  <div 
                                    style={dateStyle} 
                                    className={cn(
                                      "text-[42px] italic leading-none mb-1 tabular-nums",
                                      !dateIsBold && "font-normal"
                                    )}
                                  >
                                    {item.val.toString().padStart(2, '0')}
                                  </div>
                                  <div className="text-[#777] text-[11px] font-bold uppercase tracking-[2px]">
                                    {item.label}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="text-[#555] text-[14px] mt-8 text-center font-medium">
                            Desde {format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </div>
                        </div>
                      )}

                      {selectedCountStyle === 'data-grande' && (
                        <div className="w-full flex flex-col items-center">
                          <div className="text-[#888] text-[14px] font-bold uppercase tracking-[4px] mb-[20px] text-center">
                            UAU, ESTÃO JUNTOS HÁ
                          </div>
                          
                          <div 
                            style={{ backgroundColor: dateBoxBgColor, borderColor: dateBoxBorderColor }} 
                            className="border rounded-[15px] py-[15px] px-[10px] flex justify-center items-center w-full max-w-[360px] shadow-2xl"
                          >
                            {[
                              { val: timeDiff?.years || 0, label: 'Anos' },
                              { val: timeDiff?.months || 0, label: 'Meses' },
                              { val: timeDiff?.days || 0, label: 'Dias' },
                            ].map((item, i, arr) => (
                              <div key={i} className="flex flex-col items-center justify-center flex-1 relative">
                                <div 
                                  style={dateStyle} 
                                  className={cn(
                                    "text-[48px] italic leading-none mb-[5px] tabular-nums",
                                    !dateIsBold && "font-normal"
                                  )}
                                >
                                  {item.val.toString().padStart(2, '0')}
                                </div>
                                <div className="text-[#666] text-[10px] font-black uppercase tracking-[2px]">
                                  {item.label}
                                </div>
                                {i < arr.length - 1 && (
                                  <div className="absolute right-0 top-[15%] bottom-[15%] w-px bg-[#333]/40" />
                                )}
                              </div>
                            ))}
                          </div>

                          <div className="text-[#555] text-[13px] mt-[20px] text-center font-medium">
                            Desde {format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </div>
                        </div>
                      )}

                      {selectedCountStyle === 'dias-grandes' && (
                        <div className="w-full flex flex-col items-center">
                          <div className="text-[#888] text-[14px] font-bold uppercase tracking-[4px] mb-[25px] text-center">
                            UAU, ESTÃO JUNTOS HÁ
                          </div>
                          
                          <div 
                            style={{ backgroundColor: dateBoxBgColor, borderColor: dateBoxBorderColor }} 
                            className="border rounded-[20px] py-[25px] px-[20px] flex flex-col items-center justify-center w-full max-w-[280px] shadow-2xl"
                          >
                            <div 
                              style={dateStyle} 
                              className={cn(
                                "text-[64px] italic leading-none mb-[10px] tabular-nums",
                                !dateIsBold && "font-normal"
                              )}
                            >
                              {totalDays.toLocaleString('pt-BR')}
                            </div>
                            <div className="text-[#666] text-[10px] font-black uppercase tracking-[4px]">
                              Dias
                            </div>
                          </div>

                          <div className="text-[#555] text-[14px] mt-[25px] text-center font-medium">
                            Desde {format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {musicData && selectedTheme === 'classic' && (
                    <div className="w-full px-1 mt-4">
                      <MusicPlayer 
                        musicData={musicData} 
                        musicBoxColor={musicBoxColor} 
                        musicTextColor={musicTextColor} 
                        musicHasNeon={musicHasNeon} 
                        musicNeonStrength={musicNeonStrength} 
                        isAutoPlay={isAudioPlaying}
                        onStateChange={(playing) => setIsAudioPlaying(playing)}
                      />
                    </div>
                  )}

                  {isPackEnabled && selectedTheme === 'classic' && (
                    <div className="w-full px-5 mt-10 pb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                      <div className="text-center mb-8">
                        <h3 
                          style={{ fontFamily: getFontFamily(titleFont || 'dancing-script'), color: messageColor }} 
                          className="text-2xl opacity-80"
                        >
                          Para você
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {PACK_MODULES.map((mod) => (
                          <div 
                            key={mod.id}
                            className="bg-white rounded-2xl p-1 shadow-lg overflow-hidden border border-black/5 active:scale-95 transition-transform"
                          >
                            <div 
                              className="aspect-[4/3] rounded-t-xl flex items-center justify-center relative overflow-hidden"
                              style={{ backgroundColor: mod.bgColor }}
                            >
                              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-white" />
                              <mod.icon className="w-8 h-8 relative z-10" style={{ color: mod.iconColor }} />
                            </div>
                            <div className="py-2.5 bg-white text-center border-t border-black/5">
                              <span className="text-[11px] font-black text-neutral-800 uppercase tracking-tight">{mod.label}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="h-20 shrink-0" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
