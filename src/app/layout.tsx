import type {Metadata} from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'Eternize | Presentes Digitais Personalizados',
  description: 'Crie um presente digital com fotos, música e textos personalizados para quem você ama.',
  icons: {
    icon: 'https://s3.typebotstorage.com/public/workspaces/cm7vfrzsh0001xixq5auwzryb/typebots/cmor2i57p000007huwd9cnpp5/blocks/rnrd9dgoh72piuhxaqenuibb?v=1777891185088',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full w-full dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;700;900&family=Dancing+Script:wght@400;700&family=Pacifico&family=Playfair+Display:wght@400;700&family=Bebas+Neue&family=Lora:wght@700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-black min-h-full">
        <FirebaseClientProvider>
          {children}
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
