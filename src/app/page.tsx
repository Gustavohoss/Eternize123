'use client';

import React, { useState, useEffect, useCallback } from 'react';
import NextLink from 'next/link';
import NextImage from 'next/image';
import { 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  ListOrdered, 
  CircleDollarSign, 
  QrCode, 
  Heart,
  Music,
  Clock,
  Layout,
  Layers,
  Zap,
  Play,
  Pause,
  Star,
  Lock,
  MessageCircle,
  Send,
  Bookmark,
  Check,
  CreditCard,
  ShieldCheck,
  Users,
  Headphones,
  Crown,
  Infinity,
  HelpCircle,
  Instagram,
  X
} from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { THEME_OPTIONS } from '@/app/criador/constants';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';

const STEPS = [
  {
    id: 1,
    title: 'Personalize',
    description: 'Personalize sua página com fotos, mensagens, efeitos especiais e muito mais.',
    icon: ListOrdered,
    color: '#e11d48',
    glow: 'rgba(225, 29, 72, 0.4)'
  },
  {
    id: 2,
    title: 'Faça o pagamento',
    description: 'Escolha seu plano preferido e faça o pagamento de forma rápida e segura.',
    icon: CircleDollarSign,
    color: '#be123c',
    glow: 'rgba(190, 18, 60, 0.4)'
  },
  {
    id: 3,
    title: 'Receba seu acesso',
    description: 'Você receberá por email um QR code e link para acessar sua página.',
    icon: QrCode,
    color: '#9f1239',
    glow: 'rgba(159, 18, 57, 0.4)'
  },
  {
    id: 4,
    title: 'Compartilhe o amor',
    description: 'Compartilhe a página com a pessoa amada e surpreenda-a de forma especial.',
    icon: Heart,
    color: '#881337',
    glow: 'rgba(136, 19, 55, 0.4)'
  }
];

const REVIEWS_1 = [
  {
    stars: 5,
    text: '"Gente, fiz isso pro meu mozão e ele CHOROU 😭 Nunca vi ele assim. As fotos, a música, o texto... tudo ficou perfeito. Ele ainda abre o link até hoje!"',
    name: 'Mariana & João',
    time: '1 mês atrás',
    initials: 'MJ',
    color: 'linear-gradient(135deg,#e11d48,#ff6b6b)'
  },
  {
    stars: 5,
    text: '"Fiz em menos de 10 minutos e o resultado parece coisa de designer profissional. Ele ficou sem palavras 🤩 ❤️ Melhor presente que já dei na vida."',
    name: 'Ana & Pedro',
    time: '2 dias atrás',
    initials: 'AP',
    color: 'linear-gradient(135deg,#667eea,#764ba2)'
  },
  {
    stars: 5,
    text: '"Montei uma surpresa pra Carol com nossas fotos de viagem e a música do nosso primeiro beijo. Ela ficou emocionada demais!! Com certeza vou fazer de novo."',
    name: 'Lucas & Carol',
    time: '3 meses atrás',
    initials: 'LC',
    color: 'linear-gradient(135deg,#f093fb,#f5576c)'
  },
  {
    stars: 5,
    text: '"Ele ficou completamente surpreso! Eu mesma me emocionei montando, de tanto que ficou bonito 💜 Já recomendei pra todas as minhas amigas."',
    name: 'Larissa & Tiago',
    time: '9 meses atrás',
    initials: 'LT',
    color: 'linear-gradient(135deg,#4facfe,#00f2fe)'
  },
  {
    stars: 5,
    text: '"Achei que ia ser difícil mas foi o contrário — rapidinho e ficou INCRÍVEL. Colocamos as músicas que marcaram nossa relação e foi muito emocionante 🎵"',
    name: 'Clara & Rafael',
    time: '2 meses atrás',
    initials: 'CR',
    color: 'linear-gradient(135deg,#43e97b,#38f9d7)'
  },
];

const REVIEWS_2 = [
  {
    stars: 5,
    text: '"Criei pro meu mozão de surprise e ele ficou sem acreditar que eu fiz isso. Ele disse que foi o presente mais lindo que já recebeu ❤️ Recomendo 10/10!"',
    name: 'Vanessa & Ricardo',
    time: '1 semana atrás',
    initials: 'VR',
    color: 'linear-gradient(135deg,#fa709a,#fee140)'
  },
  {
    stars: 5,
    text: '"Nossa página ficou tão linda que até eu piquei sem acreditar. Meu namorado abriu na frente dos amigos dele e todo mundo quis fazer também! 😍"',
    name: 'Isabela & Bruno',
    time: '5 dias atrás',
    initials: 'IB',
    color: 'linear-gradient(135deg,#a8edea,#fed6e3)'
  },
  {
    stars: 5,
    text: '"Fiz de aniversário de namoro e mandei o link pelo WhatsApp. Ela ficou chorando de emoção e me ligou na hora. Nunca vi ela assim tão feliz 🥹"',
    name: 'Felipe & Julia',
    time: '2 semanas atrás',
    initials: 'FJ',
    color: 'linear-gradient(135deg,#ffecd2,#fcb69f)'
  },
  {
    stars: 5,
    text: '"Simplesmente perfeito. Coloquei nossas fotos favoritas, a música que tocou no nosso primeiro encontro e escrevi um texto do coração. Ela salvou pra sempre!"',
    name: 'Gabriel & Sofia',
    time: '4 meses atrás',
    initials: 'GS',
    color: 'linear-gradient(135deg,#d299c2,#fef9d7)'
  },
  {
    stars: 5,
    text: '"Presente mais original que já fiz na vida. Não custou quase nada mas pareceu que custou uma fortuna de tão especial que ficou. Ela ficou sem palavras 💕"',
    name: 'Camila & André',
    time: '3 semanas atrás',
    initials: 'CA',
    color: 'linear-gradient(135deg,#89f7fe,#66a6ff)'
  },
];

