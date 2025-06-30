import React from 'react';
import { CTA } from '../components/landing/CTA';
import { Features } from '../components/landing/Features';
import { Footer } from '../components/landing/Footer';
import { Hero } from '../components/landing/Hero';
import { Testimonials } from '../components/landing/Testimonials';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-arami-gradient">
      {/* Main Content Container - Responsive */}
      <div className="max-w-md mx-auto px-4 sm:max-w-2xl sm:px-6 lg:max-w-6xl xl:max-w-7xl lg:px-8">
        <Hero />
        <Features />
        <Testimonials />
        <CTA />
      </div>
      <Footer />
    </div>
  );
};