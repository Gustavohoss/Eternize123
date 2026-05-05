
'use client';

import React, { useState } from 'react';
import { LayoutGrid, Check, X, CreditCard, Sparkles, Info, Plus, Image as ImageIcon, Trash2, Calendar, MessageSquare, Type } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface Memory {
  id: string;
  title: string;
  date: string;
  description: string;
  photo: string;
}

interface StepModulesEditProps {
  isPackEnabled: boolean;
  onPackToggle: (enabled: boolean) => void;
  memories: Memory[];
  onMemoriesChange: (memories: Memory[]) => void;
  onBack: () => void;
  onNext: () => void;
}

const compressImage = (base64Str: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 600;
      const MAX_HEIGHT = 600;
      let width = img.width;
      let height = img.height;
      if (width > height) { if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; } }
      else { if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; } }
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.6));
    };
  });
};

export function StepModulesEdit({ isPackEnabled, onPackToggle, memories, onMemoriesChange, onBack, onNext }: StepModulesEditProps) {
  const [editingMemoryId, setEditingMemoryId] = useState<string | null>(null);

  const addMemory = () => {
    if (memories.length >= 10) return;
    const newMemory: Memory = {
      id: Math.random().toString(36).substring(2, 9),
      title: 'Nova Memória',
      date: new Date().toLocaleDateString('pt-BR'),
      description: '',
      photo: ''
    };
    onMemoriesChange([...memories, newMemory]);
    setEditingMemoryId(newMemory.id);
  };

  const removeMemory = (id: string) => {
    onMemoriesChange(memories.filter(m => m.id !== id));
    if (editingMemoryId === id) setEditingMemoryId(null);
  };

  const updateMemory = (id: string, updates: Partial<Memory>) => {
    onMemoriesChange(memories.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const compressed = await compressImage(reader.result as string);
      updateMemory(id, { photo: compressed });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8 md:space-y-10 flex flex-col items-center md:items-start w-full max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-3 text-center md:text-left w-full">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="bg-white/5 p-2 rounded-2xl border border-white/10">
            <LayoutGrid className="w-5 h-5 md:w-6 md:h-6 text-white/80" />
          </div>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight">Personalizar Módulos</h2>
        </div>
        <p className="text-xs md:text-base text-white/40 font-medium">
          Personalize as seções extras que aparecerão no presente.
        </p>
      </div>

      <div className="w-full space-y-8">
        {/* Toggle do Pack */}
        <div 
          className={cn(
            "w-full bg-[#0c0c0c] border rounded-3xl p-6 flex flex-col gap-4 transition-all duration-300",
            isPackEnabled ? "border-primary/50 ring-1 ring-primary/10" : "border-white/5"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="bg-primary/20 p-2 rounded-xl">
                  <Sparkles className="w-5 h-5 text-primary" />
               </div>
               <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">Pack de Módulos</h4>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    {isPackEnabled ? 'Exibindo no site' : 'Oculto no site'}
                  </p>
               </div>
            </div>
            <Switch checked={isPackEnabled} onCheckedChange={onPackToggle} />
          </div>
        </div>

        {isPackEnabled && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
             <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                   <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/60">Linha do Tempo de Memórias</h3>
                </div>
                <span className="text-[10px] font-bold text-white/20">{memories.length}/10</span>
             </div>

             <div className="grid grid-cols-1 gap-4">
                {memories.map((memory, index) => (
                  <div 
                    key={memory.id}
                    className={cn(
                      "bg-[#0c0c0c] border rounded-[2rem] transition-all duration-300 overflow-hidden",
                      editingMemoryId === memory.id ? "border-primary/40 bg-primary/[0.02]" : "border-white/5 hover:border-white/10"
                    )}
                  >
                    <div 
                      className="p-5 flex items-center justify-between cursor-pointer"
                      onClick={() => setEditingMemoryId(editingMemoryId === memory.id ? null : memory.id)}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                         <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0 relative">
                            {memory.photo ? (
                              <Image src={memory.photo} fill className="object-cover" alt="" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-4 h-4 text-white/10" /></div>
                            )}
                         </div>
                         <div className="min-w-0">
                            <h4 className="text-xs font-black text-white truncate uppercase tracking-tight">{memory.title || `Memória ${index + 1}`}</h4>
                            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{memory.date}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-2">
                         <button 
                           onClick={(e) => { e.stopPropagation(); removeMemory(memory.id); }}
                           className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg text-white/20 transition-all"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                         <div className={cn("transition-transform duration-300", editingMemoryId === memory.id ? "rotate-180" : "")}>
                            <ChevronLeft className="w-4 h-4 text-white/20 -rotate-90" />
                         </div>
                      </div>
                    </div>

                    {editingMemoryId === memory.id && (
                      <div className="px-5 pb-6 space-y-5 border-t border-white/5 pt-6 animate-in slide-in-from-top-2">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                               <Label className="text-[9px] font-black uppercase text-white/40 ml-1 flex items-center gap-1.5"><Type className="w-2.5 h-2.5" /> Título curto</Label>
                               <Input 
                                 value={memory.title}
                                 onChange={(e) => updateMemory(memory.id, { title: e.target.value })}
                                 placeholder="Ex: Primeiro Encontro"
                                 className="bg-white/5 border-white/5 h-10 rounded-xl text-xs font-bold"
                               />
                            </div>
                            <div className="space-y-2">
                               <Label className="text-[9px] font-black uppercase text-white/40 ml-1 flex items-center gap-1.5"><Calendar className="w-2.5 h-2.5" /> Data</Label>
                               <Input 
                                 value={memory.date}
                                 onChange={(e) => updateMemory(memory.id, { date: e.target.value })}
                                 placeholder="Ex: 14 de Fevereiro, 2022"
                                 className="bg-white/5 border-white/5 h-10 rounded-xl text-xs font-bold"
                               />
                            </div>
                         </div>

                         <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase text-white/40 ml-1 flex items-center gap-1.5"><MessageSquare className="w-2.5 h-2.5" /> Descrição da memória</Label>
                            <Textarea 
                              value={memory.description}
                              onChange={(e) => updateMemory(memory.id, { description: e.target.value })}
                              placeholder="Conte o que aconteceu nesse dia..."
                              className="bg-white/5 border-white/5 min-h-[80px] rounded-xl text-xs leading-relaxed"
                            />
                         </div>

                         <div className="space-y-3">
                            <Label className="text-[9px] font-black uppercase text-white/40 ml-1 flex items-center gap-1.5"><ImageIcon className="w-2.5 h-2.5" /> Foto do momento</Label>
                            <div className="flex items-center gap-4">
                               <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0 group">
                                  {memory.photo ? (
                                    <>
                                      <Image src={memory.photo} fill className="object-cover" alt="" />
                                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                         <label className="cursor-pointer bg-white text-black p-1.5 rounded-full scale-90">
                                            <ImageIcon className="w-3 h-3" />
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(e, memory.id)} />
                                         </label>
                                      </div>
                                    </>
                                  ) : (
                                    <label className="w-full h-full flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-white/5 transition-all">
                                       <Plus className="w-4 h-4 text-white/20" />
                                       <span className="text-[7px] font-black uppercase text-white/20">Subir foto</span>
                                       <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(e, memory.id)} />
                                    </label>
                                  )}
                               </div>
                               <div className="flex-1 space-y-1">
                                  <p className="text-[10px] font-bold text-white/60">Uma imagem vale mais que mil palavras.</p>
                                  <p className="text-[9px] text-white/20 leading-relaxed">Recomendamos fotos quadradas ou verticais para melhor visualização na linha do tempo.</p>
                               </div>
                            </div>
                         </div>
                      </div>
                    )}
                  </div>
                ))}

                {memories.length < 10 && (
                  <button 
                    onClick={addMemory}
                    className="w-full h-16 rounded-[2rem] border-2 border-dashed border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10 transition-all flex items-center justify-center gap-3 text-white/20 hover:text-primary transition-all group"
                  >
                    <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-widest">Adicionar nova memória</span>
                  </button>
                )}
             </div>
          </div>
        )}

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-start gap-4">
          <Info className="w-5 h-5 text-white/30 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-[11px] font-black uppercase text-white/60 tracking-widest">Configuração Visual</p>
            <p className="text-[11px] font-medium text-white/30 leading-relaxed">
              As memórias aparecem em ordem de adição. Você pode clicar no título de uma memória para expandir os detalhes e editá-la.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
