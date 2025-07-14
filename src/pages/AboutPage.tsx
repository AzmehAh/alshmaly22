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
    title: 'Company Foundation',
    description: 'Al-Shamali was established in Idlib, Syria, with a vision to export premium Syrian agricultural products.'
  },
  {
    year: '2005',
    title: 'First International Export',
    description: 'Successfully exported our first shipment of freekeh and legumes to European markets.'
  },
  {
    year: '2010',
    title: 'Quality Certifications',
    description: 'Obtained ISO 9001 and ISO 22000 certifications and implemented modern Sortex cleaning technology.'
  },
  {
    year: '2020',
    title: 'Our Export Launch',
    description: 'Started exporting through Souqna First Gate in Qatar, gradually expanding to other countries with a product range exceeding 30 items.'
  },
  {
    year: '2024',
    title: 'Sustainable Future',
    description: 'Committed to sustainable farming practices and supporting local Syrian farmers.'
  }
];


 


  const values = [
    {
      icon: Award,
      title: 'Quality Excellence',
      description: 'We maintain the highest standards in every product we export, ensuring authenticity and premium quality.'
    },
    {
      icon: Users,
      title: 'Customer Focus',
      description: 'Our customers are at the heart of everything we do. We build lasting partnerships based on trust and reliability.'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'We connect Syrian agricultural heritage with global markets, bringing authentic flavors worldwide.'
    },
    {
      icon: CheckCircle,
      title: 'Sustainability',
      description: 'We are committed to sustainable farming practices that support local communities and the environment.'
    }
  ];

return (
  <div className="min-h-screen bg-[#F7F7F7] pt-20">
    {/* Hero Section */}
    <section className="relative py-32 text-white">
  
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="https://i.postimg.cc/RZSbVwFP/4aa54b09-2e71-484f-b501-e95043211167.jpg" 
          alt="Al-Shamali Team"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
    
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
              {/* Vision content - could be made dynamic */}
            </div> 
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=800&h=600" 
                alt="Al-Shamali Team"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute -bottom-6 -right-6  bg-[#054239]   text-white p-6 rounded-2xl">
                
                <p className="text-sm font-semibold">Established</p>
                <p className="text-2xl font-bold">1999</p>
              </div>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-[#f7f7f7] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-[#054239] rounded-full flex items-center justify-center mb-6">
                  <value.icon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#054239] mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
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
           {/* Journey subtitle could be made dynamic */}
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
              Annual Exports: {getLocalizedField(country, 'annual_exports')}
            </p>
            <p className="text-gray-500 text-sm">
              Main Products: {getLocalizedField(country, 'main_products')}
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