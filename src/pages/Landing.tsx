import React from 'react';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { Testimonials } from '../components/landing/Testimonials';
import { CTA } from '../components/landing/CTA';
import { Footer } from '../components/landing/Footer';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900">
      {/* Bolt.new Badge */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .bolt-badge {
            transition: all 0.3s ease;
          }
          @keyframes badgeIntro {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.05); }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); opacity: 1; }
          }
          .bolt-badge-intro {
            animation: badgeIntro 0.8s ease-out 1s both;
          }
          .bolt-badge-intro.animated {
            animation: none;
          }
          @keyframes badgeHover {
            0% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.1) rotate(22deg); }
            100% { transform: scale(1) rotate(0deg); }
          }
          .bolt-badge:hover {
            animation: badgeHover 0.6s ease-in-out;
          }
        `
      }} />
      
      <div className="fixed top-4 right-4 z-50">
        <a 
          href="https://bolt.new/?rid=os72mi" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block transition-all duration-300 hover:shadow-2xl"
        >
          <img 
            src="https://storage.bolt.army/white_circle_360x360.png" 
            alt="Built with Bolt.new badge" 
            className="w-20 h-20 md:w-28 md:h-28 rounded-full shadow-lg bolt-badge bolt-badge-intro"
            onAnimationEnd={(e) => e.currentTarget.classList.add('animated')}
          />
        </a>
      </div>

      {/* Main Content */}
      <Hero />
      <Features />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};