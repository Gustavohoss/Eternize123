
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
      <div className="max-w-6xl mx-auto flex flex-col lg:grid lg:grid-cols-[1fr_420px] items-center justify-center min-h-[calc(100vh-120px)] px-6 gap-12 lg:gap-16 py-12 lg:py-0">
        
        {/* Lado Esquerdo: Conteúdo conforme script solicitado */}
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
            <div className="relative z-10 rounded-full bg-red-900/20 text-white text-xs font-semibold inline-flex items-center px-4 py-2 space-x-2">
              <Sparkles className="w-4 h-4 text-red-400" />
              <span>Nós te ajudamos a criar em 5 minutos</span>
            </div>
          </div>

          <h1 className="text-white text-5xl lg:text-6xl font-sans relative z-20 font-bold tracking-tight mb-1">
            Declare seu amor
          </h1>
          
          <div className="font-['Pacifico'] text-4xl md:text-5xl text-red-500 font-bold mb-6 -mt-0.5 leading-tight min-h-[60px]">
            <span>{typewriterText}</span>
            <span className="animate-pulse">|</span>
          </div>
          
          <p className="text-white/90 text-lg mb-8 leading-relaxed max-w-xl font-medium">
            Crie um presente digital com fotos, música e textos personalizados, para quem você ama e surpreenda a pessoa. Pronto em 5 minutos.
          </p>

          <Link href="/criador" className="w-full sm:w-auto">
            <button className="h-14 max-w-md relative group inline-flex items-center justify-center overflow-hidden rounded-lg animate-pulse bg-gradient-to-br from-red-500 to-pink-600 p-0.5 font-medium text-white w-full transition-all hover:scale-[1.02]" type="button">
              <span className="w-full relative rounded-md bg-black/20 backdrop-blur-sm px-8 py-6 md:px-12 md:py-8 transition-all duration-200 ease-in group-hover:bg-black/0 flex items-center h-14 justify-center">
                <span className="flex items-center justify-center gap-3">
                  <Heart className="w-6 h-6 text-white fill-current" />
                  <span className="tracking-wider font-bold text-lg">Quero criar agora! ❤️</span>
                  <ChevronRight className="w-5 h-5 ml-2" />
                </span>
              </span>
            </button>
          </Link>

          {/* Social Proof e Comentários Dinâmicos */}
          <div className="flex items-center justify-center lg:justify-start gap-3 mt-8">
            <div className="flex -space-x-2 flex-shrink-0">
              <img className="w-8 h-8 rounded-full border-2 border-neutral-900" src="https://i.pravatar.cc/100?u=a" alt="User 1" />
              <img className="w-8 h-8 rounded-full border-2 border-neutral-900" src="https://i.pravatar.cc/100?u=b" alt="User 2" />
              <img className="w-8 h-8 rounded-full border-2 border-neutral-900" src="https://i.pravatar.cc/100?u=c" alt="User 3" />
              <img className="w-8 h-8 rounded-full border-2 border-neutral-900" src="https://i.pravatar.cc/100?u=d" alt="User 4" />
            </div>
            
            <div 
              className="flex flex-col gap-0.5 min-w-0 transition-all duration-500"
              style={{ 
                opacity: reviewOpacity, 
                transform: `translateY(${reviewTranslate}px)` 
              }}
            >
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-white/60 text-[10px] font-medium">{REVIEWS[reviewIdx].name}</span>
              </div>
              <p className="text-white/85 text-xs leading-snug line-clamp-1 font-medium italic">
                {REVIEWS[reviewIdx].text}
              </p>
              <p className="text-white/35 text-[10px] font-bold uppercase tracking-wider">
                Mais de 75.000 usuários satisfeitos
              </p>
            </div>
          </div>
        </div>

        {/* Lado Direito: Carrossel de Temas (Mantido para composição) */}
        <div className="flex flex-col items-center justify-center w-full relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200 py-10">
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
