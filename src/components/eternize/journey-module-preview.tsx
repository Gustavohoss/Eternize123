
'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { X, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import 'leaflet/dist/leaflet.css';

// Import Leaflet components dynamically to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false });
const useMap = dynamic(() => import('react-leaflet').then(mod => mod.useMap), { ssr: false });

export interface JourneyPoint {
  id: string;
  title: string;
  date: string;
  description: string;
  photo: string;
  lat: number;
  lng: number;
  rotation?: string;
}

interface JourneyModulePreviewProps {
  points?: JourneyPoint[];
}

const DEFAULT_POINTS: JourneyPoint[] = [
  {
    id: '1',
    lat: -23.5505,
    lng: -46.6333,
    title: "São Paulo — onde tudo começou",
    date: "13/02/2022",
    description: "Nossa cidade, nosso lar. Aqui demos nosso primeiro passo juntos naquela tarde de fevereiro.",
    photo: "https://picsum.photos/seed/sp/600/800",
    rotation: "-5deg"
  },
  {
    id: '2',
    lat: -22.9068,
    lng: -43.1729,
    title: "Rio de Janeiro — maravilhosa",
    date: "20/05/2023",
    description: "Um final de semana inesquecível vendo o pôr do sol no Arpoador.",
    photo: "https://picsum.photos/seed/rio/600/800",
    rotation: "4deg"
  },
  {
    id: '3',
    lat: -27.5954,
    lng: -48.5480,
    title: "Florianópolis — ilha do amor",
    date: "10/01/2024",
    description: "Pés na areia e o barulho do mar. Onde renovamos nossas energias.",
    photo: "https://picsum.photos/seed/floripa/600/800",
    rotation: "-3deg"
  }
];

// Componente para controlar o vôo do mapa até o ponto selecionado
function MapController({ center }: { center: [number, number] }) {
  const map = (useMap as any)();
  useEffect(() => {
    if (center && map) {
      map.flyTo(center, 12, {
        duration: 2
      });
    }
  }, [center, map]);
  return null;
}

export function JourneyModulePreview({ points }: JourneyModulePreviewProps) {
  const [L, setL] = useState<any>(null);
  const [selectedPoint, setSelectedPoint] = useState<JourneyPoint | null>(null);

  useEffect(() => {
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
    });
  }, []);

  const displayPoints = points && points.length > 0 ? points : DEFAULT_POINTS;

  // Se o usuário adicionou um ponto agora, vamos focar nele
  const lastPoint = displayPoints[displayPoints.length - 1];
  const centerCoords: [number, number] = lastPoint ? [lastPoint.lat, lastPoint.lng] : [-15.78, -47.92];

  if (!L) return (
    <div className="w-full h-full bg-[#0d1117] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
    </div>
  );

  const createCustomIcon = (point: JourneyPoint) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="marcador-polaroid" style="transform: rotate(${point.rotation || '0deg'})">
          <img src="${point.photo || 'https://picsum.photos/seed/empty/200/200'}" alt="Foto">
          <div class="marcador-legenda">${point.title || 'Local'}</div>
        </div>
      `,
      iconSize: [64, 75],
      iconAnchor: [32, 37]
    });
  };

  const polylineCoords: [number, number][] = displayPoints.map(p => [p.lat, p.lng]);

  return (
    <div className="relative w-full h-full bg-[#0d1117] overflow-hidden text-white font-sans">
      <style jsx global>{`
        .marcador-polaroid {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          background: white;
          padding: 5px 5px 16px 5px;
          border-radius: 2px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
          width: 64px;
          transition: transform 0.2s ease;
          cursor: pointer;
        }
        .marcador-polaroid img {
          width: 54px;
          height: 54px;
          object-fit: cover;
          background: #eee;
          border-radius: 1px;
        }
        .marcador-legenda {
          font-size: 6px;
          font-weight: 800;
          color: #111;
          text-align: center;
          padding-top: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
          text-transform: uppercase;
        }
        .leaflet-container {
          background: #0d1117 !important;
        }
        .leaflet-control-attribution, .leaflet-control-zoom { display: none !important; }
      `}</style>

      {/* Cabeçalho */}
      <div className="absolute top-0 left-0 right-0 z-[1000] flex justify-between items-center px-4 py-6 bg-gradient-to-b from-[#0d1117]/95 to-transparent pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-[#161b22] border border-[#30363d] p-1.5 rounded-lg">
             <MapPin className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">Jornada no Mapa</span>
        </div>
      </div>

      {/* Mapa */}
      <MapContainer 
        center={centerCoords} 
        zoom={5} 
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        
        <MapController center={centerCoords} />

        {displayPoints.map((point) => (
          <Marker 
            key={point.id} 
            position={[point.lat, point.lng]} 
            icon={createCustomIcon(point)}
            eventHandlers={{
              click: () => setSelectedPoint(point),
            }}
          />
        ))}

        {polylineCoords.length > 1 && (
          <Polyline 
            positions={polylineCoords}
            color="#34d399"
            weight={2}
            opacity={0.5}
            dashArray="6, 6"
          />
        )}
      </MapContainer>

      {/* Badge de Lugares */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs shadow-2xl">
        <span className="text-emerald-400 animate-pulse">●</span>
        <span className="font-bold text-white">{displayPoints.length} lugares</span>
        <span className="text-white/40">· toque para explorar</span>
      </div>

      {/* Modal de Detalhes (Stories Style) */}
      {selectedPoint && (
        <div className="absolute inset-0 z-[2000] bg-black flex flex-col animate-in fade-in duration-300">
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/70 to-transparent">
            <button 
              onClick={() => setSelectedPoint(null)}
              className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <span className="font-semibold text-sm truncate max-w-[200px]">{selectedPoint.title}</span>
            <div className="w-8" />
          </div>

          <div className="flex-1 relative">
            <img src={selectedPoint.photo || 'https://picsum.photos/seed/empty/400/600'} className="w-full h-full object-cover" alt="" />
            <div className="absolute bottom-0 left-0 right-0 p-10 pb-16 text-center bg-gradient-to-t from-black/95 via-black/40 to-transparent">
              <p className="text-xs text-white/60 mb-2 font-mono">{selectedPoint.date}</p>
              <p className="text-base font-medium leading-relaxed">{selectedPoint.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
