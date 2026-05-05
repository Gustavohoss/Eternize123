'use client';

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Lock, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { intervalToDuration } from 'date-fns';
import { MusicPlayer } from './music-player';
import { SparklesCore } from '@/components/ui/sparkles';
import { SmokeBackground } from '@/components/ui/spooky-smoke-animation';
import { FallingPattern } from '@/components/ui/falling-pattern';
import { ThemeId } from '@/app/criador/constants';
import { MemoriesModulePreview } from './memories-module-preview';
import { AchievementsModulePreview } from './achievements-module-preview';
import { CuriosidadesModulePreview } from './curiosidades-module-preview';
import { RouletteModulePreview } from './roulette-module-preview';
import { Button } from '@/components/ui/button';
import { type JourneyPoint } from './journey-module-preview';

// Importação dinâmica para evitar erros de SSR com Leaflet
const JourneyModulePreview = dynamic(
  () => import('./journey-module-preview').then(mod => mod.JourneyModulePreview),
  { ssr: false, loading: () => <div className="flex-1 bg-black flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div></div> }
);

// Theme-specific view components
import { ClassicView } from './themes/classic-view';
import { NetflixView } from './themes/netflix-view';
import { SpotifyView } from './themes/spotify-view';
import { InstagramView } from './themes/instagram-view';
import { StoriesView } from './themes/stories-view';

interface DeviceMockupProps {
  selectedTheme?: ThemeId;
  selectedBgColor: string;
  selectedEffect: string;
  isEmojiRainEnabled: boolean;
  selectedEmojis: string[];
  emojiSize: number;
  emojiRainPosition?: 'behind' | 'front';
  uploadedPhotos: string[];
  pageTitle: string;
  message?: string;
  musicData?: any;
  date?: Date;
  selectedCountStyle: string;
  photoEffect?: 'slide' | 'coverflow' | 'fan';
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
  step?: string;
  memories?: any[];
  journeyPoints?: JourneyPoint[];
  activeModuleId?: string | null;
}

export function DeviceMockup({
  selectedTheme = 'classic',
  selectedBgColor,
  selectedEffect,
  isEmojiRainEnabled,
  selectedEmojis,
  emojiSize,
  emojiRainPosition = 'behind',
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
  isPackEnabled = false,
  memories = [],
  journeyPoints = [],
  activeModuleId = null
}: DeviceMockupProps) {
  
  // Shared State
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [timeDiff, setTimeDiff] = useState<any>(null);
  const [previewModuleId, setPreviewModuleId] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(isAutoPlay);
  const [activeTab, setActiveTab] = useState<string>('grid');

  // Sincroniza a abertura do módulo com o comando externo (editor)
  useEffect(() => {
    if (activeModuleId !== undefined) {
      setPreviewModuleId(activeModuleId);
    }
  }, [activeModuleId]);

  // Animation/Experience States
  const [isIntroActive, setIsIntroActive] = useState(false);
  const [introPhase, setIntroPhase] = useState<'idle' | 'closing' | 'logo' | 'fading'>('idle');
  const [showStories, setShowStories] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isStoryPaused, setIsStoryPaused] = useState(false);
  const [isFading, setIsFading] = useState(false);

  // Theme Specific States
  const [showSpotifyFullscreen, setShowSpotifyFullscreen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isInList, setIsInList] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showInstagramPost, setShowInstagramPost] = useState(false);
  const [selectedPostIndex, setSelectedPostIndex] = useState(0);
  const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({});
  const [savedPosts, setSavedPosts] = useState<Record<number, boolean>>({});
  const [dynamicSpotifyColor, setDynamicSpotifyColor] = useState('#1a0a0a');
  const [spotifyHeaderOpacity, setSpotifyHeaderOpacity] = useState(0);

  // Sync isAudioPlaying with isAutoPlay prop
  useEffect(() => { setIsAudioPlaying(isAutoPlay); }, [isAutoPlay]);

  // Sync Active Tab based on theme
  useEffect(() => {
    if (selectedTheme === 'spotify') setActiveTab('músicas');
    else if (selectedTheme === 'instagram') setActiveTab('grid');
    else setActiveTab('episodios');
  }, [selectedTheme]);

  // Date Logic
  useEffect(() => {
    if (!date) { setTimeDiff(null); return; }
    const updateCounter = () => {
      const now = new Date();
      if (now < date) { setTimeDiff({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      const duration = intervalToDuration({ start: date, end: now });
      setTimeDiff({ years: duration.years || 0, months: duration.months || 0, days: duration.days || 0, hours: duration.hours || 0, minutes: duration.minutes || 0, seconds: duration.seconds || 0 });
    };
    updateCounter();
    const interval = setInterval(updateCounter, 1000);
    return () => clearInterval(interval);
  }, [date]);

  const totalDays = useMemo(() => {
    if (!date) return 0;
    const now = new Date();
    if (now < date) return 0;
    return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  }, [date]);

  const formattedTotalDays = useMemo(() => {
    if (totalDays >= 1000) return (totalDays / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + 'K';
    return totalDays.toLocaleString('pt-BR');
  }, [totalDays]);

  // Font Helpers
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

  // Story Logic
  const triggerFade = useCallback((callback: () => void) => {
    setIsFading(true);
    setTimeout(() => { callback(); setIsFading(false); }, 800);
  }, []);

  const nextStory = useCallback(() => {
    if (isFading) return;
    if (currentStoryIndex < uploadedPhotos.length - 1) triggerFade(() => { setCurrentStoryIndex(prev => prev + 1); setStoryProgress(0); });
    else setShowStories(false);
  }, [uploadedPhotos.length, currentStoryIndex, triggerFade, isFading]);

  const prevStory = useCallback(() => {
    if (isFading) return;
    if (currentStoryIndex > 0) triggerFade(() => { setCurrentStoryIndex(prev => prev - 1); setStoryProgress(0); });
  }, [currentStoryIndex, triggerFade, isFading]);

  useEffect(() => {
    if (!showStories || uploadedPhotos.length === 0 || isStoryPaused || isFading) return;
    const intervalTime = 50; const duration = 5000; const step = (intervalTime / duration) * 100;
    const timer = setInterval(() => {
      setStoryProgress(prev => { if (prev >= 100) { nextStory(); return 0; } return prev + step; });
    }, intervalTime);
    return () => clearInterval(timer);
  }, [showStories, nextStory, uploadedPhotos.length, isStoryPaused, isFading]);

  // Dynamic Styles
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

  // Curtain Bars generation
  const curtainBars = useMemo(() => {
    const count = 30;
    return Array.from({ length: count }).map((_, i) => {
      const r = Math.floor(26 + (i * (192 / count)));
      return {
        color: `rgb(${r}, 0, 0)`,
        delay: `${i * 0.02}s`
      };
    });
  }, []);

  const handleStartNetflixExperience = useCallback(() => {
    setIsIntroActive(true);
    setIntroPhase('closing');
    
    // Logo aparece após o fechamento das barras
    setTimeout(() => {
      setIntroPhase('logo');
    }, 1600);

    // Inicia os stories após a animação completa
    setTimeout(() => {
      setIsIntroActive(false);
      setIntroPhase('idle');
      setShowStories(true);
      setCurrentStoryIndex(0);
      setStoryProgress(0);
    }, 4500);
  }, []);

  return (
    <div className={cn("w-full transition-all duration-500 flex flex-col relative", isFullscreen ? "h-full" : "max-w-[400px] mx-auto")}>
      {musicData && (
        <MusicPlayer musicData={musicData} isAutoPlay={isAudioPlaying} hideUI={selectedTheme !== 'classic'} onStateChange={setIsAudioPlaying} />
      )}

      {/* Intro Animation Layer (Eternize Effect) */}
      {isIntroActive && (
        <div className="absolute inset-0 z-[1000] bg-black flex items-center justify-center overflow-hidden">
           <div className={cn("curtain-container", introPhase !== 'idle' && "curtain-active")}>
             {curtainBars.map((bar, i) => (
               <div 
                 key={i} 
                 className="curtain-bar" 
                 style={{ backgroundColor: bar.color, transitionDelay: bar.delay }}
               />
             ))}
           </div>
           
           <div className="curtain-overlay"></div>
           
           <h1 className={cn(
             "curtain-logo-text", 
             introPhase === 'logo' && "curtain-logo-visible"
           )}>
             ETERNIZE
           </h1>
        </div>
      )}

      {/* Stories Layer */}
      {showStories && (
        <StoriesView 
          photos={uploadedPhotos} 
          currentIndex={currentStoryIndex} 
          progress={storyProgress} 
          isPaused={isStoryPaused} 
          isFading={isFading} 
          pageTitle={pageTitle} 
          formattedDays={formattedTotalDays} 
          onClose={() => setShowStories(false)} 
          onPrev={prevStory} 
          onNext={nextStory} 
          onPauseToggle={setIsStoryPaused}
          theme={selectedTheme}
        />
      )}

      {!isFullscreen && (
        <div className="bg-white border-x border-t border-neutral-200 p-2.5 flex items-center justify-center shrink-0 rounded-t-2xl">
          <div className="bg-neutral-100 rounded-full h-8 w-full flex items-center px-4 gap-2 border border-neutral-200 max-w-[400px]">
            <Lock className="w-3 h-3 text-neutral-400" />
            <div className="text-[11px] text-neutral-600 font-medium truncate">eternizee.shop/site/{slugifiedTitle || 'seu-nome'}</div>
          </div>
        </div>
      )}

      <div className={cn("relative bg-black border-white/10 shadow-2xl flex-1 overflow-hidden no-scrollbar flex flex-col", isFullscreen ? "rounded-none" : "rounded-b-[2.5rem] aspect-[9/19] border-x border-b")}>
        <div className="absolute inset-0 transition-colors duration-500" style={{ backgroundColor: (selectedTheme === 'instagram') ? '#000000' : (selectedTheme === 'netflix' || selectedTheme === 'spotify') ? '#121212' : selectedBgColor }}>
          
          {/* Effects Layers */}
          {isEmojiRainEnabled && (
            <div className={cn("absolute inset-0 pointer-events-none overflow-hidden", emojiRainPosition === 'front' ? "z-[100]" : "z-[15]")}>
              {[...Array(15)].map((_, i) => (
                <span key={i} className="absolute animate-fall" style={{ left: `${Math.random() * 100}%`, top: `-${Math.random() * 200}px`, animationDuration: `${3 + Math.random() * 4}s`, animationDelay: `${Math.random() * 5}s`, fontSize: `${emojiSize}px`, opacity: 0.8 }}>{selectedEmojis[i % selectedEmojis.length]}</span>
              ))}
            </div>
          )}
          {selectedEffect === 'sparkles' && selectedTheme === 'classic' && <div className="absolute inset-0 pointer-events-none z-10"><SparklesCore background="transparent" minSize={0.4} maxSize={1.2} particleDensity={sparklesDensity} className="w-full h-full" particleColor={sparklesColor} speed={sparklesSpeed} /></div>}
          {selectedEffect === 'smoke' && selectedTheme === 'classic' && <div className="absolute inset-0 pointer-events-none z-10"><SmokeBackground smokeColor={smokeColor} backgroundColor={selectedBgColor} intensity={smokeIntensity} /></div>}
          {selectedEffect === 'pattern' && selectedTheme === 'classic' && <div className="absolute inset-0 pointer-events-none z-10 opacity-40"><FallingPattern color={patternColor} backgroundColor="transparent" density={patternDensity} duration={patternDuration} className="p-0" /></div>}

          {/* Theme Viewport */}
          <div className="absolute inset-0 flex flex-col items-center overflow-y-auto no-scrollbar z-20">
            <div className={cn("w-full flex flex-col items-center min-h-full", isFullscreen && "max-w-[480px]")}>
              {selectedTheme === 'classic' && (
                <ClassicView {...{uploadedPhotos, photoEffect, showCard, cardColor, titlePosition, pageTitle, titleStyle, message, messageColor, messageFontFamily: getFontFamily(messageFont || 'inter'), date, selectedCountStyle, dateStyle, dateIsBold, dateBoxBgColor, dateBoxBorderColor, timeDiff, totalDays, musicData, musicBoxColor, musicTextColor, musicHasNeon, musicNeonStrength, isAudioPlaying, onAudioToggle: setIsAudioPlaying, isPackEnabled, onModuleClick: setPreviewModuleId}} />
              )}
              {selectedTheme === 'netflix' && (
                <NetflixView {...{uploadedPhotos, activeHeroIndex, pageTitle, titleStyle, date, message, timeDiff, totalDays, dateStyle, activeTab, onTabChange: setActiveTab, onStartExperience: handleStartNetflixExperience, onPhotoClick: setActiveHeroIndex, isInList, onListToggle: () => setIsInList(!isInList), isPackEnabled, onModuleClick: setPreviewModuleId}} />
              )}
              {selectedTheme === 'spotify' && (
                <SpotifyView {...{uploadedPhotos, activeHeroIndex, pageTitle, totalDays, timeDiff, date, activeTab, onTabChange: setActiveTab, onPhotoClick: (i) => { setActiveHeroIndex(i); setShowSpotifyFullscreen(true); }, isLiked, onLikeToggle: () => setIsLiked(!isLiked), isAudioPlaying, onAudioToggle: setIsAudioPlaying, dynamicSpotifyColor, spotifyHeaderOpacity, onHeaderScroll: (e) => setSpotifyHeaderOpacity(Math.min(1, e.currentTarget.scrollTop / 100)), onShowFullscreen: () => setShowSpotifyFullscreen(true), onCloseFullscreen: () => setShowSpotifyFullscreen(false), showSpotifyFullscreen, message, musicData}} />
              )}
              {selectedTheme === 'instagram' && (
                <InstagramView {...{uploadedPhotos, pageTitle, totalDays, timeDiff, date, message, musicData, isFollowing, onFollowToggle: () => setIsFollowing(!isFollowing), activeTab, onTabChange: setActiveTab, onStartStories: () => { setShowStories(true); setCurrentStoryIndex(0); setStoryProgress(0); }, onPostClick: (i) => { setSelectedPostIndex(i); setShowInstagramPost(true); }, showPostDetail: showInstagramPost, selectedPostIndex, onClosePost: () => setShowInstagramPost(false), likedPosts, onLikePost: (i) => setLikedPosts(prev => ({...prev, [i]: !prev[i]})), savedPosts, onSavePost: (i) => setSavedPosts(prev => ({...prev, [i]: !prev[i]})), isAudioPlaying, onAudioToggle: setIsAudioPlaying}} />
              )}
            </div>
          </div>

          {/* Module Overlay (Interno ao Mockup) */}
          {previewModuleId && (
            <div className="absolute inset-0 z-[500] bg-black flex flex-col animate-in slide-in-from-bottom-4 duration-500 overflow-hidden">
               <div className="relative h-full flex flex-col">
                  <div className="absolute top-6 right-6 z-[550]">
                    <Button 
                      onClick={() => setPreviewModuleId(null)}
                      className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:bg-black/80 flex items-center justify-center text-white shadow-2xl transition-all active:scale-95"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="flex-1 overflow-y-auto no-scrollbar custom-scroll">
                     {previewModuleId === 'memorias' && <MemoriesModulePreview memories={memories} />}
                     {previewModuleId === 'conquistas' && <AchievementsModulePreview />}
                     {previewModuleId === 'curiosidades' && <CuriosidadesModulePreview date={date} />}
                     {previewModuleId === 'jornada' && <JourneyModulePreview points={journeyPoints} />}
                     {previewModuleId === 'surpresa' && <RouletteModulePreview />}
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
