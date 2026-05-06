
'use client';

import React from 'react';
import NextLink from 'next/link';

export function LandingFooter() {
  return (
    <footer className="py-8 px-[8%] border-t border-[#1a1a1a] flex flex-col md:flex-row justify-between items-center gap-4 text-[#555] text-[12px] font-medium">
      <p>© 2025 Eternize - Presentes Digitais Eternos.</p>
      <div className="flex gap-6">
        <NextLink href="#" className="hover:text-white transition-colors">Termos de Uso</NextLink>
        <NextLink href="#" className="hover:text-white transition-colors">Privacidade</NextLink>
        <NextLink href="#" className="hover:text-white transition-colors">Suporte</NextLink>
      </div>
    </footer>
  );
}
