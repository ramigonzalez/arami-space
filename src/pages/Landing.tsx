import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { Testimonials } from '../components/landing/Testimonials';
import { CTA } from '../components/landing/CTA';
import { Footer } from '../components/landing/Footer';

export const Landing: React.FC = () => {
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