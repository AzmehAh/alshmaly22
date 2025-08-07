import React from 'react';
import { Facebook, Instagram,Mail, Youtube, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-[#054239] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="gap-4">
            <div className="flex items-center space-x-2"> 
               <img 
              src="./images/logo2.png" 
              alt="Al-Shmaly Logo" 
              className="h-16 w-15 object-contain"
            />
              <div>
                <h3 className="text-xl font-bold">{t('admin.logo')}</h3>
              
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {t('footer.company_description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{t('footer.quick_links')}</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-[#b9a779] transition-colors duration-300">{t('nav.home')}</Link></li>
              <li><Link to="/products" className="text-gray-300 hover:text-[#b9a779] transition-colors duration-300">{t('nav.products')}</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-[#b9a779] transition-colors duration-300">{t('nav.about')}</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-[#b9a779] transition-colors duration-300">{t('nav.blog')}</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-[#b9a779] transition-colors duration-300">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{t('footer.contact_info')}</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-[#b9a779] mt-1" />
                <p className="text-gray-300 text-sm">{t('contact.address')}<br /> {t('footer.contact_adress')}</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-[#b9a779]" />
                <div className="text-gray-300 text-sm" dir="ltr">
                  <p> +963 956 556 410</p>
                 
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-[#b9a779]" />
                <p className="text-gray-300 text-sm">alshmaly.sy@gmail.com</p>
              </div>
            </div>
          </div>

        {/* Social Media */}
<div>
  <h4 className="font-semibold text-lg mb-4">{t('footer.follow_us')}</h4>
  <div className="flex gap-4">
    {/* Facebook */}
    <a
      href="https://www.facebook.com/alshmaly.sy?locale=ar_AR"
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 bg-[#b9a779] rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[#1877F2] hover:text-white"
    >
      <Facebook size={20} />
    </a>

    {/* Instagram */}
    <a
  href="https://www.instagram.com/shmaly.sy?igsh=bjJ1dTJtbGpseW5q"
  target="_blank"
  rel="noopener noreferrer"
  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 text-white bg-[#b9a779] hover:text-white hover:bg-gradient-to-tr hover:from-pink-500 hover:via-red-500 hover:to-yellow-500"
>
  <Instagram size={20} />
</a>


    {/* YouTube */}
    <a
      href="https://youtube.com/@hasan.alshmaly?si=3ucyNyVXCMJITi2q"
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 bg-[#b9a779] rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[#FF0000] hover:text-white"
    >
      <Youtube size={20} />
    </a>
  </div>
</div>
          </div>



       <div className="border-t border-gray-700 mt-8 pt-8 text-center">
  <p className="text-gray-300 text-sm">
 {t('footer.rights')} {t('footer.all_rights')} <br />
    {t('footer.made_by')}{' '}
    <a
      href="https://ymedia.design/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#b9a779] hover:underline"
    >
      Y-Media
    </a>
  </p>
</div>

      </div>
    </footer>
  );
};

export default Footer;