import React from 'react';
import { Leaf, Award, Users, Clock, HandHeart } from 'lucide-react';

const MarqueeSection = () => {
  const features = [
    { icon: Leaf, text: '100% Natural' },
    { icon: Award, text: 'Global Quality Standards' },
    { icon: Clock, text: '25+ Years of Expertise' }, 
    { icon: Users, text: 'Customer Satisfaction First' },
    { icon: HandHeart, text: 'Ongoing Trader Support' },
  ];
 
  return ( 
    <section className="py-2 bg-[#F7F7F7] border-b-2 border-b-[#edebe0] overflow-hidden w-full">
      <div className="w-full relative">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...features, ...features, ...features].map((feature, index) => (
            <div 
              key={index} 
              className="inline-flex items-center mx-8 text-[#054239] flex-shrink-0"
            > 
              <div className="w-12 h-12 text-[#054239] rounded-full flex items-center justify-center">
                <feature.icon size={24} />
              </div>
              <span className="ml-4 text-xl font-semibold">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarqueeSection;

