'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Menu, X } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-rose-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button 
            onClick={() => handleNavigation('/')}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <Sparkles className="w-8 h-8 text-rose-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
              MaiBeauti
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => handleNavigation('/analyze')} 
              className="text-gray-700 hover:text-rose-500 transition"
            >
              Analyze
            </button>
            <button 
              onClick={() => handleNavigation('/products')} 
              className="text-gray-700 hover:text-rose-500 transition"
            >
              Products
            </button>
            <button 
              onClick={() => handleNavigation('/login')} 
              className="px-4 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition"
            >
              Sign In
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500 rounded-lg p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-3 bg-white/80 backdrop-blur-md border-t border-rose-100">
          <button
            onClick={() => handleNavigation('/analyze')}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-rose-50 hover:text-rose-500 rounded-lg transition-colors"
          >
            Analyze
          </button>
          <button
            onClick={() => handleNavigation('/products')}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-rose-50 hover:text-rose-500 rounded-lg transition-colors"
          >
            Products
          </button>
          <button
            onClick={() => handleNavigation('/login')}
            className="w-full bg-rose-500 text-white px-4 py-2 rounded-full hover:bg-rose-600 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
}