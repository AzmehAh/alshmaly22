import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  getLocalizedField: (data: any, field: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Static translations for UI elements
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.about': 'About Us',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.iso_certificate': 'ISO Certificate',
    
    // Common
    'common.loading': 'Loading...',
    'common.search': 'Search...',
    'common.view_details': 'View Details',
    'common.read_more': 'Read More',
    'common.contact_us': 'Contact Us',
    'common.get_quote': 'Get Quote',
    'common.learn_more': 'Learn More',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.submit': 'Submit',
    'common.close': 'Close',
    
    // Home page
    'home.hero.title': 'Al-Shamali – Quality Speaks',
    'home.hero.subtitle': 'We export the best of Syrian nature to the world, bringing authenticity and premium quality to your table.',
    'home.hero.explore_products': 'Explore Our Products',
    'home.about.title': 'We bring authenticity into your world',
    'home.products.title': 'Featured Products',
    'home.services.title': 'Our Services',
    'home.blog.title': 'Latest News & Updates',
    
    // Products
    'products.title': 'Our Products',
    'products.all_categories': 'All Products',
    'products.no_products': 'No products found matching your criteria.',
    'products.sort_by': 'Sort By',
    'products.sort.name': 'Name',
    'products.sort.price_low': 'Price: Low to High',
    'products.sort.price_high': 'Price: High to Low',
    
    // About
    'about.title': 'About Al-Shamali',
    'about.hero.subtitle': 'For over 25 years, we have been the bridge between Syrian agricultural heritage and global markets, bringing authentic, premium-quality products to tables worldwide.',
    'about.vision.title': 'Our Vision & Values',
    'about.journey.title': 'Our Journey',
    'about.global_reach.title': 'Global Reach',
    'about.global_reach.subtitle': 'We proudly export to over 30 countries worldwide, bringing Syrian agricultural excellence to global markets',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.get_in_touch': 'Get in Touch',
    'contact.send_message': 'Send us a Message',
    'contact.address': 'Address',
    'contact.phone': 'Phone',
    'contact.email': 'Email',
    'contact.business_hours': 'Business Hours',
    
    // Blog
    'blog.title': 'Al-Shamali Blog',
    'blog.subtitle': 'Stay updated with our latest news, insights, and stories from the world of Syrian agriculture',
    'blog.all_categories': 'All',
    'blog.no_posts': 'No blog posts found in this category.',
    
    // Footer
    'footer.description': 'We export the best of Syrian nature to the world, bringing authenticity and quality to your table.',
    'footer.quick_links': 'Quick Links',
    'footer.contact_info': 'Contact Info',
    'footer.follow_us': 'Follow Us',
    'footer.rights': 'All rights reserved.',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.products': 'المنتجات',
    'nav.about': 'من نحن',
    'nav.blog': 'المدونة',
    'nav.contact': 'اتصل بنا',
    'nav.iso_certificate': 'شهادة الآيزو',
    
    // Common
    'common.loading': 'جارٍ التحميل...',
    'common.search': 'البحث...',
    'common.view_details': 'عرض التفاصيل',
    'common.read_more': 'اقرأ المزيد',
    'common.contact_us': 'اتصل بنا',
    'common.get_quote': 'احصل على عرض سعر',
    'common.learn_more': 'تعلم المزيد',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.add': 'إضافة',
    'common.submit': 'إرسال',
    'common.close': 'إغلاق',
    
    // Home page
    'home.hero.title': 'الشمالي – الجودة تتحدث عن نفسها',
    'home.hero.subtitle': 'نصدر أفضل ما في الطبيعة السورية إلى العالم، ونقدم الأصالة والجودة المميزة لمائدتك.',
    'home.hero.explore_products': 'استكشف منتجاتنا',
    'home.about.title': 'نحن نجلب الأصالة إلى عالمك',
    'home.products.title': 'المنتجات المميزة',
    'home.services.title': 'خدماتنا',
    'home.blog.title': 'آخر الأخبار والتحديثات',
    
    // Products
    'products.title': 'منتجاتنا',
    'products.all_categories': 'جميع المنتجات',
    'products.no_products': 'لم يتم العثور على منتجات تطابق معاييرك.',
    'products.sort_by': 'ترتيب حسب',
    'products.sort.name': 'الاسم',
    'products.sort.price_low': 'السعر: من الأقل إلى الأعلى',
    'products.sort.price_high': 'السعر: من الأعلى إلى الأقل',
    
    // About
    'about.title': 'عن الشمالي',
    'about.hero.subtitle': 'لأكثر من 25 عامًا، كنا الجسر بين التراث الزراعي السوري والأسواق العالمية، نجلب منتجات أصلية عالية الجودة إلى موائد العالم.',
    'about.vision.title': 'رؤيتنا وقيمنا',
    'about.journey.title': 'رحلتنا',
    'about.global_reach.title': 'الوصول العالمي',
    'about.global_reach.subtitle': 'نفخر بالتصدير إلى أكثر من 30 دولة حول العالم، نجلب التميز الزراعي السوري إلى الأسواق العالمية',
    
    // Contact
    'contact.title': 'اتصل بنا',
    'contact.get_in_touch': 'تواصل معنا',
    'contact.send_message': 'أرسل لنا رسالة',
    'contact.address': 'العنوان',
    'contact.phone': 'الهاتف',
    'contact.email': 'البريد الإلكتروني',
    'contact.business_hours': 'ساعات العمل',
    
    // Blog
    'blog.title': 'مدونة الشمالي',
    'blog.subtitle': 'ابق على اطلاع بآخر أخبارنا ورؤانا وقصصنا من عالم الزراعة السورية',
    'blog.all_categories': 'الكل',
    'blog.no_posts': 'لم يتم العثور على مقالات في هذه الفئة.',
    
    // Footer
    'footer.description': 'نصدر أفضل ما في الطبيعة السورية إلى العالم، ونجلب الأصالة والجودة إلى مائدتك.',
    'footer.quick_links': 'روابط سريعة',
    'footer.contact_info': 'معلومات الاتصال',
    'footer.follow_us': 'تابعنا',
    'footer.rights': 'جميع الحقوق محفوظة.',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [direction, setDirection] = useState<Direction>('ltr');

  useEffect(() => {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem('al-shamali-language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguageState(savedLanguage);
      setDirection(savedLanguage === 'ar' ? 'rtl' : 'ltr');
    }
  }, []);

  useEffect(() => {
    // Update document direction and font
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
    
    // Add/remove Arabic font class
    if (language === 'ar') {
      document.documentElement.classList.add('font-arabic');
    } else {
      document.documentElement.classList.remove('font-arabic');
    }
  }, [language, direction]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setDirection(lang === 'ar' ? 'rtl' : 'ltr');
    localStorage.setItem('al-shamali-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  const getLocalizedField = (data: any, field: string): string => {
    if (!data) return '';
    
    const localizedField = language === 'ar' ? `${field}_ar` : field;
    const fallbackField = language === 'ar' ? field : `${field}_ar`;
    
    return data[localizedField] || data[fallbackField] || data[field] || '';
  };

  return (
    <LanguageContext.Provider value={{
      language,
      direction,
      setLanguage,
      t,
      getLocalizedField
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};