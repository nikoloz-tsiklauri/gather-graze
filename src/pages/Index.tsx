import React from 'react';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import FeaturedCategories from '@/components/FeaturedCategories';
import Benefits from '@/components/Benefits';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';

const Index: React.FC = () => {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <FeaturedCategories />
      <Benefits />
      <Testimonials />
      <FAQ />
    </main>
  );
};

export default Index;
