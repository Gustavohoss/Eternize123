
'use client';

import React from 'react';
import NextLink from 'next/link';
import NextImage from 'next/image';

export function Header() {
  return (
    <header className="sticky top-0 z-[100] bg-[#0a0a0a]/95 border-b border-[#1a1a1a] backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
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
      </div>
    </header>
  );
}
