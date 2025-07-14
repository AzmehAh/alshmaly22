import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-[100vh] flex items-center overflow-hidden w-full">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <video 
          autoPlay 
          muted 
          loop 
          className="w-full h-full object-cover min-w-full min-h-full"
          poster="https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-corn-field-44232-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50 w-full h-full"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Al-Shamali –{' '}
              <span className="text-[#b9a779]">Quality Speaks</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              We export the best of Syrian nature to the world, bringing authenticity and premium quality to your table.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/products"
                className="bg-[#b9a779] hover:bg-[#054239] text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center group"
              >
                Explore Our Products
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link 
                to="/contact"
                className="border-2 border-white text-white hover:bg-white hover:text-[#054239] px-8 py-4 rounded-full font-semibold transition-all duration-300 text-center"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;