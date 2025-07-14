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
    'blog.load_more': 'Load More Articles',
    'blog.share': 'Share Article',
    
    // Footer
    'footer.description': 'We export the best of Syrian nature to the world, bringing authenticity and quality to your table.',
    'footer.quick_links': 'Quick Links',
    'footer.contact_info': 'Contact Info',
    'footer.follow_us': 'Follow Us',
    'footer.rights': 'All rights reserved.',
    
    // About page
    'about.hero.subtitle': 'For over 25 years, we have been the bridge between Syrian agricultural heritage and global markets, bringing authentic, premium-quality products to tables worldwide.',
    'about.vision.title': 'Our Vision & Values',
    'about.vision.content': 'We maintain the highest standards in every product we export, ensuring authenticity and premium quality.',
    'about.journey.title': 'Our Journey',
    'about.journey.subtitle': 'Discover the milestones that have shaped our commitment to quality and excellence',
    'about.values.quality.title': 'Quality Excellence',
    'about.values.quality.description': 'We maintain the highest standards in every product we export, ensuring authenticity and premium quality.',
    'about.values.customer.title': 'Customer Focus',
    'about.values.customer.description': 'Our customers are at the heart of everything we do. We build lasting partnerships based on trust and reliability.',
    'about.values.global.title': 'Global Reach',
    'about.values.global.description': 'We connect Syrian agricultural heritage with global markets, bringing authentic flavors worldwide.',
    'about.values.sustainability.title': 'Sustainability',
    'about.values.sustainability.description': 'We are committed to sustainable farming practices that support local communities and the environment.',
    
    // Contact page
    'contact.hero.subtitle': 'Ready to start your journey with premium Syrian agricultural products? Get in touch with our team today.',
    'contact.get_in_touch': 'Get in Touch',
    'contact.send_message': 'Send us a Message',
    'contact.form.full_name': 'Full Name',
    'contact.form.email': 'Email Address',
    'contact.form.phone': 'Phone Number',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Message',
    'contact.form.send': 'Send Message',
    'contact.form.sending': 'Sending...',
    'contact.form.placeholder.name': 'Your full name',
    'contact.form.placeholder.email': 'your.email@example.com',
    'contact.form.placeholder.phone': '+1 (555) 123-4567',
    'contact.form.placeholder.message': 'Tell us about your requirements, questions, or how we can help you...',
    'contact.form.success': 'Thank you for your message! We will get back to you soon.',
    'contact.form.error': 'Failed to send message. Please try again.',
    'contact.location': 'Our Location',
    'contact.whatsapp': 'WhatsApp Chat',
    'contact.call_now': 'Call Now',
    'contact.business_hours.title': 'Business Hours',
    'contact.business_hours.weekdays': 'Saturday to Thursday: 9:00 AM – 5:00 PM',
    'contact.business_hours.friday': 'Friday: Closed',
    'contact.faq.title': 'Frequently Asked Questions',
    'contact.faq.subtitle': 'Quick answers to common questions about our products and services',
    
    // Services
    'services.title': 'Our Services',
    'services.subtitle': 'From packaging to delivery, we provide comprehensive solutions for your agricultural product needs',
    'services.packaging.title': 'Packaging & Filling',
    'services.packaging.description': 'Professional packaging solutions with custom labeling options',
    'services.shipping.title': 'Shipping & Export',
    'services.shipping.description': 'Worldwide shipping with reliable logistics partners',
    'services.wholesale.title': 'Wholesale Supply',
    'services.wholesale.description': 'Complete documentation and customs clearance support',
    'services.consulting.title': 'Agricultural Consulting',
    'services.consulting.description': 'Expert consulting services for traders and distributors',
    
    // General buttons and actions
    'buttons.explore_products': 'Explore Our Products',
    'buttons.browse_all_articles': 'Browse All Articles',
    'buttons.explore_all_products': 'Explore All Products',
    'buttons.contact_supplier': 'Contact Supplier',
    'buttons.request_quote': 'Request Quote',
    'buttons.load_more': 'Load More',
    
    // Footer sections
    'footer.company_description': 'We export the best of Syrian nature to the world, bringing authenticity and quality to your table.',
    'footer.made_by': 'Made by',
    'footer.all_rights': 'All rights reserved.',
    
    // Form validation
    'validation.required': 'This field is required',
    'validation.email': 'Please enter a valid email address',
    'validation.phone': 'Please enter a valid phone number',
    
    // Misc
    'misc.established': 'Established',
    'misc.trusted_by': 'Trusted by',
    'misc.clients': 'Clients',
    'misc.years_experience': 'Years of Experience',
    'misc.exporting_countries': 'Exporting Countries',
    'misc.satisfied_clients': 'Satisfied Clients',
    'misc.industrial_zone': 'Industrial Zone',
    'misc.select_subject': 'Select a subject',
    'misc.subject_options.product_inquiry': 'Product Inquiry',
    'misc.subject_options.bulk_order': 'Bulk Order',
    'misc.subject_options.partnership': 'Partnership Opportunity',
    'misc.subject_options.quality_question': 'Quality Question',
    'misc.subject_options.shipping': 'Shipping & Logistics',
    'misc.subject_options.other': 'Other',
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
    'blog.load_more': 'تحميل المزيد من المقالات',
    'blog.share': 'مشاركة المقال',
    
    // Footer
    'footer.description': 'نصدر أفضل ما في الطبيعة السورية إلى العالم، ونجلب الأصالة والجودة إلى مائدتك.',
    'footer.quick_links': 'روابط سريعة',
    'footer.contact_info': 'معلومات الاتصال',
    'footer.follow_us': 'تابعنا',
    'footer.rights': 'جميع الحقوق محفوظة.',
    
    // About page
    'about.hero.subtitle': 'لأكثر من 25 عامًا، كنا الجسر بين التراث الزراعي السوري والأسواق العالمية، نجلب منتجات أصلية عالية الجودة إلى موائد العالم.',
    'about.vision.title': 'رؤيتنا وقيمنا',
    'about.vision.content': 'نحافظ على أعلى المعايير في كل منتج نصدره، مما يضمن الأصالة والجودة المتميزة.',
    'about.journey.title': 'رحلتنا',
    'about.journey.subtitle': 'اكتشف المعالم التي شكلت التزامنا بالجودة والتميز',
    'about.values.quality.title': 'التميز في الجودة',
    'about.values.quality.description': 'نحافظ على أعلى المعايير في كل منتج نصدره، مما يضمن الأصالة والجودة المتميزة.',
    'about.values.customer.title': 'التركيز على العملاء',
    'about.values.customer.description': 'عملاؤنا في قلب كل ما نفعله. نبني شراكات دائمة قائمة على الثقة والموثوقية.',
    'about.values.global.title': 'الوصول العالمي',
    'about.values.global.description': 'نربط التراث الزراعي السوري بالأسواق العالمية، ونقدم النكهات الأصلية في جميع أنحاء العالم.',
    'about.values.sustainability.title': 'الاستدامة',
    'about.values.sustainability.description': 'نحن ملتزمون بممارسات الزراعة المستدامة التي تدعم المجتمعات المحلية والبيئة.',
    
    // Contact page
    'contact.hero.subtitle': 'هل أنت مستعد لبدء رحلتك مع المنتجات الزراعية السورية المتميزة؟ تواصل مع فريقنا اليوم.',
    'contact.get_in_touch': 'تواصل معنا',
    'contact.send_message': 'أرسل لنا رسالة',
    'contact.form.full_name': 'الاسم الكامل',
    'contact.form.email': 'عنوان البريد الإلكتروني',
    'contact.form.phone': 'رقم الهاتف',
    'contact.form.subject': 'الموضوع',
    'contact.form.message': 'الرسالة',
    'contact.form.send': 'إرسال الرسالة',
    'contact.form.sending': 'جارٍ الإرسال...',
    'contact.form.placeholder.name': 'اسمك الكامل',
    'contact.form.placeholder.email': 'your.email@example.com',
    'contact.form.placeholder.phone': '+1 (555) 123-4567',
    'contact.form.placeholder.message': 'أخبرنا عن متطلباتك أو أسئلتك أو كيف يمكننا مساعدتك...',
    'contact.form.success': 'شكرًا لك على رسالتك! سنعود إليك قريبًا.',
    'contact.form.error': 'فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى.',
    'contact.location': 'موقعنا',
    'contact.whatsapp': 'محادثة واتساب',
    'contact.call_now': 'اتصل الآن',
    'contact.business_hours.title': 'ساعات العمل',
    'contact.business_hours.weekdays': 'السبت إلى الخميس: 9:00 صباحًا – 5:00 مساءً',
    'contact.business_hours.friday': 'الجمعة: مغلق',
    'contact.faq.title': 'الأسئلة الشائعة',
    'contact.faq.subtitle': 'إجابات سريعة على الأسئلة الشائعة حول منتجاتنا وخدماتنا',
    
    // Services
    'services.title': 'خدماتنا',
    'services.subtitle': 'من التعبئة إلى التسليم، نقدم حلولاً شاملة لاحتياجات منتجاتك الزراعية',
    'services.packaging.title': 'التعبئة والتغليف',
    'services.packaging.description': 'حلول تعبئة احترافية مع خيارات وضع العلامات المخصصة',
    'services.shipping.title': 'الشحن والتصدير',
    'services.shipping.description': 'الشحن في جميع أنحاء العالم مع شركاء لوجستيين موثوقين',
    'services.wholesale.title': 'التوريد بالجملة',
    'services.wholesale.description': 'وثائق كاملة ودعم إجراءات الجمارك',
    'services.consulting.title': 'الاستشارات الزراعية',
    'services.consulting.description': 'خدمات استشارية متخصصة للتجار والموزعين',
    
    // General buttons and actions
    'buttons.explore_products': 'استكشف منتجاتنا',
    'buttons.browse_all_articles': 'تصفح جميع المقالات',
    'buttons.explore_all_products': 'استكشف جميع المنتجات',
    'buttons.contact_supplier': 'اتصل بالمورد',
    'buttons.request_quote': 'طلب عرض سعر',
    'buttons.load_more': 'تحميل المزيد',
    
    // Footer sections
    'footer.company_description': 'نصدر أفضل ما في الطبيعة السورية إلى العالم، ونجلب الأصالة والجودة إلى مائدتك.',
    'footer.made_by': 'تم التطوير بواسطة',
    'footer.all_rights': 'جميع الحقوق محفوظة.',
    
    // Form validation
    'validation.required': 'هذا الحقل مطلوب',
    'validation.email': 'يرجى إدخال عنوان بريد إلكتروني صحيح',
    'validation.phone': 'يرجى إدخال رقم هاتف صحيح',
    
    // Misc
    'misc.established': 'تأسست عام',
    'misc.trusted_by': 'موثوق من قبل',
    'misc.clients': 'عميل',
    'misc.years_experience': 'سنوات من الخبرة',
    'misc.exporting_countries': 'دولة مصدرة إليها',
    'misc.satisfied_clients': 'عميل راضٍ',
    'misc.industrial_zone': 'المنطقة الصناعية',
    'misc.select_subject': 'اختر موضوعًا',
    'misc.subject_options.product_inquiry': 'استفسار عن المنتج',
    'misc.subject_options.bulk_order': 'طلب بالجملة',
    'misc.subject_options.partnership': 'فرصة شراكة',
    'misc.subject_options.quality_question': 'سؤال عن الجودة',
    'misc.subject_options.shipping': 'الشحن واللوجستيات',
    'misc.subject_options.other': 'أخرى',
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