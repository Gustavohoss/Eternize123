
'use client';

import React from 'react';
import { Star, Check } from 'lucide-react';

const REVIEWS_1 = [
  { stars: 5, text: '"Gente, fiz isso pro meu mozão e ele CHOROU 😭 Nunca vi ele assim. As fotos, a música, o texto... tudo ficou perfeito."', name: 'Mariana & João', time: '1 mês atrás', initials: 'MJ', color: 'linear-gradient(135deg,#e11d48,#ff6b6b)' },
  { stars: 5, text: '"Fiz em menos de 10 minutos e o resultado parece coisa de designer profissional. Melhor presente que já dei na vida."', name: 'Ana & Pedro', time: '2 dias atrás', initials: 'AP', color: 'linear-gradient(135deg,#667eea,#764ba2)' },
  { stars: 5, text: '"Montei uma surpresa pra Carol com nossas fotos de viagem e a música do nosso primeiro beijo. Ela ficou emocionada demais!!"', name: 'Lucas & Carol', time: '3 meses atrás', initials: 'LC', color: 'linear-gradient(135deg,#f093fb,#f5576c)' },
  { stars: 5, text: '"Ele ficou completamente surpreso! Eu mesma me emocionei montando, de tanto que ficou bonito 💜 Recomendei pra todas as amigas."', name: 'Larissa & Tiago', time: '9 meses atrás', initials: 'LT', color: 'linear-gradient(135deg,#4facfe,#00f2fe)' },
  { stars: 5, text: '"Achei que ia ser difícil mas foi o contrário — rapidinho e ficou INCRÍVEL. Colocamos as músicas que marcaram nossa relação."', name: 'Clara & Rafael', time: '2 meses atrás', initials: 'CR', color: 'linear-gradient(135deg,#43e97b,#38f9d7)' },
];

const REVIEWS_2 = [
  { stars: 5, text: '"Criei pro meu mozão de surprise e ele ficou sem acreditar. Ele disse que foi o presente mais lindo que já recebeu ❤️"', name: 'Vanessa & Ricardo', time: '1 semana atrás', initials: 'VR', color: 'linear-gradient(135deg,#fa709a,#fee140)' },
  { stars: 5, text: '"Nossa página ficou tão linda que até eu piquei sem acreditar. Meu namorado abriu na frente dos amigos e todos quiseram fazer!"', name: 'Isabela & Bruno', time: '5 dias atrás', initials: 'IB', color: 'linear-gradient(135deg,#a8edea,#fed6e3)' },
  { stars: 5, text: '"Fiz de aniversário de namoro e mandei o link pelo WhatsApp. Ela ficou chorando de emoção e me ligou na hora. 🥹"', name: 'Felipe & Julia', time: '2 semanas atrás', initials: 'FJ', color: 'linear-gradient(135deg,#ffecd2,#fcb69f)' },
  { stars: 5, text: '"Simplesmente perfeito. Coloquei nossas fotos favoritas, a música que tocou no nosso primeiro encontro. Ela salvou pra sempre!"', name: 'Gabriel & Sofia', time: '4 meses atrás', initials: 'GS', color: 'linear-gradient(135deg,#d299c2,#fef9d7)' },
  { stars: 5, text: '"Presente mais original que já fiz na vida. Não custou quase nada mas pareceu que custou uma fortuna. Ela ficou sem palavras 💕"', name: 'Camila & André', time: '3 semanas atrás', initials: 'CA', color: 'linear-gradient(135deg,#89f7fe,#66a6ff)' },
];

const AVATAR_DATA = [
  {initials:'MJ', color:'linear-gradient(135deg,#e11d48,#ff6b6b)'},
  {initials:'AP', color:'linear-gradient(135deg,#667eea,#764ba2)'},
  {initials:'LC', color:'linear-gradient(135deg,#f093fb,#f5576c)'},
  {initials:'LT', color:'linear-gradient(135deg,#4facfe,#00f2fe)'},
  {initials:'CR', color:'linear-gradient(135deg,#43e97b,#38f9d7)'},
  {initials:'VR', color:'linear-gradient(135deg,#fa709a,#fee140)'},
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

export function ReviewsSection() {
  return (
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
          Histórias reais de quem criou algo especial e fez alguém chorar de emoção.
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

      <div className="relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:bottom-0 before:w-32 before:bg-gradient-to-r before:from-black before:to-transparent before:z-10 after:absolute after:right-0 after:top-0 after:bottom-0 after:w-32 after:bg-gradient-to-l after:from-black after:to-transparent after:z-10">
        <div className="flex gap-4 w-max animate-scroll-left px-4">
          {[...REVIEWS_1, ...REVIEWS_1].map((review, i) => (
            <ReviewCard key={i} review={review} />
          ))}
        </div>
      </div>

      <div className="relative w-full overflow-hidden mt-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-32 before:bg-gradient-to-r before:from-black before:to-transparent before:z-10 after:absolute after:right-0 after:top-0 after:bottom-0 after:w-32 after:bg-gradient-to-l after:from-black after:to-transparent after:z-10">
        <div className="flex gap-4 w-max animate-scroll-right px-4">
          {[...Array.from({length: 10})].map((_, i) => (
            <ReviewCard key={i} review={REVIEWS_2[i % REVIEWS_2.length]} />
          ))}
        </div>
      </div>
    </section>
  );
}
