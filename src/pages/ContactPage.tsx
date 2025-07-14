import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { ContactAPI } from '../lib/api/contact';

const ContactPage = () => {
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
      
      await ContactAPI.submitContactMessage(formData);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      }); 
      
      setSubmitMessage('Thank you for your message! We will get back to you soon.');
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitMessage('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqData = [
    {
      question: "What is your minimum order quantity?",
      answer: "Our minimum order quantity varies by product. For most items, it's 1 ton, but we can accommodate smaller orders for sample testing."
    },
    {
      question: "Do you provide certificates of origin and quality?",
      answer: "Yes, we provide all necessary documentation including certificates of origin, quality certificates, and phytosanitary certificates for international shipping."
    },
    {
      question: "What are your payment terms?",
      answer: "We accept various payment methods including T/T, L/C, and other internationally recognized payment terms. Specific terms can be discussed based on order size and relationship."
    },
    {
      question: "How long does shipping take?",
      answer: "Shipping times vary by destination. Typically, it takes 2-4 weeks for sea freight and 3-7 days for air freight to most international destinations."
    },
    {
      question: "Do you offer private labeling services?",
      answer: "Yes, we offer private labeling services with your brand. We can customize packaging design and labeling according to your specifications."
    }
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f7]  pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-[#054239] text-white ">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              Ready to start your journey with premium Syrian agricultural products? 
              Get in touch with our team today.
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
                <h2 className="text-2xl font-bold text-[#054239] mb-8">Get in Touch</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#b9a779] rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#054239] mb-1">Address</h3>
                      <p className="text-gray-600">
                        Industrial Zone<br />
                        Idlib, Syria
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#b9a779] rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#054239] mb-1">Phone</h3>
                      <p className="text-gray-600">+963 XXX XXX XXX</p>
                      <p className="text-gray-600">+963 XXX XXX XXX</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#b9a779] rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#054239] mb-1">Email</h3>
                      <p className="text-gray-600">info@al-shamali.com</p>
                      <p className="text-gray-600">sales@al-shamali.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#b9a779] rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#054239] mb-1">Business Hours</h3>
                      <p className="text-gray-600">
                        Sunday - Thursday: 8:00 AM - 6:00 PM<br />
                        Friday: 8:00 AM - 12:00 PM<br />
                        Saturday: Closed
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Contact Buttons */}
                <div className="mt-8 space-y-3">
                  <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-full font-medium transition-all duration-300 flex items-center justify-center">
                    <MessageCircle size={20} className="mr-2" />
                    WhatsApp Chat
                  </button>
                  <button className="w-full bg-[#b9a779] hover:bg-[#054239] text-white py-3 px-4 rounded-full font-medium transition-all duration-300 flex items-center justify-center">
                    <Phone size={20} className="mr-2" />
                    Call Now
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Form and Map */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Form */}
              <div className="bg-[#f7f7f7]  rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-[#054239] mb-8">Send us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {submitMessage && (
                    <div className={`p-4 rounded-lg ${
                      submitMessage.includes('Thank you') 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {submitMessage}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent transition-all duration-300"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent transition-all duration-300"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent transition-all duration-300"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent transition-all duration-300"
                      >
                        <option value="">Select a subject</option>
                        <option value="product-inquiry">Product Inquiry</option>
                        <option value="bulk-order">Bulk Order</option>
                        <option value="partnership">Partnership Opportunity</option>
                        <option value="quality-question">Quality Question</option>
                        <option value="shipping">Shipping & Logistics</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent transition-all duration-300 resize-none"
                      placeholder="Tell us about your requirements, questions, or how we can help you..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#b9a779] hover:bg-[#054239] text-white py-4 px-6 rounded-full font-semibold transition-all duration-300 flex items-center justify-center group"
                  >
                    <Send size={20} className="mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>

              {/* Map */}
              <div className="bg-[#f7f7f7]  rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-[#054239] mb-6">Our Location</h2>
                <div className="relative bg-gray-100 rounded-xl h-96 overflow-hidden">
                  {/* Map Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin size={64} className="text-[#b9a779] mx-auto mb-4" />
                      <p className="text-gray-600 text-lg font-medium">Interactive Map</p>
                      <p className="text-gray-500">Al-Shamali Location in Idlib, Syria</p>
                    </div>
                  </div>
                  
                  {/* In a real implementation, you would integrate with Google Maps, Mapbox, or similar */}
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509374!2d-122.42107968468141!3d37.77492927975903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb10ed6d9b5050fa5!2sIdlib%2C%20Syria!5e0!3m2!1sen!2sus!4v1635959542123!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-xl"
                  ></iframe>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-600 text-sm">
                    <strong>Note:</strong> For international clients, we provide comprehensive shipping and logistics support. 
                    Our team will coordinate with you to ensure smooth delivery to your location.
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
      <h2 className="text-4xl font-bold text-[#054239] mb-4">Frequently Asked Questions</h2>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">
        Quick answers to common questions about our products and services
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