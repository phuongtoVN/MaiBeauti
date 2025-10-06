'use client';

import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-6 h-6 text-rose-500" />
              <span className="text-xl font-bold">MaiBeauti</span>
            </div>
            <p className="text-gray-400 text-sm">
              AI-powered skincare platform for personalized beauty solutions
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <button 
                  onClick={() => router.push('/analyze')} 
                  className="hover:text-white transition"
                >
                  Skin Analysis
                </button>
              </li>
              <li>
                <button 
                  onClick={() => router.push('/chat')} 
                  className="hover:text-white transition"
                >
                  AI Consultant
                </button>
              </li>
              <li>
                <button 
                  onClick={() => router.push('/products')} 
                  className="hover:text-white transition"
                >
                  Shop Products
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <button 
                  onClick={() => router.push('/about')} 
                  className="hover:text-white transition"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => router.push('/contact')} 
                  className="hover:text-white transition"
                >
                  Contact
                </button>
              </li>
              <li>
                <button 
                  onClick={() => router.push('/privacy')} 
                  className="hover:text-white transition"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <button 
                  onClick={() => router.push('/faq')} 
                  className="hover:text-white transition"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button 
                  onClick={() => router.push('/help')} 
                  className="hover:text-white transition"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button 
                  onClick={() => router.push('/shipping')} 
                  className="hover:text-white transition"
                >
                  Shipping Info
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 MaiBeauti. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}