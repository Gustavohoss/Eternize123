
'use client';

import React from 'react';
import NextLink from 'next/link';

export function LandingFooter() {
  return (
    <footer className="py-12 border-t border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-[#555] text-[12px] font-medium">
        <div className="flex flex-col items-center md:items-start gap-2">
          <p>© 2025 Eternize - Presentes Digitais Eternos.</p>
          <p className="text-[10px] opacity-60">Criado com ❤️ para todos os tipos de amor.</p>
        </div>
        <div className="flex gap-8">
          <NextLink href="#" className="hover:text-white transition-colors">Termos de Uso</NextLink>
          <NextLink href="#" className="hover:text-white transition-colors">Privacidade</NextLink>
          <NextLink href="#" className="hover:text-white transition-colors">Suporte</NextLink>
        </div>
      </div>
    </footer>
  );
}
