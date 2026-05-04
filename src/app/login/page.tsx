'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Mail, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/minhas-paginas');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('E-mail ou senha incorretos.');
      } else {
        setError('Ocorreu um erro ao tentar entrar. Verifique sua conexão.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="fixed inset-0 bg-hero-glow pointer-events-none z-0" />
      
      <Link href="/" className="absolute top-8 left-8 group flex items-center gap-2 text-white/30 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest z-10">
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Voltar ao início
      </Link>

      <div className="w-full max-w-[400px] relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-10">
          <div className="mb-6 flex flex-col items-center gap-2">
            <Image 
              src="https://s3.typebotstorage.com/public/workspaces/cm7vfrzsh0001xixq5auwzryb/typebots/cmor2i57p000007huwd9cnpp5/blocks/rnrd9dgoh72piuhxaqenuibb?v=1777891185088" 
              alt="Eternize Logo" 
              width={64} 
              height={64} 
              className="h-14 md:h-16 w-auto object-contain"
              priority
            />
            <span className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase text-white">ETERNIZE</span>
          </div>
          <h1 className="text-xl font-black italic uppercase tracking-tighter mb-2 text-white/40">Bem-vindo de volta<span className="text-primary">.</span></h1>
          <p className="text-white/20 text-sm font-medium">Acesse suas memórias eternizadas.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1 flex items-center gap-2">
              <Mail className="w-3 h-3" /> Seu E-mail
            </label>
            <Input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ex: voce@email.com"
              required
              className="bg-white/5 border-white/10 h-14 rounded-xl text-sm font-medium focus:border-primary/50 transition-all shadow-inner"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1 flex items-center gap-2">
              <Mail className="w-3 h-3" /> Sua Senha
            </label>
            <Input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-white/5 border-white/10 h-14 rounded-xl text-sm font-medium focus:border-primary/50 transition-all shadow-inner"
            />
            <p className="text-[9px] text-white/20 italic ml-1">Senha padrão para novos acessos: Eternize123</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-red-500 text-[11px] font-bold text-center animate-in shake-1 duration-300">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-sm transition-all shadow-2xl shadow-primary/20 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Entrar no painel'}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[11px] font-medium text-white/20 uppercase tracking-widest">
            Ainda não tem um presente? <Link href="/criador" className="text-primary hover:underline font-black">Crie agora</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
