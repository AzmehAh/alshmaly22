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
      className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-50 hover:bg-[#b9a779]/10 border border-gray-200 hover:border-[#b9a779]/50 transition-all duration-300 group"
      title={language === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
    >
      <Globe size={18} className="text-[#054239] group-hover:text-[#b9a779] transition-colors duration-300" />
      <span className="font-medium text-[#054239] group-hover:text-[#b9a779] transition-colors duration-300 min-w-[24px]">
        {language === 'en' ? 'AR' : 'EN'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;