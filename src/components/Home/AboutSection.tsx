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
    <div className="relative">
  <a
    href="https://youtu.be/wb-Cm7t08zg?si=A51qw-FXXKWTRqZx"
    target="_blank"
    rel="noopener noreferrer"
    className="block w-full h-96 group"
  >
    <img
      src="https://img.youtube.com/vi/wb-Cm7t08zg/hqdefault.jpg"
      alt="Al-Shmaly Video"
      className="rounded-2xl shadow-2xl w-full h-96 object-cover group-hover:opacity-80 transition duration-300"
    />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="bg-white bg-opacity-80 rounded-full p-4 shadow-lg group-hover:scale-110 transition duration-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-red-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M10 16.5l6-4.5-6-4.5v9z" />
        </svg>
      </div>
    </div>
  </a>

  {/* بطاقة التعريف في الأسفل */}
  <div className="absolute -bottom-6 -right-6 bg-[#b9a779] text-white p-6 rounded-2xl">
    <p className="text-sm font-semibold">{t('home.about.1')}</p>
    <p className="text-2xl font-bold">{t('home.about.2')}</p>
  </div>
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
