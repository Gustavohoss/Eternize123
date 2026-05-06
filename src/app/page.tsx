
'use client';

import React from 'react';
import { TopBar } from '@/components/eternize/landing/top-bar';
import { Header } from '@/components/eternize/landing/header';
import { HeroSection } from '@/components/eternize/landing/hero-section';
import { StepsSection } from '@/components/eternize/landing/steps-section';
import { FeaturesDashboard } from '@/components/eternize/landing/features-dashboard';
import { ReviewsSection } from '@/components/eternize/landing/reviews-section';
import { PricingSection } from '@/components/eternize/landing/pricing-section';
import { FAQSection } from '@/components/eternize/landing/faq-section';
import { LandingFooter } from '@/components/eternize/landing/footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-body selection:bg-primary overflow-x-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
        
        .typing-container {
          font-family: 'Great Vibes', cursive;
        }

        .cursor {
          width: 2px;
          height: 35px;
          background-color: #e11d48;
          margin-left: 5px;
          animation: blink 0.8s infinite;
        }

        @keyframes blink { 50% { opacity: 0; } }

        .cta-button {
          background: linear-gradient(90deg, #e11d48, #9f1239);
          box-shadow: 0 8px 20px rgba(225, 29, 72, 0.2);
        }

        @keyframes progress-ani {
          0% { width: 38%; }
          100% { width: 100%; }
        }
        .animate-progress-live {
          animation: progress-ani 20s linear infinite;
        }

        @keyframes wave-ani {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.3); }
        }
        .animate-wave-bar {
          animation: wave-ani 1.2s ease-in-out infinite;
        }

        @keyframes pulse-heart {
          0%, 100% { box-shadow: 0 0 0 0 rgba(225, 29, 72, 0.4); }
          50% { box-shadow: 0 0 0 5px transparent; }
        }
        .animate-pulse-heart {
          animation: pulse-heart 1.5s ease-in-out infinite;
        }

        @keyframes blink-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .animate-blink-dot {
          animation: blink-dot 1.5s ease-in-out infinite;
        }
      `}</style>

      <TopBar />
      <Header />
      <main>
        <HeroSection />
        <StepsSection />
        <FeaturesDashboard />
        <ReviewsSection />
        <PricingSection />
        <FAQSection />
      </main>
      <LandingFooter />
    </div>
  );
}
