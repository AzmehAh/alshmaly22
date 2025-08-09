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
      className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#054239] hover:bg-[#b9a779] text-white transition-all duration-200 group"
      title={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
    >
      <Globe size={16} className="text-white group-hover:text-white transition-colors duration-200" />
      <span className="font-medium text-white group-hover:text-white transition-colors duration-200 min-w-[24px] text-center">
        {language.toUpperCase()}
      </span>
    </button>
  );
};

export default LanguageSwitcher;