'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export function RouletteModulePreview() {
  const [currentRotation, setCurrentRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState('');

  // Ordem dos momentos alinhada com as fatias da roleta
  const moments = [
    "O dia que nos conhecemos",
    "Aquele jantar especial",
    "Nossa primeira janta",
    "Quando decidimos morar juntos",
    "Nosso primeiro beijo",
    "Nossa primeira viagem"
  ];

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const extraDegrees = Math.floor(Math.random() * 360);
    const totalSpins = (Math.floor(Math.random() * 5) + 5) * 360;
    
    // Rotação acumulativa para giro contínuo
    const newRotation = currentRotation + totalSpins + extraDegrees;
    setCurrentRotation(newRotation);

    setTimeout(() => {
      const actualDeg = newRotation % 360;
      // Lógica para identificar a fatia no topo (0 graus)
      const sliceIndex = Math.floor(((360 - actualDeg) % 360) / 60);
      
      setResult(moments[sliceIndex]);
      setShowResult(true);
      setIsSpinning(false);
    }, 4000);
  };

  return (
    <div className="relative w-full h-full min-h-[600px] flex items-center justify-center overflow-hidden bg-[#050505] text-white font-sans">
      <style jsx>{`
        .wheel-wrapper::before {
          content: "";
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          border-left: 15px solid transparent;
          border-right: 15px solid transparent;
          border-top: 20px solid #ffffff;
          z-index: 10;
        }

        .slice {
          overflow: hidden;
          position: absolute;
          top: 0;
          right: 0;
          width: 50%;
          height: 50%;
          transform-origin: 0% 100%;
        }

        .slice-content {
          position: absolute;
          left: -100%;
          width: 200%;
          height: 200%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .slice-content span {
          position: absolute;
          top: 45px;
          left: 50%;
          transform: translateX(-50%) rotate(30deg);
          text-align: center;
          width: 80px;
          font-size: 11px;
          font-weight: 900;
          color: #ffffff;
          text-transform: uppercase;
          line-height: 1.1;
        }

        /* Cores Alternadas e Posições */
        .slice:nth-child(1) { transform: rotate(0deg) skewY(-30deg); }
        .slice:nth-child(1) .slice-content { background-color: #1a0000; transform: skewY(30deg) rotate(30deg); }
        
        .slice:nth-child(2) { transform: rotate(60deg) skewY(-30deg); }
        .slice:nth-child(2) .slice-content { background-color: #4d0000; transform: skewY(30deg) rotate(30deg); }
        
        .slice:nth-child(3) { transform: rotate(120deg) skewY(-30deg); }
        .slice:nth-child(3) .slice-content { background-color: #8b0000; transform: skewY(30deg) rotate(30deg); }
        
        .slice:nth-child(4) { transform: rotate(180deg) skewY(-30deg); }
        .slice:nth-child(4) .slice-content { background-color: #1a0000; transform: skewY(30deg) rotate(30deg); }
        
        .slice:nth-child(5) { transform: rotate(240deg) skewY(-30deg); }
        .slice:nth-child(5) .slice-content { background-color: #4d0000; transform: skewY(30deg) rotate(30deg); }
        
        .slice:nth-child(6) { transform: rotate(300deg) skewY(-30deg); }
        .slice:nth-child(6) .slice-content { background-color: #8b0000; transform: skewY(30deg) rotate(30deg); }
      `}</style>

      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#2a0000_0%,#050505_100%)] pointer-events-none" />

      <div className="relative z-10 text-center w-full px-6 flex flex-col items-center">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-2">
          Roleta <span className="bg-gradient-to-r from-[#ff4d4d] to-[#8b0000] bg-clip-text text-transparent">Surpresa</span>
        </h1>
        <p className="text-white/60 text-sm font-medium mb-12 max-w-[280px]">Qual foi o melhor momento que vivemos juntos?</p>

        <div className="wheel-wrapper relative w-[320px] h-[320px] mb-12">
          <div 
            className="w-full h-full rounded-full border-[12px] border-[#1a0000] relative overflow-hidden shadow-[0_0_40px_rgba(255,0,0,0.3)] transition-transform duration-[4000ms] cubic-bezier(0.15, 0, 0.15, 1)"
            style={{ transform: `rotate(${currentRotation}deg)` }}
          >
            <ul className="w-full h-full relative list-none">
              <li className="slice"><div className="slice-content"><span>O dia que...</span></div></li>
              <li className="slice"><div className="slice-content"><span>Aquele j...</span></div></li>
              <li className="slice"><div className="slice-content"><span>Nossa pr...</span></div></li>
              <li className="slice"><div className="slice-content"><span>Quando n...</span></div></li>
              <li className="slice"><div className="slice-content"><span>Nosso pr...</span></div></li>
              <li className="slice"><div className="slice-content"><span>Nossa pr...</span></div></li>
            </ul>
          </div>

          <button 
            onClick={spinWheel}
            disabled={isSpinning}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#8b0000] border-4 border-[#050505] rounded-full z-20 flex items-center justify-center shadow-[0_0_25px_#ff0000] active:scale-90 transition-transform disabled:opacity-50 disabled:grayscale"
          >
            <svg viewBox="0 0 24 24" width="32" className={cn(isSpinning && "animate-spin")}><path fill="white" d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"/></svg>
          </button>
        </div>

        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 animate-pulse">Toque no botão para girar</p>
      </div>

      {/* Result Modal */}
      {showResult && (
        <div className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-300">
           <div className="bg-[#1a0000] p-10 rounded-[2.5rem] border-2 border-red-600 text-center shadow-[0_0_50px_rgba(255,0,0,0.4)] animate-in zoom-in-90 duration-500 max-w-[320px]">
              <p className="text-red-200 text-sm font-bold mb-1">O momento sorteado foi:</p>
              <h2 className="text-2xl font-black text-red-500 italic uppercase tracking-tighter mb-8 leading-tight">{result}</h2>
              <button 
                onClick={() => setShowResult(false)}
                className="bg-red-600 hover:bg-red-500 text-white font-black py-3 px-8 rounded-full text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"
              >
                Girar novamente ❤️
              </button>
           </div>
        </div>
      )}
    </div>
  );
}