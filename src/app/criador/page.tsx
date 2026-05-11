
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Pencil, Maximize2, X, Loader2, CheckCircle2, Copy, ExternalLink, Heart, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DeviceMockup } from '@/components/eternize/device-mockup';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { getContrastColor } from '@/lib/color-utils';
import { Step, MOCK_CITIES, ThemeId } from './constants';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFirestore, useAuth, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';

// Step Components
import { StepThemeSelection } from '@/components/eternize/creator-steps/step-theme-selection';
import { StepGiftType } from '@/components/eternize/creator-steps/step-gift-type';
import { StepCustomizeBackground } from '@/components/eternize/creator-steps/step-customize-background';
import { StepPhotos } from '@/components/eternize/creator-steps/step-photos';
import { StepPageTitle } from '@/components/eternize/creator-steps/step-page-title';
import { StepMessage } from '@/components/eternize/creator-steps/step-message';
import { StepMusic } from '@/components/eternize/creator-steps/step-music';
import { StepDataLocation } from '@/components/eternize/creator-steps/step-data-location';
import { StepPlans } from '@/components/eternize/creator-steps/step-plans';
import { StepOrderBump } from '@/components/eternize/creator-steps/step-order-bump';
import { StepSubdomainConfig } from '@/components/eternize/creator-steps/step-subdomain-config';

// MAPEAMENTO DE LINKS DO CHECKOUT NA PERFECTPAY
const CHECKOUT_URLS = {
  '1w': {
    standard: "https://go.eternizeee.shop/PPU38CQBEQN",
    withPack: "https://go.eternizeee.shop/PPU38CQBQ8L"
  },
  'forever': {
    standard: "https://go.eternizeee.shop/PPU38CQBF2L",
    withPack: "https://go.eternizeee.shop/PPU38CQBQ8M"
  }
};

const compressImage = (base64Str: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 1200;
      const MAX_HEIGHT = 1200;
      let width = img.width;
      let height = img.height;
      if (width > height) { if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; } }
      else { if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; } }
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
  });
};

