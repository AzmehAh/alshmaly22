import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { ContactAPI } from '../lib/api/contact';
import { useLanguage } from '../contexts/LanguageContext';

const ContactPage = () => {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '', 
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setSubmitMessage('');
      
      await ContactAPI.submitContactMessage({
        ...formData,
        language
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      }); 
      
      setSubmitMessage(t('contact.form.success'));
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitMessage(t('contact.form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqData = [
    {
      question: t('faq.minimum_order.question'),
      answer: t('faq.minimum_order.answer')
    },
    { 
      question: t('faq.certificates.question'),
      answer: t('faq.certificates.answer')
    },
    {
      question: t('faq.payment_terms.question'),
      answer: t('faq.payment_terms.answer')
    },
    {
      question: t('faq.shipping_time.question'),
      answer: t('faq.shipping_time.answer')
    },
    {
      question: t('faq.private_labeling.question'),
      answer: t('faq.private_labeling.answer')
    }
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f7]  pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-[#054239] text-white ">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">{t('contact.title')}</h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              {t('contact.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4  ">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="bg-[#f7f7f7] rounded-2xl p-8 shadow-lg h-fit sticky top-24">
                <h2 className="text-2xl font-bold text-[#054239] mb-8">{t('contact.get_in_touch')}</h2>
                 
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#b9a779] rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#054239] mb-1">{t('contact.address')}</h3>
                      <p className="text-gray-600">
                      {t('contact.location.industrial_zone')}<br />
                      {t('contact.location.full_address')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#b9a779] rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#054239] mb-1">{t('contact.phone')}</h3>
                      <p className="text-gray-600 ">{t('contact.phone.1')}</p>
                      <p className="text-gray-600">{t('contact.phone.2')}</p>
                    </div> 
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#b9a779] rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#054239] mb-1">{t('contact.email')}</h3>
                      <p className="text-gray-600">alshmaly.sy@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#b9a779] rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#054239] mb-1">{t('contact.business_hours.title')}</h3>
                      <p className="text-gray-600">
                       {t('contact.business_hours.weekdays')}<br />
                       {t('contact.business_hours.friday')}
                      </p>
                    </div>
                  </div>
                </div>

       {/* Quick Contact Buttons */}
<div className="mt-8 space-y-3">
  <button
    onClick={() => {
      const phoneNumber = "963956556410";
      const message = "Hello! Thank you for reaching out. How can we assist you ?";
      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }}
    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-full font-medium transition-all duration-300 flex items-center justify-center"
  >
    <MessageCircle size={20} className="mr-2" />
    {t('contact.whatsapp')}
  </button>

  <a
    href="tel:+963956556410"
    className="w-full bg-[#b9a779] hover:bg-[#054239] text-white py-3 px-4 rounded-full font-medium transition-all duration-300 flex items-center justify-center"
  >
    <Phone size={20} className="mr-2" />
    {t('contact.call_now')}
  </a>
</div>
                </div>

              </div>


            {/* Contact Form and Map */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Form */}
              <div className="bg-[#f7f7f7]  rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-[#054239] mb-8">{t('contact.send_message')}</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {submitMessage && (
                    <div className={`p-4 rounded-lg ${
                      submitMessage.includes(t('contact.form.success').substring(0, 5)) 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {submitMessage}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('contact.form.full_name')} *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent transition-all duration-300"
                        placeholder={t('contact.form.placeholder.name')}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('contact.form.email')} *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent transition-all duration-300"
                        placeholder={t('contact.form.placeholder.email')}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('contact.form.phone')}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent transition-all duration-300"
                        placeholder={t('contact.form.placeholder.phone')}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('contact.form.subject')} *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent transition-all duration-300"
                      >
                        <option value="">{t('misc.select_subject')}</option>
                        <option value="product-inquiry">{t('misc.subject_options.product_inquiry')}</option>
                        <option value="bulk-order">{t('misc.subject_options.bulk_order')}</option>
                        <option value="partnership">{t('misc.subject_options.partnership')}</option>
                        <option value="quality-question">{t('misc.subject_options.quality_question')}</option>
                        <option value="shipping">{t('misc.subject_options.shipping')}</option>
                        <option value="other">{t('misc.subject_options.other')}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.message')} *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent transition-all duration-300 resize-none"
                      placeholder={t('contact.form.placeholder.message')}
                      
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#b9a779] hover:bg-[#054239] text-white py-4 px-6 rounded-full font-semibold transition-all duration-300 flex items-center justify-center group"
                  >
                    <Send size={20} className="mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    {isSubmitting ? t('contact.form.sending') : t('contact.form.send')}
                  </button>
                </form>
              </div>

              {/* Map */}
              <div className="bg-[#f7f7f7]  rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-[#054239] mb-6">{t('contact.location')}</h2>
                <div className="relative bg-gray-100 rounded-xl h-96 overflow-hidden">
                
                  {/* In a real implementation, you would integrate with Google Maps, Mapbox, or similar */}
                <iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3220.021842769755!2d36.769716739654555!3d36.19035061456288!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15257b2abd015b51%3A0x8c7ccf0d0af4520a!2z2YXYpNiz2LPYqSDYp9mE2LTZhdin2YTZiiDYp9mE2KrYrNin2LHZitipIEFMU0hNQUxZIEFHUk8!5e0!3m2!1sen!2snl!4v1752479443663!5m2!1sen!2snl"
  width="100%"
  height="100%"
  style={{ border: 0 }}
  allowFullScreen=""
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
  className="rounded-xl"
/>

                </div> 
                
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-600 text-sm">
                    <strong> {t('Note')}</strong>  {t('note.all')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
     <section className="py-20 bg-[#f7f7f7]   border-t-2  border-t-[#edebe0]">
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-[#054239] mb-4">{t('contact.faq.title')}</h2>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">
        {t('contact.faq.subtitle')}
      </p>
    </div>

    <div className="max-w-4xl mx-auto space-y-6">
      {faqData.map((faq, index) => (
        <div key={index} className="bg-[#f7f7f7] rounded-xl overflow-hidden p-6">
          <h3 className="text-lg font-semibold text-[#054239] mb-2">{faq.question}</h3>
          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
        </div>
      ))}
    </div>
  </div>
</section>

    </div>
  );
};

export default ContactPage;