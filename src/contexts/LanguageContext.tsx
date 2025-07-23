import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  direction: 'ltr' | 'rtl';
  t: (key: string, params?: Record<string, any>) => string;
  getLocalizedField: (obj: any, field: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation strings
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
    'common.read_more': 'Read More',
    'common.view_details': 'View Details',
    'common.contact_us': 'Contact Us',
    'common.loading': 'Loading...',
    'common.product': 'Product',
    
    // Home page
    'home.hero.title': 'Premium Syrian Agricultural Products',
    'home.hero.subtitle': 'Al-Shamali exports the finest quality legumes, spices, natural oils, and herbs from Syria to markets worldwide. Quality speaks for itself.',
    'home.hero.explore_products': 'Explore Our Products',
    'home.about.title': 'About Al-Shamali',
    'home.about.description': 'Since 1998, Al-Shamali has been a leading exporter of premium Syrian agricultural products. We pride ourselves on quality, tradition, and sustainable farming practices that have been passed down through generations.',
    'home.about.1': 'Established',
    'home.about.2': '1998',
    'home.products.title': 'Featured Products',
    
    // Statistics
    'statistics.satisfied_clients': 'Satisfied Clients',
    'statistics.exporting_countries': 'Exporting Countries',
    'statistics.years_experience': 'Years of Experience',
    
    // Marquee
    'marquee.natural': 'Natural & Organic',
    'marquee.quality_standards': 'International Quality Standards',
    'marquee.years_expertise': '25+ Years of Expertise',
    'marquee.customer_satisfaction': '98% Customer Satisfaction',
    'marquee.trader_support': '24/7 Trader Support',
    
    // Services
    'services.title': 'Our Services',
    'services.subtitle': 'Comprehensive solutions for international trade partners and distributors',
    'services.packaging.title': 'Custom Packaging',
    'services.packaging.description': 'Flexible packaging options from 500g to 25kg bags, customized to your market needs.',
    'services.shipping.title': 'Global Shipping',
    'services.shipping.description': 'Reliable worldwide delivery with proper documentation and temperature control.',
    'services.wholesale.title': 'Wholesale Solutions',
    'services.wholesale.description': 'Competitive pricing for bulk orders with flexible payment terms.',
    'services.consulting.title': 'Trade Consulting',
    'services.consulting.description': 'Expert guidance on import regulations, certifications, and market entry.',
    
    // Products
    'products.title': 'Our Products',
    'products.discover': 'Discover our premium selection of Syrian agricultural products',
    'products.filt': 'All Categories',
    'products.filters.title': 'Filters',
    'products.filters.search.label': 'Search Products',
    'products.filters.search.placeholder': 'Search by name or description...',
    'products.filters.categories.label': 'Categories',
    'products.show': 'Showing',
    'products.show2': 'products of',
    'products.no_products': 'No products found matching your criteria.',
    'products.packaging_options': 'Packaging Options',
    'products.specifications': 'Product Specifications',
    'products.related_products': 'Related Products',
    
    // Pagination
    'pagination.previous': 'Previous',
    'pagination.next': 'Next',
    
    // Buttons
    'buttons.contact_supplier': 'Contact Supplier',
    'buttons.browse_all_articles': 'Browse All Articles',
    'buttons.explore_all_products': 'Explore All Products',
    
    // Blog
    'blog.title': 'Latest News & Articles',
    'blog.subtitle': 'Stay updated with the latest insights from the agricultural export industry',
    'blog.no_posts': 'No blog posts found.',
    'blog.share': 'Share Article',
    
    // About
    'about.title': 'About Al-Shamali',
    'about.hero.subtitle': 'Discover our story of dedication to quality Syrian agricultural products and global partnerships.',
    'about.vision.title': 'Our Vision',
    'about.vision.content': 'To be the leading bridge connecting the rich agricultural heritage of Syria with global markets, ensuring quality, sustainability, and mutual prosperity.',
    'about.vision.description.1': 'We believe in preserving traditional Syrian farming methods while embracing modern quality standards and sustainable practices.',
    'about.vision.description.2': 'Our commitment extends beyond business - we support local farmers and communities while building lasting partnerships worldwide.',
    'about.established': 'Established',
    'about.values.quality.title': 'Premium Quality',
    'about.values.quality.description': 'Every product meets international standards through rigorous quality control processes.',
    'about.values.customer.title': 'Customer Focus',
    'about.values.customer.description': 'Building long-term partnerships through reliable service and consistent quality.',
    'about.values.global.title': 'Global Reach',
    'about.values.global.description': 'Serving markets across continents with efficient logistics and documentation.',
    'about.values.sustainability.title': 'Sustainability',
    'about.values.sustainability.description': 'Supporting eco-friendly practices and sustainable agriculture development.',
    'about.journey.title': 'Our Journey',
    'about.journey.subtitle': 'From humble beginnings to international recognition',
    'about.global_reach.title': 'Global Export Network',
    'about.global_reach.subtitle': 'Proudly serving markets across multiple continents',
    
    // Timeline
    'timeline.foundation.title': 'Company Foundation',
    'timeline.foundation.description': 'Al-Shamali was established as a local agricultural trading company in Aleppo.',
    'timeline.first_export.title': 'First International Export',
    'timeline.first_export.description': 'Successfully exported our first shipment to neighboring countries.',
    'timeline.certifications.title': 'Quality Certifications',
    'timeline.certifications.description': 'Obtained international quality certifications and expanded our product range.',
    'timeline.export_launch.title': 'Global Export Initiative',
    'timeline.export_launch.description': 'Launched comprehensive export program reaching 30+ countries worldwide.',
    'timeline.sustainable_future.title': 'Sustainable Future',
    'timeline.sustainable_future.description': 'Implementing sustainable practices and digital transformation initiatives.',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.hero.subtitle': 'Get in touch with our export specialists for wholesale inquiries and partnerships',
    'contact.get_in_touch': 'Get in Touch',
    'contact.address': 'Address',
    'contact.phone': 'Phone',
    'contact.phone.1': '+963 956 556 410',
    'contact.phone.2': '+963 956 556 411',
    'contact.email': 'Email',
    'contact.business_hours.title': 'Business Hours',
    'contact.business_hours.weekdays': 'Sunday - Thursday: 8:00 AM - 6:00 PM',
    'contact.business_hours.friday': 'Friday: 8:00 AM - 12:00 PM',
    'contact.whatsapp': 'WhatsApp',
    'contact.call_now': 'Call Now',
    'contact.send_message': 'Send Message',
    'contact.location': 'Our Location',
    'contact.location.industrial_zone': 'Industrial Zone, Aleppo',
    'contact.location.full_address': 'Syria, Aleppo, Sheikh Najjar Industrial City',
    
    // Contact Form
    'contact.form.full_name': 'Full Name',
    'contact.form.email': 'Email Address',
    'contact.form.phone': 'Phone Number',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Message',
    'contact.form.send': 'Send Message',
    'contact.form.sending': 'Sending...',
    'contact.form.success': 'Thank you! Your message has been sent successfully. We will get back to you soon.',
    'contact.form.error': 'Sorry, there was an error sending your message. Please try again.',
    'contact.form.placeholder.name': 'Your full name',
    'contact.form.placeholder.email': 'your@email.com',
    'contact.form.placeholder.phone': '+1 (555) 123-4567',
    'contact.form.placeholder.message': 'Tell us about your requirements...',
    
    // FAQ
    'contact.faq.title': 'Frequently Asked Questions',
    'contact.faq.subtitle': 'Common questions about our products and export services',
    'faq.minimum_order.question': 'What is the minimum order quantity?',
    'faq.minimum_order.answer': 'Our minimum order quantity varies by product, typically starting from 1 ton for most items. Contact us for specific product requirements.',
    'faq.certificates.question': 'Do you provide quality certificates?',
    'faq.certificates.answer': 'Yes, we provide all necessary certificates including phytosanitary certificates, certificates of origin, and quality analysis reports.',
    'faq.payment_terms.question': 'What are your payment terms?',
    'faq.payment_terms.answer': 'We offer flexible payment terms including L/C at sight, T/T advance, and other mutually agreed terms based on order size and relationship.',
    'faq.shipping_time.question': 'How long does shipping take?',
    'faq.shipping_time.answer': 'Shipping time depends on destination and method. Typically 2-4 weeks by sea freight and 3-7 days by air freight.',
    'faq.private_labeling.question': 'Do you offer private labeling?',
    'faq.private_labeling.answer': 'Yes, we provide private labeling services with custom packaging and branding for orders above minimum quantities.',
    
    // Misc
    'misc.select_subject': 'Select a subject',
    'misc.subject_options.product_inquiry': 'Product Inquiry',
    'misc.subject_options.bulk_order': 'Bulk Order Request',
    'misc.subject_options.partnership': 'Partnership Opportunity',
    'misc.subject_options.quality_question': 'Quality Question',
    'misc.subject_options.shipping': 'Shipping & Logistics',
    'misc.subject_options.other': 'Other',
    
    // Back navigation
    'back': 'Back to Products',
    'back.blog': 'Back to Blog',
    
    // Footer
    'footer.company_description': 'Al-Shamali exports premium Syrian agricultural products including legumes, spices, natural oils, and herbs to markets worldwide.',
    'footer.quick_links': 'Quick Links',
    'footer.contact_info': 'Contact Information',
    'footer.contact_adress': 'Sheikh Najjar Industrial City, Aleppo, Syria',
    'footer.follow_us': 'Follow Us',
    'footer.rights': '© 2024 Al-Shamali.',
    'footer.all_rights': 'All rights reserved.',
    'footer.made_by': 'Website designed and developed by',
    
    // Admin
    'admin.logo': 'Al-Shamali',
    'admin.dashboard': 'Admin Panel',
    'admin.dashboard.overview': 'Dashboard Overview',
    'admin.homepage.management': 'Homepage Management',
    'admin.products.management': 'Products Management',
    'admin.categories.management': 'Categories Management',
    'admin.export_countries.management': 'Export Countries',
    'admin.blog.management': 'Blog Posts',
    'admin.blog_categories.management': 'Blog Categories',
    'admin.contacts.management': 'Contact Messages',
    'admin.welcome': 'Welcome',
    'admin.logout': 'Logout',
    'admin.language.current': 'Language',
    'admin.language.switch': 'Switch Language',
    'admin.language.english': 'English',
    'admin.language.arabic': 'العربية',
    'admin.last_updated': 'Last Updated',
    'admin.no_data': 'No data available',
    'admin.add': 'Add',
    'admin.edit': 'Edit',
    'admin.delete': 'Delete',
    'admin.view': 'View',
    'admin.manage': 'Manage',
    'admin.cancel': 'Cancel',
    'admin.save': 'Save',
    'admin.saving': 'Saving...',
    'admin.update': 'Update',
    'admin.create': 'Create',
    'admin.search': 'Search...',
    'admin.all': 'All',
    'admin.category': 'Category',
    'admin.availability': 'Availability',
    'admin.actions': 'Actions',
    'admin.uncategorized': 'Uncategorized',
    'admin.basic_info': 'Basic Information',
    'admin.name': 'Name',
    'admin.english': 'English',
    'admin.arabic': 'Arabic',
    'admin.description': 'Description',
    'admin.select': 'Select',
    'admin.specifications': 'Specifications',
    'admin.image': 'Images',
    'admin.alt_text': 'Alt Text',
    'admin.order': 'Order',
    'admin.remove': 'Remove',
    'admin.packages': 'Packages',
    'admin.weight': 'Weight',
    'admin.default': 'Default',
    'admin.related': 'Related Products',
    'admin.related2': 'Related Posts',
    'admin.confirm_delete': 'Are you sure you want to delete this item?',
    'admin.delete_warning': 'This action cannot be undone.',
    'admin.product': 'Product',
    
    // Other
    'erorr': 'Error:',
    'Note': 'Note:',
    'note.all': 'Our office is located in the Sheikh Najjar Industrial City. Please contact us before visiting to ensure availability.',
    'Photo.Gallery': 'Photo Gallery',
    'Related.Articles': 'Related Articles',
    'No.related': 'No related articles found.',
    
    // Categories
    'categories.title': 'Product Categories',
    'categories.add_category': 'Add New Category',
    'categories.search_placeholder': 'Search categories...',
    'categories.table.name': 'Category Name',
    'categories.table.slug': 'Slug',
    'categories.table.created': 'Created Date',
    'categories.table.actions': 'Actions',
    'categories.form.add_title': 'Add New Category',
    'categories.form.edit_title': 'Edit Category',
    'categories.form.name_en': 'Name (English)',
    'categories.form.name_ar': 'Name (Arabic)',
    'categories.form.slug': 'Slug',
    'categories.form.cancel': 'Cancel',
    'categories.form.saving': 'Saving...',
    'categories.form.update': 'Update Category',
    'categories.form.create': 'Create Category',
    'categories.delete_modal.title': 'Delete Category',
    'categories.delete_modal.message': 'Are you sure you want to delete this category? This action cannot be undone.',
    'categories.delete_modal.cancel': 'Cancel',
    'categories.delete_modal.delete': 'Delete',
    
    // Blog Categories
    'blogCategories.title': 'Blog Categories',
    'blogCategories.add': 'Add New Category',
    'blogCategories.search.placeholder': 'Search blog categories...',
    'blogCategories.table.name': 'Category Name',
    'blogCategories.table.slug': 'Slug',
    'blogCategories.table.created': 'Created Date',
    'blogCategories.table.actions': 'Actions',
    'blogCategories.form.name_en': 'Name (English)',
    'blogCategories.form.name_ar': 'Name (Arabic)',
    'blogCategories.form.slug': 'Slug',
    'blogCategories.form.name_en.placeholder': 'Category name in English',
    'blogCategories.form.name_ar.placeholder': 'اسم الفئة بالعربية',
    'blogCategories.form.slug.placeholder': 'category-slug',
    'blogCategories.form.cancel': 'Cancel',
    'blogCategories.form.saving': 'Saving...',
    'blogCategories.form.update': 'Update Category',
    'blogCategories.form.create': 'Create Category',
    'blogCategories.addNew.title': 'Add New Blog Category',
    'blogCategories.edit.title': 'Edit Blog Category',
    'blogCategories.delete.title': 'Delete Blog Category',
    'blogCategories.delete.confirmation': 'Are you sure you want to delete this blog category? This action cannot be undone.',
    'blogCategories.delete.cancel': 'Cancel',
    'blogCategories.delete.delete': 'Delete',
    
    // Export Countries
    'export.title': 'Export Countries Management',
    'export.add': 'Add New Country',
    'export.search.placeholder': 'Search countries...',
    'export.table.order': 'Order',
    'export.table.country': 'Country',
    'export.table.exports': 'Annual Exports',
    'export.table.products': 'Main Products',
    'export.table.status': 'Status',
    'export.table.actions': 'Actions',
    'export.status.active': 'Active',
    'export.status.inactive': 'Inactive',
    'export.edit': 'Edit Country',
    'export.delete': 'Delete',
    'export.add_new': 'Add New Export Country',
    'export.name_en': 'Country Name (English)',
    'export.name_ar': 'Country Name (Arabic)',
    'export.exports_en': 'Annual Exports (English)',
    'export.exports_ar': 'Annual Exports (Arabic)',
    'export.products_en': 'Main Products (English)',
    'export.products_ar': 'Main Products (Arabic)',
    'export.display_on_site': 'Display on website',
    'export.cancel': 'Cancel',
    'export.saving': 'Saving...',
    'export.update': 'Update Country',
    'export.create': 'Create Country',
    'export.delete.title': 'Delete Export Country',
    'export.delete.confirmation': 'Are you sure you want to delete this export country? This action cannot be undone.',
    
    // Blog
    'blog.title': 'Blog Management',
    'blog.add_post': 'Add New Post',
    'blog.all_categories': 'All Categories',
    'blog.search.placeholder': 'Search blog posts...',
    'blog.table.post': 'Blog Post',
    'blog.table.category': 'Category',
    'blog.table.author': 'Author',
    'blog.table.status': 'Status',
    'blog.table.date': 'Date',
    'blog.table.actions': 'Actions',
    'blog.status.published': 'Published',
    'blog.status.draft': 'Draft',
    'blog.uncategorized': 'Uncategorized',
    'blog.modal.view_post': 'View Post',
    'blog.modal.edit_post_btn': 'Edit',
    'blog.modal.manage_related_posts': 'Manage Related Posts',
    'blog.modal.delete': 'Delete',
    'blog.modal.add_new_post': 'Add New Blog Post',
    'blog.modal.edit_post': 'Edit Blog Post',
    'blog.fields.title_en': 'Title (English)',
    'blog.fields.title_ar': 'Title (Arabic)',
    'blog.fields.slug': 'Slug',
    'blog.fields.excerpt_en': 'Excerpt (English)',
    'blog.fields.excerpt_ar': 'Excerpt (Arabic)',
    'blog.fields.content_en': 'Content (English)',
    'blog.fields.content_ar': 'Content (Arabic)',
    'blog.fields.category': 'Category',
    'blog.fields.author_en': 'Author (English)',
    'blog.fields.author_ar': 'Author (Arabic)',
    'blog.fields.read_time_en': 'Read Time (English)',
    'blog.fields.read_time_ar': 'Read Time (Arabic)',
    'blog.fields.event_date_en': 'Event Date (English)',
    'blog.fields.event_date_ar': 'Event Date (Arabic)',
    'blog.fields.status': 'Status',
    'blog.fields.featured_image_url': 'Featured Image URL',
    'blog.modal.cancel': 'Cancel',
    'blog.modal.saving': 'Saving...',
    'blog.modal.delete_title': 'Delete Blog Post',
    'blog.modal.delete_confirmation': 'Are you sure you want to delete this blog post? This action cannot be undone.',
    'blog.error.save_post': 'Error saving blog post. Please try again.',
    'blog.error.delete_post': 'Error deleting blog post. Please try again.',
    'blog.images.remove': 'Remove Image',
    
    // Contacts
    'contacts.title': 'Contact Messages',
    'contacts.totalMessages': 'Total Messages: {{count}}',
    'contacts.search.placeholder': 'Search messages...',
    'contacts.filter.allStatus': 'All Status',
    'contacts.filter.unread': 'Unread',
    'contacts.filter.read': 'Read',
    'contacts.filter.responded': 'Responded',
    'contacts.table.contact': 'Contact',
    'contacts.table.subject': 'Subject',
    'contacts.table.status': 'Status',
    'contacts.table.date': 'Date',
    'contacts.table.language': 'Language',
    'contacts.table.actions': 'Actions',
    'contacts.status.unread': 'Unread',
    'contacts.status.read': 'Read',
    'contacts.status.responded': 'Responded',
    'contacts.language.ar': 'Arabic',
    'contacts.language.en': 'English',
    'contacts.action.viewDetails': 'View Details',
    'contacts.action.deleteMessage': 'Delete Message',
    'contacts.details.title': 'Contact Message Details',
    'contacts.details.name': 'Name',
    'contacts.details.email': 'Email',
    'contacts.details.phone': 'Phone',
    'contacts.details.subject': 'Subject',
    'contacts.details.message': 'Message',
    'contacts.details.status': 'Status',
    'contacts.details.dateReceived': 'Date Received',
    'contacts.details.close': 'Close',
    'contacts.details.reply': 'Reply via Email',
    'contacts.delete.title': 'Delete Message',
    'contacts.delete.confirmation': 'Are you sure you want to delete this message? This action cannot be undone.',
    'contacts.delete.cancel': 'Cancel',
    'contacts.delete.delete': 'Delete',
    
    // Homepage Management
    'homepage.products': 'Featured Products',
    'homepage.blog.posts': 'Featured Blog Posts',
    'add.to.homepage': 'Add to Homepage',
    'order': 'Order',
    'product': 'Product',
    'blog.post': 'Blog Post',
    'status': 'Status',
    'actions': 'Actions',
    'active': 'Active',
    'inactive': 'Inactive',
    'view.item': 'View Item',
    'remove.from.homepage': 'Remove from Homepage',
    'add.item.to.homepage': 'Add {{type}} to Homepage',
    'search.products': 'Search products...',
    'search.blog': 'Search blog posts...',
    'uncategorized': 'Uncategorized',
    'add': 'Add',
    'no.available.products': 'No available products to add',
    'no.available.blog.posts': 'No available blog posts to add'
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.products': 'المنتجات',
    'nav.about': 'من نحن',
    'nav.blog': 'المدونة',
    'nav.contact': 'تواصل معنا',
    'nav.iso_certificate': 'شهادة الآيزو',
    
    // Common
    'common.read_more': 'اقرأ المزيد',
    'common.view_details': 'عرض التفاصيل',
    'common.contact_us': 'تواصل معنا',
    'common.loading': 'جاري التحميل...',
    'common.product': 'منتج',
    
    // Home page
    'home.hero.title': 'منتجات زراعية سورية متميزة',
    'home.hero.subtitle': 'تصدر الشمالي أجود أنواع البقوليات والتوابل والزيوت الطبيعية والأعشاب من سوريا إلى الأسواق العالمية. الجودة تتحدث عن نفسها.',
    'home.hero.explore_products': 'استكشف منتجاتنا',
    'home.about.title': 'حول الشمالي',
    'home.about.description': 'منذ عام 1998، تعتبر الشمالي شركة رائدة في تصدير المنتجات الزراعية السورية المتميزة. نفخر بالجودة والتقاليد وممارسات الزراعة المستدامة التي تم توارثها عبر الأجيال.',
    'home.about.1': 'تأسست',
    'home.about.2': '1998',
    'home.products.title': 'المنتجات المميزة',
    
    // Statistics
    'statistics.satisfied_clients': 'عميل راضٍ',
    'statistics.exporting_countries': 'دولة للتصدير',
    'statistics.years_experience': 'سنة من الخبرة',
    
    // Marquee
    'marquee.natural': 'طبيعي وعضوي',
    'marquee.quality_standards': 'معايير جودة دولية',
    'marquee.years_expertise': '25+ سنة من الخبرة',
    'marquee.customer_satisfaction': '98% رضا العملاء',
    'marquee.trader_support': 'دعم التجار 24/7',
    
    // Services
    'services.title': 'خدماتنا',
    'services.subtitle': 'حلول شاملة لشركاء التجارة الدولية والموزعين',
    'services.packaging.title': 'تعبئة مخصصة',
    'services.packaging.description': 'خيارات تعبئة مرنة من 500 جم إلى أكياس 25 كيلو، مخصصة لاحتياجات السوق.',
    'services.shipping.title': 'شحن عالمي',
    'services.shipping.description': 'توصيل موثوق في جميع أنحاء العالم مع الوثائق المناسبة والتحكم في درجة الحرارة.',
    'services.wholesale.title': 'حلول الجملة',
    'services.wholesale.description': 'أسعار تنافسية للطلبات المجمعة مع شروط دفع مرنة.',
    'services.consulting.title': 'استشارات التجارة',
    'services.consulting.description': 'إرشاد خبير حول قوانين الاستيراد والشهادات ودخول السوق.',
    
    // Products
    'products.title': 'منتجاتنا',
    'products.discover': 'اكتشف مجموعتنا المتميزة من المنتجات الزراعية السورية',
    'products.filt': 'جميع الفئات',
    'products.filters.title': 'المرشحات',
    'products.filters.search.label': 'البحث في المنتجات',
    'products.filters.search.placeholder': 'البحث بالاسم أو الوصف...',
    'products.filters.categories.label': 'الفئات',
    'products.show': 'عرض',
    'products.show2': 'منتج من',
    'products.no_products': 'لم يتم العثور على منتجات تطابق معاييرك.',
    'products.packaging_options': 'خيارات التعبئة',
    'products.specifications': 'مواصفات المنتج',
    'products.related_products': 'منتجات ذات صلة',
    
    // Pagination
    'pagination.previous': 'السابق',
    'pagination.next': 'التالي',
    
    // Buttons
    'buttons.contact_supplier': 'تواصل مع المورد',
    'buttons.browse_all_articles': 'تصفح جميع المقالات',
    'buttons.explore_all_products': 'استكشف جميع المنتجات',
    
    // Blog
    'blog.title': 'آخر الأخبار والمقالات',
    'blog.subtitle': 'ابق مطلعاً على آخر المستجدات من صناعة تصدير المنتجات الزراعية',
    'blog.no_posts': 'لم يتم العثور على مقالات.',
    'blog.share': 'مشاركة المقال',
    
    // About
    'about.title': 'حول الشمالي',
    'about.hero.subtitle': 'اكتشف قصتنا في التفاني لجودة المنتجات الزراعية السورية والشراكات العالمية.',
    'about.vision.title': 'رؤيتنا',
    'about.vision.content': 'أن نكون الجسر الرائد الذي يربط التراث الزراعي الغني لسوريا بالأسواق العالمية، مما يضمن الجودة والاستدامة والازدهار المتبادل.',
    'about.vision.description.1': 'نؤمن بالحفاظ على أساليب الزراعة السورية التقليدية مع تبني معايير الجودة الحديثة والممارسات المستدامة.',
    'about.vision.description.2': 'التزامنا يمتد إلى ما هو أبعد من الأعمال - ندعم المزارعين والمجتمعات المحلية بينما نبني شراكات دائمة في جميع أنحاء العالم.',
    'about.established': 'تأسست',
    'about.values.quality.title': 'جودة متميزة',
    'about.values.quality.description': 'كل منتج يلبي المعايير الدولية من خلال عمليات مراقبة الجودة الصارمة.',
    'about.values.customer.title': 'التركيز على العملاء',
    'about.values.customer.description': 'بناء شراكات طويلة الأمد من خلال الخدمة الموثوقة والجودة المستمرة.',
    'about.values.global.title': 'نطاق عالمي',
    'about.values.global.description': 'خدمة الأسواق عبر القارات مع اللوجستيات والتوثيق الفعال.',
    'about.values.sustainability.title': 'الاستدامة',
    'about.values.sustainability.description': 'دعم الممارسات الصديقة للبيئة وتطوير الزراعة المستدامة.',
    'about.journey.title': 'رحلتنا',
    'about.journey.subtitle': 'من البدايات المتواضعة إلى الاعتراف الدولي',
    'about.global_reach.title': 'شبكة التصدير العالمية',
    'about.global_reach.subtitle': 'نفخر بخدمة الأسواق عبر قارات متعددة',
    
    // Timeline
    'timeline.foundation.title': 'تأسيس الشركة',
    'timeline.foundation.description': 'تأسست الشمالي كشركة تجارة زراعية محلية في حلب.',
    'timeline.first_export.title': 'أول تصدير دولي',
    'timeline.first_export.description': 'تصدير أول شحنة بنجاح إلى الدول المجاورة.',
    'timeline.certifications.title': 'شهادات الجودة',
    'timeline.certifications.description': 'الحصول على شهادات الجودة الدولية وتوسيع مجموعة منتجاتنا.',
    'timeline.export_launch.title': 'مبادرة التصدير العالمي',
    'timeline.export_launch.description': 'إطلاق برنامج التصدير الشامل الذي يصل إلى أكثر من 30 دولة في جميع أنحاء العالم.',
    'timeline.sustainable_future.title': 'مستقبل مستدام',
    'timeline.sustainable_future.description': 'تنفيذ الممارسات المستدامة ومبادرات التحول الرقمي.',
    
    // Contact
    'contact.title': 'تواصل معنا',
    'contact.hero.subtitle': 'تواصل مع متخصصي التصدير لدينا للاستفسارات الجملة والشراكات',
    'contact.get_in_touch': 'تواصل معنا',
    'contact.address': 'العنوان',
    'contact.phone': 'الهاتف',
    'contact.phone.1': '410 556 956 963+',
    'contact.phone.2': '411 556 956 963+',
    'contact.email': 'البريد الإلكتروني',
    'contact.business_hours.title': 'ساعات العمل',
    'contact.business_hours.weekdays': 'الأحد - الخميس: 8:00 ص - 6:00 م',
    'contact.business_hours.friday': 'الجمعة: 8:00 ص - 12:00 م',
    'contact.whatsapp': 'واتساب',
    'contact.call_now': 'اتصل الآن',
    'contact.send_message': 'إرسال رسالة',
    'contact.location': 'موقعنا',
    'contact.location.industrial_zone': 'المنطقة الصناعية، حلب',
    'contact.location.full_address': 'سوريا، حلب، مدينة الشيخ نجار الصناعية',
    
    // Contact Form
    'contact.form.full_name': 'الاسم الكامل',
    'contact.form.email': 'عنوان البريد الإلكتروني',
    'contact.form.phone': 'رقم الهاتف',
    'contact.form.subject': 'الموضوع',
    'contact.form.message': 'الرسالة',
    'contact.form.send': 'إرسال الرسالة',
    'contact.form.sending': 'جاري الإرسال...',
    'contact.form.success': 'شكراً لك! تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.',
    'contact.form.error': 'عذراً، حدث خطأ في إرسال رسالتك. يرجى المحاولة مرة أخرى.',
    'contact.form.placeholder.name': 'اسمك الكامل',
    'contact.form.placeholder.email': 'your@email.com',
    'contact.form.placeholder.phone': '1234567890+',
    'contact.form.placeholder.message': 'أخبرنا عن متطلباتك...',
    
    // FAQ
    'contact.faq.title': 'الأسئلة الشائعة',
    'contact.faq.subtitle': 'أسئلة شائعة حول منتجاتنا وخدمات التصدير',
    'faq.minimum_order.question': 'ما هي الكمية الدنيا للطلب؟',
    'faq.minimum_order.answer': 'تختلف الكمية الدنيا للطلب حسب المنتج، وتبدأ عادة من طن واحد لمعظم العناصر. اتصل بنا لمتطلبات منتج محدد.',
    'faq.certificates.question': 'هل تقدمون شهادات الجودة؟',
    'faq.certificates.answer': 'نعم، نقدم جميع الشهادات اللازمة بما في ذلك الشهادات الصحية النباتية وشهادات المنشأ وتقارير تحليل الجودة.',
    'faq.payment_terms.question': 'ما هي شروط الدفع لديكم؟',
    'faq.payment_terms.answer': 'نقدم شروط دفع مرنة بما في ذلك اعتماد مستندي عند الإطلاع، تحويل مصرفي مقدم، وشروط أخرى متفق عليها بناءً على حجم الطلب والعلاقة.',
    'faq.shipping_time.question': 'كم من الوقت يستغرق الشحن؟',
    'faq.shipping_time.answer': 'يعتمد وقت الشحن على الوجهة والطريقة. عادة 2-4 أسابيع بالشحن البحري و 3-7 أيام بالشحن الجوي.',
    'faq.private_labeling.question': 'هل تقدمون خدمة العلامة التجارية الخاصة؟',
    'faq.private_labeling.answer': 'نعم، نقدم خدمات العلامة التجارية الخاصة مع التعبئة والعلامة التجارية المخصصة للطلبات فوق الكميات الدنيا.',
    
    // Misc
    'misc.select_subject': 'اختر موضوعاً',
    'misc.subject_options.product_inquiry': 'استفسار عن المنتج',
    'misc.subject_options.bulk_order': 'طلب كمية كبيرة',
    'misc.subject_options.partnership': 'فرصة شراكة',
    'misc.subject_options.quality_question': 'سؤال حول الجودة',
    'misc.subject_options.shipping': 'الشحن واللوجستيات',
    'misc.subject_options.other': 'أخرى',
    
    // Back navigation
    'back': 'العودة إلى المنتجات',
    'back.blog': 'العودة إلى المدونة',
    
    // Footer
    'footer.company_description': 'تصدر الشمالي المنتجات الزراعية السورية المتميزة بما في ذلك البقوليات والتوابل والزيوت الطبيعية والأعشاب إلى الأسواق في جميع أنحاء العالم.',
    'footer.quick_links': 'روابط سريعة',
    'footer.contact_info': 'معلومات الاتصال',
    'footer.contact_adress': 'مدينة الشيخ نجار الصناعية، حلب، سوريا',
    'footer.follow_us': 'تابعنا',
    'footer.rights': '© 2024 الشمالي.',
    'footer.all_rights': 'جميع الحقوق محفوظة.',
    'footer.made_by': 'تم تصميم وتطوير الموقع بواسطة',
    
    // Admin
    'admin.logo': 'الشمالي',
    'admin.dashboard': 'لوحة الإدارة',
    'admin.dashboard.overview': 'نظرة عامة على لوحة القيادة',
    'admin.homepage.management': 'إدارة الصفحة الرئيسية',
    'admin.products.management': 'إدارة المنتجات',
    'admin.categories.management': 'إدارة الفئات',
    'admin.export_countries.management': 'دول التصدير',
    'admin.blog.management': 'مقالات المدونة',
    'admin.blog_categories.management': 'فئات المدونة',
    'admin.contacts.management': 'رسائل التواصل',
    'admin.welcome': 'مرحباً',
    'admin.logout': 'تسجيل الخروج',
    'admin.language.current': 'اللغة',
    'admin.language.switch': 'تبديل اللغة',
    'admin.language.english': 'English',
    'admin.language.arabic': 'العربية',
    'admin.last_updated': 'آخر تحديث',
    'admin.no_data': 'لا توجد بيانات متاحة',
    'admin.add': 'إضافة',
    'admin.edit': 'تعديل',
    'admin.delete': 'حذف',
    'admin.view': 'عرض',
    'admin.manage': 'إدارة',
    'admin.cancel': 'إلغاء',
    'admin.save': 'حفظ',
    'admin.saving': 'جاري الحفظ...',
    'admin.update': 'تحديث',
    'admin.create': 'إنشاء',
    'admin.search': 'البحث...',
    'admin.all': 'الكل',
    'admin.category': 'الفئة',
    'admin.availability': 'التوفر',
    'admin.actions': 'الإجراءات',
    'admin.uncategorized': 'غير مصنف',
    'admin.basic_info': 'المعلومات الأساسية',
    'admin.name': 'الاسم',
    'admin.english': 'الإنجليزية',
    'admin.arabic': 'العربية',
    'admin.description': 'الوصف',
    'admin.select': 'اختر',
    'admin.specifications': 'المواصفات',
    'admin.image': 'الصور',
    'admin.alt_text': 'النص البديل',
    'admin.order': 'الترتيب',
    'admin.remove': 'إزالة',
    'admin.packages': 'العبوات',
    'admin.weight': 'الوزن',
    'admin.default': 'افتراضي',
    'admin.related': 'المنتجات ذات الصلة',
    'admin.related2': 'المقالات ذات الصلة',
    'admin.confirm_delete': 'هل أنت متأكد من حذف هذا العنصر؟',
    'admin.delete_warning': 'لا يمكن التراجع عن هذا الإجراء.',
    'admin.product': 'منتج',
    
    // Other
    'erorr': 'خطأ:',
    'Note': 'ملاحظة:',
    'note.all': 'يقع مكتبنا في مدينة الشيخ نجار الصناعية. يرجى الاتصال بنا قبل الزيارة لضمان التوفر.',
    'Photo.Gallery': 'معرض الصور',
    'Related.Articles': 'مقالات ذات صلة',
    'No.related': 'لم يتم العثور على مقالات ذات صلة.',
    
    // Categories
    'categories.title': 'فئات المنتجات',
    'categories.add_category': 'إضافة فئة جديدة',
    'categories.search_placeholder': 'البحث في الفئات...',
    'categories.table.name': 'اسم الفئة',
    'categories.table.slug': 'الرابط',
    'categories.table.created': 'تاريخ الإنشاء',
    'categories.table.actions': 'الإجراءات',
    'categories.form.add_title': 'إضافة فئة جديدة',
    'categories.form.edit_title': 'تعديل الفئة',
    'categories.form.name_en': 'الاسم (الإنجليزية)',
    'categories.form.name_ar': 'الاسم (العربية)',
    'categories.form.slug': 'الرابط',
    'categories.form.cancel': 'إلغاء',
    'categories.form.saving': 'جاري الحفظ...',
    'categories.form.update': 'تحديث الفئة',
    'categories.form.create': 'إنشاء فئة',
    'categories.delete_modal.title': 'حذف الفئة',
    'categories.delete_modal.message': 'هل أنت متأكد من حذف هذه الفئة؟ لا يمكن التراجع عن هذا الإجراء.',
    'categories.delete_modal.cancel': 'إلغاء',
    'categories.delete_modal.delete': 'حذف',
    
    // Blog Categories
    'blogCategories.title': 'فئات المدونة',
    'blogCategories.add': 'إضافة فئة جديدة',
    'blogCategories.search.placeholder': 'البحث في فئات المدونة...',
    'blogCategories.table.name': 'اسم الفئة',
    'blogCategories.table.slug': 'الرابط',
    'blogCategories.table.created': 'تاريخ الإنشاء',
    'blogCategories.table.actions': 'الإجراءات',
    'blogCategories.form.name_en': 'الاسم (الإنجليزية)',
    'blogCategories.form.name_ar': 'الاسم (العربية)',
    'blogCategories.form.slug': 'الرابط',
    'blogCategories.form.name_en.placeholder': 'اسم الفئة بالإنجليزية',
    'blogCategories.form.name_ar.placeholder': 'اسم الفئة بالعربية',
    'blogCategories.form.slug.placeholder': 'category-slug',
    'blogCategories.form.cancel': 'إلغاء',
    'blogCategories.form.saving': 'جاري الحفظ...',
    'blogCategories.form.update': 'تحديث الفئة',
    'blogCategories.form.create': 'إنشاء فئة',
    'blogCategories.addNew.title': 'إضافة فئة مدونة جديدة',
    'blogCategories.edit.title': 'تعديل فئة المدونة',
    'blogCategories.delete.title': 'حذف فئة المدونة',
    'blogCategories.delete.confirmation': 'هل أنت متأكد من حذف فئة المدونة هذه؟ لا يمكن التراجع عن هذا الإجراء.',
    'blogCategories.delete.cancel': 'إلغاء',
    'blogCategories.delete.delete': 'حذف',
    
    // Export Countries
    'export.title': 'إدارة دول التصدير',
    'export.add': 'إضافة دولة جديدة',
    'export.search.placeholder': 'البحث في الدول...',
    'export.table.order': 'الترتيب',
    'export.table.country': 'الدولة',
    'export.table.exports': 'الصادرات السنوية',
    'export.table.products': 'المنتجات الرئيسية',
    'export.table.status': 'الحالة',
    'export.table.actions': 'الإجراءات',
    'export.status.active': 'نشط',
    'export.status.inactive': 'غير نشط',
    'export.edit': 'تعديل الدولة',
    'export.delete': 'حذف',
    'export.add_new': 'إضافة دولة تصدير جديدة',
    'export.name_en': 'اسم الدولة (الإنجليزية)',
    'export.name_ar': 'اسم الدولة (العربية)',
    'export.exports_en': 'الصادرات السنوية (الإنجليزية)',
    'export.exports_ar': 'الصادرات السنوية (العربية)',
    'export.products_en': 'المنتجات الرئيسية (الإنجليزية)',
    'export.products_ar': 'المنتجات الرئيسية (العربية)',
    'export.display_on_site': 'عرض على الموقع',
    'export.cancel': 'إلغاء',
    'export.saving': 'جاري الحفظ...',
    'export.update': 'تحديث الدولة',
    'export.create': 'إنشاء دولة',
    'export.delete.title': 'حذف دولة التصدير',
    'export.delete.confirmation': 'هل أنت متأكد من حذف دولة التصدير هذه؟ لا يمكن التراجع عن هذا الإجراء.',
    
    // Blog
    'blog.title': 'إدارة المدونة',
    'blog.add_post': 'إضافة مقال جديد',
    'blog.all_categories': 'جميع الفئات',
    'blog.search.placeholder': 'البحث في مقالات المدونة...',
    'blog.table.post': 'مقال المدونة',
    'blog.table.category': 'الفئة',
    'blog.table.author': 'المؤلف',
    'blog.table.status': 'الحالة',
    'blog.table.date': 'التاريخ',
    'blog.table.actions': 'الإجراءات',
    'blog.status.published': 'منشور',
    'blog.status.draft': 'مسودة',
    'blog.uncategorized': 'غير مصنف',
    'blog.modal.view_post': 'عرض المقال',
    'blog.modal.edit_post_btn': 'تعديل',
    'blog.modal.manage_related_posts': 'إدارة المقالات ذات الصلة',
    'blog.modal.delete': 'حذف',
    'blog.modal.add_new_post': 'إضافة مقال جديد',
    'blog.modal.edit_post': 'تعديل مقال المدونة',
    'blog.fields.title_en': 'العنوان (الإنجليزية)',
    'blog.fields.title_ar': 'العنوان (العربية)',
    'blog.fields.slug': 'الرابط',
    'blog.fields.excerpt_en': 'المقتطف (الإنجليزية)',
    'blog.fields.excerpt_ar': 'المقتطف (العربية)',
    'blog.fields.content_en': 'المحتوى (الإنجليزية)',
    'blog.fields.content_ar': 'المحتوى (العربية)',
    'blog.fields.category': 'الفئة',
    'blog.fields.author_en': 'المؤلف (الإنجليزية)',
    'blog.fields.author_ar': 'المؤلف (العربية)',
    'blog.fields.read_time_en': 'وقت القراءة (الإنجليزية)',
    'blog.fields.read_time_ar': 'وقت القراءة (العربية)',
    'blog.fields.event_date_en': 'تاريخ الحدث (الإنجليزية)',
    'blog.fields.event_date_ar': 'تاريخ الحدث (العربية)',
    'blog.fields.status': 'الحالة',
    'blog.fields.featured_image_url': 'رابط الصورة المميزة',
    'blog.modal.cancel': 'إلغاء',
    'blog.modal.saving': 'جاري الحفظ...',
    'blog.modal.delete_title': 'حذف مقال المدونة',
    'blog.modal.delete_confirmation': 'هل أنت متأكد من حذف مقال المدونة هذا؟ لا يمكن التراجع عن هذا الإجراء.',
    'blog.error.save_post': 'خطأ في حفظ مقال المدونة. يرجى المحاولة مرة أخرى.',
    'blog.error.delete_post': 'خطأ في حذف مقال المدونة. يرجى المحاولة مرة أخرى.',
    'blog.images.remove': 'إزالة الصورة',
    
    // Contacts
    'contacts.title': 'رسائل التواصل',
    'contacts.totalMessages': 'إجمالي الرسائل: {{count}}',
    'contacts.search.placeholder': 'البحث في الرسائل...',
    'contacts.filter.allStatus': 'جميع الحالات',
    'contacts.filter.unread': 'غير مقروءة',
    'contacts.filter.read': 'مقروءة',
    'contacts.filter.responded': 'تم الرد',
    'contacts.table.contact': 'جهة الاتصال',
    'contacts.table.subject': 'الموضوع',
    'contacts.table.status': 'الحالة',
    'contacts.table.date': 'التاريخ',
    'contacts.table.language': 'اللغة',
    'contacts.table.actions': 'الإجراءات',
    'contacts.status.unread': 'غير مقروءة',
    'contacts.status.read': 'مقروءة',
    'contacts.status.responded': 'تم الرد',
    'contacts.language.ar': 'العربية',
    'contacts.language.en': 'الإنجليزية',
    'contacts.action.viewDetails': 'عرض التفاصيل',
    'contacts.action.deleteMessage': 'حذف الرسالة',
    'contacts.details.title': 'تفاصيل رسالة التواصل',
    'contacts.details.name': 'الاسم',
    'contacts.details.email': 'البريد الإلكتروني',
    'contacts.details.phone': 'الهاتف',
    'contacts.details.subject': 'الموضوع',
    'contacts.details.message': 'الرسالة',
    'contacts.details.status': 'الحالة',
    'contacts.details.dateReceived': 'تاريخ الاستلام',
    'contacts.details.close': 'إغلاق',
    'contacts.details.reply': 'رد عبر البريد الإلكتروني',
    'contacts.delete.title': 'حذف الرسالة',
    'contacts.delete.confirmation': 'هل أنت متأكد من حذف هذه الرسالة؟ لا يمكن التراجع عن هذا الإجراء.',
    'contacts.delete.cancel': 'إلغاء',
    'contacts.delete.delete': 'حذف',
    
    // Homepage Management
    'homepage.products': 'المنتجات المميزة',
    'homepage.blog.posts': 'مقالات المدونة المميزة',
    'add.to.homepage': 'إضافة إلى الصفحة الرئيسية',
    'order': 'الترتيب',
    'product': 'منتج',
    'blog.post': 'مقال المدونة',
    'status': 'الحالة',
    'actions': 'الإجراءات',
    'active': 'نشط',
    'inactive': 'غير نشط',
    'view.item': 'عرض العنصر',
    'remove.from.homepage': 'إزالة من الصفحة الرئيسية',
    'add.item.to.homepage': 'إضافة {{type}} إلى الصفحة الرئيسية',
    'search.products': 'البحث في المنتجات...',
    'search.blog': 'البحث في مقالات المدونة...',
    'uncategorized': 'غير مصنف',
    'add': 'إضافة',
    'no.available.products': 'لا توجد منتجات متاحة للإضافة',
    'no.available.blog.posts': 'لا توجد مقالات مدونة متاحة للإضافة'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Arabic instead of English
  const [language, setLanguage] = useState<'en' | 'ar'>('ar');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'en' | 'ar';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    
    // Set document direction and language
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const direction = language === 'ar' ? 'rtl' : 'ltr';

  const t = (key: string, params?: Record<string, any>) => {
    let translation = translations[language][key] || translations.en[key] || key;
    
    if (params) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{{${param}}}`, params[param]);
      });
    }
    
    return translation;
  };

  const getLocalizedField = (obj: any, field: string) => {
    if (!obj) return '';
    
    if (language === 'ar') {
      const arField = obj[`${field}_ar`];
      if (arField && arField.trim() !== '') {
        return arField;
      }
    }
    
    return obj[field] || '';
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      direction,
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