export default function CriadorApp() {
  const isMobile = useIsMobile();
  const firestore = useFirestore();
  const auth = useAuth();
  
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>('theme-selection');
  const [isSaving, setIsSaving] = useState(false);

  // States
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>('classic');
  const [selectedGiftType, setSelectedGiftType] = useState<string>('amor');
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
  const [userHasManuallyChangedTitleColor, setUserHasManuallyChangedTitleColor] = useState(false);
  const [dateColor, setDateColor] = useState<string>('#ffffff');
  const [dateFont, setDateFont] = useState<string>('playfair');
  const [dateIsBold, setDateIsBold] = useState<boolean>(true);
  const [dateHasNeon, setDateHasNeon] = useState<boolean>(false);
  const [dateNeonStrength, setDateNeonStrength] = useState<number>(10);
  const [userHasManuallyChangedDateColor, setUserHasManuallyChangedDateColor] = useState(false);
  const [dateBoxBgColor, setDateBoxBgColor] = useState<string>('#1a1a1a');
  const [dateBoxBorderColor, setDateBoxBorderColor] = useState<string>('#2a2a2a');
  const [messageColor, setMessageColor] = useState<string>('#ffffff');
  const [messageFont, setMessageFont] = useState<string>('inter');
  const [userHasManuallyChangedMessageColor, setUserHasManuallyChangedMessageColor] = useState(false);
  const [musicBoxColor, setMusicBoxColor] = useState<string>('#0e0e0e');
  const [musicTextColor, setMusicTextColor] = useState<string>('#ffffff');
  const [musicHasNeon, setMusicHasNeon] = useState<boolean>(false);
  const [musicNeonStrength, setMusicNeonStrength] = useState<number>(15);
  const [isMusicAutoPlay, setIsMusicAutoPlay] = useState<boolean>(true);
  const [locationQuery, setLocationQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Plano e Módulos
  const [selectedPlan, setSelectedPlan] = useState<'forever' | '1w'>('forever');
  const [isPackEnabled, setIsPackEnabled] = useState<boolean>(false);

  useEffect(() => { setMounted(true); }, []);

  // Garante scroll para o topo sempre que o passo mudar
  useEffect(() => {
    if (mounted) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [step, mounted]);

  const stepSequence = useMemo((): Step[] => {
    const base: Step[] = ['theme-selection', 'gift-type'];
    if (selectedTheme === 'netflix' || selectedTheme === 'spotify' || selectedTheme === 'instagram') {
      return [...base, 'data-location', 'page-title', 'message', 'photos', 'music', 'plans', 'order-bump', 'subdomain-config'];
    }
    return [...base, 'customize-background', 'photos', 'page-title', 'message', 'data-location', 'music', 'plans', 'order-bump', 'subdomain-config'];
  }, [selectedTheme]);

  // Lógica de validação por etapa
  const isStepValid = useMemo(() => {
    switch (step) {
      case 'theme-selection': return !!selectedTheme;
      case 'gift-type': return !!selectedGiftType;
      case 'customize-background': return true; // Visual é opcional/padrão
      case 'photos': return uploadedPhotos.length > 0;
      case 'page-title': return pageTitle.trim().length >= 2;
      case 'message': 
        // Limpa HTML para verificar se há texto real
        const plainText = message.replace(/<[^>]*>/g, '').trim();
        return plainText.length >= 3;
      case 'music': return !!musicData;
      case 'data-location': return !!date;
      case 'plans': return !!selectedPlan;
      case 'order-bump': return true;
      case 'subdomain-config': return true; // Validação interna no componente
      default: return true;
    }
  }, [step, selectedTheme, selectedGiftType, uploadedPhotos, pageTitle, message, musicData, date, selectedPlan]);

  const currentStepIndex = stepSequence.indexOf(step);

  const handleBack = () => {
    if (currentStepIndex <= 0) { window.location.href = '/'; return; }
    setStep(stepSequence[currentStepIndex - 1]);
  };

  const handleNext = () => {
    if (isStepValid && currentStepIndex < stepSequence.length - 1) {
      setStep(stepSequence[currentStepIndex + 1]);
    }
  };

  const handleFinalize = async (finalSlug: string) => {
    if (!firestore || !auth) return;
    setIsSaving(true);

    try {
      let currentUserId: string | null = null;
      let currentUser = auth.currentUser;
      
      if (!currentUser) {
        const credential = await signInAnonymously(auth);
        currentUser = credential.user;
      }
      currentUserId = currentUser?.uid || null;

      if (!currentUserId) throw new Error("Falha na identificação do usuário.");

      const contentData = {
        selectedTheme, selectedBgColor, selectedEffect, isEmojiRainEnabled, selectedEmojis,
        emojiSize, emojiRainPosition, selectedCountStyle, photoEffect, date: date?.toISOString(),
        pageTitle, message, musicData, uploadedPhotos, sparklesDensity, sparklesSpeed, sparklesColor,
        smokeIntensity, smokeColor, patternDuration, patternDensity, patternColor, cardColor,
        showCard, titlePosition, titleColor, titleFont, titleIsBold, titleHasNeon, titleNeonStrength,
        dateColor, dateFont, dateIsBold, dateHasNeon, dateNeonStrength, dateBoxBgColor, dateBoxBorderColor,
        messageColor, messageFont, musicBoxColor, musicTextColor, musicHasNeon, musicNeonStrength,
        isMusicAutoPlay, locationQuery, isPackEnabled, selectedPlan
      };

      const jsonContent = JSON.stringify(contentData);
      const publishedRef = doc(firestore, 'published_sites', finalSlug);
      
      const docData = {
        id: finalSlug,
        userId: currentUserId,
        name: pageTitle || 'Meu Presente',
        status: 'pending',
        subdomainName: finalSlug,
        pageUrl: `https://eternizee.shop/site/${finalSlug}`,
        contentJson: jsonContent,
        isPackEnabled: isPackEnabled,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(publishedRef, docData);

      // Redirecionamento baseado no plano e pack
      const urls = CHECKOUT_URLS[selectedPlan];
      const baseUrl = isPackEnabled ? urls.withPack : urls.standard;
      const checkoutUrlWithMetadata = `${baseUrl}?src=${finalSlug}`;
      window.location.href = checkoutUrlWithMetadata;

    } catch (error: any) {
      console.error("Erro ao salvar projeto:", error);
      setIsSaving(false);
      alert(error.message || "Ocorreu um erro ao salvar sua página. Por favor, tente novamente.");
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

  const removePhoto = (index: number) => setUploadedPhotos(prev => prev.filter((_, i) => i !== index));

  const filteredCities = locationQuery.length > 0 
    ? MOCK_CITIES.filter(city => city.toLowerCase().includes(locationQuery.toLowerCase()))
    : [];

  useEffect(() => {
    if (selectedTheme === 'netflix' || selectedTheme === 'instagram') {
      setTitleColor('#ffffff');
      if (!userHasManuallyChangedDateColor) setDateColor('#ff0000');
    } else if (selectedTheme === 'spotify') {
      setTitleColor('#ffffff');
      if (!userHasManuallyChangedDateColor) setDateColor('#1DB954');
    } else if (!userHasManuallyChangedTitleColor) {
      const surfaceColor = showCard ? cardColor : selectedBgColor;
      setTitleColor(getContrastColor(surfaceColor));
    }
  }, [cardColor, selectedBgColor, showCard, userHasManuallyChangedTitleColor, selectedTheme]);

  useEffect(() => {
    if (selectedTheme === 'netflix' || selectedTheme === 'instagram') {
      if (!userHasManuallyChangedDateColor) setDateColor('#ff0000');
    } else if (selectedTheme === 'spotify') {
      if (!userHasManuallyChangedDateColor) setDateColor('#1DB954');
    } else if (!userHasManuallyChangedDateColor) {
      setDateColor('#ffffff');
    }
  }, [selectedBgColor, userHasManuallyChangedDateColor, selectedTheme]);

  useEffect(() => {
    if (!userHasManuallyChangedMessageColor) setMessageColor(getContrastColor(selectedBgColor));
  }, [selectedBgColor, userHasManuallyChangedMessageColor]);

  const previewProps = {
    selectedTheme, selectedBgColor, selectedEffect, isEmojiRainEnabled, selectedEmojis, emojiSize,
    emojiRainPosition, step, uploadedPhotos, pageTitle, message, musicData, date,
    selectedCountStyle, photoEffect, titleColor, titleFont, titleIsBold, titleHasNeon,
    titleNeonStrength, cardColor, showCard, titlePosition, dateColor, dateFont, dateIsBold,
    dateHasNeon, dateNeonStrength, dateBoxBgColor, dateBoxBorderColor, messageColor, messageFont,
    musicBoxColor, musicTextColor, musicHasNeon, musicNeonStrength, isAutoPlay: isMusicAutoPlay,
    sparklesDensity, sparklesSpeed, sparklesColor, smokeIntensity, smokeColor, patternDuration,
    patternDensity, patternColor, isPackEnabled
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-white relative font-body overflow-x-hidden">
      <div className="fixed inset-0 bg-hero-glow pointer-events-none z-0" />

      {step === 'theme-selection' && <StepThemeSelection selectedTheme={selectedTheme} onThemeSelect={setSelectedTheme} onNext={handleNext} />}
      {step === 'gift-type' && <StepGiftType selectedGiftType={selectedGiftType} onSelect={setSelectedGiftType} onNext={handleNext} onBack={handleBack} />}

      {step !== 'theme-selection' && step !== 'gift-type' && (
        <div className="relative z-10 container mx-auto px-4 pt-16 md:pt-20 pb-12 max-w-7xl">
          <div className="fixed top-0 left-0 right-0 z-[110] px-4 md:px-10 bg-black/60 backdrop-blur-md">
            <div className="max-w-7xl mx-auto flex items-center gap-4 h-12">
               <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(currentStepIndex / (stepSequence.length - 1)) * 100}%` }} />
               </div>
               <span className="text-[10px] md:text-xs font-black text-white/50 tracking-widest">{currentStepIndex}/{stepSequence.length - 1}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_420px] gap-8 md:gap-16 items-start pt-8">
            <div className="w-full min-w-0">
              {step === 'customize-background' && <StepCustomizeBackground {...{selectedBgColor, onBgColorChange: setSelectedBgColor, selectedEffect, onEffectChange: setSelectedEffect, isEmojiRainEnabled, onEmojiRainToggle: setIsEmojiRainEnabled, selectedEmojis, onToggleEmoji: toggleEmoji, emojiSize, onEmojiSizeChange: setEmojiSize, emojiRainPosition, onEmojiRainPositionChange: setEmojiRainPosition, isEmojiPickerOpen, onEmojiPickerOpenChange: setIsEmojiPickerOpen, sparklesDensity, onSparklesDensityChange: setSparklesDensity, sparklesSpeed, onSparklesSpeedChange: setSparklesSpeed, sparklesColor, onSparklesColorChange: setSparklesColor, smokeIntensity, onSmokeIntensityChange: setSmokeIntensity, smokeColor, onSmokeColorChange: setSmokeColor, patternDuration, onPatternDurationChange: setPatternDuration, patternDensity, onPatternDensityChange: setPatternDensity, patternColor, onPatternColorChange: setPatternColor, onBack: handleBack, onNext: handleNext}} />}
              {step === 'photos' && <StepPhotos {...{selectedTheme, uploadedPhotos, onPhotoUpload: handlePhotoUpload, onRemovePhoto: removePhoto, showCard, onShowCardChange: setShowCard, cardColor, onCardColorChange: setCardColor, titlePosition, onTitlePositionChange: setTitlePosition, photoEffect, onPhotoEffectChange: setPhotoEffect, onBack: handleBack, onNext: handleNext}} />}
              {step === 'page-title' && <StepPageTitle {...{selectedTheme, pageTitle, onPageTitleChange: setPageTitle, titleFont, onTitleFontChange: setTitleFont, titleIsBold, onTitleIsBoldChange: setTitleIsBold, titleHasNeon, onTitleHasNeonChange: setTitleHasNeon, titleNeonStrength, onTitleNeonStrengthChange: setTitleNeonStrength, titleColor, onTitleColorChange: (c) => { setTitleColor(c); setUserHasManuallyChangedTitleColor(true); }, onBack: handleBack, onNext: handleNext}} />}
              {step === 'message' && <StepMessage {...{selectedTheme, message, onMessageChange: setMessage, messageFont, onMessageFontChange: setMessageFont, messageColor, onMessageColorChange: (c) => { setMessageColor(c); setUserHasManuallyChangedMessageColor(true); }, onBack: handleBack, onNext: handleNext}} />}
              {step === 'music' && <StepMusic {...{selectedTheme, musicData, onMusicSelect: setMusicData, musicBoxColor, onMusicBoxColorChange: setMusicBoxColor, musicTextColor, onMusicTextColorChange: setMusicTextColor, musicHasNeon, onMusicHasNeonChange: setMusicHasNeon, musicNeonStrength, onMusicNeonStrengthChange: setMusicNeonStrength, isAutoPlay: isMusicAutoPlay, onAutoPlayChange: setIsMusicAutoPlay, onBack: handleBack, onNext: handleNext}} />}
              {step === 'data-location' && <StepDataLocation {...{selectedTheme, date, onDateSelect: setDate, locationQuery, onLocationQueryChange: setLocationQuery, showSuggestions, onShowSuggestionsChange: setShowSuggestions, filteredCities, selectedCountStyle, onCountStyleChange: setSelectedCountStyle, dateFont, onDateFontChange: setDateFont, dateIsBold, onDateIsBoldChange: setDateIsBold, dateHasNeon, onDateHasNeonChange: setDateHasNeon, dateNeonStrength, onDateNeonStrengthChange: setDateNeonStrength, dateColor, onDateColorChange: (c) => { setDateColor(c); setUserHasManuallyChangedDateColor(true); }, dateBoxBgColor, onDateBoxBgColorChange: setDateBoxBgColor, dateBoxBorderColor, onDateBoxBorderColorChange: setDateBoxBorderColor, onBack: handleBack, onNext: handleNext}} />}
              {step === 'plans' && <StepPlans selectedPlan={selectedPlan} onPlanChange={setSelectedPlan} onBack={handleBack} onFinish={handleNext} />}
              {step === 'order-bump' && <StepOrderBump onBack={handleBack} onFinish={handleNext} date={date} isPackEnabled={isPackEnabled} onPackToggle={setIsPackEnabled} />}
              {step === 'subdomain-config' && <StepSubdomainConfig onBack={handleBack} onFinish={handleFinalize} initialValue={pageTitle} />}

              <div className="lg:hidden flex flex-col items-center mt-12 w-full gap-4">
                 <Dialog>
                   <DialogTrigger asChild><Button variant="outline" className="w-full h-11 rounded-xl border-white/10 bg-white/5 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"><Maximize2 className="w-4 h-4" /> Ver em tela cheia</Button></DialogTrigger>
                   <DialogContent className="fixed inset-0 w-full h-[100dvh] p-0 bg-black border-none overflow-hidden flex flex-col z-[200] translate-x-0 translate-y-0 rounded-none">
                     <DialogTitle className="sr-only">Prévia do Presente</DialogTitle>
                     <DialogDescription className="sr-only">Visualização em tela cheia do seu presente personalizado.</DialogDescription>
                     <div className="flex-1 overflow-hidden relative flex flex-col">
                       <div className="absolute top-6 right-6 z-[250]"><DialogClose className="p-2.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all border border-white/20 shadow-2xl backdrop-blur-md"><X className="w-5 h-5" /></DialogClose></div>
                       {mounted && <DeviceMockup {...previewProps} isFullscreen />}
                     </div>
                   </DialogContent>
                 </Dialog>
                 {mounted && isMobile && <DeviceMockup {...previewProps} />}
              </div>

              {step !== 'plans' && step !== 'order-bump' && step !== 'subdomain-config' && (
                <div className="mt-12 flex flex-col gap-6 max-w-md mx-auto md:mx-0">
                  {!isStepValid && (
                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <AlertCircle className="w-4 h-4 text-primary shrink-0" />
                      <p className="text-[11px] font-bold text-primary uppercase tracking-tight">Complete os campos obrigatórios para prosseguir.</p>
                    </div>
                  )}
                  <div className="flex flex-col gap-4 pt-6 border-t border-white/5">
                    <Button onClick={handleBack} variant="outline" className="w-full h-14 rounded-2xl border-white/10 bg-white/5 font-black text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2"><ChevronLeft className="w-4 h-4" /> Voltar etapa</Button>
                    <Button 
                      onClick={handleNext} 
                      disabled={!isStepValid}
                      className={cn(
                        "w-full h-14 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-2xl",
                        isStepValid ? "bg-primary text-white hover:bg-primary/90 shadow-primary/20" : "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
                      )}
                    >
                      Próxima etapa <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex justify-center md:justify-start"><p className="text-[11px] font-medium text-white/30 italic flex items-center gap-2"><Pencil className="w-3 h-3" /> Você poderá editar isso após a compra</p></div>
                </div>
              )}
            </div>

            <div className="lg:sticky lg:top-20 self-start hidden lg:flex flex-col items-center gap-6">
               <Dialog>
                 <DialogTrigger asChild><Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all rounded-full px-4 gap-2 text-[10px] font-black uppercase"><Maximize2 className="w-3 h-3" /> Ver em tela cheia</Button></DialogTrigger>
                 <DialogContent className="fixed inset-0 w-full h-[100dvh] p-0 bg-black border-none overflow-hidden flex flex-col z-[200] translate-x-0 translate-y-0 rounded-none">
                   <DialogTitle className="sr-only">Prévia do Presente</DialogTitle>
                   <DialogDescription className="sr-only">Visualização em tela cheia do seu presente personalizado.</DialogDescription>
                   <div className="flex-1 overflow-hidden relative flex flex-col">
                     <div className="absolute top-6 right-6 z-[250]"><DialogClose className="p-2.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all border border-white/20 shadow-2xl backdrop-blur-md"><X className="w-5 h-5" /></DialogClose></div>
                     {mounted && <DeviceMockup {...previewProps} isFullscreen />}
                   </div>
                 </DialogContent>
               </Dialog>
               {mounted && !isMobile && <DeviceMockup {...previewProps} />}
            </div>
          </div>
        </div>
      )}

      {isSaving && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 animate-in fade-in duration-300">
          <div className="relative mb-6">
            <Loader2 className="w-16 h-16 text-primary animate-spin" />
            <Heart className="w-6 h-6 text-primary absolute inset-0 m-auto animate-pulse" />
          </div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Processando...</h2>
          <p className="text-white/40 text-sm font-medium animate-pulse">Aguarde um momento enquanto preparamos seu acesso.</p>
        </div>
      )}
    </div>
  );
}
