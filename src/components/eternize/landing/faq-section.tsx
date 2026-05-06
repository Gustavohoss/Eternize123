
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
  { id: "01", question: "O que é a Eternize?", answer: "A Eternize é uma plataforma que permite criar presentes digitais personalizados e inesquecíveis." },
  { id: "02", question: "Como crio minha página personalizada?", answer: "É muito simples! Basta acessar nosso criador, escolher um tema, subir suas fotos, selecionar a trilha sonora e escrever sua mensagem." },
  { id: "03", question: "O que posso incluir na minha página?", answer: "Você pode incluir até 8 fotos, uma música do YouTube, um contador em tempo real, textos formatados, e módulos extras." },
  { id: "04", question: "Como acesso minha página após o pagamento?", answer: "Assim que o pagamento for confirmado, você receberá o link exclusivo e um QR Code por e-mail." },
  { id: "05", question: "Posso editar minha página depois de criá-la?", answer: "Sim! Todos os nossos planos permitem edições posteriores através do painel de controle." },
  { id: "06", question: "Por quanto tempo minha página ficará disponível?", answer: "No plano 'Para Sempre', sua página fica guardada em nossos servidores por tempo indeterminado." },
  { id: "07", question: "Quais formas de pagamento são aceitas?", answer: "Aceitamos Pix (aprovação instantânea) e Cartão de Crédito (com parcelamento)." },
  { id: "08", question: "Como entro em contato com o suporte?", answer: "Nosso suporte funciona 24 horas por dia através do Instagram oficial." }
];

export function FAQSection() {
  return (
    <section className="py-24 bg-[#0a0a0a] border-t border-white/5 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
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
          <div className="space-y-12">
            <div className="bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] p-6 space-y-8 relative group overflow-hidden">
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
              
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
                className="w-full h-14 bg-primary text-white rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_15px_30px_rgba(225,29,72,0.3)] relative z-10"
              >
                <Instagram className="w-5 h-5" />
                <span>Fale com a gente no Instagram</span>
              </a>
            </div>
          </div>

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
                  <AccordionContent className="pb-8 pl-12 md:pl-14 text-white/40 text-[11px] md:text-[13px] font-medium leading-relaxed">
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
