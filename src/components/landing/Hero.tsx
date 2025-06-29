import React from 'react';
import { Button } from '../ui/Button';
import { ArrowRight, Mic, Sparkles, Target } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative px-4 pt-20 pb-24 text-center">
      <div className="max-w-4xl mx-auto">
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
          <div className="w-2 h-2 bg-accent-400 rounded-full animate-pulse"></div>
          <span className="text-white/90 text-sm font-medium">arami</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Your Voice-First
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-accent-500">
            Emotional AI
          </span>
          <br />
          Companion
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
          Discover your unique personality, build emotional intelligence, and achieve 
          meaningful goals through personalized daily rituals powered by advanced AI.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
            <Mic className="w-4 h-4 text-accent-400" />
            <span className="text-white/90 text-sm font-medium">Voice-First Experience</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
            <Sparkles className="w-4 h-4 text-accent-400" />
            <span className="text-white/90 text-sm font-medium">Personality-Driven</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
            <Target className="w-4 h-4 text-accent-400" />
            <span className="text-white/90 text-sm font-medium">Daily Growth Rituals</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button
            size="large"
            icon={ArrowRight}
            iconPosition="right"
            className="w-full sm:w-auto min-w-[200px]"
          >
            Start Your Journey
          </Button>
          <Button
            variant="outline"
            size="large"
            className="w-full sm:w-auto min-w-[200px]"
          >
            Watch Demo
          </Button>
        </div>

        {/* Social Proof */}
        <div className="text-center">
          <p className="text-white/60 text-sm mb-4">Trusted by thousands of users worldwide</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-sm">★</span>
                ))}
              </div>
              <span className="text-white/70 text-sm">4.9/5 App Store</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-sm">★</span>
                ))}
              </div>
              <span className="text-white/70 text-sm">4.8/5 Google Play</span>
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
};