import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-4 py-2 rounded-full bg-[#054239] hover:bg-[#b9a779] text-white transition-all duration-300 group"
      title={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
    >
      <Globe size={16} className="group-hover:rotate-12 transition-transform duration-300" />
      <span className="font-medium min-w-[24px]">
        {language === 'en' ? 'عربي' : 'EN'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;