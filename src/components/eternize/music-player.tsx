
'use client';

import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Music2, ChevronDown, Volume2, Play, Pause, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface MusicPlayerProps {
  musicData?: {
    id: string;
    title: string;
    thumb: string;
  };
  musicBoxColor?: string;
  musicTextColor?: string;
  musicHasNeon?: boolean;
  musicNeonStrength?: number;
  isAutoPlay?: boolean;
  hideUI?: boolean;
  onStateChange?: (isPlaying: boolean) => void;
}

export interface MusicPlayerRef {
  play: () => void;
  pause: () => void;
  toggle: () => void;
}

export const MusicPlayer = forwardRef<MusicPlayerRef, MusicPlayerProps>(({ 
  musicData,
  musicBoxColor = '#0e0e0e',
  musicTextColor = '#ffffff',
  musicHasNeon = false,
  musicNeonStrength = 15,
  isAutoPlay = false,
  hideUI = false,
  onStateChange
}, ref) => {
  const searchParams = useSearchParams();
  const isMutedByParam = searchParams.get('muted') === 'true';
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<any>(null);
  const containerId = useRef(`yt-player-${Math.random().toString(36).substring(2, 11)}`);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Expor métodos para o pai (DeviceMockup)
  useImperativeHandle(ref, () => ({
    play: () => {
      if (playerRef.current && isReady) {
        if (!isMutedByParam) {
          playerRef.current.unMute();
          playerRef.current.setVolume(100);
        }
        playerRef.current.playVideo();
      }
    },
    pause: () => {
      if (playerRef.current && isReady) {
        playerRef.current.pauseVideo();
      }
    },
    toggle: () => {
      const state = playerRef.current?.getPlayerState();
      if (state === 1) {
        playerRef.current.pauseVideo();
      } else {
        if (!isMutedByParam) {
          playerRef.current.unMute();
          playerRef.current.setVolume(100);
        }
        playerRef.current.playVideo();
      }
    }
  }));

  useEffect(() => {
    const loadYoutubeApi = () => {
      if (window.YT && window.YT.Player) {
        initPlayer();
        return;
      }

      if (!document.getElementById('youtube-api-script')) {
        const tag = document.createElement('script');
        tag.id = 'youtube-api-script';
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }

      const prevOnReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevOnReady) prevOnReady();
        initPlayer();
      };
    };

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player || playerRef.current || !document.getElementById(containerId.current)) return;

      try {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        
        playerRef.current = new window.YT.Player(containerId.current, {
          height: '1',
          width: '1',
          videoId: musicData?.id || '',
          playerVars: {
            autoplay: isAutoPlay ? 1 : 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            rel: 0,
            enablejsapi: 1,
            origin: origin,
            mute: isAutoPlay ? 1 : 0 
          },
          events: {
            onReady: (event: any) => {
              setIsReady(true);
              setDuration(event.target.getDuration());
              
              if (isAutoPlay && !isMutedByParam) {
                event.target.unMute();
                event.target.setVolume(100);
                event.target.playVideo();
              }
            },
            onStateChange: (event: any) => {
              const state = event.data;
              
              if (state === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                if (onStateChange) onStateChange(true);
                startTimer();
              } else if (state === window.YT.PlayerState.PAUSED || state === window.YT.PlayerState.ENDED) {
                setIsPlaying(false);
                if (onStateChange) onStateChange(false);
                stopTimer();
              }
            }
          }
        });
      } catch (err) {
        console.error("Failed to initialize YT Player", err);
      }
    };

    loadYoutubeApi();

    return () => {
      stopTimer();
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [musicData?.id]);

  useEffect(() => {
    if (!playerRef.current || !isReady) return;
    
    const playerState = typeof playerRef.current.getPlayerState === 'function' ? playerRef.current.getPlayerState() : -1;
    const isActuallyPlaying = playerState === window.YT.PlayerState.PLAYING || playerState === window.YT.PlayerState.BUFFERING;

    if (isAutoPlay && !isActuallyPlaying) {
      if (!isMutedByParam) {
        playerRef.current.unMute();
        playerRef.current.setVolume(100);
      }
      playerRef.current.playVideo();
    } else if (!isAutoPlay && isActuallyPlaying) {
      playerRef.current.pauseVideo();
    }
  }, [isAutoPlay, isReady, isMutedByParam]);

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 500);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!playerRef.current || !isReady) return;
    
    if (!isPlaying) {
      if (!isMutedByParam) {
        playerRef.current.unMute();
        playerRef.current.setVolume(100);
      }
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!playerRef.current || !isReady || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const perc = x / rect.width;
    if (typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(duration * perc);
    }
  };

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  };

  const accentColor = '#e11d48';
  const neonShadow = musicHasNeon 
    ? `0 0 ${musicNeonStrength! / 2}px ${accentColor}, 0 0 ${musicNeonStrength}px ${accentColor}` 
    : 'none';

  if (hideUI) {
    return (
      <div className="fixed -left-[1000px] -top-[1000px] pointer-events-none opacity-0">
        <div id={containerId.current}></div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "w-full rounded-[20px] border border-white/5 overflow-hidden p-[12px] transition-all duration-500 shadow-2xl relative z-20 backdrop-blur-xl",
        isExpanded ? "pb-[20px]" : ""
      )}
      style={{ backgroundColor: musicBoxColor }}
    >
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="w-[48px] h-[48px] bg-white/5 rounded-[12px] flex items-center justify-center overflow-hidden shrink-0 relative">
          {musicData?.thumb ? (
            <img src={musicData.thumb} className={cn("w-full h-full object-cover", isPlaying && "opacity-80")} alt="" />
          ) : (
            <Music2 className="text-white w-5 h-5" />
          )}
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="flex gap-0.5 items-end h-3">
                <div className="w-0.5 bg-white animate-bounce" style={{ animationDuration: '0.5s' }} />
                <div className="w-0.5 bg-white animate-bounce" style={{ animationDuration: '0.8s', animationDelay: '0.1s' }} />
                <div className="w-0.5 bg-white animate-bounce" style={{ animationDuration: '0.6s', animationDelay: '0.2s' }} />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-1 ml-[15px] overflow-hidden">
          <div className="text-[14px] font-semibold truncate" style={{ color: musicTextColor }}>
            {musicData?.title || "Nenhuma música"}
          </div>
          <div className="text-[12px] truncate opacity-50" style={{ color: musicTextColor }}>
            {musicData?.id ? "YouTube Audio" : "Selecione uma música"}
          </div>
        </div>

        <div className={cn("transition-transform duration-500 opacity-50", isExpanded ? "rotate-180" : "")} style={{ color: musicTextColor }}>
          <ChevronDown size={20} />
        </div>
      </div>

      <div className={cn(
        "overflow-hidden transition-all duration-500",
        isExpanded ? "max-h-[200px] opacity-100 mt-[20px]" : "max-h-0 opacity-0"
      )}>
        <div className="progress-container px-1" onClick={seek}>
          <div className="w-full h-[3px] bg-white/10 relative cursor-pointer rounded-full">
            <div 
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-100 rounded-full" 
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
            />
          </div>
          
          <div className="flex justify-between text-[11px] mt-[8px] opacity-50 font-mono" style={{ color: musicTextColor }}>
            <span className="tabular-nums">{formatTime(currentTime)}</span>
            <span className="tabular-nums">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="player-controls flex items-center justify-between mt-[15px] px-[5px]">
          <Volume2 size={18} className="opacity-50" style={{ color: musicTextColor }} />
          <button 
            type="button"
            className="w-[50px] h-[50px] bg-primary rounded-full flex items-center justify-center text-white active:scale-95 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.4)] border-none cursor-pointer disabled:opacity-50"
            onClick={togglePlay}
            style={{ boxShadow: neonShadow }}
          >
            {!isReady ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : isPlaying ? (
              <Pause size={22} fill="white" />
            ) : (
              <Play size={22} fill="white" className="ml-[3px]" />
            )}
          </button>
          <div style={{ width: '18px' }} />
        </div>
      </div>

      <div className="fixed -left-[1000px] -top-[1000px] pointer-events-none opacity-0">
        <div id={containerId.current}></div>
      </div>
    </div>
  );
});

MusicPlayer.displayName = 'MusicPlayer';
