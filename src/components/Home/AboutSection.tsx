import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const AboutSection = () => {
  const { t } = useLanguage();
  const [clients, setClients] = useState(0);
  const [countries, setCountries] = useState(0);
  const [years, setYears] = useState(0);
  const sectionRef = useRef(null);
  const intervalRef = useRef(null); 

  const animateCounters = () => {
    const clientsTarget = 5000;
    const countriesTarget = 30;
    const yearsTarget = 27;
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setClients(0);
    setCountries(0);
    setYears(0);

    intervalRef.current = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setClients(Math.floor(clientsTarget * progress));
      setCountries(Math.floor(countriesTarget * progress));
      setYears(Math.floor(yearsTarget * progress));

      if (currentStep >= steps) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setClients(clientsTarget);
        setCountries(countriesTarget);
        setYears(yearsTarget);
      }
    }, stepDuration);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animateCounters();
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  return (
   <section id="about" ref={sectionRef} className="py-20 bg-[#054239]">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Video */}
      <div className="relative w-full h-96 rounded-2xl shadow-2xl overflow-hidden">
        <iframe
          className="w-full h-full object-cover rounded-2xl"
          src="https://www.youtube.com/embed/wb-Cm7t08zg?si=H08yd5Nl-x4Xa1YZ"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        ></iframe>
        
</div>
          {/* Content */}
          <div>
            <h2 className="text-4xl font-bold text-[#F7F7F7] mb-6">
              {t('home.about.title')}
            </h2>
           
<p className="text-[#edebe0] text-lg leading-relaxed mb-8">
               {t('home.about.description')}
            </p>
            {/* Counters */}
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#b9a779] mb-2">
                  {clients.toLocaleString()}+
                </div>
                <p className="text-[#F7F7F7] font-medium">{t('statistics.satisfied_clients')}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#b9a779]  mb-2">
                  {countries}+
                </div>
                <p className="text-[#F7F7F7] font-medium">{t('statistics.exporting_countries')}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#b9a779] mb-2">
                  {years}
                </div>
                <p className="text-[#F7F7F7] font-medium">{t('statistics.years_experience')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
