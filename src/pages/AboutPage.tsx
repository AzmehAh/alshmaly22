import React, { useState } from 'react';
import { Award, Users, Globe, Calendar, MapPin, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ExportCountriesAPI } from '../lib/api/export-countries';
import type { ExportCountry } from '../lib/supabase';

const AboutPage = () => {
  const { t, getLocalizedField } = useLanguage();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [exportCountries, setExportCountries] = useState<ExportCountry[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchExportCountries = async () => {
      try {
        const countries = await ExportCountriesAPI.getActiveExportCountries();
        setExportCountries(countries);
      } catch (error) {
        console.error('Error fetching export countries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExportCountries();
  }, []);
 
  const timeline = [
  { 
    year: '1998', 
    title: t('timeline.foundation.title'),
    description: t('timeline.foundation.description')
  },
  {
    year: '2005',
    title: t('timeline.first_export.title'),
    description: t('timeline.first_export.description')
  },
  {
    year: '2010',
    title: t('timeline.certifications.title'),
    description: t('timeline.certifications.description')
  },
  {
    year: '2020',
    title: t('timeline.export_launch.title'),
    description: t('timeline.export_launch.description')
  },
  {
    year: '2024',
    title: t('timeline.sustainable_future.title'),
    description: t('timeline.sustainable_future.description')
  }
];


 


  const values = [
    {
      key: 'quality',
      icon: Award,
    },
    {
      key: 'customer',
      icon: Users,
    },
    {
      key: 'global',
      icon: Globe,
    },
    {
      key: 'sustainability',
      icon: CheckCircle,
    }
  ];
 
return (
  <div className="min-h-screen bg-[#F7F7F7] pt-20">
    {/* Hero Section */}
    <section className="relative py-20 bg-[#054239] text-white">
  
      {/* <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="https://i.postimg.cc/RZSbVwFP/4aa54b09-2e71-484f-b501-e95043211167.jpg" 
          alt="Al-Shamali Team"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      */}
    
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">{t('about.title')}</h1>
          <p className="text-xl text-gray-100 leading-relaxed drop-shadow-md">
            {t('about.hero.subtitle')}
          </p>
        </div>
      </div>
    </section>


      {/* Vision and Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-4xl font-bold text-[#054239] mb-6">{t('about.vision.title')}</h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-6">
                {t('about.vision.content')}
              </p>
             
              <p className="text-gray-600 text-lg leading-relaxed">
                {t('about.vision.description.1')}
                 </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                {t('about.vision.description.2')}
                 </p>
            </div> 
            <div className="relative">
              <img 
                src="./images/shmaly.png" 
                alt="Al-Shmaly Team"
                className="rounded-2xl  w-full h-96 object-contain"
              />
          
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-[#f7f7f7] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-[#054239] rounded-full flex items-center justify-center mb-6">
                  <value.icon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#054239] mb-4">{t(`about.values.${value.key}.title`)}</h3>
                <p className="text-gray-600">{t(`about.values.${value.key}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20 bg-[#F7F7F7]  border-b-2  border-t-2 border-b-[#edebe0] border-t-[#edebe0]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
           <h2 className="text-4xl font-bold text-[#054239] mb-4">{t('about.journey.title')}</h2>
           <p className="text-gray-600 text-lg max-w-2xl mx-auto">
             {t('about.journey.subtitle')}
           </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-[#054239] hidden lg:block"></div>

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'}`}>
                    <div className="bg-[#f7f7f7] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <Calendar size={20} className="text-[#b9a779] mr-2" />
                        <span className="text-[#b9a779] font-bold text-lg">{item.year}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-[#054239] mb-3">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="hidden lg:block w-6 h-6 bg-[#054239] rounded-full border-4 border-white shadow-lg z-10"></div>
                  
                  <div className="lg:w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

  {/* Export Countries Map */}
<section className="py-20 bg-[#F7F7F7] ">
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-[#054239] mb-4">{t('about.global_reach.title')}</h2>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">
        {t('about.global_reach.subtitle')}
      </p>
    </div>

    {/* Export Countries Grid */}
    {loading ? (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b9a779]"></div>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exportCountries.map((country) => (
          <div 
            key={country.id}
            className="bg-[#F7F7F7] rounded-xl p-6 hover:bg-[#b9a779]/10 transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedCountry(country)}
          >
            <div className="flex items-center mb-3">
              <MapPin size={20} className="text-[#b9a779] mr-2" />
              <h3 className="text-lg font-semibold text-[#054239]">
                {getLocalizedField(country, 'name')}
              </h3>
            </div>
            <p className="text-gray-600 text-sm mb-2">
             {getLocalizedField(country, 'annual_exports')}
            </p>
            <p className="text-gray-500 text-sm">
              {getLocalizedField(country, 'main_products')}
            </p>
          </div>
        ))}
      </div>
    )}

    {!loading && exportCountries.length === 0 && (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No export countries available at the moment.</p>
      </div>
    )}
  </div>
</section>
 </div>
   
  );
};

export default AboutPage;