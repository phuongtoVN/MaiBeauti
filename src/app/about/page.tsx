'use client';
import Footer from '@/components/Footer';
import { Sparkles, Heart, Shield, Zap, Users, Award, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button 
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-8 h-8 text-rose-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
                MaiBeauti
              </span>
            </button>
            <button
              onClick={() => router.push('/analyze')}
              className="px-6 py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition"
            >
              Try Free Analysis
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-rose-500 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Revolutionizing Skincare with AI
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            Your personal dermatologist, powered by cutting-edge technology. 
            Professional skin analysis, personalized routines, accessible to everyone.
          </p>
          <button
            onClick={() => router.push('/analyze')}
            className="px-8 py-4 bg-white text-rose-500 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition"
          >
            Start Your Free Analysis
          </button>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Our Story
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-lg leading-relaxed mb-6">
              MaiBeauti was born from a simple frustration: getting professional skincare advice 
              shouldn't require expensive dermatologist appointments or navigating overwhelming 
              product choices alone.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              We noticed that millions of people struggle with skin concerns but lack access to 
              personalized, expert guidance. Meanwhile, shelves overflow with products making 
              bold promises, leaving consumers confused about what truly works for their unique skin.
            </p>
            <p className="text-lg leading-relaxed">
              That's why we created MaiBeauti—combining advanced AI technology with dermatological 
              expertise to deliver instant, personalized skin analysis and product recommendations. 
              Now, professional-grade skincare guidance is just a selfie away.
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Mission */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100">
              <div className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-700">
                To democratize professional skincare by making expert analysis and personalized 
                recommendations accessible to everyone, everywhere, instantly.
              </p>
            </div>

            {/* Vision */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-700">
                A world where everyone has the confidence and knowledge to achieve their 
                healthiest, most radiant skin through personalized, AI-powered guidance.
              </p>
            </div>

            {/* Values */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
              <p className="text-gray-700">
                Privacy-first, science-backed, transparent recommendations. We prioritize 
                your data security and only suggest products proven to work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Powered by Advanced AI
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                How Our Technology Works
              </h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="text-rose-500 mr-3 text-xl">✓</span>
                  <span>
                    <strong>Advanced Facial Recognition:</strong> Our AI analyzes over 50 skin 
                    attributes in seconds using cutting-edge computer vision.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-rose-500 mr-3 text-xl">✓</span>
                  <span>
                    <strong>Dermatology-Grade Accuracy:</strong> Trained on millions of skin 
                    images and validated against professional dermatological assessments.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-rose-500 mr-3 text-xl">✓</span>
                  <span>
                    <strong>Personalized Recommendations:</strong> Machine learning matches your 
                    unique skin profile with products proven to work for similar skin types.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-rose-500 mr-3 text-xl">✓</span>
                  <span>
                    <strong>Privacy Protected:</strong> Your photos are encrypted, processed 
                    securely, and never shared with third parties.
                  </span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-rose-100 to-purple-100 rounded-2xl p-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-rose-500 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900">10,000+</div>
                    <div className="text-gray-600">Analyses Completed</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900">95%</div>
                    <div className="text-gray-600">Satisfaction Rate</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900">24/7</div>
                    <div className="text-gray-600">AI Support Available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Why Choose MaiBeauti?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Instant Results',
                description: 'Get your skin analysis in under 30 seconds',
                icon: Zap,
                color: 'bg-yellow-500'
              },
              {
                title: 'Expert-Backed',
                description: 'Recommendations based on dermatological science',
                icon: Award,
                color: 'bg-blue-500'
              },
              {
                title: 'Personalized',
                description: 'Tailored to your unique skin type and concerns',
                icon: Heart,
                color: 'bg-rose-500'
              },
              {
                title: 'Private & Secure',
                description: 'Your data is encrypted and never shared',
                icon: Shield,
                color: 'bg-green-500'
              }
            ].map((feature, index) => (
              <div key={index} className="p-6 border-2 border-gray-100 rounded-2xl hover:border-rose-300 transition">
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-rose-500 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Skin?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands who've discovered their perfect skincare routine with MaiBeauti
          </p>
          <button
            onClick={() => router.push('/analyze')}
            className="px-8 py-4 bg-white text-rose-500 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition inline-flex items-center space-x-2"
          >
            <span>Start Free Analysis</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer className="bg-gray-900 text-white py-12">
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
                <li><button onClick={() => router.push('/analyze')} className="hover:text-white transition">Skin Analysis</button></li>
                <li><button className="hover:text-white transition">AI Consultant</button></li>
                <li><button className="hover:text-white transition">Shop Products</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button onClick={() => router.push('/about')} className="hover:text-white transition">About Us</button></li>
                <li><button className="hover:text-white transition">Contact</button></li>
                <li><button className="hover:text-white transition">Privacy Policy</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button className="hover:text-white transition">FAQ</button></li>
                <li><button className="hover:text-white transition">Help Center</button></li>
                <li><button className="hover:text-white transition">Shipping Info</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 MaiBeauti. All rights reserved.</p>
          </div>
        </div>
      </Footer>
    </div>
  );
}