const AVATAR_DATA = [
  {initials:'MJ', color:'linear-gradient(135deg,#e11d48,#ff6b6b)'},
  {initials:'AP', color:'linear-gradient(135deg,#667eea,#764ba2)'},
  {initials:'LC', color:'linear-gradient(135deg,#f093fb,#f5576c)'},
  {initials:'LT', color:'linear-gradient(135deg,#4facfe,#00f2fe)'},
  {initials:'CR', color:'linear-gradient(135deg,#43e97b,#38f9d7)'},
  {initials:'VR', color:'linear-gradient(135deg,#fa709a,#fee140)'},
];

const FAQ_ITEMS = [
  {
    id: "01",
    question: "O que é a Eternize?",
    answer: "A Eternize é uma plataforma que permite criar presentes digitais personalizados e inesquecíveis. Você pode montar uma página exclusiva com fotos, música, contador de tempo e mensagens especiais para surpreender quem você ama."
  },
  {
    id: "02",
    question: "Como crio minha página personalizada?",
    answer: "É muito simples! Basta acessar nosso criador, escolher um tema, subir suas fotos, selecionar a trilha sonora e escrever sua mensagem. Após o pagamento, sua página é publicada instantaneamente."
  },
  {
    id: "03",
    question: "O que posso incluir na minha página?",
    answer: "Você pode incluir até 8 fotos (dependendo do plano), uma música do YouTube que toca automaticamente, um contador em tempo real, textos formatados, e módulos extras como linha do tempo de memórias e curiosidades astronômicas."
  },
  {
    id: "04",
    question: "Como acesso minha página após o pagamento?",
    answer: "Assim que o pagamento for confirmado, você receberá o link exclusivo e um QR Code por e-mail e também verá na tela de confirmação. O acesso é imediato."
  },
  {
    id: "05",
    question: "Posso editar minha página depois de criá-la?",
    answer: "Sim! Todos os nossos planos permitem edições posteriores. Você receberá uma chave de acesso para entrar no painel de edição e alterar fotos, textos ou músicas quando quiser."
  },
  {
    id: "06",
    question: "Por quanto tempo minha página ficará disponível?",
    answer: "No plano de 1 semana, o acesso expira após sete dias. No plano 'Para Sempre', sua página fica guardada em nossos servidores por tempo indeterminado, sem cobranças extras ou mensalidades."
  },
  {
    id: "07",
    question: "Quais formas de pagamento são aceitas?",
    answer: "Aceitamos Pix (aprovação instantânea) e Cartão de Crédito (com parcelamento disponível). Todos os pagamentos são processados em ambiente seguro e criptografado."
  },
  {
    id: "08",
    question: "Como entro em contato com o suporte?",
    answer: "Nosso suporte funciona 24 horas por dia. Você pode nos chamar pelo Instagram clicando no botão ao lado ou através do e-mail de suporte enviado após a compra."
  }
];

