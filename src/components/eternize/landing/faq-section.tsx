
'use client';

import React from 'react';
import { HelpCircle, MessageCircle, Instagram } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  { id: "01", question: "O que é a Eternize?", answer: "A Eternize é uma plataforma que permite criar presentes digitais personalizados e inesquecíveis para quem você ama." },
  { id: "02", question: "Como crio minha página personalizada?", answer: "É muito simples! Basta acessar nosso criador, escolher um tema, subir suas fotos, selecionar a trilha sonora e escrever sua mensagem." },
  { id: "03", question: "O que posso incluir na minha página?", answer: "Você pode incluir até 8 fotos, uma música do YouTube, um contador em tempo real, textos formatados, e módulos extras (conquistas, linha do tempo, curiosidades)." },
  { id: "04", question: "Como acesso minha página após o pagamento?", answer: "Assim que o pagamento for confirmado pela PerfectPay, você receberá o link exclusivo e um QR Code por e-mail e poderá acessar pelo painel." },
  { id: "05", question: "Posso editar minha página depois de criá-la?", answer: "Sim! Todos os nossos planos permitem edições posteriores ilimitadas através do seu painel de controle pessoal." },
  { id: "06", question: "Por quanto tempo minha página ficará disponível?", answer: "No plano 'Para Sempre', sua página fica guardada em nossos servidores de forma vitalícia, sem taxas recorrentes." },
  { id: "07", question: "Quais formas de pagamento são aceitas?", answer: "Aceitamos Pix (com liberação automática e instantânea) e Cartão de Crédito em até 12x." },
  { id: "08", question: "Como entro em contato com o suporte?", answer: "Nosso suporte funciona 24 horas por dia através do direct do nosso Instagram oficial." }
];

export function FAQSection() {
  return (
    <section className="py-24 md:py-32 bg-[#0a0a0a] border-t border-white/5 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col items-center text-center space-y-6 mb-20 md:mb-28 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2.5 bg-white/5 border border-white/10 px-4 py-2 rounded-full relative group">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-primary rounded-full" />
            <HelpCircle className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Dúvidas Frequentes</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white leading-tight uppercase italic italic-shadow">
            Tire suas dúvidas
          </h2>
          
          <p className="text-white/40 text-sm md:text-lg max-w-sm font-medium leading-relaxed">
            Tudo o que você precisa saber antes de eternizar sua história.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-20 md:gap-28 items-start">
          <div className="space-y-12">
            <div className="bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] p-8 space-y-10 relative group overflow-hidden">
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
              
              <div className="flex items-start gap-6 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-7 h-7 text-primary" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-black text-white uppercase tracking-tight">Suporte Prioritário</h4>
                  <p className="text-sm font-medium text-white/30 leading-relaxed">
                    Nossa equipe está online agora mesmo para te ajudar.
                  </p>
                </div>
              </div>

              <a 
                href="https://instagram.com" 
                target="_blank" 
                className="w-full h-16 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_15px_30px_rgba(225,29,72,0.3)] relative z-10"
              >
                <Instagram className="w-5 h-5" />
                <span>Chamar no Instagram</span>
              </a>
            </div>
          </div>

          <div className="w-full">
            <Accordion type="single" collapsible className="w-full space-y-3">
              {FAQ_ITEMS.map((item) => (
                <AccordionItem 
                  key={item.id} 
                  value={item.id} 
                  className="border-white/5 bg-transparent px-0 group"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-5 md:py-6">
                    <div className="flex items-center gap-5">
                      <span className="text-xl md:text-2xl font-black text-white/10 group-data-[state=open]:text-primary transition-colors italic">
                        {item.id}
                      </span>
                      <span className="text-sm md:text-base font-black text-white/80 group-data-[state=open]:text-white transition-all tracking-tight uppercase">
                        {item.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-10 pl-14 md:pl-16 text-white/40 text-[13px] md:text-[15px] font-medium leading-relaxed max-w-xl">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
