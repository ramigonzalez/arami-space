import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { Testimonials } from '../components/landing/Testimonials';
import { CTA } from '../components/landing/CTA';
import { Footer } from '../components/landing/Footer';

interface LandingProps {
  // Future props can be added here
}

export const Landing: React.FC<LandingProps> = () => {
  return (
    <Layout>
      <Hero />
      <Features />
      <Testimonials />
      <CTA />
      <Footer />
    </Layout>
  );
};