'use client';

import { useRouter } from 'next/navigation';
import { Camera, MessageCircle, ShoppingBag, TrendingUp, Star, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Your Personal
            <span className="block bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
              AI Skincare Consultant
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Get AI-powered skin analysis in seconds. Receive personalized product recommendations from Mai, your intelligent skincare advisor.
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => router.push('/analyze')}
              className="px-8 py-4 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-full text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition flex items-center space-x-2"
            >
              <Camera className="w-5 h-5" />
              <span>Analyze Your Skin</span>
            </button>
            <button 
              onClick={() => router.push('/chat')}
              className="px-8 py-4 bg-white text-rose-600 border-2 border-rose-500 rounded-full text-lg font-semibold hover:bg-rose-50 transition flex items-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat with Mai</span>
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition border border-rose-100">
            <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-rose-600 rounded-2xl flex items-center justify-center mb-6">
              <Camera className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Skin Analysis</h3>
            <p className="text-gray-600 leading-relaxed">
              Upload a selfie and get detailed insights about your skin type, concerns, and personalized recommendations in under 30 seconds.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition border border-purple-100">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Chat with Mai</h3>
            <p className="text-gray-600 leading-relaxed">
              Ask Mai anything about skincare. Get expert advice, product suggestions, and answers to your questions instantly.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition border border-rose-100">
            <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <ShoppingBag className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Curated Products</h3>
            <p className="text-gray-600 leading-relaxed">
              Shop skincare products perfectly matched to your skin type and concerns, with AI-powered personalization.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            How MaiBeauti Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-rose-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Upload Your Selfie</h3>
              <p className="text-gray-600">
                Take or upload a clear photo of your face in good lighting
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Get AI Analysis</h3>
              <p className="text-gray-600">
                Our AI analyzes your skin type, concerns, and creates a profile
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-rose-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Receive Recommendations</h3>
              <p className="text-gray-600">
                Get personalized product suggestions and skincare advice from Mai
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-rose-500 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-rose-100">Skin Analyses</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-rose-100">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">30s</div>
              <div className="text-rose-100">Analysis Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-rose-100">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-gradient-to-br from-rose-50 to-purple-50 rounded-3xl p-12 text-center border border-rose-100">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Skincare Routine?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have discovered their perfect skincare routine with MaiBeauti
          </p>
          <button 
            onClick={() => router.push('/analyze')}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-full text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition"
          >
            <Sparkles className="w-5 h-5" />
            <span>Start Free Analysis</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-6 h-6 text-rose-400" />
                <span className="text-xl font-bold">MaiBeauti</span>
              </div>
              <p className="text-gray-400">
                AI-powered skincare platform for personalized beauty solutions
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => router.push('/analyze')} className="hover:text-white transition">Skin Analysis</button></li>
                <li><button onClick={() => router.push('/chat')} className="hover:text-white transition">AI Consultant</button></li>
                <li><button onClick={() => router.push('/products')} className="hover:text-white transition">Shop Products</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => router.push('/about')} className="hover:text-white transition">About Us</button></li>
                <li><button onClick={() => router.push('/contact')} className="hover:text-white transition">Contact</button></li>
                <li><button onClick={() => router.push('/privacy')} className="hover:text-white transition">Privacy Policy</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => router.push('/faq')} className="hover:text-white transition">FAQ</button></li>
                <li><button onClick={() => router.push('/help')} className="hover:text-white transition">Help Center</button></li>
                <li><button onClick={() => router.push('/shipping')} className="hover:text-white transition">Shipping Info</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MaiBeauti. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}