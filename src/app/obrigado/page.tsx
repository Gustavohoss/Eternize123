
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Mail, LayoutGrid, ArrowRight, Heart, Sparkles, Instagram, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function ThankYouPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-body">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-hero-glow pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Confetti-like Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -20, opacity: 0 }}
            animate={{ 
              y: [0, 800], 
              opacity: [0, 1, 0],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: Math.random() * 3 + 2, 
              repeat: Infinity,
              delay: Math.random() * 5 
            }}
            className="absolute text-primary/40"
            style={{ left: `${Math.random() * 100}%`, fontSize: `${Math.random() * 20 + 10}px` }}
          >
            {Math.random() > 0.5 ? '❤️' : '✨'}
          </motion.div>
        ))}
      </div>

      <div className="max-w-2xl w-full relative z-20 flex flex-col items-center text-center">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col items-center gap-3"
        >
          <Image 
            src="https://s3.typebotstorage.com/public/workspaces/cm7vfrzsh0001xixq5auwzryb/typebots/cmor2i57p000007huwd9cnpp5/blocks/rnrd9dgoh72piuhxaqenuibb?v=1777891185088" 
            alt="Eternize Logo" 
            width={60} 
            height={60} 
            className="h-12 md:h-14 w-auto object-contain"
          />
          <span className="text-xl md:text-2xl font-black italic tracking-tighter uppercase text-white">ETERNIZE</span>
        </motion.div>

        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative bg-white/5 border border-white/10 rounded-full p-8 shadow-2xl">
            <CheckCircle2 className="w-16 h-16 text-primary" strokeWidth={2.5} />
          </div>
        </motion.div>

        {/* Main Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
            PAGAMENTO<br /><span className="text-primary">CONFIRMADO!</span>
          </h1>
          <p className="text-white/50 text-base md:text-lg max-w-md mx-auto font-medium leading-relaxed">
            Parabéns! Sua história agora está eternizada. Preparamos tudo com muito carinho para você surpreender quem você ama.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-12"
        >
          <div className="bg-[#0c0c0c] border border-white/5 rounded-3xl p-6 text-left space-y-4 transition-all hover:border-primary/20 group">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase italic text-white mb-1">Acesso via E-mail</h4>
              <p className="text-[11px] text-white/30 font-medium leading-relaxed uppercase tracking-widest">
                Enviamos os dados de acesso e o QR Code exclusivo para o e-mail utilizado na compra.
              </p>
            </div>
          </div>

          <div className="bg-[#0c0c0c] border border-white/5 rounded-3xl p-6 text-left space-y-4 transition-all hover:border-primary/20 group">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <LayoutGrid className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase italic text-white mb-1">Painel Liberado</h4>
              <p className="text-[11px] text-white/30 font-medium leading-relaxed uppercase tracking-widest">
                Sua página já está ativa! Você pode editá-la e ver o resultado agora mesmo no seu painel.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col gap-4 w-full max-w-md"
        >
          <Link href="/minhas-paginas" className="w-full">
            <Button className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-3">
              Acessar Minhas Páginas <LayoutGrid className="w-4 h-4" />
            </Button>
          </Link>
          
          <div className="flex gap-3">
             <a href="https://instagram.com" target="_blank" className="flex-1">
                <Button variant="outline" className="w-full h-14 rounded-2xl border-white/10 bg-white/5 font-black text-[10px] uppercase tracking-widest gap-2 hover:bg-white/10">
                   <Instagram className="w-3.5 h-3.5" /> Suporte
                </Button>
             </a>
             <Link href="/criador" className="flex-1">
                <Button variant="ghost" className="w-full h-14 rounded-2xl text-white/30 hover:text-white font-black text-[10px] uppercase tracking-widest gap-2">
                   Criar outro <Sparkles className="w-3.5 h-3.5" />
                </Button>
             </Link>
          </div>
        </motion.div>

        {/* Bottom Message */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1 }}
          className="mt-16 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2"
        >
          <Heart className="w-3 h-3 fill-current" /> Obrigado por escolher a Eternize
        </motion.p>
      </div>
    </div>
  );
}
