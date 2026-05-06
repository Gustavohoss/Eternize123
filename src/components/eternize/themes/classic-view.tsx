
'use client';

import React from 'react';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay, EffectCreative } from 'swiper/modules';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { OrganicModuleGrid } from './organic-module-grid';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-creative';

interface ClassicViewProps {
  uploadedPhotos: string[];
  photoEffect: 'slide' | 'coverflow' | 'fan';
  showCard: boolean;
  cardColor: string;
  titlePosition: 'top' | 'bottom';
  pageTitle: string;
  titleStyle: React.CSSProperties;
  message?: string;
  messageColor?: string;
  messageFontFamily?: string;
  date?: Date;
  selectedCountStyle: string;
  dateStyle: React.CSSProperties;
  dateIsBold: boolean;
  dateBoxBgColor: string;
  dateBoxBorderColor: string;
  timeDiff: any;
  totalDays: number;
  musicData?: any;
  musicBoxColor: string;
  musicTextColor: string;
  musicHasNeon: boolean;
  musicNeonStrength: number;
  isAudioPlaying: boolean;
  onAudioToggle: (playing: boolean) => void;
  isPackEnabled: boolean;
  onModuleClick: (id: string) => void;
}

export function ClassicView({
  uploadedPhotos,
  photoEffect,
  showCard,
  cardColor,
  titlePosition,
  pageTitle,
  titleStyle,
  message,
  messageColor,
  messageFontFamily,
  date,
  selectedCountStyle,
  dateStyle,
  dateIsBold,
  dateBoxBgColor,
  dateBoxBorderColor,
  timeDiff,
  totalDays,
  musicData,
  isPackEnabled,
  onModuleClick
}: ClassicViewProps) {
  return (
    <div className="w-full min-h-full flex flex-col items-center pt-8 px-5 gap-6">
      <div 
        style={showCard ? { backgroundColor: cardColor } : { backgroundColor: 'transparent' }} 
        className={cn(
          "w-full rounded-[8px] z-20 flex flex-col items-center transition-all duration-300", 
          showCard ? "shadow-[0_15px_35px_rgba(0,0,0,0.5)] p-[12px]" : "p-0", 
          showCard && (photoEffect === 'fan' ? "pb-[25px]" : "pb-[20px]")
        )}
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
              coverflowEffect={photoEffect === 'coverflow' ? { rotate: 30, stretch: 0, depth: 100, modifier: 1, slideShadows: true } : undefined} 
              creativeEffect={photoEffect === 'fan' ? { limitProgress: 4, prev: { translate: [0, "-120%", -500], rotate: [0, 0, 15], opacity: 0 }, next: { translate: ["15%", 0, -150], rotate: [0, 0, 5], scale: 0.85, opacity: 1 } } : undefined}
            >
              {uploadedPhotos.map((photo, i) => (<SwiperSlide key={i}><div className="w-full h-full relative"><Image src={photo} fill className="object-cover" alt="" priority /></div></SwiperSlide>))}
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
            style={{ color: messageColor, fontFamily: messageFontFamily }} 
            className="text-center text-lg md:text-xl leading-relaxed font-medium" 
            dangerouslySetInnerHTML={{ __html: message }} 
          />
        </div>
      )}

      {date && (
        <div className="w-full py-4 flex flex-col items-center">
          {selectedCountStyle === 'padrao' && (
            <div className="w-full flex flex-col items-center">
              <div className="text-[#888] text-[14px] font-bold uppercase tracking-[4px] mb-8 text-center">UAU, ESTÃO JUNTOS HÁ</div>
              <div style={{ backgroundColor: dateBoxBgColor, borderColor: dateBoxBorderColor }} className="border rounded-[20px] overflow-hidden w-full max-w-[360px] shadow-2xl">
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
                      <div style={dateStyle} className={cn("text-[42px] italic leading-none mb-1 tabular-nums", !dateIsBold && "font-normal")}>{item.val.toString().padStart(2, '0')}</div>
                      <div className="text-[#777] text-[11px] font-bold uppercase tracking-[2px]">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-[#555] text-[14px] mt-8 text-center font-medium">Desde {format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</div>
            </div>
          )}
          {selectedCountStyle === 'data-grande' && (
            <div className="w-full flex flex-col items-center">
              <div className="text-[#888] text-[14px] font-bold uppercase tracking-[4px] mb-[20px] text-center">UAU, ESTÃO JUNTOS HÁ</div>
              <div style={{ backgroundColor: dateBoxBgColor, borderColor: dateBoxBorderColor }} className="border rounded-[15px] py-[15px] px-[10px] flex justify-center items-center w-full max-w-[360px] shadow-2xl">
                {[ { val: timeDiff?.years || 0, label: 'Anos' }, { val: timeDiff?.months || 0, label: 'Meses' }, { val: timeDiff?.days || 0, label: 'Dias' }, ].map((item, i, arr) => (<div key={i} className="flex flex-col items-center justify-center flex-1 relative"><div style={dateStyle} className={cn("text-[48px] italic leading-none mb-[5px] tabular-nums", !dateIsBold && "font-normal")}>{item.val.toString().padStart(2, '0')}</div><div className="text-[#666] text-[10px] font-black uppercase tracking-[2px]">{item.label}</div>{i < arr.length - 1 && (<div className="absolute right-0 top-[15%] bottom-[15%] w-px bg-[#333]/40" />)}</div>))}
              </div>
              <div className="text-[#555] text-[13px] mt-[20px] text-center font-medium">Desde {format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</div>
            </div>
          )}
          {selectedCountStyle === 'dias-grandes' && (
            <div className="w-full flex flex-col items-center">
              <div className="text-[#888] text-[14px] font-bold uppercase tracking-[4px] mb-[25px] text-center">UAU, ESTÃO JUNTOS HÁ</div>
              <div style={{ backgroundColor: dateBoxBgColor, borderColor: dateBoxBorderColor }} className="border rounded-[20px] py-[25px] px-[20px] flex flex-col items-center justify-center w-full max-w-[280px] shadow-2xl">
                <div style={dateStyle} className={cn("text-[64px] italic leading-none mb-[10px] tabular-nums", !dateIsBold && "font-normal")}>{totalDays.toLocaleString('pt-BR')}</div>
                <div className="text-[#666] text-[10px] font-black uppercase tracking-[4px]">Dias</div>
              </div>
              <div className="text-[#555] text-[14px] mt-[25px] text-center font-medium">Desde {format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</div>
            </div>
          )}
        </div>
      )}

      {isPackEnabled && (
        <OrganicModuleGrid onModuleClick={onModuleClick} pageTitle={pageTitle} />
      )}

      <div className="h-32 shrink-0" />
    </div>
  );
}
