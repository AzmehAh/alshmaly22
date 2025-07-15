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
    
    // Marquee section
    'marquee.natural': '100% Natural',
    'marquee.quality_standards': 'Global Quality Standards',
    'marquee.years_expertise': '25+ Years of Expertise',
    'marquee.customer_satisfaction': 'Customer Satisfaction First',
    'marquee.trader_support': 'Ongoing Trader Support',
    
    // Statistics
    'statistics.satisfied_clients': 'Satisfied Clients',
    'statistics.exporting_countries': 'Exporting Countries',
    'statistics.years_experience': 'Years of Experience',
    
    // Timeline
    'timeline.foundation.title': 'Company Foundation',
    'timeline.foundation.description': 'Al-Shamali was established in Idlib, Syria, with a vision to export premium Syrian agricultural products.',
    'timeline.first_export.title': 'First International Export',
    'timeline.first_export.description': 'Successfully exported our first shipment of freekeh and legumes to European markets.',
    'timeline.certifications.title': 'Quality Certifications',
    'timeline.certifications.description': 'Obtained ISO 9001 and ISO 22000 certifications and implemented modern Sortex cleaning technology.',
    'timeline.export_launch.title': 'Export Expansion',
    'timeline.export_launch.description': 'Started exporting through Souqna First Gate in Qatar, gradually expanding to other countries with a product range exceeding 30 items.',
    'timeline.sustainable_future.title': 'Sustainable Future',
    'timeline.sustainable_future.description': 'Committed to sustainable farming practices and supporting local Syrian farmers.',
    
    // FAQ
    'faq.minimum_order.question': 'What is your minimum order quantity?',
    'faq.minimum_order.answer': 'Our minimum order quantity varies by product. For most items, it\'s 1 ton, but we can accommodate smaller orders for sample testing.',
    'faq.certificates.question': 'Do you provide certificates of origin and quality?',
    'faq.certificates.answer': 'Yes, we provide all necessary documentation including certificates of origin, quality certificates, and phytosanitary certificates for international shipping.',
    'faq.payment_terms.question': 'What are your payment terms?',
    'faq.payment_terms.answer': 'We accept various payment methods including T/T, L/C, and other internationally recognized payment terms. Specific terms can be discussed based on order size and relationship.',
    'faq.shipping_time.question': 'How long does shipping take?',
    'faq.shipping_time.answer': 'Shipping times vary by destination. Typically, it takes 2-4 weeks for sea freight and 3-7 days for air freight to most international destinations.',
    'faq.private_labeling.question': 'Do you offer private labeling services?',
    'faq.private_labeling.answer': 'Yes, we offer private labeling services with your brand. We can customize packaging design and labeling according to your specifications.',
    
    // About page
    'about.established': 'Established',
    
    // Contact location
    'contact.location.industrial_zone': 'Industrial Zone',
    'contact.location.full_address': 'Idlib, Sarmada, Syria',
    
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
    
    // Products
    'products.packaging_options': 'Packaging Options',
    'products.additional_info': 'Additional Information',
    'products.specifications': 'Specifications',
    'products.related_products': 'Related Products',
    'products.discover': 'Discover our premium Syrian agricultural products, carefully selected and processed to bring you the authentic taste of Syria.',
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
   'home.about.description': 'لأكثر من 25 عامًا، كانت "الشمالي" الاسم الموثوق في تصدير المنتجات الزراعية السورية عالية الجودة. لقد جعلنا التزامنا بالجودة والأصالة الشريك المفضل للتجار حول العالم، حيث نُقدِّم أفضل أنواع البقوليات، والتوابل، والزيوت، والأعشاب من الأرض السورية إلى موائد العالم.'

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
     'footer.contact_adress':'إدلب، سرمدا، سوريا',
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
    
    // Marquee section
    'marquee.natural': '100% طبيعي',
    'marquee.quality_standards': 'معايير الجودة العالمية',
    'marquee.years_expertise': '25+ سنة من الخبرة',
    'marquee.customer_satisfaction': 'رضا العملاء أولاً',
    'marquee.trader_support': 'دعم مستمر للتجار',
    
    // Statistics
    'statistics.satisfied_clients': 'عميل راضٍ',
    'statistics.exporting_countries': 'دولة مصدرة إليها',
    'statistics.years_experience': 'سنوات من الخبرة',
    
    // Timeline
    'timeline.foundation.title': 'تأسيس الشركة',
    'timeline.foundation.description': 'تأسست الشمالي في إدلب، سوريا، برؤية لتصدير المنتجات الزراعية السورية المتميزة.',
    'timeline.first_export.title': 'أول تصدير دولي',
    'timeline.first_export.description': 'نجحنا في تصدير أول شحنة من الفريكة والبقوليات إلى الأسواق الأوروبية.',
    'timeline.certifications.title': 'شهادات الجودة',
    'timeline.certifications.description': 'حصلنا على شهادات الآيزو 9001 و22000 وطبقنا تقنية التنظيف الحديثة Sortex.',
    'timeline.export_launch.title': 'توسيع التصدير',
    'timeline.export_launch.description': 'بدأنا التصدير عبر سوقنا البوابة الأولى في قطر، وتوسعنا تدريجياً إلى دول أخرى بمجموعة منتجات تتجاوز 30 صنفاً.',
    'timeline.sustainable_future.title': 'مستقبل مستدام',
    'timeline.sustainable_future.description': 'التزمنا بممارسات الزراعة المستدامة ودعم المزارعين السوريين المحليين.',
    
    // FAQ
    'faq.minimum_order.question': 'ما هي الكمية الدنيا للطلب؟',
    'faq.minimum_order.answer': 'تختلف الكمية الدنيا للطلب حسب المنتج. بالنسبة لمعظم الأصناف، هي طن واحد، لكن يمكننا استيعاب طلبات أصغر لأغراض اختبار العينات.',
    'faq.certificates.question': 'هل تقدمون شهادات المنشأ والجودة؟',
    'faq.certificates.answer': 'نعم، نقدم جميع الوثائق اللازمة بما في ذلك شهادات المنشأ وشهادات الجودة والشهادات النباتية للشحن الدولي.',
    'faq.payment_terms.question': 'ما هي شروط الدفع لديكم؟',
    'faq.payment_terms.answer': 'نقبل طرق دفع متنوعة بما في ذلك T/T و L/C وشروط دفع دولية أخرى معترف بها. يمكن مناقشة الشروط المحددة بناءً على حجم الطلب والعلاقة.',
    'faq.shipping_time.question': 'كم من الوقت يستغرق الشحن؟',
    'faq.shipping_time.answer': 'تختلف أوقات الشحن حسب الوجهة. عادة، يستغرق 2-4 أسابيع للشحن البحري و3-7 أيام للشحن الجوي إلى معظم الوجهات الدولية.',
    'faq.private_labeling.question': 'هل تقدمون خدمات العلامة التجارية الخاصة؟',
    'faq.private_labeling.answer': 'نعم، نقدم خدمات العلامة التجارية الخاصة بعلامتكم التجارية. يمكننا تخصيص تصميم التعبئة ووضع العلامات وفقاً لمواصفاتكم.',
    
    // About page
    'about.established': 'تأسست عام',
    
    // Contact location
    'contact.location.industrial_zone': 'المنطقة الصناعية',
    'contact.location.full_address': 'إدلب، سرمدا، سوريا',
    
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
    
    // Products
    'products.packaging_options': 'خيارات التعبئة',
    'products.additional_info': 'معلومات إضافية',
    'products.specifications': 'المواصفات',
    'products.related_products': 'منتجات ذات صلة',
    'products.discover': 'اكتشف منتجاتنا الزراعية السورية المتميزة، مختارة ومعالجة بعناية لنقدم لك الطعم الأصيل لسوريا.',
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