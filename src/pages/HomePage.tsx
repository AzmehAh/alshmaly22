import React from 'react';
import HeroSection from '../components/Home/HeroSection';
import MarqueeSection from '../components/Home/MarqueeSection';
import AboutSection from '../components/Home/AboutSection';
import ServicesSection from '../components/Home/ServicesSection';
import ProductsSection from '../components/Home/ProductsSection';
import BlogSection from '../components/Home/BlogSection';

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ProductsSection />
      <ServicesSection />
      <BlogSection />
    </>
  );
};

export default HomePage;