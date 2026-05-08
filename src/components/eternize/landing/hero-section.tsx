
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ChevronRight, Sparkles } from 'lucide-react';
import { ThemeCarousel } from './theme-carousel';
import { cn } from '@/lib/utils';

const TYPEWRITER_TEXTS = ["para a sua mana!", "para a sua mãe!", "para o seu amor!", "para o seu irmão!"];

const REVIEWS = [
    { name: "Fernanda T.", text: "Minha vovó nem sabia que ia receber algo tão lindo 😭💕" },
    { name: "Gustavo S.", text: "Minha namorada chorou de emoção, valeu muito! 😍" },
    { name: "Mariana L.", text: "Fiz para minha mãe e ela compartilha com todo mundo kkk" },
    { name: "Ricardo W.", text: "Muito fácil de fazer e o resultado é profissional. Recomendo!" }
];

export function HeroSection() {
  // Typewriter State
  const [typewriterText, setTypewriterText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  // Reviews State
  const [reviewIdx, setReviewIdx] = useState(0);
  const [reviewOpacity, setReviewOpacity] = useState(1);
  const [reviewTranslate, setReviewTranslate] = useState(0);

  // Typewriter Logic
  useEffect(() => {
    const handleType = () => {
      const i = loopNum % TYPEWRITER_TEXTS.length;
      const fullText = TYPEWRITER_TEXTS[i];

      setTypewriterText(
        isDeleting 
          ? fullText.substring(0, typewriterText.length - 1) 
          : fullText.substring(0, typewriterText.length + 1)
      );

      setTypingSpeed(isDeleting ? 50 : 150);

      if (!isDeleting && typewriterText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && typewriterText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [typewriterText, isDeleting, loopNum, typingSpeed]);

  // Reviews Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setReviewOpacity(0);
      setReviewTranslate(10);
      
      setTimeout(() => {
        setReviewIdx((prev) => (prev + 1) % REVIEWS.length);
        setReviewOpacity(1);
        setReviewTranslate(0);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-black">
      <div className="max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-[1.1fr_450px] items-center justify-center min-h-[calc(100vh-120px)] px-6 gap-16 lg:gap-24 py-16 lg:py-0">
        
        {/* Lado Esquerdo: Conteúdo */}
        <div className="w-full text-center lg:text-left flex flex-col items-center lg:items-start animate-in fade-in slide-in-from-left-8 duration-1000">
          
          {/* Badge Animado */}
          <div className="relative inline-flex p-px overflow-hidden rounded-full mb-6 mx-0 w-fit">
            <div 
              className="absolute inset-0 animate-spin-slow pointer-events-none" 
              style={{ 
                background: 'conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.9) 20%, transparent 40%)',
                animationDuration: '3s'
              }} 
            />
            <div className="absolute inset-[1px] rounded-full bg-black pointer-events-none"></div>
            <div className="relative z-10 rounded-full bg-red-900/20 text-white text-[11px] font-semibold inline-flex items-center px-5 py-2.5 space-x-2">
              <Sparkles className="w-4 h-4 text-red-400" />
              <span className="tracking-wide">Nós te ajudamos a criar em 5 minutos</span>
            </div>
          </div>

          <h1 className="text-white text-5xl lg:text-7xl font-sans pt-3 relative z-20 font-bold tracking-tight mb-2">
            Declare seu amor
          </h1>
          
          <div className="font-['Great_Vibes'] text-4xl md:text-5xl text-red-500 font-bold mb-4 -mt-0.5 leading-tight min-h-[60px]">
            <span>{typewriterText}</span>
            <span className="animate-pulse">|</span>
          </div>
          
          <p className="text-white/80 text-lg md:text-xl mb-6 leading-relaxed max-w-xl font-medium">
            Crie um presente digital com fotos, música e textos personalizados, para quem você ama e surpreenda a pessoa. Pronto em 5 minutos.
          </p>

          <Link href="/criador" className="w-full sm:w-auto">
            <button className="h-16 max-w-md relative group inline-flex items-center justify-center overflow-hidden rounded-xl animate-pulse bg-gradient-to-br from-red-500 to-pink-600 p-0.5 font-medium text-white w-full transition-all hover:scale-[1.02] shadow-2xl shadow-primary/20" type="button">
              <span className="w-full relative rounded-lg bg-black/20 backdrop-blur-sm px-8 py-6 md:px-14 md:py-8 transition-all duration-200 ease-in group-hover:bg-black/0 flex items-center h-16 justify-center">
                <span className="flex items-center justify-center gap-3">
                  <Heart className="w-6 h-6 text-white fill-current" />
                  <span className="tracking-wider font-bold text-xl uppercase italic">Quero criar agora!</span>
                  <ChevronRight className="w-5 h-5 ml-2" />
                </span>
              </span>
            </button>
          </Link>

          {/* Social Proof e Comentários Dinâmicos */}
          <div className="flex items-center justify-center lg:justify-start gap-5 mt-8">
            <div className="flex -space-x-3 flex-shrink-0">
              <img className="w-10 h-10 rounded-full border-2 border-neutral-900" src="https://i.pravatar.cc/100?u=a" alt="User 1" />
              <img className="w-10 h-10 rounded-full border-2 border-neutral-900" src="https://i.pravatar.cc/100?u=b" alt="User 2" />
              <img className="w-10 h-10 rounded-full border-2 border-neutral-900" src="https://i.pravatar.cc/100?u=c" alt="User 3" />
              <img className="w-10 h-10 rounded-full border-2 border-neutral-900" src="https://i.pravatar.cc/100?u=d" alt="User 4" />
            </div>
            
            <div 
              className="flex flex-col gap-1 min-w-0 transition-all duration-500"
              style={{ 
                opacity: reviewOpacity, 
                transform: `translateY(${reviewTranslate}px)` 
              }}
            >
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-white/60 text-[11px] font-black uppercase tracking-widest">{REVIEWS[reviewIdx].name}</span>
              </div>
              <p className="text-white/85 text-sm leading-snug line-clamp-1 font-medium italic">
                {REVIEWS[reviewIdx].text}
              </p>
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">
                Mais de 75.000 usuários satisfeitos
              </p>
            </div>
          </div>
        </div>

        {/* Lado Direito: Carrossel de Temas */}
        <div className="flex flex-col items-center justify-center w-full relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200 py-10 lg:py-0">
          <ThemeCarousel />
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </section>
  );
}
