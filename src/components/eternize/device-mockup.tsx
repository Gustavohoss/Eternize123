'use client';

import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Lock, X, Play, Heart, Sparkles as SparkleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { intervalToDuration } from 'date-fns';
import { MusicPlayer, type MusicPlayerRef } from './music-player';
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
import { SpotifyWrappedView } from './themes/spotify-wrapped-view';

interface DeviceMockupProps {
  senderName?: string;
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
  rouletteItems?: string[];
  activeModuleId?: string | null;
  spotifyCardPhoto?: string;
}

export function DeviceMockup({
  senderName = '',
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
  rouletteItems = [],
  activeModuleId = null,
  spotifyCardPhoto = ''
}: DeviceMockupProps) {
  
  // Shared State
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [timeDiff, setTimeDiff] = useState<any>(null);
  const [previewModuleId, setPreviewModuleId] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('grid');
  const [hasStarted, setHasStarted] = useState(false);

  // Refs
  const musicPlayerRef = useRef<MusicPlayerRef>(null);

  // Sincroniza a abertura do módulo com o comando externo (editor)
  useEffect(() => {
    if (activeModuleId !== undefined) {
      setPreviewModuleId(activeModuleId);
    }
  }, [activeModuleId]);

  // Animation/Experience States
  const [showStories, setShowStories] = useState(false);
  const [showSpotifyWrapped, setShowSpotifyWrapped] = useState(false);
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
  const [spotifyHeaderOpacity, setSpotifyHeaderOpacity] = useState(0);

  // Inicializa o estado de áudio baseado no config se estiver no editor
  useEffect(() => {
    if (!isFullscreen) {
      setIsAudioPlaying(isAutoPlay || false);
    }
  }, [isAutoPlay, isFullscreen]);

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
    return () => clearInterval(interval);
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

  const handleStartExperience = () => {
    setHasStarted(true);
    setIsAudioPlaying(true);
    
    // Tenta tocar através da prop isAutoPlay e também forçando via ref
    setTimeout(() => {
      if (musicPlayerRef.current) {
        musicPlayerRef.current.play();
      }
    }, 100);
  };

  return (
    <div className={cn("w-full transition-all duration-500 flex flex-col relative", isFullscreen ? "h-full" : "max-w-[400px] mx-auto")}>
      
      {/* Gatilho de interação para o site publicado */}
      {isFullscreen && !hasStarted && (
        <div className="absolute inset-0 z-[2000] bg-[#0c0c0c] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500 overflow-hidden">
           {selectedTheme === 'spotify' ? (
             <div className="w-full h-full flex flex-col items-center justify-center relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(29,185,84,0.12)_0%,transparent_60%)] pointer-events-none" />
                
                <div className="max-w-[320px] flex flex-col items-center relative z-10">
                   <div className="flex flex-col items-center gap-2 mb-12">
                      <h2 className="text-white text-3xl md:text-4xl font-black tracking-tight leading-none font-['DM_Sans']">
                        {senderName || 'Alguém'} separou
                      </h2>
                      <h2 className="text-white text-3xl md:text-4xl font-black tracking-tight leading-none font-['DM_Sans']">
                        um
                      </h2>
                      
                      <div className="mt-4 flex flex-col items-center">
                         <h2 className="text-[#1DB954] text-[52px] md:text-[60px] font-black tracking-tighter leading-[0.85] uppercase italic font-['DM_Sans']">
                           presente
                         </h2>
                         <h2 className="text-[#1DB954] text-[52px] md:text-[60px] font-black tracking-tighter leading-[0.85] uppercase italic font-['DM_Sans']">
                           especial!
                         </h2>
                      </div>
                   </div>

                   <p className="text-white/30 text-[11px] font-black leading-relaxed max-w-[260px] mb-14 uppercase tracking-[0.2em] font-['DM_Sans']">
                      Um momento único feito com carinho para celebrar a jornada de vocês
                   </p>
                   
                   <button 
                     onClick={handleStartExperience}
                     className="bg-[#1DB954] text-black px-16 py-5 rounded-full text-base font-black tracking-tight hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(0,0,0,0.5)] border-none cursor-pointer"
                   >
                     Ver Presente
                   </button>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-10">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.485 17.303c-.215.354-.674.464-1.028.249-2.855-1.745-6.446-2.137-10.68-1.168-.406.094-.813-.162-.907-.568-.094-.406.162-.813.568-.907 4.636-1.06 8.59-.61 11.798 1.346.354.215.464.674.249 1.028zm1.464-3.262c-.272.441-.832.578-1.273.307-3.266-2.008-8.245-2.593-12.106-1.42-.496.149-1.02-.132-1.169-.628-.149-.496.132-1.02.628-1.169 4.412-1.34 9.9-1.01 13.64 1.288.441.272.578.832.307 1.273zm.126-3.415c-3.916-2.325-10.374-2.54-14.135-1.4c-.6.182-1.23-.165-1.413-.765-.182-.6.165-1.23.765-1.413 4.316-1.309 11.434-1.05 15.938 1.623.54.32.716 1.014.396 1.554-.32.54-1.014.716-1.554.396z"/>
                   </svg>
                </div>
             </div>
           ) : (
             <>
               <div className="absolute inset-0 bg-hero-glow opacity-30 pointer-events-none" />
               <div className="relative z-10 space-y-8 max-w-sm">
                  <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                     <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                     <div className="relative bg-primary/10 border border-primary/20 rounded-full p-6 shadow-[0_0_50px_rgba(225,29,72,0.3)]">
                        <Heart className="w-10 h-10 text-primary fill-primary animate-pulse" />
                     </div>
                  </div>
                  <div className="space-y-3">
                     <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">PARA VOCÊ<span className="text-primary">.</span></h2>
                     <p className="text-white/40 text-sm font-medium leading-relaxed">Prepare-se para uma surpresa especial. Ligue o som para uma experiência completa.</p>
                  </div>
                  <Button onClick={handleStartExperience} className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-3">Dar o Play ❤️ <Play className="w-4 h-4 fill-current" /></Button>
               </div>
             </>
           )}
        </div>
      )}

      {/* Renderiza a estrutura básica sempre, mas controla a visibilidade do conteúdo principal */}
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
          
          {/* O conteúdo do site agora é montado sempre, mas fica invisível se estiver no full-screen e não tiver começado */}
          <div className={cn("absolute inset-0 flex flex-col items-center overflow-y-auto no-scrollbar z-20 transition-opacity duration-700", isFullscreen && !hasStarted ? "opacity-0 invisible pointer-events-none" : "opacity-100 visible")}>
            
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

            <div className={cn("w-full flex flex-col items-center min-h-full", isFullscreen && "max-w-[480px]")}>
              {selectedTheme === 'classic' && (
                <ClassicView {...{uploadedPhotos, photoEffect, showCard, cardColor, titlePosition, pageTitle, titleStyle, message, messageColor, messageFontFamily: getFontFamily(messageFont || 'inter'), date, selectedCountStyle, dateStyle, dateIsBold, dateBoxBgColor, dateBoxBorderColor, timeDiff, totalDays, isPackEnabled, onModuleClick: setPreviewModuleId}} />
              )}
              {selectedTheme === 'netflix' && (
                <NetflixView {...{uploadedPhotos, activeHeroIndex, pageTitle, titleStyle, date, message, timeDiff, totalDays, dateStyle, activeTab, onTabChange: setActiveTab, onStartExperience: () => setShowStories(true), onPhotoClick: setActiveHeroIndex, isInList, onListToggle: () => setIsInList(!isInList), isPackEnabled, onModuleClick: setPreviewModuleId}} />
              )}
              {selectedTheme === 'spotify' && (
                <SpotifyView {...{uploadedPhotos, activeHeroIndex, pageTitle, totalDays, timeDiff, date, activeTab, onTabChange: setActiveTab, onPhotoClick: (i) => { setActiveHeroIndex(i); setShowSpotifyFullscreen(true); }, isLiked, onLikeToggle: () => setIsLiked(!isLiked), isAudioPlaying, onAudioToggle: setIsAudioPlaying, dynamicSpotifyColor: '#121212', spotifyHeaderOpacity, onHeaderScroll: (e) => setSpotifyHeaderOpacity(Math.min(1, e.currentTarget.scrollTop / 100)), onShowFullscreen: () => setShowSpotifyFullscreen(true), onCloseFullscreen: () => setShowSpotifyFullscreen(false), showSpotifyFullscreen, message, isPackEnabled, onModuleClick: setPreviewModuleId, spotifyCardPhoto, onStartWrapped: () => setShowSpotifyWrapped(true), musicData}} />
              )}
              {selectedTheme === 'instagram' && (
                <InstagramView {...{uploadedPhotos, pageTitle, totalDays, timeDiff, date, message, isFollowing, onFollowToggle: () => setIsFollowing(!isFollowing), activeTab, onTabChange: setActiveTab, onStartStories: () => { setShowStories(true); setCurrentStoryIndex(0); setStoryProgress(0); }, onPostClick: (i) => { setSelectedPostIndex(i); setShowInstagramPost(true); }, showPostDetail: showInstagramPost, selectedPostIndex, onClosePost: () => setShowInstagramPost(false), likedPosts, onLikePost: (i) => setLikedPosts(prev => ({...prev, [i]: !prev[i]})), savedPosts, onSavePost: (i) => setSavedPosts(prev => ({...prev, [i]: !prev[i]})), isAudioPlaying, onAudioToggle: setIsAudioPlaying, isPackEnabled, onModuleClick: setPreviewModuleId}} />
              )}
            </div>
          </div>

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

          {/* Spotify Wrapped Intro Layer */}
          {showSpotifyWrapped && (
            <SpotifyWrappedView 
              pageTitle={pageTitle}
              totalDays={totalDays}
              photos={uploadedPhotos}
              onClose={() => setShowSpotifyWrapped(false)}
              onComplete={() => setShowSpotifyWrapped(false)}
            />
          )}

          {/* MUSIC PLAYER - Renderizado fora para inicializar, mas visível apenas quando começado */}
          {musicData && (
            <div className={cn("absolute bottom-6 left-4 right-4 z-[100] transition-all duration-700", isFullscreen && !hasStarted ? "opacity-0 invisible pointer-events-none" : "opacity-100 visible animate-in slide-in-from-bottom-4")}>
               <MusicPlayer 
                 ref={musicPlayerRef}
                 musicData={musicData} 
                 musicBoxColor={selectedTheme === 'classic' ? musicBoxColor : 'rgba(12,12,12,0.9)'}
                 musicTextColor={selectedTheme === 'classic' ? musicTextColor : '#ffffff'}
                 musicHasNeon={selectedTheme === 'classic' ? musicHasNeon : false}
                 musicNeonStrength={musicNeonStrength}
                 isAutoPlay={isAudioPlaying}
                 onStateChange={setIsAudioPlaying}
               />
            </div>
          )}

          {/* Module Overlay */}
          {previewModuleId && (
            <div className="absolute inset-0 z-[500] bg-black flex flex-col animate-in slide-in-from-bottom-4 duration-500 overflow-hidden">
               <div className="relative h-full flex flex-col">
                  <div className="absolute top-6 right-6 z-[550]">
                    <Button onClick={() => setPreviewModuleId(null)} className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:bg-black/80 flex items-center justify-center text-white shadow-2xl transition-all active:scale-90"><X className="w-5 h-5" /></Button>
                  </div>
                  <div className="flex-1 overflow-y-auto no-scrollbar custom-scroll">
                     {previewModuleId === 'memorias' && <MemoriesModulePreview memories={memories} />}
                     {previewModuleId === 'conquistas' && <AchievementsModulePreview />}
                     {previewModuleId === 'curiosidades' && <CuriosidadesModulePreview date={date} />}
                     {previewModuleId === 'jornada' && <JourneyModulePreview points={journeyPoints} />}
                     {previewModuleId === 'surpresa' && <RouletteModulePreview items={rouletteItems} />}
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}