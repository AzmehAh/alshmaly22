import React, { useState } from 'react';
import { Search, Download, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
 
  return (
<header className="bg-[#edebe0] backdrop-blur-md fixed top-0 left-0 w-full z-50 shadow-sm">

      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */} 
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="https://i.postimg.cc/sgdxhP1p/logo.png" 
              alt="Al-Shamaly Logo"  
              className="h-16 w-15 object-contain"
            />
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-[#054239]">Al-Shamaly</h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`transition-colors duration-300 font-medium ${
                isActive('/') ? 'text-[#b9a779]' : 'text-[#054239] hover:text-[#b9a779]'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`transition-colors duration-300 font-medium ${
                isActive('/products') ? 'text-[#b9a779]' : 'text-[#054239] hover:text-[#b9a779]'
              }`}
            >
              Products
            </Link>
            <Link 
              to="/about" 
              className={`transition-colors duration-300 font-medium ${
                isActive('/about') ? 'text-[#b9a779]' : 'text-[#054239] hover:text-[#b9a779]'
              }`}
            >
              About Us
            </Link>
            <Link 
              to="/blog" 
              className={`transition-colors duration-300 font-medium ${
                isActive('/blog') || location.pathname.startsWith('/blog/') ? 'text-[#b9a779]' : 'text-[#054239] hover:text-[#b9a779]'
              }`}
            >
              Blog
            </Link>
            <Link 
              to="/contact" 
              className={`transition-colors duration-300 font-medium ${
                isActive('/contact') ? 'text-[#b9a779]' : 'text-[#054239] hover:text-[#b9a779]'
              }`}
            >
              Contact
            </Link>
            <button className="flex items-center space-x-1 text-[#b9a779] hover:text-[#054239] transition-colors duration-300">
              <Download size={16} />
              <span className="text-sm">ISO Certificate</span>
            </button>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-gray-50 rounded-full px-4 py-2 max-w-xs">
            <Search size={18} className="text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search products..."
              className="bg-transparent outline-none text-sm flex-1"
            />
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
                Home
              </Link>
              <Link 
                to="/products" 
                className={`transition-colors duration-300 ${
                  isActive('/products') ? 'text-[#b9a779]' : 'text-[#054239] hover:text-[#b9a779]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                to="/about" 
                className={`transition-colors duration-300 ${
                  isActive('/about') ? 'text-[#b9a779]' : 'text-[#054239] hover:text-[#b9a779]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                to="/blog" 
                className={`transition-colors duration-300 ${
                  isActive('/blog') || location.pathname.startsWith('/blog/') ? 'text-[#b9a779]' : 'text-[#054239] hover:text-[#b9a779]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                to="/contact" 
                className={`transition-colors duration-300 ${
                  isActive('/contact') ? 'text-[#b9a779]' : 'text-[#054239] hover:text-[#b9a779]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              > 
                Contact
              </Link>
              <button className="flex items-center space-x-1 text-[#b9a779] hover:text-[#054239] transition-colors duration-300">
                <Download size={16} />
                <span>ISO Certificate</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;