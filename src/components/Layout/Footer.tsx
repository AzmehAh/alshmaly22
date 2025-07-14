import React from 'react';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#054239] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2"> 
               <img 
              src="https://i.postimg.cc/sgdxhP1p/logo.png" 
              alt="Al-Shamaly Logo" 
              className="h-16 w-15 object-contain"
            />
              <div>
                <h3 className="text-xl font-bold">Al-Shamaly</h3>
              
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              We export the best of Syrian nature to the world, bringing authenticity and quality to your table.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-[#b9a779] transition-colors duration-300">Home</Link></li>
              <li><Link to="/products" className="text-gray-300 hover:text-[#b9a779] transition-colors duration-300">Products</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-[#b9a779] transition-colors duration-300">About Us</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-[#b9a779] transition-colors duration-300">Blog</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-[#b9a779] transition-colors duration-300">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin size={16} className="text-[#b9a779] mt-1" />
                <p className="text-gray-300 text-sm">Idlib, Syria</p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-[#b9a779]" />
                <p className="text-gray-300 text-sm">+963 XXX XXX XXX</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-[#b9a779]" />
                <p className="text-gray-300 text-sm">info@al-shamali.com</p>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-[#b9a779] rounded-full flex items-center justify-center hover:bg-white hover:text-[#054239] transition-all duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-[#b9a779] rounded-full flex items-center justify-center hover:bg-white hover:text-[#054239] transition-all duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-[#b9a779] rounded-full flex items-center justify-center hover:bg-white hover:text-[#054239] transition-all duration-300">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300 text-sm">
            © 2024 Al-Shamali Agricultural Products. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;