function ReviewCard({ review }: { review: any }) {
  return (
    <div className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-4 w-[250px] md:w-[280px] shrink-0 text-left transition-all hover:border-white/10 group relative">
      <div className="flex gap-0.5 mb-3">
        {[...Array(review.stars)].map((_, i) => (
          <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
        ))}
      </div>
      <div className="absolute top-4 right-4 text-2xl font-serif text-white/5 opacity-40 group-hover:text-primary/10 transition-colors pointer-events-none">"</div>
      <p className="text-white/80 text-[11px] md:text-[12px] leading-relaxed mb-4 min-h-[60px] italic">
        {review.text}
      </p>
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div 
            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-lg"
            style={{ background: review.color }}
          >
            {review.initials}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-black text-white uppercase tracking-tight truncate">{review.name}</span>
            <span className="text-[8px] font-bold text-white/20">{review.time}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-green-500/5 border border-green-500/10 px-2 py-0.5 rounded-full shrink-0">
          <Check className="w-2 h-2 text-green-500" strokeWidth={4} />
          <span className="text-[7px] font-black text-green-500 uppercase tracking-widest">Verificado</span>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [text, setText] = useState('');
  const phrases = ["para o seu mozão!", "para a sua vovó!", "com a sua trilha sonora!", "para o seu amor!"];
  const [pIndex, setPIndex] = useState(0);
  const [cIndex, setCIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Dashboard States
  const [dashboardTheme, setDashboardTheme] = useState('classic');
  const [previewThemeIndex, setPreviewThemeIndex] = useState(0);
  const [counter, setCounter] = useState({ years: '00', months: '00', days: '00', hours: '00' });
  const [waveformBars, setWaveformBars] = useState<{ height: string; duration: string }[]>([]);

  // Embla Carousel Logic for Hero
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'center', 
    skipSnaps: false,
    duration: 30
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  // Typewriter Effect
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

  // Live Counter Logic for Dashboard
  useEffect(() => {
    const updateCounter = () => {
      const start = new Date('2022-02-14T00:00:00');
      const now = new Date();
      const diff = now.getTime() - start.getTime();
      
      const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
      const years = Math.floor(totalDays / 365);
      const months = Math.floor((totalDays % 365) / 30);
      const days = totalDays % 30;
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

      setCounter({
        years: String(years).padStart(2, '0'),
        months: String(months).padStart(2, '0'),
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0')
      });
    };

    updateCounter();
    const interval = setInterval(updateCounter, 1000);
    return () => clearInterval(interval);
  }, []);

  // Pre-calculate waveform bars to avoid hydration errors
  useEffect(() => {
    setWaveformBars(
      Array.from({ length: 28 }).map(() => ({
        height: `${Math.random() * 80 + 20}%`,
        duration: `${0.8 + Math.random() * 0.8}s`,
      }))
    );
  }, []);

  const currentTheme = THEME_OPTIONS[selectedIndex];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-body selection:bg-primary overflow-x-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
        
        .typing-container {
          font-family: 'Great Vibes', cursive;
        }

        .cursor {
          width: 2px;
          height: 35px;
          background-color: #e11d48;
          margin-left: 5px;
          animation: blink 0.8s infinite;
        }

        @keyframes blink { 50% { opacity: 0; } }

        .cta-button {
          background: linear-gradient(90deg, #e11d48, #9f1239);
          box-shadow: 0 8px 20px rgba(225, 29, 72, 0.2);
        }

        @keyframes progress-ani {
          0% { width: 38%; }
          100% { width: 100%; }
        }
        .animate-progress-live {
          animation: progress-ani 20s linear infinite;
        }

        @keyframes wave-ani {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.3); }
        }
        .animate-wave-bar {
          animation: wave-ani 1.2s ease-in-out infinite;
        }

        @keyframes pulse-heart {
          0%, 100% { box-shadow: 0 0 0 0 rgba(225, 29, 72, 0.4); }
          50% { box-shadow: 0 0 0 5px transparent; }
        }
        .animate-pulse-heart {
          animation: pulse-heart 1.5s ease-in-out infinite;
        }

        @keyframes blink-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .animate-blink-dot {
          animation: blink-dot 1.5s ease-in-out infinite;
        }
      `}</style>

      {/* Top Bar */}
      <div className="bg-gradient-to-r from-[#7f1d1d] to-[#1a0a0d] text-[12px] text-center py-2 text-[#fecaca] font-medium">
        ⚡ Apenas hoje — Todos os planos com <strong>50% OFF</strong> de desconto, aproveite! <u className="cursor-pointer ml-1">Ver planos</u>
      </div>

      {/* Header */}
      <header className="flex justify-between items-center px-[5%] md:px-[8%] py-4 bg-[#0a0a0a]/95 border-b border-[#1a1a1a] sticky top-0 z-[100] backdrop-blur-md">
        <div className="logo flex items-center gap-3 shrink-0">
          <NextImage 
            src="https://s3.typebotstorage.com/public/workspaces/cm7vfrzsh0001xixq5auwzryb/typebots/cmor2i57p000007huwd9cnpp5/blocks/rnrd9dgoh72piuhxaqenuibb?v=1777891185088" 
            alt="Eternize Logo" 
            width={48} 
            height={48} 
            className="h-10 md:h-12 w-auto object-contain"
            priority
          />
          <span className="text-xl md:text-2xl font-black italic tracking-tighter uppercase text-white">ETERNIZE</span>
        </div>
        <nav className="hidden lg:flex">
          <NextLink href="/" className="mx-4 text-[13px] opacity-80 hover:opacity-100 hover:text-primary transition-all">Início</NextLink>
          <NextLink href="#" className="mx-4 text-[13px] opacity-80 hover:opacity-100 hover:text-primary transition-all">Como funciona?</NextLink>
          <NextLink href="#" className="mx-4 text-[13px] opacity-80 hover:opacity-100 hover:text-primary transition-all">Planos</NextLink>
          <NextLink href="#" className="mx-4 text-[13px] opacity-80 hover:opacity-100 hover:text-primary transition-all">F.A.Q</NextLink>
        </nav>
        <div className="flex items-center gap-4 md:gap-6">
          <NextLink href="/login" className="hidden md:block text-[13px] font-semibold hover:text-primary transition-colors">Fazer Login</NextLink>
          <NextLink href="/criador" className="bg-primary px-5 py-2.5 rounded-full text-white font-bold text-[13px] hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20">
            Criar minha página
          </NextLink>
        </div>
      </header>

      {/* Hero Section */}
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

        {/* Visual Carousel */}
        <div className="flex flex-col items-center justify-center w-full relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200 py-10">
          <div className="relative w-full max-w-[400px] flex flex-col items-center">
            <div className="w-full overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {THEME_OPTIONS.map((theme, i) => {
                  const isSelected = selectedIndex === i;
                  const videoId = (theme as any).videoUrl;

                  return (
                    <div 
                      key={theme.id} 
                      className="flex-[0_0_100%] min-w-0 px-10 flex items-center justify-center transition-opacity duration-500"
                      style={{ 
                        opacity: isSelected ? 1 : 0.2,
                        zIndex: isSelected ? 50 : 10
                      }}
                    >
                      <div 
                        className={cn(
                          "relative bg-[#141414] rounded-[24px] overflow-hidden transition-all duration-500 w-full max-w-[280px] aspect-[3/4.8] border-2",
                          isSelected 
                            ? "scale-100 opacity-100" 
                            : "scale-85 opacity-50 border-transparent grayscale-[0.3]"
                        )}
                        style={isSelected ? { 
                          borderColor: theme.color,
                          boxShadow: `0 0 40px ${theme.color}66, 0 0 80px ${theme.color}33`
                        } : {}}
                      >
                        <div className={cn(
                          "absolute top-0 left-0 right-0 h-[3px] z-30 transition-opacity duration-500",
                          isSelected ? "opacity-100" : "opacity-0"
                        )} 
                        style={{ background: `linear-gradient(90deg, transparent, ${theme.color}, transparent)` }}
                        />

                        <div className="absolute inset-0 bg-gradient-to-b from-[#1f1f1f] to-[#141414] z-10 overflow-hidden">
                          {videoId ? (
                            <div className="absolute inset-0 pointer-events-none">
                              <iframe
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full scale-[1.25] border-none"
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&playsinline=1&volume=0`}
                                allow="autoplay; encrypted-media"
                                tabIndex={-1}
                              />
                            </div>
                          ) : (
                            <NextImage 
                              src={theme.image} 
                              fill 
                              className="object-cover" 
                              alt={theme.name} 
                              priority
                              data-ai-hint="theme preview"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-20" />
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-5 z-30">
                          <div className="flex justify-between items-center mb-1">
                            <h2 className="text-white text-lg font-black m-0 font-inter">{theme.name}</h2>
                            <span 
                              className="px-2.5 py-0.5 rounded-full text-[0.6rem] font-black uppercase tracking-wider border"
                              style={{ 
                                backgroundColor: `${theme.color}22`, 
                                color: theme.color, 
                                borderColor: `${theme.color}44` 
                              }}
                            >
                              {theme.badge}
                            </span>
                          </div>

                          <p className="text-[#b3b3b3] text-[10px] leading-snug mb-4 font-medium line-clamp-2">
                            {theme.description}
                          </p>

                          <Dialog>
                            <DialogTrigger asChild>
                              <button 
                                className="w-full bg-white/5 border border-white/10 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-white/10 active:scale-95"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Ver demo
                              </button>
                            </DialogTrigger>
                            <DialogContent className="fixed inset-0 w-full h-[100dvh] p-0 bg-black border-none overflow-hidden flex flex-col z-[500] translate-x-0 translate-y-0 rounded-none max-w-none">
                              <DialogTitle className="sr-only">Demo {theme.name}</DialogTitle>
                              <DialogDescription className="sr-only">Visualização ao vivo do tema {theme.name}</DialogDescription>
                              <div className="flex-1 relative">
                                 <div className="absolute top-6 right-6 z-[600]">
                                    <DialogClose className="p-2.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all border border-white/20 shadow-2xl backdrop-blur-md">
                                       <X className="w-5 h-5" />
                                    </DialogClose>
                                 </div>
                                 <iframe 
                                   src={(theme as any).demoUrl || "#"} 
                                   className="w-full h-full border-none"
                                   title={`Demo ${theme.name}`}
                                 />
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button 
              onClick={scrollPrev}
              className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-90 z-20"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button 
              onClick={scrollNext}
              className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-90 z-20"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>

            <div className="flex gap-2.5 mt-8 shrink-0 z-20">
              {THEME_OPTIONS.map((theme, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    i === selectedIndex ? "w-7" : "w-1.5 bg-white/10"
                  )} 
                  style={i === selectedIndex ? { backgroundColor: theme.color } : {}}
                />
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                Selecionado: <span className="text-white" style={{ color: currentTheme.color }}>{currentTheme.name}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 md:py-32 flex flex-col items-center px-[5%] border-t border-white/5 bg-[#0a0a0a]">
        <div className="w-full max-w-[1100px] text-center">
          
          {/* Layout Mobile (Timeline Vertical) */}
          <div className="flex md:hidden flex-col items-start relative px-6 text-left gap-16">
            <div className="absolute left-[52px] top-10 bottom-10 w-px bg-white/10 z-0" />

            {STEPS.map((step) => (
              <div key={step.id} className="flex gap-8 relative z-10 w-full items-start">
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center font-black text-xl shrink-0 transition-transform active:scale-95"
                  style={{ 
                    backgroundColor: step.id === 1 ? '#e11d48' : step.id === 2 ? '#be123c' : step.id === 3 ? '#9f1239' : '#881337',
                    boxShadow: `0 0 30px ${step.glow}`
                  }}
                >
                  {step.id}
                </div>
                
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-2.5 mb-2">
                    <step.icon className="w-4 h-4 text-white/60" style={{ color: step.color }} />
                    <h3 className="text-lg font-extrabold text-white tracking-tight">{step.title}</h3>
                  </div>
                  <p className="text-[13.5px] text-white/40 leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Layout (Grid + Dots Line) */}
          <div className="hidden md:block">
            <div className="flex justify-between items-center relative mb-12 px-[10%]">
              <div className="absolute top-1/2 left-[12%] right-[12%] h-0 border-t-2 border-dotted border-white/10 -z-0" />
              
              {STEPS.map((step) => (
                <div 
                  key={step.id}
                  className="w-[60px] h-[60px] rounded-full flex items-center justify-center font-black text-[22px] z-10"
                  style={{ 
                    backgroundColor: step.id === 1 ? '#e11d48' : step.id === 2 ? '#be123c' : step.id === 3 ? '#9f1239' : '#881337',
                    boxShadow: `0 0 30px ${step.glow}`
                  }}
                >
                  {step.id}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-5 mb-20">
              {STEPS.map((step) => (
                <div key={step.id} className="bg-[#0d0d0d] border border-white/5 rounded-[20px] p-10 flex flex-col items-center transition-all duration-300 hover:border-white/15 hover:-translate-y-1">
                  <div className="w-[55px] h-[55px] bg-white/5 border border-white/5 rounded-[14px] flex items-center justify-center mb-6">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-[18px] font-bold mb-4">{step.title}</h3>
                  <p className="text-[13.5px] text-[#888] leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-8 mt-12 md:mt-20">
            <div className="w-[120px] h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_8px_#e11d48] opacity-80" />
            <h2 className="text-[32px] md:text-[42px] font-extrabold leading-tight text-white">
              Uma <span className="text-primary">declaração de amor</span> que<br className="hidden md:block" /> ficará para sempre.
            </h2>
            
            <NextLink href="/criador" className="bg-gradient-to-r from-primary to-red-800 text-white px-10 py-5 rounded-full text-[18px] font-bold inline-flex items-center gap-3 transition-all hover:scale-105 hover:shadow-[0_15px_35px_rgba(225,29,72,0.5)] shadow-[0_10px_25px_rgba(225,29,72,0.3)] group">
              Criar minha página agora →
            </NextLink>
          </div>
        </div>
      </section>

      {/* Interactive Dashboard Section */}
      <section className="py-24 bg-[#0a0a0a] border-t border-white/5">
        <div className="max-w-[900px] mx-auto px-6 flex flex-col gap-4">
          
          <div className="text-center mb-16 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-2">
               <Zap className="w-3 h-3 text-primary fill-primary" />
               <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Recursos Poderosos</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
              Tudo que sua página precisa
            </h2>
            <p className="text-white/40 text-sm md:text-lg max-xl font-medium leading-relaxed">
              Contador ao vivo, música, temas exclusivos e muito mais — para fazer<br className="hidden md:block" /> alguém chorar de emoção.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#1a1a1a] rounded-[14px] p-6 border border-[#2a2a2a]">
              <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.15em] uppercase text-[#888] mb-2.5">
                <Star className="w-3.5 h-3.5 text-primary" /> TEMAS
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Temas Exclusivos</h3>
              <p className="text-[12px] text-[#666] mb-4">4 estilos únicos para contar a história de vocês do jeito certo</p>
              
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'classic', label: 'Default', color: '#e11d48', icon: '❤️' },
                  { id: 'netflix', label: 'Netflix', color: '#e50914', icon: '▶' },
                  { id: 'spotify', label: 'Spotify', color: '#1db954', icon: '♫' },
                  { id: 'instagram', label: 'Insta', color: '#fd1d1d', icon: '✦', isGradient: true }
                ].map((t) => (
                  <div 
                    key={t.id}
                    onClick={() => setDashboardTheme(t.id)}
                    className={cn(
                      "bg-[#111] rounded-xl p-3 cursor-pointer border transition-all duration-200 hover:-translate-y-0.5",
                      dashboardTheme === t.id ? "border-primary" : "border-[#222] hover:border-[#444]"
                    )}
                  >
                    <div 
                      className="w-6 h-6 rounded-full mb-2.5 shadow-[0_0_10px_rgba(225,29,72,0.2)]" 
                      style={{ 
                        background: t.isGradient ? 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)' : t.color,
                        boxShadow: !t.isGradient ? `0 0 10px ${t.color}66` : 'none'
                      }}
                    />
                    <div className="flex flex-col gap-0.5 mb-2 opacity-30">
                      <div className="h-[3px] bg-white/40 rounded-full w-full" />
                      <div className="h-[3px] bg-white/40 rounded-full w-[60%]" />
                      <div className="h-[3px] bg-white/40 rounded-full w-[80%]" />
                    </div>
                    <div className="text-[9px] font-bold truncate flex items-center gap-1" style={{ color: dashboardTheme === t.id ? '#fff' : '#666' }}>
                      <span style={{ color: t.color }}>{t.icon}</span> {t.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1a1a1a] rounded-[14px] p-6 border border-[#2a2a2a]">
              <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.15em] uppercase text-[#888] mb-2.5">
                <Music className="w-3.5 h-3.5 text-[#1db954]" /> MÚSICA
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Música dedicada</h3>
              <p className="text-[12px] text-[#666] mb-4">A trilha sonora de vocês, sempre tocando em loop</p>
              
              <div className="bg-[#111] rounded-xl p-4 border border-[#222]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1db954] to-[#0f9040] flex items-center justify-center shrink-0">
                    <Music className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate">Sua música especial</div>
                    <div className="text-[11px] text-[#666]">Artista favorito</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#1db954] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                    <Play className="w-3.5 h-3.5 text-black fill-black ml-0.5" />
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="h-1 bg-[#2a2a2a] rounded-full overflow-hidden mb-1.5 relative">
                    <div className="h-full bg-[#1db954] rounded-full w-[38%] animate-progress-live" />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-[#555] tabular-nums">
                    <span>1:24</span><span>3:52</span>
                  </div>
                </div>

                <div className="flex items-end justify-center gap-0.5 h-7">
                  {waveformBars.map((bar, i) => (
                    <div 
                      key={i} 
                      className="w-[3px] bg-[#1db954] rounded-full animate-wave-bar opacity-70"
                      style={{ 
                        height: bar.height,
                        animationDelay: `${i * 0.06}s`,
                        animationDuration: bar.duration
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#1a1a1a] rounded-[14px] p-5 border border-[#2a2a2a]">
              <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.15em] uppercase text-[#888] mb-2.5">
                <Clock className="w-3.5 h-3.5 text-[#888]" /> CONTADOR
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Contador de tempo</h3>
              
              <div className="flex items-center justify-between bg-[#111] rounded-lg p-2.5 mb-3">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse-heart" />
                  Ana & João
                </div>
                <div className="text-[10px] font-bold text-[#555]">14 fev 2022</div>
              </div>

              <div className="grid grid-cols-4 gap-1.5 mb-3">
                {[
                  { val: counter.years, label: 'Anos' },
                  { val: counter.months, label: 'Meses' },
                  { val: counter.days, label: 'Dias' },
                  { val: counter.hours, label: 'Hours' }
                ].map((item, i) => (
                  <div key={i} className="bg-[#111] rounded-lg py-2.5 px-1 text-center border border-[#222]">
                    <div className="text-[20px] font-bold text-white leading-none mb-1 tabular-nums">{item.val}</div>
                    <div className="text-[8px] text-[#555] uppercase font-black tracking-wider">{item.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-[#555]">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-blink-dot" />
                atualizado em tempo real
              </div>
            </div>

            <div className="bg-[#1a1a1a] rounded-[14px] p-5 border border-[#2a2a2a]">
              <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.15em] uppercase text-[#888] mb-2.5">
                <Layout className="w-3.5 h-3.5 text-[#888]" /> MÓDULOS EXTRAS
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Módulos Interativos</h3>
              
              <div className="bg-[#111] rounded-xl p-3.5 border border-white/5 mb-3 hover:border-primary/20 transition-colors group">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Heart className="w-4 h-4 text-primary fill-primary" />
                  </div>
                  <div className="text-[13px] font-bold">Memórias</div>
                </div>
                <p className="text-[11px] text-[#555] leading-relaxed">Adicione fotos e momentos especiais do casal em uma galeria interativa.</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" style={{ width: '18px', borderRadius: '4px' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#333]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#333]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#333]" />
                </div>
                <div className="flex gap-1.5">
                  <button className="w-7 h-7 rounded-md border border-[#2a2a2a] bg-[#111] flex items-center justify-center text-[#888] hover:border-primary hover:text-primary transition-all"><ChevronLeft className="w-4 h-4" /></button>
                  <button className="w-7 h-7 rounded-md border border-[#2a2a2a] bg-[#111] flex items-center justify-center text-[#888] hover:border-primary hover:text-primary transition-all"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1a] rounded-[14px] p-5 border border-[#2a2a2a]">
              <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.15em] uppercase text-[#888] mb-2.5">
                <QrCode className="w-3.5 h-3.5 text-[#888]" /> QR CODE
              </div>
              <h3 className="text-xl font-bold text-white mb-1">QR Code exclusivo</h3>
              
              <div className="flex gap-3 mb-3">
                <div className="bg-[#111] rounded-xl p-2 border border-[#222] shrink-0">
                  <svg width="60" height="60" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
                    <rect width="70" height="70" fill="#111"/>
                    <rect x="5" y="5" width="20" height="20" rx="2" fill="#e11d48"/>
                    <rect x="8" y="8" width="14" height="14" rx="1" fill="#111"/>
                    <rect x="10" y="10" width="10" height="10" rx="1" fill="#e11d48"/>
                    <rect x="45" y="5" width="20" height="20" rx="2" fill="#e11d48"/>
                    <rect x="48" y="8" width="14" height="14" rx="1" fill="#111"/>
                    <rect x="50" y="10" width="10" height="10" rx="1" fill="#e11d48"/>
                    <rect x="5" y="45" width="20" height="20" rx="2" fill="#e11d48"/>
                    <rect x="8" y="48" width="14" height="14" rx="1" fill="#111"/>
                    <rect x="10" y="50" width="10" height="10" rx="1" fill="#e11d48"/>
                    <rect x="30" y="5" width="4" height="4" fill="#e11d48"/>
                    <rect x="37" y="5" width="4" height="4" fill="#e11d48"/>
                    <rect x="30" y="11" width="4" height="4" fill="#e11d48"/>
                    <rect x="30" y="17" width="4" height="4" fill="#e11d48"/>
                    <rect x="37" y="17" width="4" height="4" fill="#e11d48"/>
                    <rect x="5" y="30" width="4" height="4" fill="#e11d48"/>
                    <rect x="11" y="30" width="4" height="4" fill="#e11d48"/>
                    <rect x="17" y="30" width="4" height="4" fill="#e11d48"/>
                    <rect x="5" y="37" width="4" height="4" fill="#e11d48"/>
                    <rect x="17" y="37" width="4" height="4" fill="#e11d48"/>
                    <rect x="30" y="30" width="4" height="4" fill="#e11d48"/>
                    <rect x="37" y="30" width="4" height="4" fill="#e11d48"/>
                    <rect x="44" y="30" width="4" height="4" fill="#e11d48"/>
                    <rect x="51" y="30" width="4" height="4" fill="#e11d48"/>
                    <rect x="58" y="30" width="4" height="4" fill="#e11d48"/>
                    <rect x="30" y="37" width="4" height="4" fill="#e11d48"/>
                    <rect x="44" y="37" width="4" height="4" fill="#e11d48"/>
                    <rect x="58" y="37" width="4" height="4" fill="#e11d48"/>
                    <rect x="30" y="44" width="4" height="4" fill="#e11d48"/>
                    <rect x="37" y="44" width="4" height="4" fill="#e11d48"/>
                    <rect x="51" y="44" width="4" height="4" fill="#e11d48"/>
                    <rect x="30" y="51" width="4" height="4" fill="#e11d48"/>
                    <rect x="44" y="51" width="4" height="4" fill="#e11d48"/>
                    <rect x="58" y="51" width="4" height="4" fill="#e11d48"/>
                    <rect x="30" y="58" width="4" height="4" fill="#e11d48"/>
                    <rect x="37" y="58" width="4" height="4" fill="#e11d48"/>
                    <rect x="51" y="58" width="4" height="4" fill="#e11d48"/>
                    <text x="35" y="25" textAnchor="middle" fontSize="10" fill="#e11d48">♥</text>
                  </svg>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-[11px] text-[#888] leading-tight mb-2">Escaneie o QR Code para acessar sua página diretamente do celular.</p>
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-[#1db954] bg-[#1db95411] px-2.5 py-1 rounded-full w-fit">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1db954]" /> EXCLUSIVO
                  </div>
                </div>
              </div>

              <div className="bg-[#111] rounded-xl p-3 border border-[#222]">
                <div className="text-[9px] font-black text-[#555] uppercase tracking-wider mb-0.5">Link da página</div>
                <div className="text-[13px] font-bold text-primary truncate">eternizee.shop/seu-amor</div>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-gradient-to-br from-[#1a0008] to-[#0d0005] rounded-[14px] p-8 border border-[#2a0010] relative overflow-hidden group">
            <div className="absolute top-[-50%] left-[-20%] w-[60%] h-[150%] bg-[radial-gradient(ellipse,_rgba(225,29,72,0.05)_0%,_transparent_70%)] pointer-events-none" />
            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-1.5 bg-[#2a0010] border border-[#4a0020] rounded-full px-3 py-1.5 text-[11px] font-bold text-primary">
                <Star className="w-3 h-3 fill-current" /> Tema {THEME_OPTIONS[previewThemeIndex].name}
              </div>
              <div className="text-[12px] font-bold text-[#555] tabular-nums">0{previewThemeIndex + 1} / 04</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start relative z-10">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#888] mb-3">
                  <Heart className="w-3 h-3 text-primary fill-primary" /> Tema
                </div>
                <h2 className="text-5xl font-black text-primary mb-4 tracking-tighter transition-all duration-500" style={{ textShadow: '0 0 40px rgba(225,29,72,0.3)', color: THEME_OPTIONS[previewThemeIndex].color }}>
                  {THEME_OPTIONS[previewThemeIndex].name}
                </h2>
                <p className="text-[13.5px] text-[#666] leading-relaxed mb-8 max-w-[320px] font-medium">
                  {THEME_OPTIONS[previewThemeIndex].description}
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="bg-primary hover:bg-red-700 text-white px-5 py-3 rounded-lg text-sm font-bold flex items-center gap-2 w-fit transition-all hover:shadow-[0_8px_20px_rgba(225,29,72,0.3)] hover:-translate-y-0.5 active:scale-95" style={{ backgroundColor: THEME_OPTIONS[previewThemeIndex].color }}>
                      <ExternalLink className="w-4 h-4" /> Ver demo ao vivo
                    </button>
                  </DialogTrigger>
                  <DialogContent className="fixed inset-0 w-full h-[100dvh] p-0 bg-black border-none overflow-hidden flex flex-col z-[500] translate-x-0 translate-y-0 rounded-none max-w-none">
                    <DialogTitle className="sr-only">Demo {THEME_OPTIONS[previewThemeIndex].name}</DialogTitle>
                    <DialogDescription className="sr-only">Visualização ao vivo do tema {THEME_OPTIONS[previewThemeIndex].name}</DialogDescription>
                    <div className="flex-1 relative">
                       <div className="absolute top-6 right-6 z-[600]">
                          <DialogClose className="p-2.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all border border-white/20 shadow-2xl backdrop-blur-md">
                             <X className="w-5 h-5" />
                          </DialogClose>
                       </div>
                       <iframe 
                         src={(THEME_OPTIONS[previewThemeIndex] as any).demoUrl || "#"} 
                         className="w-full h-full border-none"
                         title={`Demo ${THEME_OPTIONS[previewThemeIndex].name}`}
                       />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="aspect-[4/3] rounded-2xl bg-[#0d0005] border border-[#2a0010] overflow-hidden relative flex items-center justify-center shadow-2xl">
                 {(THEME_OPTIONS[previewThemeIndex] as any).videoUrl ? (
                   <div className="absolute inset-0 pointer-events-none">
                     <iframe
                       className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full scale-[1.25] border-none opacity-40 group-hover:opacity-60 transition-opacity"
                       src={`https://www.youtube.com/embed/${(THEME_OPTIONS[previewThemeIndex] as any).videoUrl}?autoplay=1&mute=1&loop=1&playlist=${(THEME_OPTIONS[previewThemeIndex] as any).videoUrl}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&playsinline=1&volume=0`}
                       allow="autoplay; encrypted-media"
                       tabIndex={-1}
                     />
                   </div>
                 ) : (
                   <NextImage 
                     src={THEME_OPTIONS[previewThemeIndex].image} 
                     fill 
                     className="object-cover opacity-20 grayscale-[0.5] group-hover:opacity-30 group-hover:scale-105 transition-all duration-700" 
                     alt="Theme preview" 
                   />
                 )}
                 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,_rgba(225,29,72,0.05)_0%,_transparent_70%)]" />
                 <Heart className="w-12 h-12 text-primary opacity-20 group-hover:opacity-40 transition-opacity" />
              </div>
            </div>

            <div className="flex items-center justify-between mt-8 relative z-10">
              <div className="flex gap-2">
                {[0, 1, 2, 3].map((idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setPreviewThemeIndex(idx)}
                    className={cn(
                      "h-1.5 rounded-full cursor-pointer transition-all duration-300",
                      previewThemeIndex === idx ? "w-6 bg-primary" : "w-1.5 bg-[#333]"
                    )} 
                    style={{ backgroundColor: previewThemeIndex === idx ? THEME_OPTIONS[idx].color : undefined }}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setPreviewThemeIndex((prev) => (prev - 1 + 4) % 4)}
                  className="w-8 h-8 rounded-lg border border-[#2a2a2a] bg-[#111] flex items-center justify-center text-[#888] hover:border-primary hover:text-primary transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setPreviewThemeIndex((prev) => (prev + 1) % 4)}
                  className="w-8 h-8 rounded-lg border border-[#2a2a2a] bg-[#111] flex items-center justify-center text-[#888] hover:border-primary hover:text-primary transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 md:py-24 bg-[#0a0a0a] border-t border-white/5 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 text-white/40 text-[12px] mb-4 relative group">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-primary rounded-full"></div>
            <Star className="w-3.5 h-3.5" />
            Avaliações reais
          </div>

          <h2 className="text-3xl md:text-6xl font-black text-center leading-tight tracking-tight mb-4">
            70.000 casais não podem<br /> <span className="text-primary">estar errados.</span>
          </h2>
          
          <p className="text-white/40 text-center text-sm md:text-lg max-w-md mb-8 font-medium">
            Histórias reais de quem criou algo especial e fez alguém chorar de emoção — do jeito bom.
          </p>

          <div className="bg-[#111] border border-white/10 rounded-2xl flex items-center mb-10 overflow-hidden shadow-2xl">
            <div className="px-5 py-3 border-r border-white/5 text-center">
              <div className="text-2xl font-black text-white leading-none mb-1">4.9</div>
              <div className="flex gap-0.5 justify-center">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />)}
              </div>
            </div>
            <div className="px-5 py-3 flex items-center gap-3">
              <div className="flex -space-x-2">
                {AVATAR_DATA.map((a, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-[#111] flex items-center justify-center text-[8px] font-black text-white shadow-md" style={{ background: a.color }}>
                    {a.initials}
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <strong className="text-xs font-black text-white">+70.000</strong>
                <span className="text-[9px] text-white/30 font-bold uppercase tracking-wider">avaliações</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 1 - Scroll Left */}
        <div className="relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:bottom-0 before:w-32 before:bg-gradient-to-r before:from-black before:to-transparent before:z-10 after:absolute after:right-0 after:top-0 after:bottom-0 after:w-32 after:bg-gradient-to-l after:from-black after:to-transparent after:z-10">
          <div className="flex gap-4 w-max animate-scroll-left px-4">
            {[...REVIEWS_1, ...REVIEWS_1].map((review, i) => (
              <ReviewCard key={i} review={review} />
            ))}
          </div>
        </div>

        {/* Row 2 - Scroll Right */}
        <div className="relative w-full overflow-hidden mt-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-32 before:bg-gradient-to-r before:from-black before:to-transparent before:z-10 after:absolute after:right-0 after:top-0 after:bottom-0 after:w-32 after:bg-gradient-to-l after:from-black after:to-transparent after:z-10">
          <div className="flex gap-4 w-max animate-scroll-right px-4">
            {[...Array.from({length: 10})].map((_, i) => (
              <ReviewCard key={i} review={REVIEWS_2[i % REVIEWS_2.length]} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 md:py-20 bg-[#0a0a0a] border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full mb-4">
              <Crown className="w-3 h-3 text-primary" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60">Escolha seu plano</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase mb-4">Uma memória que dura para sempre</h2>
            <p className="text-white/40 text-sm md:text-base max-xl mx-auto font-medium leading-relaxed">
              Pague uma vez e guarde essa história para sempre. Sem mensalidades, sem surpresas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <div className="bg-[#0c0c0c] border border-white/5 rounded-[2rem] p-7 flex flex-col transition-all duration-500 hover:border-white/10 group">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-black italic uppercase tracking-tight">1 semana</h3>
                  <p className="text-white/30 text-[11px] font-medium max-w-[180px]">Acesso por 1 semana. Todas as funcionalidades incluídas.</p>
                </div>
                <div className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg text-[9px] font-black text-white/40 uppercase">1s</div>
              </div>

              <div className="mb-6 pt-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black">R$ 21,00</span>
                  <span className="text-white/20 text-[10px] font-bold">/por 1 semana</span>
                </div>
              </div>

              <div className="space-y-3 mb-8 flex-1">
                {[
                  "Contador em tempo real",
                  "Texto dedicado",
                  "URL personalizada",
                  "QR Code exclusivo",
                  "Até 4 fotos",
                  "Suporte 24 horas",
                  "Música dedicada",
                  "Módulos extras"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-white/40" strokeWidth={3} />
                    </div>
                    <span className="text-xs font-bold text-white/40">{item}</span>
                  </div>
                ))}
              </div>

              <NextLink href="/criador" className="w-full h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all active:scale-95 gap-2">
                Criar minha página <ChevronRight className="w-3.5 h-3.5" />
              </NextLink>
            </div>

            <div className="relative bg-[#0c0c0c] border-2 border-primary/30 rounded-[2rem] p-7 flex flex-col transition-all duration-500 shadow-[0_0_80px_rgba(225,29,72,0.15)] group scale-[1.02] z-10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-red-800 text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-2xl shadow-primary/40 animate-pulse">
                <Star className="w-2.5 h-2.5 fill-current" /> MAIS POPULAR
              </div>

              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-black italic uppercase tracking-tight">Para sempre</h3>
                  <p className="text-white/40 text-[11px] font-medium max-w-[180px]">Sem prazo. Sua história fica guardada para sempre.</p>
                </div>
                <div className="bg-primary/20 border border-primary/30 px-2 py-0.5 rounded-lg text-[9px] font-black text-primary uppercase flex items-center gap-1">
                  <Infinity className="w-2.5 h-2.5" /> Vitalício
                </div>
              </div>

              <div className="mb-6 pt-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-white">R$ 29,77</span>
                  <span className="text-white/30 text-[10px] font-bold">/uma vez</span>
                </div>
              </div>

              <div className="space-y-3 mb-8 flex-1">
                {[
                  "Contador em tempo real",
                  "Texto dedicado",
                  "URL personalizada",
                  "QR Code exclusivo",
                  "Até 8 fotos",
                  "Suporte 24 horas",
                  "Música dedicada",
                  "Módulos extras",
                  "Acesso Ilimitado"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(225,29,72,0.2)]">
                      <Check className="w-2.5 h-2.5 text-primary" strokeWidth={4} />
                    </div>
                    <span className="text-xs font-bold text-white/80">{item}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <NextLink href="/criador" className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-red-900 flex items-center justify-center font-black uppercase tracking-widest text-[10px] shadow-[0_15px_30px_rgba(225,29,72,0.4)] hover:brightness-110 transition-all active:scale-95 gap-2">
                  Criar minha página <ChevronRight className="w-3.5 h-3.5" />
                </NextLink>
                <p className="text-[9px] text-center text-white/20 font-bold uppercase tracking-widest">Sem mensalidades. Pague uma vez, guarde para sempre.</p>
              </div>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex flex-col items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/5 transition-all">
                <ShieldCheck className="w-5 h-5 text-white/40 group-hover:text-primary" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-white/40 group-hover:text-white/60">Pagamento seguro</span>
            </div>
            <div className="flex flex-col items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/5 transition-all">
                <CreditCard className="w-5 h-5 text-white/40 group-hover:text-primary" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-white/40 group-hover:text-white/60">Cartão ou Pix</span>
            </div>
            <div className="flex flex-col items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/5 transition-all">
                <Users className="w-5 h-5 text-white/40 group-hover:text-primary" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-white/40 group-hover:text-white/60">+70.000 casais</span>
            </div>
            <div className="flex flex-col items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/5 transition-all">
                <Headphones className="w-5 h-5 text-white/40 group-hover:text-primary" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-white/40 group-hover:text-white/60">Suporte 24 horas</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#0a0a0a] border-t border-white/5 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          {/* Centered Header */}
          <div className="flex flex-col items-center text-center space-y-6 mb-16 md:mb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2.5 bg-white/5 border border-white/10 px-4 py-2 rounded-full relative group">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-primary rounded-full" />
              <HelpCircle className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">F.A.Q</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white leading-tight">
              Perguntas Frequentes
            </h2>
            
            <p className="text-white/40 text-xs md:text-base max-w-sm font-medium leading-relaxed">
              Tudo o que você precisa saber antes de criar sua página.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16 md:gap-24 items-start">
            
            {/* Left Column: Support */}
            <div className="space-y-12">
              <div className="bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] p-6 space-y-8 relative group overflow-hidden">
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                
                <div className="flex items-start gap-5 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-black text-white uppercase tracking-tight">Ainda tem dúvidas?</h4>
                    <p className="text-xs font-medium text-white/30 leading-relaxed">
                      Fale com a gente pelo Instagram — respondemos em minutos.
                    </p>
                  </div>
                </div>

                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  className="w-full h-14 bg-primary text-white rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_15px_30px_rgba(225,29,72,0.3)] relative z-10 px-6 text-center"
                >
                  <Instagram className="w-5 h-5 shrink-0" />
                  <span className="leading-tight">Fale com a gente no Instagram</span>
                </a>
              </div>
            </div>

            {/* Right Column: Accordion */}
            <div className="w-full">
              <Accordion type="single" collapsible className="w-full space-y-2">
                {FAQ_ITEMS.map((item) => (
                  <AccordionItem 
                    key={item.id} 
                    value={item.id} 
                    className="border-white/5 bg-transparent px-0 group"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-4 md:py-5">
                      <div className="flex items-center gap-4">
                        <span className="text-lg md:text-xl font-black text-white/10 group-data-[state=open]:text-primary transition-colors italic">
                          {item.id}
                        </span>
                        <span className="text-xs md:text-sm font-black text-white/80 group-data-[state=open]:text-white transition-all tracking-tight">
                          {item.question}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-8 pl-12 md:pl-14 text-white/40 text-[11px] md:text-[13px] font-medium leading-relaxed max-xl">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-[8%] border-t border-[#1a1a1a] flex flex-col md:flex-row justify-between items-center gap-4 text-[#555] text-[12px] font-medium">
        <p>© 2025 Eternize - Presentes Digitais Eternos.</p>
        <div className="flex gap-6">
          <NextLink href="#" className="hover:text-white transition-colors">Termos de Uso</NextLink>
          <NextLink href="#" className="hover:text-white transition-colors">Privacidade</NextLink>
          <NextLink href="#" className="hover:text-white transition-colors">Suporte</NextLink>
        </div>
      </footer>
    </div>
  );
}
