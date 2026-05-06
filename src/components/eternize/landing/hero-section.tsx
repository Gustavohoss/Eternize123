
'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { ThemeCarousel } from './theme-carousel';

export function HeroSection() {
  const [text, setText] = useState('');
  const phrases = ["para o seu mozão!", "para a sua vovó!", "com a sua trilha sonora!", "para o seu amor!"];
  const [pIndex, setPIndex] = useState(0);
  const [cIndex, setCIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[pIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (cIndex < current.length) {
          setText(current.substring(0, cIndex + 1));
          setCIndex(cIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (cIndex > 0) {
          setText(current.substring(0, cIndex - 1));
          setCIndex(cIndex - 1);
        } else {
          setIsDeleting(false);
          setPIndex((pIndex + 1) % phrases.length);
        }
      }
    }, isDeleting ? 50 : 120);

    return () => clearTimeout(timeout);
  }, [cIndex, isDeleting, pIndex]);

  return (
    <section className="flex flex-col lg:grid lg:grid-cols-[1fr_420px] items-center justify-center min-h-[calc(100vh-120px)] px-[5%] md:px-[8%] gap-12 lg:gap-32 py-12 lg:py-0">
      <div className="max-w-[550px] text-center lg:text-left flex flex-col items-center lg:items-start animate-in fade-in slide-in-from-left-8 duration-1000">
        <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[11px] border border-primary/20 mb-6 font-bold tracking-wide uppercase italic">
          ✨ Nós te ajudamos a criar em 5 minutos
        </div>
        
        <h1 className="text-[48px] md:text-[62px] font-black leading-[1.1] m-0 tracking-tighter">
          Declare seu amor
        </h1>
        
        <div className="typing-container text-[36px] md:text-[48px] text-primary h-[60px] md:h-[70px] mb-4 flex items-center justify-center lg:justify-start">
          <span>{text}</span>
          <span className="cursor" />
        </div>
        
        <p className="text-[16px] md:text-[18px] text-[#b3b3b3] leading-relaxed mb-10 max-w-[90%] md:max-w-[480px] font-medium">
          Crie um presente digital com fotos, música e textos personalizados, para quem você ama e surpreenda a pessoa. Pronto em 5 minutos.
        </p>

        <NextLink href="/criador" className="cta-button text-white px-8 py-4 md:px-10 md:py-5 rounded-xl text-[18px] md:text-[20px] font-black inline-flex items-center gap-3 transition-all hover:brightness-110 active:scale-95 w-full sm:w-auto justify-center group uppercase italic tracking-tight">
          Quero criar agora! <span className="text-2xl transition-transform group-hover:translate-x-1">›</span>
        </NextLink>

        <div className="flex items-center mt-10 gap-4 social-proof">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map(i => (
              <img key={i} src={`https://i.pravatar.cc/100?u=${i + 10}`} className="w-[34px] h-[34px] rounded-full border-2 border-[#0a0a0a] shadow-lg" alt="usuário satisfeito" />
            ))}
          </div>
          <div className="text-[12px] md:text-[13px] text-[#b3b3b3] font-medium">
            <span className="text-[#ffb703] block mb-0.5 text-sm">★★★★★</span>
            Mais de 75.000 usuários satisfeitos
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center w-full relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200 py-10">
        <ThemeCarousel />
      </div>
    </section>
  );
}
