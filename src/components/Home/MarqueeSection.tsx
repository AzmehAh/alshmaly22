import React from 'react';
import { Leaf, Award, Users, Clock, HandHeart } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const MarqueeSection = () => {
  const { t } = useLanguage();
  
  const features = [ 
    { icon: Leaf, text: t('marquee.natural') },
    { icon: Award, text: t('marquee.quality_standards') },
    { icon: Clock, text: t('marquee.years_expertise') }, 
    { icon: Users, text: t('marquee.customer_satisfaction') },
    { icon: HandHeart, text: t('marquee.trader_support') },
  ];

  return ( 
    <section className="py-3 bg-[#F7F7F7] border-b-2 border-b-[#edebe0] overflow-hidden w-full">
      <div className="w-full relative">
        <div className="flex animate-marquee whitespace-nowrap min-w-max">
          {[...features, ...features, ...features].map((feature, index) => (
            <div 
              key={index} 
              className="inline-flex items-center px-8 md:px-12 text-[#054239] flex-shrink-0"
            > 
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center">
                <feature.icon size={20} className="md:w-6 md:h-6" />
              </div>
              <span className="ml-3 md:ml-4 text-sm md:text-xl font-semibold">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarqueeSection;
