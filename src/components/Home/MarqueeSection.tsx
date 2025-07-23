import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { Leaf, Award, Users, Clock, HandHeart } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const MarqueeSection = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  const x = useMotionValue(0);
  const animationRef = useRef();
  const lastTime = useRef(0);
  const isHovered = useRef(false);

  const features = [
    { icon: Leaf, text: t('marquee.natural') },
    { icon: Award, text: t('marquee.quality_standards') },
    { icon: Clock, text: t('marquee.years_expertise') },
    { icon: Users, text: t('marquee.customer_satisfaction') },
    { icon: HandHeart, text: t('marquee.trader_support') },
  ];

  const duplicated = [...features, ...features, ...features];
  const itemWidth = 260;
  const gap = 30;
  const totalOriginalWidth = features.length * (itemWidth + gap);
  const direction = isRTL ? 1 : -1;
  const animationDuration = 15; 

  const animate = (currentTime) => {
    if (!lastTime.current) lastTime.current = currentTime;

    if (!isHovered.current) {
      const deltaTime = currentTime - lastTime.current;
      const deltaProgress = deltaTime / (animationDuration * 1000);
      let currentX = x.get();
      let newX = currentX + direction * deltaProgress * totalOriginalWidth;

      if (direction < 0) {
        if (Math.abs(newX) >= totalOriginalWidth) newX += totalOriginalWidth;
        else if (newX > 0) newX -= totalOriginalWidth;
      } else {
        if (newX >= totalOriginalWidth) newX -= totalOriginalWidth;
        else if (newX < 0) newX += totalOriginalWidth;
      }

      x.set(newX);
    }

    lastTime.current = currentTime;
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRTL]);

  return (
    <section
      className="py-3 bg-[#F7F7F7] border-b-2 border-b-[#edebe0] overflow-hidden w-full"
      dir={isRTL ? 'rtl' : 'ltr'}
      onMouseEnter={() => { isHovered.current = true; }}
      onMouseLeave={() => {
        isHovered.current = false;
        lastTime.current = performance.now();
      }}
    >
      <div className="relative overflow-hidden w-full">
       <motion.div
  className={`flex ${isRTL ? 'flex-row-reverse' : ''}`}
  style={{
    x,
    width: `${duplicated.length * (itemWidth + gap)}px`,
    gap: `${gap}px`,
  }}
>
  {duplicated.map((feature, index) => (
    <div
      key={index}
      className={`inline-flex items-center text-[#054239] flex-shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}
      style={{ width: `${itemWidth}px` }}
    >
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center">
        <feature.icon size={20} className="md:w-6 md:h-6" />
      </div>
      <span
        className={`text-sm md:text-lg font-semibold ${
          isRTL ? 'mr-3 md:mr-4' : 'ml-3 md:ml-4'
        }`}
      >
        {feature.text}
      </span>
    </div>
  ))}
</motion.div>

      </div>
    </section>
  );
};

export default MarqueeSection;
