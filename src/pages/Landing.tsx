import React from 'react';
import { CTA } from '../components/landing/CTA';
import { Features } from '../components/landing/Features';
import { Footer } from '../components/landing/Footer';
import { Hero } from '../components/landing/Hero';
import { Testimonials } from '../components/landing/Testimonials';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-arami-gradient">
      {/* Custom Bolt.new Badge Configuration - Styles moved to index.css */}
      <div className="fixed top-4 left-4 z-50">
        <a href="https://bolt.new/?rid=os72mi" target="_blank" rel="noopener noreferrer" 
           className="block transition-all duration-300 hover:shadow-2xl">
          <img src="https://storage.bolt.army/white_circle_360x360.png" 
               alt="Built with Bolt.new badge" 
               className="w-20 h-20 md:w-28 md:h-28 rounded-full shadow-lg bolt-badge bolt-badge-intro"
               onAnimationEnd={(e) => e.currentTarget.classList.add('animated')} />
        </a>
      </div>
      
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