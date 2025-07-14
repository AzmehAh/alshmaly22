import React, { useState, useEffect, useRef } from 'react';

const AboutSection = () => {
  const [clients, setClients] = useState(0);
  const [countries, setCountries] = useState(0);
  const [years, setYears] = useState(0);
  const sectionRef = useRef(null);
  const intervalRef = useRef(null); 

  const animateCounters = () => {
    const clientsTarget = 5000;
    const countriesTarget = 30;
    const yearsTarget = 25;
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
          {/* Image */}
          <div className="relative">
            <img 
              src="https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=800&h=600" 
              alt="Al-Shamali Team"
              className="rounded-2xl shadow-2xl w-full h-96 object-cover"
            />
            <div className="absolute -bottom-6 -right-6 bg-[#b9a779] text-white p-6 rounded-2xl">
              <p className="text-sm font-semibold">Trusted by</p>
              <p className="text-2xl font-bold">5000+ Clients</p>
            </div>
          </div>

          {/* Content */}
          <div>
            <h2 className="text-4xl font-bold text-[#F7F7F7]  mb-6">
              We bring authenticity into your world
            </h2>
            <p className="text-[#edebe0] text-lg leading-relaxed mb-8">
              For over 25 years, Al-Shamali has been the trusted name in exporting premium Syrian agricultural products. 
              Our commitment to quality and authenticity has made us a preferred partner for traders worldwide, 
              bringing the finest legumes, spices, oils, and herbs from Syrian soil to tables across the globe.
            </p>

            {/* Counters */}
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#b9a779] mb-2">
                  {clients.toLocaleString()}+
                </div>
                <p className="text-[#F7F7F7]  font-medium">Satisfied Clients</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#b9a779]  mb-2">
                  {countries}+
                </div>
                <p className="text-[#F7F7F7]  font-medium">Exporting Countries</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#b9a779] mb-2">
                  {years}
                </div>
                <p className="text-[#F7F7F7]  font-medium">Years of Experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
