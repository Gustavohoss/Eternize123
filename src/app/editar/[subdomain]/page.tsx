
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { doc, updateDoc, serverTimestamp, collection, getDocs, writeBatch, deleteDoc } from 'firebase/firestore';
import { useDoc, useFirestore, useUser } from '@/firebase';
import { DeviceMockup } from '@/components/eternize/device-mockup';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Loader2, Heart, Save, ArrowLeft, Maximize2, X, Pencil, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Step, ThemeId, MOCK_CITIES } from '@/app/criador/constants';
import { getContrastColor } from '@/lib/color-utils';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { type JourneyPoint } from '@/components/eternize/journey-module-preview';

// Step Components
import { StepCustomizeBackground } from '@/components/eternize/creator-steps/step-customize-background';
import { StepPhotos } from '@/components/eternize/creator-steps/step-photos';
import { StepPageTitle } from '@/components/eternize/creator-steps/step-page-title';
import { StepMessage } from '@/components/eternize/creator-steps/step-message';
import { StepMusic } from '@/components/eternize/creator-steps/step-music';
import { StepDataLocation } from '@/components/eternize/creator-steps/step-data-location';
import { StepModulesEdit } from '@/components/eternize/creator-steps/step-modules-edit';

export default function EditSitePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const subdomain = params.subdomain as string;
  const firestore = useFirestore();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const isMobile = useIsMobile();

  const siteRef = useMemo(() => {
    if (!firestore || !subdomain) return null;
    return doc(firestore, 'published_sites', subdomain);
  }, [firestore, subdomain]);

  const { data: siteData, isLoading: isDocLoading } = useDoc(siteRef as any);

  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isMediaLoading, setIsMediaLoading] = useState(true);
  const [step, setStep] = useState<Step>('customize-background');
  const [activeModulePreview, setActiveModulePreview] = useState<string | null>(null);

  const isModulesOnlyMode = useMemo(() => searchParams.get('startStep') === 'modules', [searchParams]);

  useEffect(() => { 
    setMounted(true); 
    if (searchParams.get('startStep') === 'modules') {
      setStep('modules');
    }
  }, [searchParams]);

  // States
  const [senderName, setSenderName] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>('classic');
  const [selectedBgColor, setSelectedBgColor] = useState<string>('#000000');
  const [selectedEffect, setSelectedEffect] = useState<string>('none');
  const [isEmojiRainEnabled, setIsEmojiRainEnabled] = useState<boolean>(false);
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>(['❤️']);
  const [emojiSize, setEmojiSize] = useState<number>(20);
  const [emojiRainPosition, setEmojiRainPosition] = useState<'behind' | 'front'>('behind');
  const [selectedCountStyle, setSelectedCountStyle] = useState<string>('padrao');
  const [photoEffect, setPhotoEffect] = useState<'slide' | 'coverflow' | 'fan'>('slide');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [pageTitle, setPageTitle] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [musicData, setMusicData] = useState<{id: string, title: string, thumb: string} | undefined>(undefined);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isPackEnabled, setIsPackEnabled] = useState<boolean>(false);
  const [hasPackPurchased, setHasPackPurchased] = useState<boolean>(false);
  const [memories, setMemories] = useState<any[]>([]);
  const [journeyPoints, setJourneyPoints] = useState<any[]>([]);
  const [spotifyCardPhoto, setSpotifyCardPhoto] = useState<string>('');
  
  const [sparklesDensity, setSparklesDensity] = useState<number>(100);
  const [sparklesSpeed, setSparklesSpeed] = useState<number>(0.5);
  const [sparklesColor, setSparklesColor] = useState<string>('#ffffff');
  const [smokeIntensity, setSmokeIntensity] = useState<number>(0.5);
  const [smokeColor, setSmokeColor] = useState<string>('#ffffff');
  const [patternDuration, setPatternDuration] = useState<number>(150);
  const [patternDensity, setPatternDensity] = useState<number>(1);
  const [patternColor, setPatternColor] = useState<string>('#ffffff');
  const [cardColor, setCardColor] = useState<string>('#ffffff');
  const [showCard, setShowCard] = useState<boolean>(true);
  const [titlePosition, setTitlePosition] = useState<'top' | 'bottom'>('bottom');
  const [titleColor, setTitleColor] = useState<string>('#111111');
  const [titleFont, setTitleFont] = useState<string>('dancing-script');
  const [titleIsBold, setTitleIsBold] = useState<boolean>(false);
  const [titleHasNeon, setTitleHasNeon] = useState<boolean>(false);
  const [titleNeonStrength, setTitleNeonStrength] = useState<number>(10);
  const [dateColor, setDateColor] = useState<string>('#ffffff');
  const [dateFont, setDateFont] = useState<string>('playfair');
  const [dateIsBold, setDateIsBold] = useState<boolean>(true);
  const [dateHasNeon, setDateHasNeon] = useState<boolean>(false);
  const [dateNeonStrength, setDateNeonStrength] = useState<number>(10);
  const [dateBoxBgColor, setDateBoxBgColor] = useState<string>('#1a1a1a');
  const [dateBoxBorderColor, setDateBoxBorderColor] = useState<string>('#2a2a2a');
  const [messageColor, setMessageColor] = useState<string>('#ffffff');
  const [messageFont, setMessageFont] = useState<string>('inter');
  const [musicBoxColor, setMusicBoxColor] = useState<string>('#0e0e0e');
  const [musicTextColor, setMusicTextColor] = useState<string>('#ffffff');
  const [musicHasNeon, setMusicHasNeon] = useState<boolean>(false);
  const [musicNeonStrength, setMusicNeonStrength] = useState<number>(15);
  const [isMusicAutoPlay, setIsMusicAutoPlay] = useState<boolean>(false);
  const [locationQuery, setLocationQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Registro de IDs que foram apagados no editor para remover do banco ao salvar
  const [deletedMediaIds, setDeletedMediaIds] = useState<string[]>([]);

  // BUSCA DADOS FRACIONADOS DA SUBCOLEÇÃO
  useEffect(() => {
    if (siteData && firestore) {
      const loadMedia = async () => {
        setIsMediaLoading(true);
        try {
          const config = JSON.parse(siteData.contentJson);
          
          const mediaSnap = await getDocs(collection(siteRef!, 'media'));
          const albumPhotos: string[] = [];
          let spotifyCard = '';
          const loadedMemories: any[] = [];
          const loadedJourneyPoints: any[] = [];

          mediaSnap.forEach(doc => {
            const data = doc.data();
            if (data.type === 'album') {
              const idx = parseInt(doc.id.split('_')[1]);
              albumPhotos[idx] = data.base64;
            } else if (data.type === 'spotify') {
              spotifyCard = data.base64;
            } else if (data.type === 'memory') {
              loadedMemories.push({
                id: doc.id.replace('memory_', ''),
                title: data.title || '',
                date: data.date || '',
                description: data.description || '',
                photo: data.photo || ''
              });
            } else if (data.type === 'journey') {
              loadedJourneyPoints.push({
                id: doc.id.replace('journey_', ''),
                title: data.title || '',
                date: data.date || '',
                description: data.description || '',
                photo: data.photo || '',
                lat: data.lat,
                lng: data.lng,
                rotation: data.rotation
              });
            }
          });

          setSenderName(config.senderName || '');
          setSelectedTheme(config.selectedTheme || 'classic');
          setSelectedBgColor(config.selectedBgColor || '#000000');
          setSelectedEffect(config.selectedEffect || 'none');
          setIsEmojiRainEnabled(config.isEmojiRainEnabled || false);
          setSelectedEmojis(config.selectedEmojis || ['❤️']);
          setEmojiSize(config.emojiSize || 20);
          setEmojiRainPosition(config.emojiRainPosition || 'behind');
          setSelectedCountStyle(config.selectedCountStyle || 'padrao');
          setPhotoEffect(config.photoEffect || 'slide');
          setDate(config.date ? new Date(config.date) : undefined);
          setPageTitle(config.pageTitle || '');
          setMessage(config.message || '');
          setMusicData(config.musicData);
          setUploadedPhotos(albumPhotos.filter(p => !!p));
          setSpotifyCardPhoto(spotifyCard);
          
          setMemories(loadedMemories);
          setJourneyPoints(loadedJourneyPoints);
          
          const packPurchased = siteData.isPackEnabled === true;
          setHasPackPurchased(packPurchased);
          setIsPackEnabled(config.isPackEnabled !== undefined ? config.isPackEnabled : packPurchased);
          
          // ... rest of config sync
          setSparklesDensity(config.sparklesDensity || 100);
          setSparklesSpeed(config.sparklesSpeed || 0.5);
          setSparklesColor(config.sparklesColor || '#ffffff');
          setSmokeIntensity(config.smokeIntensity || 0.5);
          setSmokeColor(config.smokeColor || '#ffffff');
          setPatternDuration(config.patternDuration || 150);
          setPatternDensity(config.patternDensity || 1);
          setPatternColor(config.patternColor || '#ffffff');
          setCardColor(config.cardColor || '#ffffff');
          setShowCard(config.showCard !== undefined ? config.showCard : true);
          setTitlePosition(config.titlePosition || 'bottom');
          setTitleColor(config.titleColor || '#111111');
          setTitleFont(config.titleFont || 'dancing-script');
          setTitleIsBold(config.titleIsBold || false);
          setTitleHasNeon(config.titleHasNeon || false);
          setTitleNeonStrength(config.titleNeonStrength || 10);
          setDateColor(config.dateColor || '#ffffff');
          setDateFont(config.dateFont || 'playfair');
          setDateIsBold(config.dateIsBold !== undefined ? config.dateIsBold : true);
          setDateHasNeon(config.dateHasNeon || false);
          setDateNeonStrength(config.dateNeonStrength || 10);
          setDateBoxBgColor(config.dateBoxBgColor || '#1a1a1a');
          setDateBoxBorderColor(config.dateBoxBorderColor || '#2a2a2a');
          setMessageColor(config.messageColor || '#ffffff');
          setMessageFont(config.messageFont || 'inter');
          setMusicBoxColor(config.musicBoxColor || '#0e0e0e');
          setMusicTextColor(config.musicTextColor || '#ffffff');
          setMusicHasNeon(config.musicHasNeon || false);
          setMusicNeonStrength(config.musicNeonStrength || 15);
          setIsMusicAutoPlay(config.isMusicAutoPlay || false);
          setLocationQuery(config.locationQuery || '');

        } catch (e) {
          console.error("Erro ao carregar mídia", e);
        } finally {
          setIsMediaLoading(false);
        }
      };
      loadMedia();
    }
  }, [siteData, firestore, siteRef]);

  const handleSave = async () => {
    if (!firestore || !siteRef || !user) return;
    setIsSaving(true);

    try {
      const contentData = {
        senderName, selectedTheme, selectedBgColor, selectedEffect, isEmojiRainEnabled, selectedEmojis,
        emojiSize, emojiRainPosition, selectedCountStyle, photoEffect, date: date?.toISOString(),
        pageTitle, message, musicData, sparklesDensity, sparklesSpeed, sparklesColor,
        smokeIntensity, smokeColor, patternDuration, patternDensity, patternColor, cardColor,
        showCard, titlePosition, titleColor, titleFont, titleIsBold, titleHasNeon, titleNeonStrength,
        dateColor, dateFont, dateIsBold, dateHasNeon, dateNeonStrength, dateBoxBgColor, dateBoxBorderColor,
        messageColor, messageFont, musicBoxColor, musicTextColor, musicHasNeon, musicNeonStrength,
        isMusicAutoPlay, locationQuery, isPackEnabled
      };

      await updateDoc(siteRef, {
        name: pageTitle || 'Meu Presente',
        contentJson: JSON.stringify(contentData),
        isPackEnabled: isPackEnabled,
        updatedAt: serverTimestamp(),
      });

      const batch = writeBatch(firestore);
      const mediaCollection = collection(siteRef, 'media');
      
      // Salva fotos do álbum
      uploadedPhotos.forEach((base64, index) => {
        batch.set(doc(mediaCollection, `album_${index}`), { base64, type: 'album' });
      });

      // Salva foto do spotify
      if (spotifyCardPhoto) {
        batch.set(doc(mediaCollection, 'spotify_card'), { base64: spotifyCardPhoto, type: 'spotify' });
      }

      // Salva Memórias (Metadados + Foto em 1 documento individual)
      memories.forEach(m => {
        batch.set(doc(mediaCollection, `memory_${m.id}`), {
          type: 'memory',
          title: m.title,
          date: m.date,
          description: m.description,
          photo: m.photo || ''
        });
      });

      // Salva Jornada (Metadados + Foto em 1 documento individual)
      journeyPoints.forEach(p => {
        batch.set(doc(mediaCollection, `journey_${p.id}`), {
          type: 'journey',
          title: p.title,
          date: p.date,
          description: p.description,
          photo: p.photo || '',
          lat: p.lat,
          lng: p.lng,
          rotation: p.rotation
        });
      });

      // Remove documentos apagados
      deletedMediaIds.forEach(id => {
        batch.delete(doc(mediaCollection, id));
      });

      await batch.commit();
      router.push('/minhas-paginas');
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      setIsSaving(false);
      alert("Erro ao salvar: " + (error.message || "Tente novamente."));
    }
  };

  const handleRemoveMemory = useCallback((id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
    setDeletedMediaIds(prev => [...prev, `memory_${id}`]);
  }, []);

  const handleRemoveJourneyPoint = useCallback((id: string) => {
    setJourneyPoints(prev => prev.filter(p => p.id !== id));
    setDeletedMediaIds(prev => [...prev, `journey_${id}`]);
  }, []);

  const stepSequence = useMemo(() => {
    const isFixed = selectedTheme === 'netflix' || selectedTheme === 'spotify' || selectedTheme === 'instagram';
    let steps: Step[] = isFixed ? ['data-location', 'page-title', 'message', 'photos', 'music'] : ['customize-background', 'photos', 'page-title', 'message', 'data-location', 'music'];
    if (hasPackPurchased) steps.push('modules');
    return steps;
  }, [selectedTheme, hasPackPurchased]);

  const currentStepIndex = stepSequence.indexOf(step);

  const handleBack = useCallback(() => {
    if (isModulesOnlyMode && step === 'modules') { router.push('/minhas-paginas'); return; }
    if (currentStepIndex <= 0) { router.push('/minhas-paginas'); return; }
    setStep(stepSequence[currentStepIndex - 1]);
  }, [currentStepIndex, stepSequence, router, isModulesOnlyMode, step]);

  const handleNext = useCallback(() => {
    if (currentStepIndex < stepSequence.length - 1) setStep(stepSequence[currentStepIndex + 1]);
  }, [currentStepIndex, stepSequence]);

  if (isAuthLoading || isDocLoading || isMediaLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 text-white">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Carregando editor...</p>
      </div>
    );
  }

  const previewProps = {
    senderName, selectedTheme, selectedBgColor, selectedEffect, isEmojiRainEnabled, selectedEmojis, emojiSize,
    emojiRainPosition, step, uploadedPhotos, pageTitle, message, musicData, date,
    selectedCountStyle, photoEffect, titleColor, titleFont, titleIsBold, titleHasNeon,
    titleNeonStrength, cardColor, showCard, titlePosition, dateColor, dateFont, dateIsBold,
    dateHasNeon, dateNeonStrength, dateBoxBgColor, dateBoxBorderColor, messageColor, messageFont,
    musicBoxColor, musicTextColor, musicHasNeon, musicNeonStrength, isAutoPlay: false,
    sparklesDensity, sparklesSpeed, sparklesColor, smokeIntensity, smokeColor, patternDuration,
    patternDensity, patternColor, isPackEnabled, memories, journeyPoints,
    activeModuleId: activeModulePreview,
    spotifyCardPhoto
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-white relative font-body overflow-x-hidden">
      <div className="fixed inset-0 bg-hero-glow pointer-events-none z-0" />
      <div className="relative z-10 container mx-auto px-4 pt-16 md:pt-20 pb-12 max-w-7xl">
        <div className="fixed top-0 left-0 right-0 z-[110] px-4 md:px-10 bg-black/60 backdrop-blur-md border-b border-white/5 h-14 flex items-center justify-between">
           <button onClick={() => router.push('/minhas-paginas')} className="flex items-center gap-2 text-white/40 hover:text-white">
              <ArrowLeft className="w-4 h-4" /><span className="text-[10px] font-black uppercase tracking-widest">Sair</span>
           </button>
           <Button onClick={handleSave} disabled={isSaving} className="bg-[#15803d] hover:bg-[#166534] h-9 rounded-lg px-4 text-[10px] font-black uppercase shadow-lg">
              {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Salvar
           </Button>
        </div>
        <div className="grid lg:grid-cols-[1fr_420px] gap-8 md:gap-16 items-start pt-8">
          <div className="w-full min-w-0">
            {step === 'customize-background' && <StepCustomizeBackground {...{selectedBgColor, onBgColorChange: setSelectedBgColor, selectedEffect, onEffectChange: setSelectedEffect, isEmojiRainEnabled, onEmojiRainToggle: setIsEmojiRainEnabled, selectedEmojis, onToggleEmoji: (e: any) => {}, emojiSize, onEmojiSizeChange: (e: any) => {}, emojiRainPosition, onEmojiRainPositionChange: (e: any) => {}, isEmojiPickerOpen, onEmojiPickerOpenChange: (e: any) => {}, sparklesDensity, onSparklesDensityChange: (e: any) => {}, sparklesSpeed, onSparklesSpeedChange: (e: any) => {}, sparklesColor, onSparklesColorChange: (e: any) => {}, smokeIntensity, onSmokeIntensityChange: (e: any) => {}, smokeColor, onSmokeColorChange: (e: any) => {}, patternDuration, onPatternDurationChange: (e: any) => {}, patternDensity, onPatternDensityChange: (e: any) => {}, patternColor, onPatternColorChange: (e: any) => {}, onBack: handleBack, onNext: handleNext}} />}
            {step === 'photos' && <StepPhotos {...{selectedTheme, uploadedPhotos, onPhotoUpload: (e: any) => {}, onRemovePhoto: (e: any) => {}, showCard, onShowCardChange: (e: any) => {}, cardColor, onCardColorChange: (e: any) => {}, titlePosition, onTitlePositionChange: (e: any) => {}, photoEffect, onPhotoEffectChange: (e: any) => {} }} />}
            {step === 'page-title' && <StepPageTitle {...{selectedTheme, pageTitle, onPageTitleChange: setPageTitle, titleFont, onTitleFontChange: setTitleFont, titleIsBold, onTitleIsBoldChange: (e: any) => {}, titleHasNeon, onTitleHasNeonChange: (e: any) => {}, titleNeonStrength, onTitleNeonStrengthChange: (e: any) => {}, titleColor, onTitleColorChange: (c) => setTitleColor(c), onBack: handleBack, onNext: handleNext}} />}
            {step === 'message' && <StepMessage {...{selectedTheme, message, onMessageChange: setMessage, messageFont, onMessageFontChange: (e: any) => {}, messageColor, onMessageColorChange: (e: any) => {}, onBack: handleBack, onNext: handleNext}} />}
            {step === 'music' && <StepMusic {...{selectedTheme, musicData, onMusicSelect: setMusicData, musicBoxColor, onMusicBoxColorChange: (e: any) => {}, musicTextColor, onMusicTextColorChange: (e: any) => {}, musicHasNeon, onMusicHasNeonChange: (e: any) => {}, musicNeonStrength, onMusicNeonStrengthChange: (e: any) => {}, isAutoPlay: isMusicAutoPlay, onAutoPlayChange: (e: any) => {}, onBack: handleBack, onNext: handleNext}} />}
            {step === 'data-location' && <StepDataLocation {...{selectedTheme, date, onDateSelect: setDate, locationQuery, onLocationQueryChange: (e: any) => {}, showSuggestions, onShowSuggestionsChange: (e: any) => {}, filteredCities: [], selectedCountStyle, onCountStyleChange: (e: any) => {}, dateFont, onDateFontChange: (e: any) => {}, dateIsBold, onDateIsBoldChange: (e: any) => {}, dateHasNeon, onDateHasNeonChange: (e: any) => {}, dateNeonStrength, onDateNeonStrengthChange: (e: any) => {}, dateColor, onDateColorChange: (e: any) => {}, dateBoxBgColor, onDateBoxBgColorChange: (e: any) => {}, dateBoxBorderColor, onDateBoxBorderColorChange: (e: any) => {}, onBack: handleBack, onNext: handleNext}} />}
            {step === 'modules' && <StepModulesEdit isPackEnabled={isPackEnabled} onPackToggle={setIsPackEnabled} memories={memories} onMemoriesChange={setMemories} journeyPoints={journeyPoints} onJourneyPointsChange={setJourneyPoints} onBack={handleBack} onNext={handleSave} isModulesOnlyMode={isModulesOnlyMode} onSubModuleChange={setActiveModulePreview} onRemoveMemory={handleRemoveMemory} onRemoveJourneyPoint={handleRemoveJourneyPoint} />}
            <div className="lg:hidden mt-12 w-full gap-4">
               <Dialog><DialogTrigger asChild><Button variant="outline" className="w-full h-11 rounded-xl border-white/10 bg-white/5 font-black text-[10px] uppercase tracking-widest gap-2"><Maximize2 className="w-4 h-4" /> Ver prévia</Button></DialogTrigger><DialogContent className="fixed inset-0 w-full h-[100dvh] p-0 bg-black border-none overflow-hidden flex flex-col z-[200] rounded-none"><div className="absolute top-6 right-6 z-[250]"><DialogClose className="p-2.5 bg-black/60 rounded-full text-white border border-white/20"><X className="w-5 h-5" /></DialogClose></div>{mounted && <DeviceMockup {...previewProps} isFullscreen />}</DialogContent></Dialog>
               {mounted && isMobile && <DeviceMockup {...previewProps} />}
            </div>
            {step !== 'modules' && (
              <div className="mt-12 flex flex-col gap-4 pt-10 border-t border-white/5">
                <Button onClick={handleBack} variant="outline" className="h-14 rounded-2xl">Voltar</Button>
                <Button onClick={handleNext} className="h-14 rounded-2xl bg-primary text-white">Próxima Etapa</Button>
              </div>
            )}
          </div>
          <div className="lg:sticky lg:top-24 self-start hidden lg:flex flex-col items-center gap-6">
             <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 w-full text-center">
                <p className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center justify-center gap-2"><Pencil className="w-3 h-3" /> Modo Edição</p>
             </div>
             {mounted && !isMobile && <DeviceMockup {...previewProps} />}
          </div>
        </div>
      </div>
    </div>
  );
}
