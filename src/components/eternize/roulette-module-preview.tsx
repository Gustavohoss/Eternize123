'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export function RouletteModulePreview() {
  const [currentRotation, setCurrentRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState('');

  const moments = [
    "O dia que nos conhecemos",
    "Aquele jantar especial", 
    "Nossa primeira janta",
    "Quando decidimos morar juntos",
    "Nosso primeiro beijo",
    "Nossa primeira viagem"
  ];

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const extraDegrees = Math.floor(Math.random() * 360);
    const totalSpins = (Math.floor(Math.random() * 5) + 5) * 360;
    const newRotation = currentRotation + totalSpins + extraDegrees;
    
    setCurrentRotation(newRotation);

    setTimeout(() => {
      const actualDeg = newRotation % 360;
      const sliceIndex = Math.floor(((360 - actualDeg) % 360) / 60);
      
      setResult(moments[sliceIndex]);
      setShowResult(true);
      setIsSpinning(false);
    }, 4000);
  };

  const closeModal = () => {
    setShowResult(false);
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-[#050505] flex items-center justify-center overflow-hidden font-sans">
      <style jsx>{`
        .wheel-wrapper {
            position: relative;
            width: 340px;
            height: 340px;
            margin: 0 auto;
        }

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

        .wheel-container {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 12px solid #1a0000;
            position: relative;
            overflow: hidden;
            transition: transform 4s cubic-bezier(0.15, 0, 0.15, 1);
            box-shadow: 0 0 40px rgba(255, 0, 0, 0.3);
        }

        .wheel-inner {
            list-style: none;
            width: 100%;
            height: 100%;
            padding: 0;
            margin: 0;
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
            font-size: 12px;
            font-weight: bold;
            color: #ffffff;
        }

        /* Cores Alternadas em tons de Vermelho e Preto */
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

        .center-btn {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 75px; height: 75px;
            background: #8B0000;
            border: 5px solid #050505;
            border-radius: 50%;
            z-index: 20;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 25px #FF0000;
        }

        @keyframes popIn { 
            from { transform: scale(0.5); opacity: 0; } 
            to { transform: scale(1); opacity: 1; } 
        }

        .animate-pop-in {
            animation: popIn 0.5s cubic-bezier(0.17, 0.89, 0.32, 1.49);
        }
      `}</style>

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#2a0000_0%,#050505_100%)] pointer-events-none" />

      <div className="relative z-10 text-center w-full px-5 flex flex-col items-center">
        <h1 className="text-[2.2rem] font-bold mb-2 leading-none">
          Roleta <span className="bg-gradient-to-r from-[#ff4d4d] to-[#8b0000] bg-clip-text text-transparent">Surpresa</span>
        </h1>
        <p className="text-[1.1rem] opacity-80 mb-10 max-w-[280px] mx-auto">Qual foi o melhor momento que vivemos juntos?</p>

        <div className="wheel-wrapper">
          <div 
            className="wheel-container" 
            style={{ transform: `rotate(${currentRotation}deg)` }}
          >
            <ul className="wheel-inner">
              <li className="slice" data-text="O dia que nos conhecemos"> <div className="slice-content"><span>O dia que...</span></div></li>
              <li className="slice" data-text="Nossa primeira viagem"> <div className="slice-content"><span>Nossa pr...</span></div></li>
              <li className="slice" data-text="Nosso primeiro beijo"> <div className="slice-content"><span>Nosso pr...</span></div></li>
              <li className="slice" data-text="Quando decidimos morar juntos"> <div className="slice-content"><span>Quando n...</span></div></li>
              <li className="slice" data-text="Nossa primeira janta"> <div className="slice-content"><span>Nossa pr...</span></div></li>
              <li className="slice" data-text="Aquele jantar especial"> <div className="slice-content"><span>Aquele j...</span></div></li>
            </ul>
          </div>
          <div className="center-btn" onClick={handleSpin}>
            <svg viewBox="0 0 24 24" width="32">
              <path fill="white" d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"/>
            </svg>
          </div>
        </div>

        <p className="mt-[50px] opacity-50 text-[0.8rem] tracking-[1px] uppercase font-bold">TOQUE NO BOTÃO PARA GIRAR</p>
      </div>

      {/* Modal de Resultado */}
      {showResult && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center backdrop-blur-md animate-in fade-in duration-300 p-6">
           <div className="bg-[#1a0000] p-8 md:p-10 rounded-[30px] border-2 border-[#FF0000] text-center shadow-[0_0_30px_rgba(255,0,0,0.4)] animate-pop-in max-w-[320px] w-full">
              <p className="text-[1.1rem] text-[#ffcccc] mb-1">O momento sorteado foi:</p>
              <h2 className="text-[#ff4d4d] text-[1.8rem] font-bold mb-8 leading-tight">{result}</h2>
              <button 
                onClick={closeModal}
                className="w-full bg-[#FF0000] text-white font-bold py-4 px-8 rounded-full text-base hover:scale-105 transition-transform active:scale-95 shadow-lg"
              >
                Girar novamente ❤️
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
