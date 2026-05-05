
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface OrganicModuleGridProps {
  onModuleClick: (id: string) => void;
  pageTitle?: string;
}

export function OrganicModuleGrid({ onModuleClick, pageTitle }: OrganicModuleGridProps) {
  return (
    <div className="w-full px-2 mt-12 pb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <style jsx>{`
        .organic-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          width: 100%;
        }
        .organic-card {
          background: #fff;
          border: 2px solid #1a1a1a;
          border-radius: 12px 18px 12px 20px;
          display: flex;
          flex-direction: column;
          box-shadow: 3px 3px 0px #000;
          overflow: hidden;
          transition: transform 0.2s ease;
          cursor: pointer;
        }
        .organic-card:active { transform: scale(0.95); }
        .organic-card:nth-child(1), .organic-card:nth-child(4), .organic-card:nth-child(5) { transform: rotate(-1.5deg); }
        .organic-card:nth-child(2), .organic-card:nth-child(3), .organic-card:nth-child(6) { transform: rotate(1.5deg); }
        .organic-icon-area {
          height: 70px;
          margin: 4px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
        }
        .organic-label {
          padding: 6px 2px;
          text-align: center;
          color: #1a1a1a;
          font-family: 'Pacifico', cursive;
          font-size: 0.75rem;
          border-top: 2px solid #1a1a1a;
          background-color: #fff;
          white-space: nowrap;
        }
        .pink-bg { background-color: #ffeff1; color: #ff4d6d; }
        .yellow-bg { background-color: #fff9e6; color: #f9a825; }
        .purple-bg { background-color: #f5f0ff; color: #8e24aa; }
        .blue-bg { background-color: #f0f9ff; color: #039be5; }
        .green-bg { background-color: #f0fff4; color: #2e7d32; }
        .orange-bg { background-color: #fff4e6; color: #ef6c00; }
      `}</style>
      
      <div className="text-center mb-8">
        <h3 className="font-['Pacifico'] text-2xl text-neutral-500 font-normal">Para você</h3>
      </div>
      
      <div className="organic-grid">
        <div className="organic-card" onClick={() => onModuleClick('memorias')}>
          <div className="organic-icon-area pink-bg">♡</div>
          <div className="organic-label">Memórias</div>
        </div>
        <div className="organic-card" onClick={() => onModuleClick('conquistas')}>
          <div className="organic-icon-area yellow-bg">🏆</div>
          <div className="organic-label">Conquistas</div>
        </div>
        <div className="organic-card" onClick={() => onModuleClick('curiosidades')}>
          <div className="organic-icon-area purple-bg">✨</div>
          <div className="organic-label">Curiosidades</div>
        </div>
        <div className="organic-card">
          <div className="organic-icon-area blue-bg">☆</div>
          <div className="organic-label">Mapa Astral</div>
        </div>
        <div className="organic-card" onClick={() => onModuleClick('jornada')}>
          <div className="organic-icon-area green-bg">🧭</div>
          <div className="organic-label">Jornada</div>
        </div>
        <div className="organic-card">
          <div className="organic-icon-area orange-bg">⟳</div>
          <div className="organic-label">Surpresa</div>
        </div>
      </div>
    </div>
  );
}
