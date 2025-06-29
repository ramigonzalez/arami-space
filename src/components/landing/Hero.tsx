import React from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ArrowRight, Mic, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative px-4 pt-16 pb-20 text-center">
      <div className="max-w-4xl mx-auto">
        {/* Badge with flame icon */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <Badge size="small" />
            <span className="text-white/90 font-medium">arami</span>
          </div>
        </div>
        
        {/* Main headline */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Your Voice-First
          <br />
          <span className="bg-gradient-to-r from-primary-400 to-accent-300 bg-clip-text text-transparent">
            Emotional AI
          </span>
          <br />
          Companion
        </h1>
        
        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
          Discover your unique personality, build emotional intelligence, and achieve meaningful goals through personalized daily rituals powered by advanced AI.
        </p>
        
        {/* Feature highlights */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <div className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
            <Mic className="w-4 h-4 text-accent-300" />
            <span className="text-white/90 text-sm">Voice-First Experience</span>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
            <Sparkles className="w-4 h-4 text-accent-300" />
            <span className="text-white/90 text-sm">Personality-Driven</span>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
            <Badge size="small" variant="virtue" />
            <span className="text-white/90 text-sm">Daily Growth Rituals</span>
          </div>
        </div>
        
        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="large" 
            icon={ArrowRight} 
            iconPosition="right"
            className="w-full sm:w-auto"
            onClick={() => navigate('/auth')}
          >
            Start Your Journey
          </Button>
          <Button 
            variant="secondary" 
            size="large"
            className="w-full sm:w-auto"
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Watch Demo
          </Button>
        </div>
        
        {/* Social proof */}
        <div className="mt-12 text-center">
          <p className="text-white/60 text-sm mb-4">Trusted by thousands of users worldwide</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-white/40 text-xs">★★★★★ 4.9/5 App Store</div>
            <div className="text-white/40 text-xs">★★★★★ 4.8/5 Google Play</div>
          </div>
        </div>
      </div>
      
      {/* Floating elements for visual interest */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-accent-300 rounded-full animate-pulse-slow opacity-60" />
      <div className="absolute top-40 right-16 w-3 h-3 bg-primary-400 rounded-full animate-pulse-slow opacity-40" />
      <div className="absolute bottom-32 left-20 w-1 h-1 bg-white rounded-full animate-pulse-slow opacity-80" />
    </section>
  );
};