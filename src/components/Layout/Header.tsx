import React, { useState } from 'react';
import { Download, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSwitcher from '../ui/LanguageSwitcher';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { t, direction } = useLanguage();

  const isActive = (path) => location.pathname === path;
 const downloadPDF = async () => {
  try {
    const res = await fetch(
      'https://knejwjwqwgssrjlrvhsp.supabase.co/storage/v1/object/public/certificates/iso-cert-v2.pdf'
    );
    if (!res.ok) throw new Error('Failed to fetch PDF');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'iso-cert-v2.pdf';
    document.body.appendChild(link); 
    link.click(); 
    link.remove(); 
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Download error:', err);
  }
}; 
  return (
<header className="bg-[#edebe0] backdrop-blur-md fixed top-0 left-0 w-full z-50 shadow-sm">

      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */} 
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="./images/logo.png" 
              alt="Al-Shmaly Logo"  
              className="h-16 w-15 object-contain"
            /> 
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-[#054239]">{t('admin.logo')}</h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className={`transition-colors duration-300 font-medium ${
                isActive('/') ? 'text-[#b9a779]' : 'text-[#054239] hover:text-[#b9a779]'
              }`}
            >
              {t('nav.home')}
            </Link>
            <Link 
              to="/products" 
              className={`transition-colors duration-300 font-medium ${
                isActive('/products') ? 'text-[#b9a779]' : 'text-[#054239] hover:text-[#b9a779]'
              }`}
            >
              {t('nav.products')}
            </Link>
            <Link 
              to="/about" 
              className={`transition-colors duration-300 font-medium ${
                isActive('/about') ? 'text-[#b9a779]' : 'text-[#054239] hover:text-[#b9a779]'
              }`}
            >
              {t('nav.about')}
            </Link>
            <Link 
              to="/blog" 
              className={`transition-colors duration-300 font-medium ${
                isActive('/blog') || location.pathname.startsWith('/blog/') ? 'text-[#b9a779]' : 'text-[#054239] hover:text-[#b9a779]'
              }`}
            >
              {t('nav.blog')}
            </Link>
            <Link 
              to="/contact" 
              className={`transition-colors duration-300 font-medium ${
                isActive('/contact') ? 'text-[#b9a779]' : 'text-[#054239] hover:text-[#b9a779]'
              }`}
            >
              {t('nav.contact')}
            </Link> 
       <button
  onClick={downloadPDF}
  className="flex items-center space-x-1 text-[#b9a779] hover:text-[#054239] transition-colors duration-300"
>
  <Download size={16} />
  <span className="text-sm">{t('nav.iso_certificate')}</span>
</button>
 
{/* الصور بعد زر الشهادة */}
<div className="flex items-center gap-2 ml-4">
  <img
    src="./images/cert1.jpeg"
    alt="Certificate 1"
    className="h-12 w-12 object-contain"
  />
  <img
    src="./images/cert2.jpeg"
    alt="Certificate 2"
    className="h-14 w-13 object-contain"
  /> 
</div>
          </nav>

          {/* Language Switcher */} 
          <div className="hidden md:flex">
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t">
            <nav className="flex flex-col space-y-4 pt-4">
              <Link 
                to="/" 
                className={`transition-colors duration-300 ${
                  isActive('/') ? 'text-[#b9a779]' : 'text-[#054239] hover:text-[#b9a779]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link 
                to="/products" 
                className={`transition-colors duration-300 ${
                  isActive('/products') ? 'text-[#b9a779]' : 'text-[#054239] hover:text-[#b9a779]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.products')}
              </Link>
              <Link 
                to="/about" 
                className={`transition-colors duration-300 ${
                  isActive('/about') ? 'text-[#b9a779]' : 'text-[#054239] hover:text-[#b9a779]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.about')}
              </Link>
              <Link 
                to="/blog" 
                className={`transition-colors duration-300 ${
                  isActive('/blog') || location.pathname.startsWith('/blog/') ? 'text-[#b9a779]' : 'text-[#054239] hover:text-[#b9a779]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.blog')}
              </Link>
              <Link 
                to="/contact" 
                className={`transition-colors duration-300 ${
                  isActive('/contact') ? 'text-[#b9a779]' : 'text-[#054239] hover:text-[#b9a779]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              > 
                {t('nav.contact')}
              </Link>
              <button
  onClick={downloadPDF}
  className="flex items-center space-x-1 text-[#b9a779] hover:text-[#054239] transition-colors duration-300"
>
  <Download size={16} />
  <span className="text-sm">{t('nav.iso_certificate')}</span>
</button>
              
             {/* الصور بعد زر الشهادة */}
<div className="flex items-center gap-2 mt-2">
  <img
    src="./images/cert1.jpeg"
    alt="Certificate 1"
    className="h-12 w-12 object-contain"
  />
  <img
    src="./images/cert2.jpeg"
    alt="Certificate 2"
    className="h-14 w-13 object-contain"
  /> 
</div>

{/* Mobile Language Switcher */}
<div className="pt-4 border-t border-gray-200">
  <LanguageSwitcher />
</div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;