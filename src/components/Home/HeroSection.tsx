import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Play, Pause, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

const HeroSection = () => {
  const { t, language } = useLanguage();
  const isArabic = language === "ar";

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);


  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return ( 
<section
  id="home"
  className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden"

>
      {/* Background Video */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <video 
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster=""
        > 
          <source src="https://files.catbox.moe/jnps5k.mp4" type="video/mp4" />
        </video> 
        <div className={`absolute inset-0 w-full h-full transition-all duration-1000 ${
          isPlaying ? 'bg-black/50' : 'bg-black/80 backdrop-blur-sm'
        }`}></div>
        
        {/* Paused overlay effect */}
        {!isPlaying && (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-orange-900/20 to-gray-900/60 backdrop-sepia"></div>
        )}
      </div>

      {/* Video Controls */}
      <div className="absolute bottom-6 left-6 z-20 flex flex-row gap-4" dir="ltr">
        <button
          onClick={togglePlayPause}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
            isPlaying 
              ? 'bg-white/20 hover:bg-white/30 text-white' 
              : 'bg-red-500/80 hover:bg-red-600/80 text-white shadow-lg'
          }`}
          title={isPlaying ? 'Pause Video' : 'Play Video'}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        
        <button 
          onClick={toggleMute}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
            isMuted 
              ? 'bg-white/20 hover:bg-white/30 text-white' 
              : 'bg-blue-500/80 hover:bg-blue-600/80 text-white shadow-lg'
          }`}
          title={isMuted ? 'Unmute Video' : 'Mute Video'}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl w-full">
            <h1
              className={`text-3xl md:text-6xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight ${
                isArabic ? 'text-right' : 'text-left'
              }`}
            >
              {t('home.hero.title')}
            </h1>
            <p className={`text-lg md:text-xl text-gray-200 mb-6 md:mb-8 leading-relaxed ${isArabic ? 'text-right' : 'text-left'}`}>
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Link 
                to="/products"
                className="bg-[#b9a779] hover:bg-[#054239] text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center group text-sm md:text-base"
              >
                {t('home.hero.explore_products')}
                {language === 'ar' ? (
                  <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                ) : (
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                )}
              </Link>
              <Link 
                to="/contact"
                className="border-2 border-white text-white hover:bg-white hover:text-[#054239] px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold transition-all duration-300 text-center text-sm md:text-base"
              >
                {t('common.contact_us')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="hidden lg:block lg:absolute lg:bottom-8 lg:left-1/2 lg:transform lg:-translate-x-1/2 text-white lg:animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  ); 
};

export default HeroSection;