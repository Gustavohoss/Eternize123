'use client';

import React, { useState, useEffect, useRef } from 'react';
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

export function MusicPlayer({ 
  musicData,
  musicBoxColor = '#0e0e0e',
  musicTextColor = '#ffffff',
  musicHasNeon = false,
  musicNeonStrength = 15,
  isAutoPlay = false,
  hideUI = false,
  onStateChange
}: MusicPlayerProps) {
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
  const pendingPlay = useRef(false);

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
        playerRef.current = new window.YT.Player(containerId.current, {
          height: '1',
          width: '1',
          videoId: musicData?.id || '',
          playerVars: {
            autoplay: isAutoPlay && !isMutedByParam ? 1 : 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            rel: 0,
            enablejsapi: 1,
            origin: typeof window !== 'undefined' ? window.location.origin : '',
            mute: 1 
          },
          events: {
            onReady: (event: any) => {
              setIsReady(true);
              setDuration(event.target.getDuration());
              
              if ((pendingPlay.current || isAutoPlay) && !isMutedByParam) {
                event.target.unMute();
                event.target.setVolume(100);
                event.target.playVideo();
                pendingPlay.current = false;
              }
            },
            onStateChange: (event: any) => {
              const playing = event.data === 1;
              setIsPlaying(playing);
              if (playing) {
                startTimer();
              } else {
                stopTimer();
              }
              if (onStateChange) onStateChange(playing);
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
  }, []);

  useEffect(() => {
    if (!playerRef.current) return;

    if (musicData?.id) {
      const currentPlayerId = typeof playerRef.current.getVideoData === 'function' ? playerRef.current.getVideoData().video_id : null;
      if (currentPlayerId && currentPlayerId !== musicData.id) {
        if (typeof playerRef.current.loadVideoById === 'function') {
          playerRef.current.loadVideoById(musicData.id);
          setCurrentTime(0);
        }
      }
      
      if (isAutoPlay && !isMutedByParam) {
        if (isReady) {
          try {
            playerRef.current.unMute();
            playerRef.current.setVolume(100);
            playerRef.current.playVideo();
          } catch (e) {
            console.warn("Retrying play command...");
          }
        } else {
          pendingPlay.current = true;
        }
      } else {
        if (isReady && typeof playerRef.current.pauseVideo === 'function') {
          playerRef.current.pauseVideo();
        }
      }
    }
  }, [musicData?.id, isReady, isAutoPlay, isMutedByParam]);

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
    e.stopPropagation();
    if (!playerRef.current || !isReady) return;
    
    if (typeof playerRef.current.unMute === 'function') playerRef.current.unMute();
    if (typeof playerRef.current.setVolume === 'function') playerRef.current.setVolume(100);

    const state = typeof playerRef.current.getPlayerState === 'function' ? playerRef.current.getPlayerState() : -1;
    if (state === 1) {
      if (typeof playerRef.current.pauseVideo === 'function') playerRef.current.pauseVideo();
    } else {
      if (typeof playerRef.current.playVideo === 'function') playerRef.current.playVideo();
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

  const accentColor = '#7a1a1a';
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
        "w-full rounded-[20px] border border-[#1f1f1f] overflow-hidden p-[12px] transition-all duration-500 shadow-2xl relative z-20",
        isExpanded ? "pb-[20px]" : ""
      )}
      style={{ backgroundColor: musicBoxColor }}
    >
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="w-[48px] h-[48px] bg-[#1a1a1a] rounded-[12px] flex items-center justify-center overflow-hidden shrink-0 relative">
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
          <ChevronDown size(20) />
        </div>
      </div>

      <div className={cn(
        "overflow-hidden transition-all duration-500",
        isExpanded ? "max-h-[200px] opacity-100 mt-[20px]" : "max-h-0 opacity-0"
      )}>
        <div className="progress-container px-1" onClick={seek}>
          <div className="w-full h-[3px] bg-white/10 relative cursor-pointer rounded-full">
            <div 
              className="absolute top-0 left-0 h-full bg-[#7a1a1a] transition-all duration-100 rounded-full" 
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
            />
          </div>
          
          <div className="flex justify-between text-[11px] mt-[8px] opacity-50 font-mono" style={{ color: musicTextColor }}>
            <span className="tabular-nums">{formatTime(currentTime)}</span>
            <span className="tabular-nums">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="player-controls flex items-center justify-between mt-[15px] px-[5px]">
          <Volume2 size(18) className="opacity-50" style={{ color: musicTextColor }} />
          <button 
            type="button"
            disabled={!isReady}
            className="w-[50px] h-[50px] bg-[#7a1a1a] rounded-full flex items-center justify-center text-white active:scale-95 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.4)] border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={togglePlay}
            style={{ boxShadow: neonShadow }}
          >
            {!isReady ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isPlaying ? (
              <Pause size(22) fill="white" />
            ) : (
              <Play size(22) fill="white" className="ml-[3px]" />
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
}
