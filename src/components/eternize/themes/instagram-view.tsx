'use client';

import React from 'react';
import Image from 'next/image';
import { Bell, ChevronLeft, UserSquare2, CheckCircle2, UserPlus, Grid as GridIcon, MoreHorizontal, Heart, MessageCircle, Send, Bookmark, Plus, Trophy, Star, MapPin, RotateCcw, Play, Pause } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface InstagramViewProps {
  uploadedPhotos: string[];
  pageTitle: string;
  totalDays: number;
  timeDiff: any;
  date?: Date;
  message?: string;
  musicData?: any;
  isFollowing: boolean;
  onFollowToggle: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onStartStories: () => void;
  onPostClick: (index: number) => void;
  showPostDetail: boolean;
  selectedPostIndex: number;
  onClosePost: () => void;
  likedPosts: Record<number, boolean>;
  onLikePost: (index: number) => void;
  savedPosts: Record<number, boolean>;
  onSavePost: (index: number) => void;
  isAudioPlaying: boolean;
  onAudioToggle: (playing: boolean) => void;
  isPackEnabled?: boolean;
  onModuleClick?: (id: string) => void;
}

export function InstagramView({
  uploadedPhotos,
  pageTitle,
  totalDays,
  timeDiff,
  date,
  message,
  musicData,
  isFollowing,
  onFollowToggle,
  activeTab,
  onTabChange,
  onStartStories,
  onPostClick,
  showPostDetail,
  selectedPostIndex,
  onClosePost,
  likedPosts,
  onLikePost,
  savedPosts,
  onSavePost,
  isAudioPlaying,
  onAudioToggle,
  isPackEnabled = false,
  onModuleClick
}: InstagramViewProps) {
  
  const modules = [
    { id: 'memorias', title: 'Memórias', icon: Heart, color: 'text-red-500', borderColor: 'border-red-500/20' },
    { id: 'conquistas', title: 'Conquistas', icon: Trophy, color: 'text-yellow-500', borderColor: 'border-yellow-500/20' },
    { id: 'curiosidades', title: 'Curiosida...', icon: Star, color: 'text-purple-500', borderColor: 'border-purple-500/20' },
    { id: 'jornada', title: 'Jornada', icon: MapPin, color: 'text-emerald-500', borderColor: 'border-emerald-500/20' },
    { id: 'surpresa', title: 'Surpresa', icon: RotateCcw, color: 'text-orange-500', borderColor: 'border-orange-500/20' },
  ];

  if (showPostDetail) {
    return (
      <div className="absolute inset-0 z-[500] bg-black flex flex-col animate-in fade-in duration-300 no-scrollbar overflow-y-auto">
        <header className="flex items-center justify-between px-4 py-3 sticky top-0 bg-black z-50 border-b border-white/5">
          <div className="flex items-center gap-3">
            <button onClick={onClosePost}><ChevronLeft className="w-6 h-6" /></button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden relative bg-neutral-900">
                {uploadedPhotos.length > 0 ? <Image src={uploadedPhotos[0]} fill className="object-cover" alt="Profile" /> : null}
              </div>
              <div className="flex flex-col -space-y-0.5">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-sm tracking-tight">{pageTitle || 'NOSSA HISTÓRIA'}</span>
                  <div className="bg-[#0095F6] rounded-full p-0.5"><CheckCircle2 className="w-2.5 h-2.5 text-white" /></div>
                </div>
                <span className="text-[10px] text-neutral-400 font-medium">{date ? format(date, 'dd/MM/yyyy') : '01/05/2026'}</span>
              </div>
            </div>
          </div>
          <MoreHorizontal className="w-5 h-5 text-white" />
        </header>
        <div className="relative aspect-square w-full bg-neutral-900">
          <Image src={uploadedPhotos[selectedPostIndex]} fill className="object-cover" alt="Post" />
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => onLikePost(selectedPostIndex)} className="active:scale-125 transition-transform">
                <Heart className={cn("w-6 h-6", likedPosts[selectedPostIndex] ? "text-red-500 fill-current" : "text-white")} />
              </button>
              <MessageCircle className="w-6 h-6 text-white" />
              <Send className="w-6 h-6 text-white" />
            </div>
            <button onClick={() => onSavePost(selectedPostIndex)} className="active:scale-125 transition-transform">
              <Bookmark className={cn("w-6 h-6", savedPosts[selectedPostIndex] ? "text-white fill-current" : "text-white")} />
            </button>
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-bold text-white">{(totalDays + (likedPosts[selectedPostIndex] ? 1 : 0)).toLocaleString('pt-BR')} curtidas</p>
            <div className="text-sm">
              <span className="font-bold mr-2">{pageTitle || 'NOSSA HISTÓRIA'}</span>
              <span className="text-neutral-200">Juntos desde {date ? format(date, 'dd/MM/yyyy') : '01/05/2026'} ❤️</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black text-white font-inter flex flex-col no-scrollbar relative">
      <header className="flex items-center justify-between px-4 py-3 sticky top-0 bg-black z-50">
        <div className="flex items-center gap-3">
          <ChevronLeft className="w-6 h-6" />
          <div className="flex items-center gap-1">
            <span className="font-bold text-lg tracking-tight truncate max-w-[150px]">{pageTitle || 'NOSSA HISTÓRIA'}</span>
            <div className="bg-[#0095F6] rounded-full p-0.5"><CheckCircle2 className="w-3 h-3 text-white" /></div>
          </div>
        </div>
        <Bell className="w-6 h-6" />
      </header>
      
      <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
        <section className="px-4 pt-2 pb-4">
          <div className="flex items-center gap-6 mb-4">
            <div className="p-[2.5px] rounded-full ig-gradient cursor-pointer active:scale-95 transition-transform" onClick={onStartStories}>
              <div className="p-[2px] bg-black rounded-full">
                <div className="w-20 h-20 rounded-full border-2 border-black overflow-hidden relative bg-neutral-900">
                  {uploadedPhotos.length > 0 ? <Image src={uploadedPhotos[0]} fill className="object-cover" alt="Profile" /> : <div className="w-full h-full flex items-center justify-center"><UserSquare2 className="w-10 h-10 text-white/20" /></div>}
                </div>
              </div>
            </div>
            <div className="flex-1 flex justify-around text-center">
              <div><p className="font-bold text-base">{uploadedPhotos.length}</p><p className="text-[10px] text-neutral-400">posts</p></div>
              <div><p className="font-bold text-base">{totalDays.toLocaleString('pt-BR')}</p><p className="text-[10px] text-neutral-400">dias</p></div>
              <div><p className="font-bold text-base">{timeDiff?.years || 0}</p><p className="text-[10px] text-neutral-400">anos</p></div>
            </div>
          </div>
          
          <div className="space-y-0.5 mb-6">
            <p className="font-bold text-sm">{pageTitle || 'NOSSA HISTÓRIA'}</p>
            <div className="text-sm text-neutral-200 leading-tight" dangerouslySetInnerHTML={{ __html: message || 'Nossa jornada inesquecível...' }} />
            <p className="text-sm text-neutral-500 pt-1"> Juntos desde {date ? format(date, 'dd/MM/yyyy') : '07/04/2017'}</p>
          </div>

          <div className="flex gap-2 mb-6">
            <button onClick={onFollowToggle} className={cn("flex-1 py-1.5 rounded-lg text-sm font-semibold transition active:scale-95", isFollowing ? "bg-neutral-800 text-white" : "bg-[#0095F6] text-white")}>{isFollowing ? 'Seguindo' : 'Seguir'}</button>
            <button className="flex-1 bg-neutral-800 py-1.5 rounded-lg text-sm font-semibold transition active:scale-95 text-white">Mensagem</button>
            <button className="px-2 bg-neutral-800 rounded-lg transition active:scale-95 text-white"><UserPlus className="w-4.5 h-4.5" /></button>
          </div>

          {/* Highlights Section - Módulos ou Fotos do Feed */}
          <div className="flex gap-5 overflow-x-auto no-scrollbar mb-4 py-2 px-1">
             {isPackEnabled ? (
               modules.map((mod) => (
                 <div 
                   key={mod.id} 
                   onClick={() => onModuleClick?.(mod.id)}
                   className="flex flex-col items-center gap-2 shrink-0 cursor-pointer active:scale-95 transition-transform"
                 >
                    <div className={cn(
                      "w-[68px] h-[68px] rounded-full border bg-black flex items-center justify-center transition-all",
                      mod.borderColor
                    )}>
                       <mod.icon className={cn("w-7 h-7", mod.color)} />
                    </div>
                    <span className="text-[11px] text-white font-bold tracking-tight">{mod.title}</span>
                 </div>
               ))
             ) : (
               <>
                 <div className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group">
                    <div className="w-[68px] h-[68px] rounded-full border border-neutral-800 flex items-center justify-center bg-black group-active:scale-95 transition-transform">
                       <Plus className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-[11px] text-white font-medium">Novo</span>
                 </div>
                 {uploadedPhotos.slice(1, 4).map((photo, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 shrink-0 active:scale-95 transition-transform">
                       <div className="w-[68px] h-[68px] rounded-full border border-neutral-800 overflow-hidden relative p-[2px] bg-black">
                          <div className="w-full h-full rounded-full overflow-hidden relative">
                             <Image src={photo} fill className="object-cover" alt="" />
                          </div>
                       </div>
                       <span className="text-[11px] text-white font-medium truncate max-w-[64px]">Destaque {i+1}</span>
                    </div>
                 ))}
               </>
             )}
          </div>
        </section>

        <div className="flex border-t border-neutral-900">
          <button onClick={() => onTabChange('grid')} className={cn("flex-1 flex justify-center py-3 transition-all", activeTab === 'grid' ? "border-b border-white" : "text-neutral-500")}><GridIcon className="w-5 h-5" /></button>
          <button onClick={() => onTabChange('reels')} className={cn("flex-1 flex justify-center py-3 transition-all", activeTab === 'reels' ? "border-b border-white" : "text-neutral-500")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m2 9 3-3 3 3"/><path d="M13 18H7a2 2 0 0 1-2-2V6"/><path d="m22 15-3 3-3-3"/><path d="M11 6h6a2 2 0 0 1 2 2v10"/></svg></button>
        </div>

        <div className="grid grid-cols-3 gap-[1.5px] bg-black">
          {uploadedPhotos.length > 0 ? uploadedPhotos.map((photo, i) => (
            <div key={i} className="aspect-square relative group cursor-pointer active:opacity-80" onClick={() => onPostClick(i)}>
              <Image src={photo} fill className="object-cover" alt="" />
            </div>
          )) : null}
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
              <p className="text-[10px] text-neutral-400 truncate">{pageTitle || 'NOSSA HISTÓRIA'}</p>
            </div>
            <button onClick={() => onAudioToggle(!isAudioPlaying)} className="text-white">
              {isAudioPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>
          </div>
          <div className="mt-2 h-0.5 bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full ig-gradient" style={{ width: isAudioPlaying ? '45%' : '0%', transition: 'width 0.5s ease' }}></div>
          </div>
        </div>
      )}
    </div>
  );
}
