import React from 'react';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { Testimonials } from '../components/landing/Testimonials';
import { CTA } from '../components/landing/CTA';
import { Footer } from '../components/landing/Footer';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-surface-900">
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