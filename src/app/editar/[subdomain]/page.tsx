
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useDoc, useFirestore, useUser, errorEmitter, FirestorePermissionError } from '@/firebase';
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

const compressImage = (base64Str: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 800;
      const MAX_HEIGHT = 800;
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

  const { data: siteData, isLoading: isDocLoading, error: docError } = useDoc(siteRef as any);

  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [step, setStep] = useState<Step>('customize-background');
  const [activeModulePreview, setActiveModulePreview] = useState<string | null>(null);

  const isModulesOnlyMode = useMemo(() => searchParams.get('startStep') === 'modules', [searchParams]);

  // States
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
  const [journeyPoints, setJourneyPoints] = useState<JourneyPoint[]>([]);
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

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (siteData) {
      try {
        const config = JSON.parse(siteData.contentJson);
        const theme = config.selectedTheme || 'classic';
        setSelectedTheme(theme);
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
        setUploadedPhotos(config.uploadedPhotos || []);
        setMemories(config.memories || []);
        setJourneyPoints(config.journeyPoints || []);
        setSpotifyCardPhoto(config.spotifyCardPhoto || '');
        
        const packPurchased = siteData.isPackEnabled === true;
        setHasPackPurchased(packPurchased);
        setIsPackEnabled(config.isPackEnabled !== undefined ? config.isPackEnabled : packPurchased);
        
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

        const startStep = searchParams.get('startStep');
        const isFixed = theme === 'netflix' || theme === 'spotify' || theme === 'instagram';

        if (startStep === 'modules' && packPurchased) {
          setStep('modules');
        } else if (isFixed) {
          setStep('data-location');
        } else {
          setStep('customize-background');
        }
      } catch (e) {
        console.error("Erro ao processar conteúdo do site", e);
      }
    }
  }, [siteData, searchParams]);

  const stepSequence = useMemo((): Step[] => {
    const isFixed = selectedTheme === 'netflix' || selectedTheme === 'spotify' || selectedTheme === 'instagram';
    let steps: Step[] = [];

    if (isFixed) {
      steps = ['data-location', 'page-title', 'message', 'photos', 'music'];
    } else {
      steps = ['customize-background', 'photos', 'page-title', 'message', 'data-location', 'music'];
    }

    if (hasPackPurchased) {
      steps.push('modules');
    }

    return steps;
  }, [selectedTheme, hasPackPurchased]);

  const currentStepIndex = stepSequence.indexOf(step);

  const handleBack = useCallback(() => {
    if (isModulesOnlyMode && step === 'modules') {
      router.push('/minhas-paginas');
      return;
    }
    if (currentStepIndex <= 0) { router.push('/minhas-paginas'); return; }
    setStep(stepSequence[currentStepIndex - 1]);
  }, [currentStepIndex, stepSequence, router, isModulesOnlyMode, step]);

  const handleNext = useCallback(() => {
    if (currentStepIndex < stepSequence.length - 1) {
      setStep(stepSequence[currentStepIndex + 1]);
    }
  }, [currentStepIndex, stepSequence]);

  const handleSave = async () => {
    if (!firestore || !siteRef || !user) return;
    setIsSaving(true);

    try {
      const contentData = {
        selectedTheme, selectedBgColor, selectedEffect, isEmojiRainEnabled, selectedEmojis,
        emojiSize, emojiRainPosition, selectedCountStyle, photoEffect, date: date?.toISOString(),
        pageTitle, message, musicData, uploadedPhotos, sparklesDensity, sparklesSpeed, sparklesColor,
        smokeIntensity, smokeColor, patternDuration, patternDensity, patternColor, cardColor,
        showCard, titlePosition, titleColor, titleFont, titleIsBold, titleHasNeon, titleNeonStrength,
        dateColor, dateFont, dateIsBold, dateHasNeon, dateNeonStrength, dateBoxBgColor, dateBoxBorderColor,
        messageColor, messageFont, musicBoxColor, musicTextColor, musicHasNeon, musicNeonStrength,
        isMusicAutoPlay, locationQuery, isPackEnabled, memories, journeyPoints, spotifyCardPhoto
      };

      const jsonContent = JSON.stringify(contentData);
      
      await updateDoc(siteRef, {
        name: pageTitle || 'Meu Presente',
        contentJson: jsonContent,
        isPackEnabled: isPackEnabled,
        updatedAt: serverTimestamp(),
      });

      router.push('/minhas-paginas');
    } catch (error: any) {
      console.error("Erro ao salvar alterações:", error);
      setIsSaving(false);
      alert("Erro ao salvar: " + (error.message || "Tente novamente."));
    }
  };

  const toggleEmoji = (emoji: string) => {
    if (selectedEmojis.includes(emoji)) {
      if (selectedEmojis.length > 1) setSelectedEmojis(selectedEmojis.filter(e => e !== emoji));
    } else {
      if (selectedEmojis.length < 3) setSelectedEmojis([...selectedEmojis, emoji]);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        setUploadedPhotos(prev => [...prev, compressed].slice(0, 8));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSpotifyCardPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const compressed = await compressImage(reader.result as string);
      setSpotifyCardPhoto(compressed);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (index: number) => setUploadedPhotos(prev => prev.filter((_, i) => i !== index));

  const filteredCities = locationQuery.length > 0 
    ? MOCK_CITIES.filter(city => city.toLowerCase().includes(locationQuery.toLowerCase()))
    : [];

  const previewProps = {
    selectedTheme, selectedBgColor, selectedEffect, isEmojiRainEnabled, selectedEmojis, emojiSize,
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

  if (isAuthLoading || isDocLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 text-white">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Carregando editor...</p>
      </div>
    );
  }

  if (!siteData || siteData.userId !== user?.uid) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center text-white">
        <Heart className="w-12 h-12 text-white/10 mb-4" />
        <h1 className="text-2xl font-black mb-2 uppercase italic">Acesso Negado</h1>
        <p className="text-white/40 text-sm max-w-xs mb-8">Você não tem permissão para editar esta página ou ela não existe.</p>
        <Button onClick={() => router.push('/minhas-paginas')} className="bg-primary">Voltar para Minhas Páginas</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-white relative font-body overflow-x-hidden">
      <div className="fixed inset-0 bg-hero-glow pointer-events-none z-0" />

      <div className="relative z-10 container mx-auto px-4 pt-16 md:pt-20 pb-12 max-w-7xl">
        <div className="fixed top-0 left-0 right-0 z-[110] px-4 md:px-10 bg-black/60 backdrop-blur-md border-b border-white/5">
          <div className="max-w-7xl mx-auto flex items-center justify-between h-14">
             <button onClick={() => router.push('/minhas-paginas')} className="flex items-center gap-2 text-white/40 hover:text-white transition-all">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Sair do Editor</span>
             </button>
             
             <div className="flex-1 max-w-md mx-8 h-1 bg-white/10 rounded-full overflow-hidden hidden sm:block">
                <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(currentStepIndex / (stepSequence.length - 1)) * 100}%` }} />
             </div>

             <Button onClick={handleSave} disabled={isSaving} className="bg-[#15803d] hover:bg-[#166534] h-9 rounded-lg px-4 gap-2 text-[10px] font-black uppercase tracking-widest shadow-lg">
                {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                Salvar Alterações
             </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_420px] gap-8 md:gap-16 items-start pt-8">
          <div className="w-full min-w-0">
            {step === 'customize-background' && <StepCustomizeBackground {...{selectedBgColor, onBgColorChange: setSelectedBgColor, selectedEffect, onEffectChange: setSelectedEffect, isEmojiRainEnabled, onEmojiRainToggle: setIsEmojiRainEnabled, selectedEmojis, onToggleEmoji: toggleEmoji, emojiSize, onEmojiSizeChange: setEmojiSize, emojiRainPosition, onEmojiRainPositionChange: setEmojiRainPosition, isEmojiPickerOpen, onEmojiPickerOpenChange: setIsEmojiPickerOpen, sparklesDensity, onSparklesDensityChange: setSparklesDensity, sparklesSpeed, onSparklesSpeedChange: setSparklesSpeed, sparklesColor, onSparklesColorChange: setSparklesColor, smokeIntensity, onSmokeIntensityChange: setSmokeIntensity, smokeColor, onSmokeColorChange: setSmokeColor, patternDuration, onPatternDurationChange: setPatternDuration, patternDensity, onPatternDensityChange: setPatternDensity, patternColor, onPatternColorChange: setPatternColor, onBack: handleBack, onNext: handleNext}} />}
            {step === 'photos' && <StepPhotos {...{selectedTheme, uploadedPhotos, onPhotoUpload: handlePhotoUpload, onRemovePhoto: removePhoto, showCard, onShowCardChange: setShowCard, cardColor, onCardColorChange: setCardColor, titlePosition, onTitlePositionChange: setTitlePosition, photoEffect, onPhotoEffectChange: setPhotoEffect, onBack: handleBack, onNext: handleNext}} />}
            {step === 'page-title' && <StepPageTitle {...{selectedTheme, pageTitle, onPageTitleChange: setPageTitle, titleFont, onTitleFontChange: setTitleFont, titleIsBold, onTitleIsBoldChange: setTitleIsBold, titleHasNeon, onTitleHasNeonChange: setTitleHasNeon, titleNeonStrength, onTitleNeonStrengthChange: setTitleNeonStrength, titleColor, onTitleColorChange: (c) => setTitleColor(c), onBack: handleBack, onNext: handleNext}} />}
            {step === 'message' && <StepMessage {...{selectedTheme, message, onMessageChange: setMessage, messageFont, onMessageFontChange: setMessageFont, messageColor, onMessageColorChange: setMessageColor, onBack: handleBack, onNext: handleNext}} />}
            {step === 'music' && <StepMusic {...{selectedTheme, musicData, onMusicSelect: setMusicData, musicBoxColor, onMusicBoxColorChange: setMusicBoxColor, musicTextColor, onMusicTextColorChange: setMusicTextColor, musicHasNeon, onMusicHasNeonChange: setMusicHasNeon, musicNeonStrength, onMusicNeonStrengthChange: setMusicNeonStrength, isAutoPlay: isMusicAutoPlay, onAutoPlayChange: setIsMusicAutoPlay, onBack: handleBack, onNext: handleNext}} />}
            {step === 'data-location' && <StepDataLocation {...{selectedTheme, date, onDateSelect: setDate, locationQuery, onLocationQueryChange: setLocationQuery, showSuggestions, onShowSuggestionsChange: setShowSuggestions, filteredCities, selectedCountStyle, onCountStyleChange: setSelectedCountStyle, dateFont, onDateFontChange: setDateFont, dateIsBold, onDateIsBoldChange: setDateIsBold, dateHasNeon, onDateHasNeonChange: setDateHasNeon, dateNeonStrength, onDateNeonStrengthChange: setDateNeonStrength, dateColor, onDateColorChange: setDateColor, dateBoxBgColor, onDateBoxBgColorChange: setDateBoxBgColor, dateBoxBorderColor, onDateBoxBorderColorChange: setDateBoxBorderColor, onBack: handleBack, onNext: handleNext, spotifyCardPhoto, onSpotifyCardPhotoChange: handleSpotifyCardPhotoUpload}} />}
            {step === 'modules' && <StepModulesEdit isPackEnabled={isPackEnabled} onPackToggle={setIsPackEnabled} memories={memories} onMemoriesChange={setMemories} journeyPoints={journeyPoints} onJourneyPointsChange={setJourneyPoints} onBack={handleBack} onNext={handleSave} isModulesOnlyMode={isModulesOnlyMode} onSubModuleChange={setActiveModulePreview} />}

            <div className="lg:hidden flex flex-col items-center mt-12 w-full gap-4">
               <Dialog>
                 <DialogTrigger asChild><Button variant="outline" className="w-full h-11 rounded-xl border-white/10 bg-white/5 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"><Maximize2 className="w-4 h-4" /> Ver prévia cheia</Button></DialogTrigger>
                 <DialogContent className="fixed inset-0 w-full h-[100dvh] p-0 bg-black border-none overflow-hidden flex flex-col z-[200] translate-x-0 translate-y-0 rounded-none">
                   <DialogTitle className="sr-only">Prévia</DialogTitle>
                   <DialogDescription className="sr-only">Visualização do site em edição.</DialogDescription>
                   <div className="flex-1 overflow-hidden relative flex flex-col">
                     <div className="absolute top-6 right-6 z-[250]"><DialogClose className="p-2.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all border border-white/20 shadow-2xl backdrop-blur-md"><X className="w-5 h-5" /></DialogClose></div>
                     {mounted && <DeviceMockup {...previewProps} isFullscreen />}
                   </div>
                 </DialogContent>
               </Dialog>
               {mounted && isMobile && <DeviceMockup {...previewProps} />}
            </div>

            {step !== 'modules' && (
              <div className="mt-12 flex flex-col gap-6 max-w-md mx-auto md:mx-0">
                <div className="flex flex-col gap-4 pt-10 border-t border-white/5">
                  <Button onClick={handleBack} variant="outline" className="w-full h-14 rounded-2xl border-white/10 bg-white/5 font-black text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2"><ChevronLeft className="w-4 h-4" /> Etapa Anterior</Button>
                  {currentStepIndex < stepSequence.length - 1 ? (
                    <Button onClick={handleNext} className="w-full h-14 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/90 shadow-2xl shadow-primary/20">Próxima Etapa <ChevronRight className="w-4 h-4" /></Button>
                  ) : (
                    <Button onClick={handleSave} className="w-full h-14 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 bg-[#15803d] text-white hover:bg-[#166534] shadow-2xl shadow-green-500/20">Finalizar Edição <CheckCircle2 className="w-4 h-4" /></Button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-24 self-start hidden lg:flex flex-col items-center gap-6">
             <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 w-full text-center">
                <p className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center justify-center gap-2">
                   <Pencil className="w-3 h-3" /> Modo Edição Ativo
                </p>
             </div>
             {mounted && !isMobile && <DeviceMockup {...previewProps} />}
          </div>
        </div>
      </div>

      {isSaving && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 animate-in fade-in duration-300">
          <div className="relative mb-6">
            <Loader2 className="w-16 h-16 text-primary animate-spin" />
            <Heart className="w-6 h-6 text-primary absolute inset-0 m-auto animate-pulse" />
          </div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Salvando...</h2>
          <p className="text-white/40 text-sm font-medium animate-pulse">Suas memórias estão sendo atualizadas.</p>
        </div>
      )}
    </div>
  );
}
