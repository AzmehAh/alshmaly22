import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminLanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">{t('admin.language.current')}:</span>
      <button
        onClick={toggleLanguage}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 border border-gray-300 transition-all duration-200 group"
        title={t('admin.language.switch')}
      >
        <Globe size={16} className="text-gray-600 group-hover:text-[#b9a779] transition-colors duration-200" />
        <span className="font-medium text-gray-700 group-hover:text-[#b9a779] transition-colors duration-200 min-w-[60px] text-left">
          {language === 'en' ? t('admin.language.english') : t('admin.language.arabic')}
        </span>
      </button>
    </div>
  );
};

export default AdminLanguageSwitcher;