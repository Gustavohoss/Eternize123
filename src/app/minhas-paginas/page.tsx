
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, query, where, or, and } from 'firebase/firestore';
import { useFirestore, useUser, useCollection, useAuth, useMemoFirebase } from '@/firebase';
import { Heart, ExternalLink, Calendar, Loader2, Plus, ArrowLeft, LogOut, Layout, User, Pencil, ShieldAlert, Lock, X, CheckCircle2, Eye, EyeOff, Sparkles, Settings2, LayoutGrid, ChevronRight, QrCode, Copy, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { signOut, updatePassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function MyPages() {
  const firestore = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  
  // Password States
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  // Share States
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedSiteForShare, setSelectedSiteForShare] = useState<any>(null);

  // Edit Choice States
  const [choiceDialogOpen, setChoiceDialogOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<any>(null);

  // Query memoizada buscando por ID ou por E-mail
  const mySitesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'published_sites'),
      and(
        where('status', '==', 'published'),
        or(
          where('userId', '==', user.uid),
          where('customerEmail', '==', user.email)
        )
      )
    );
  }, [firestore, user?.uid, user?.email]);

  const { data: sites, isLoading, error } = useCollection(mySitesQuery as any);

  const handleLogout = () => {
    signOut(auth);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (newPassword.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas não coincidem.');
      return;
    }

    setIsChangingPassword(true);
    setPasswordError(null);

    try {
      await updatePassword(user, newPassword);
      setPasswordSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowPasswordDialog(false);
        setPasswordSuccess(false);
        setShowAlert(false);
      }, 3000);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/requires-recent-login') {
        setPasswordError('Para sua segurança, saia e entre novamente na conta antes de mudar a senha.');
      } else {
        setPasswordError('Erro ao atualizar senha. Tente novamente mais tarde.');
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const openEditChoice = (site: any) => {
    setSelectedSite(site);
    setChoiceDialogOpen(true);
  };

  const openShare = (site: any) => {
    setSelectedSiteForShare(site);
    setShareDialogOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Link copiado! ❤️",
      description: "O endereço da sua página já está na área de transferência.",
    });
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 text-white">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Verificando acesso...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="fixed inset-0 bg-hero-glow pointer-events-none z-0" />
        <div className="relative z-10 space-y-6">
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 w-fit mx-auto mb-4">
             <Layout className="w-10 h-10 text-white/20" />
          </div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">Área Restrita</h1>
          <p className="text-white/40 text-sm max-w-xs mx-auto font-medium leading-relaxed">Você precisa estar logado para ver seus presentes eternizados.</p>
          <div className="flex flex-col gap-3 max-w-[240px] mx-auto pt-4">
            <Link href="/login" className="w-full">
              <Button className="w-full bg-primary hover:bg-primary/90 h-12 rounded-xl font-black text-xs uppercase tracking-widest">
                Fazer Login
              </Button>
            </Link>
            <Link href="/" className="w-full">
              <Button variant="ghost" className="w-full text-white/30 hover:text-white text-xs font-bold uppercase tracking-widest">
                Voltar ao início
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 relative overflow-x-hidden">
      <div className="fixed inset-0 bg-hero-glow pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 animate-in slide-in-from-top-4 duration-700">
          <div className="space-y-2">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/" className="group flex items-center gap-2 text-white/30 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Voltar
              </Link>
              <div className="h-3 w-px bg-white/10" />
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                <User className="w-3 h-3" /> {user.email || 'Usuário'}
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase">Minhas Páginas<span className="text-primary">.</span></h1>
            <p className="text-white/40 text-sm font-medium">Gerencie seus presentes e histórias eternizadas.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/criador">
              <Button className="bg-primary hover:bg-primary/90 h-12 rounded-xl font-black text-xs uppercase tracking-widest gap-2 shadow-2xl shadow-primary/20">
                <Plus className="w-4 h-4" /> Criar nova
              </Button>
            </Link>
            <Button onClick={handleLogout} variant="outline" className="border-white/10 bg-white/5 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 h-12 rounded-xl px-4">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {showAlert && (
          <div className="mb-10 bg-orange-500/10 border border-orange-500/20 rounded-2xl p-5 flex items-start justify-between gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex items-start gap-4">
              <div className="bg-orange-500/20 p-2 rounded-lg">
                <ShieldAlert className="w-5 h-5 text-orange-500" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black uppercase tracking-tight text-white">Segurança da Conta</h4>
                <p className="text-white/50 text-[11px] font-medium leading-relaxed max-w-md">
                  Se você acessou com a senha padrão <code className="bg-white/5 px-1.5 py-0.5 rounded text-orange-400 font-mono">Eternize123</code>, recomendamos trocá-la agora para proteger suas memórias.
                </p>
                <button 
                  onClick={() => setShowPasswordDialog(true)}
                  className="text-orange-500 text-[10px] font-black uppercase tracking-widest hover:underline mt-2 flex items-center gap-2"
                >
                  <Lock className="w-3 h-3" /> Trocar senha agora
                </button>
              </div>
            </div>
            <button onClick={() => setShowAlert(false)} className="text-white/20 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">Buscando documentos...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 text-center">
            <p className="text-red-500 text-sm font-bold">Ocorreu um erro ao carregar suas páginas. Verifique sua conexão ou tente novamente mais tarde.</p>
          </div>
        ) : (!sites || sites.length === 0) ? (
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-12 text-center flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-700">
            <div className="bg-white/5 p-5 rounded-full mb-6 border border-white/10">
              <Heart className="w-10 h-10 text-white/10" />
            </div>
            <h2 className="text-xl font-black uppercase italic mb-2 tracking-tight">Nenhuma página encontrada</h2>
            <p className="text-white/30 text-sm max-w-xs mb-8">Você ainda não criou nenhum presente digital. Que tal começar agora?</p>
            <Link href="/criador">
              <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 rounded-xl font-bold">
                Criar meu primeiro presente
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {sites.map((site: any) => (
              <div key={site.id} className="group relative bg-[#0c0c0c] border border-white/5 rounded-3xl p-6 hover:border-primary/30 transition-all duration-500 overflow-hidden flex flex-col gap-5">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                     onClick={() => openShare(site)}
                     className="bg-primary/20 p-2.5 rounded-xl hover:bg-primary/40 transition-all"
                     title="Compartilhar"
                   >
                      <QrCode className="w-4 h-4 text-primary" />
                   </button>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-black uppercase italic tracking-tighter text-white group-hover:text-primary transition-colors truncate pr-12">
                    {site.name || 'Sem título'}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-wider">
                    <Calendar className="w-3 h-3" />
                    {site.createdAt ? format(site.createdAt.toDate(), "dd 'de' MMMM", { locale: ptBR }) : 'Recentemente'}
                  </div>
                </div>

                <div className="bg-black/50 border border-white/5 rounded-2xl p-4 flex items-center justify-between group/link">
                  <div className="text-[11px] font-mono font-bold text-white/30 truncate max-w-[180px]">
                    site/{site.id}
                  </div>
                  <Link href={`/site/${site.id}`} target="_blank">
                    <button className="flex items-center gap-1.5 text-[10px] font-black uppercase text-primary hover:text-primary/80 transition-colors tracking-widest">
                      ACESSAR <ExternalLink className="w-3 h-3" />
                    </button>
                  </Link>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => openEditChoice(site)}
                    variant="outline" 
                    className="flex-1 border-white/5 bg-white/5 h-12 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] gap-2 hover:bg-white/10 active:scale-95 transition-all"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Editar Site
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="bg-[#0c0c0c] border border-white/10 text-white rounded-[2.5rem] max-w-[400px] p-0 overflow-hidden outline-none">
          <div className="p-8 flex flex-col items-center text-center space-y-6">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Share2 className="w-7 h-7 text-primary" />
            </div>
            
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">Compartilhar Amor</DialogTitle>
              <DialogDescription className="text-white/40 text-sm font-medium">
                O QR Code abaixo é exclusivo para este presente e nunca mudará.
              </DialogDescription>
            </div>

            <div className="w-full bg-white p-6 rounded-3xl flex flex-col items-center gap-4 shadow-[0_0_50px_rgba(255,255,255,0.05)]">
              <div className="relative w-48 h-48">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://eternizee.shop/site/${selectedSiteForShare?.id}`)}`} 
                  alt="QR Code do Site"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-black/40 text-[10px] font-black uppercase tracking-widest">Aponte a câmera para testar</p>
            </div>

            <div className="w-full space-y-3 pt-4">
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                <p className="text-[10px] font-mono text-white/40 truncate max-w-[200px]">
                  eternizee.shop/site/{selectedSiteForShare?.id}
                </p>
                <button 
                  onClick={() => copyToClipboard(`https://eternizee.shop/site/${selectedSiteForShare?.id}`)}
                  className="p-2 hover:bg-white/5 rounded-xl transition-all text-primary"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              
              <Button 
                onClick={() => copyToClipboard(`https://eternizee.shop/site/${selectedSiteForShare?.id}`)}
                className="w-full h-14 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/20"
              >
                Copiar link da página
              </Button>
            </div>
          </div>

          <div className="bg-white/5 p-5 flex justify-center border-t border-white/5">
             <DialogClose className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">
               Fechar
             </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      {/* Choice Dialog */}
      <Dialog open={choiceDialogOpen} onOpenChange={setChoiceDialogOpen}>
        <DialogContent className="bg-[#0c0c0c] border border-white/10 text-white rounded-[2rem] max-w-[500px] p-0 overflow-hidden outline-none">
          <div className="p-8 space-y-8">
            <DialogHeader className="space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-2">
                <Settings2 className="w-6 h-6 text-primary" />
              </div>
              <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">O que vamos editar?</DialogTitle>
              <DialogDescription className="text-white/40 text-sm font-medium">
                Escolha qual parte da sua experiência você deseja personalizar agora.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-4">
               {/* Option 1: Main Site */}
               <Link href={`/editar/${selectedSite?.id}`}>
                 <div className="group relative bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-5 hover:bg-white/10 hover:border-primary/50 transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-black rounded-xl border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                       <LayoutGrid className="w-6 h-6 text-white/40 group-hover:text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <h4 className="text-sm font-black uppercase italic text-white group-hover:text-primary transition-colors">Personalizar Página</h4>
                       <p className="text-[10px] font-medium text-white/30 leading-relaxed uppercase tracking-widest">Fotos, Músicas, Cores e Mensagem</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                 </div>
               </Link>

               {/* Option 2: Modules */}
               <Link 
                 href={selectedSite?.isPackEnabled ? `/editar/${selectedSite?.id}?startStep=modules` : '#'} 
                 onClick={(e) => !selectedSite?.isPackEnabled && e.preventDefault()}
                 className={cn(!selectedSite?.isPackEnabled && "opacity-50 cursor-not-allowed")}
               >
                 <div className={cn(
                   "group relative border rounded-2xl p-5 flex items-center gap-5 transition-all",
                   selectedSite?.isPackEnabled 
                    ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50 cursor-pointer" 
                    : "bg-black/40 border-white/5 grayscale"
                 )}>
                    <div className="w-12 h-12 bg-black rounded-xl border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                       <Sparkles className={cn("w-6 h-6", selectedSite?.isPackEnabled ? "text-primary" : "text-white/10")} />
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black uppercase italic text-white group-hover:text-primary transition-colors">Configurar Módulos</h4>
                          {!selectedSite?.isPackEnabled && (
                            <span className="bg-white/10 text-[8px] font-black uppercase px-1.5 py-0.5 rounded text-white/40 border border-white/10">Bloqueado</span>
                          )}
                       </div>
                       <p className="text-[10px] font-medium text-white/30 leading-relaxed uppercase tracking-widest">Memórias, Conquistas e Curiosidades</p>
                    </div>
                    {selectedSite?.isPackEnabled ? (
                      <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-white/10" />
                    )}
                 </div>
               </Link>
            </div>
            
            {!selectedSite?.isPackEnabled && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-3">
                 <Sparkles className="w-4 h-4 text-primary shrink-0" />
                 <p className="text-[10px] font-black text-primary uppercase leading-relaxed tracking-wider">
                   Adicione o Pack de Módulos para desbloquear a linha do tempo de memórias e conquistas!
                 </p>
              </div>
            )}
          </div>

          <div className="bg-white/5 p-4 flex justify-end px-8 pb-8">
             <button 
               onClick={() => setChoiceDialogOpen(false)} 
               className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors"
             >
               Cancelar
             </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="bg-[#0c0c0c] border border-white/10 text-white rounded-3xl max-w-[400px] p-0 overflow-hidden">
          <form onSubmit={handlePasswordUpdate}>
            <div className="p-8 space-y-6">
              <DialogHeader className="space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-2">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">Trocar Senha</DialogTitle>
                <DialogDescription className="text-white/40 text-sm font-medium">
                  Crie uma nova senha segura para sua conta.
                </DialogDescription>
              </DialogHeader>

              {passwordSuccess ? (
                <div className="bg-green-500/10 border border-green-500/20 p-5 rounded-2xl flex flex-col items-center gap-3 animate-in zoom-in-95 duration-500">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                  <p className="text-green-500 font-bold text-sm text-center">Senha atualizada com sucesso!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Nova Senha</label>
                    <div className="relative">
                      <Input 
                        type={showPass ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-primary/50 text-sm font-medium pr-10"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Confirmar Senha</label>
                    <Input 
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-primary/50 text-sm font-medium"
                    />
                  </div>

                  {passwordError && (
                    <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-red-500 text-[10px] font-bold text-center">
                      {passwordError}
                    </div>
                  )}
                </div>
              )}
            </div>

            {!passwordSuccess && (
              <DialogFooter className="bg-white/5 p-6 flex items-center justify-between gap-4 border-t border-white/5">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setShowPasswordDialog(false)}
                  className="text-white/40 hover:text-white text-xs font-bold uppercase"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isChangingPassword}
                  className="bg-primary hover:bg-primary/90 rounded-xl px-6 font-black text-xs uppercase tracking-widest"
                >
                  {isChangingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirmar'}
                </Button>
              </DialogFooter>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
