'use client';

import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import Header from '@/components/Header';
export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      {/* Navigation */}
      <Header />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-500 mb-12">Last Updated: October 6, 2025</p>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-6">
            At MaiBeauti, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our AI-powered skincare platform.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">1. Information We Collect</h2>
          
          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">Personal Information</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li>Name, email address, and contact information</li>
            <li>Shipping and billing addresses</li>
            <li>Payment information (processed securely through third-party providers)</li>
            <li>Account credentials and preferences</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">Skin Analysis Data</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li>Photographs and images uploaded for skin analysis</li>
            <li>Skin type, concerns, and conditions you report</li>
            <li>Product preferences and usage history</li>
            <li>AI-generated recommendations and consultation records</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">Technical Information</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li>Device information and IP address</li>
            <li>Browser type and operating system</li>
            <li>Usage patterns and interaction with our platform</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">We use your information to:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li>Provide personalized skincare analysis and recommendations through our AI consultant</li>
            <li>Process and fulfill your product orders</li>
            <li>Improve our AI algorithms and platform functionality</li>
            <li>Send you important updates about your orders and account</li>
            <li>Communicate promotional offers and skincare tips (with your consent)</li>
            <li>Ensure platform security and prevent fraud</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">3. AI and Data Processing</h2>
          <div className="bg-rose-50 border-l-4 border-rose-500 p-6 my-6 rounded-r-lg">
            <p className="text-gray-800">
              <strong className="text-rose-600">Important:</strong> Your skin analysis photos and data are processed by our AI system to provide personalized recommendations. We use industry-standard encryption and do not share your images with third parties for marketing purposes.
            </p>
          </div>

          <p className="text-gray-700 mb-4">Our AI technology analyzes your skin data to:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li>Identify skin types, concerns, and conditions</li>
            <li>Recommend suitable products and routines</li>
            <li>Track your skincare progress over time</li>
            <li>Continuously improve recommendation accuracy</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">4. Data Sharing and Disclosure</h2>
          <p className="text-gray-700 mb-4">We may share your information with:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li><strong>Service Providers:</strong> Payment processors, shipping companies, and cloud hosting services</li>
            <li><strong>Business Partners:</strong> Only with your explicit consent for specific purposes</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
          </ul>
          <p className="text-gray-700 mb-6">We never sell your personal information to third parties.</p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">5. Data Security</h2>
          <p className="text-gray-700 mb-4">We implement robust security measures including:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li>End-to-end encryption for sensitive data</li>
            <li>Secure server infrastructure and regular security audits</li>
            <li>Strict access controls and employee training</li>
            <li>Regular backups and disaster recovery protocols</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">6. Your Rights and Choices</h2>
          <p className="text-gray-700 mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
            <li><strong>Deletion:</strong> Request deletion of your account and data</li>
            <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
            <li><strong>Data Portability:</strong> Receive your data in a portable format</li>
            <li><strong>Withdraw Consent:</strong> Revoke consent for data processing at any time</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">7. Cookies and Tracking</h2>
          <p className="text-gray-700 mb-4">We use cookies to enhance your experience. You can control cookie preferences through your browser settings. Types of cookies we use:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li><strong>Essential:</strong> Required for platform functionality</li>
            <li><strong>Analytics:</strong> Help us understand usage patterns</li>
            <li><strong>Personalization:</strong> Remember your preferences</li>
            <li><strong>Marketing:</strong> Deliver relevant content (with consent)</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">8. Children's Privacy</h2>
          <p className="text-gray-700 mb-6">
            Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">9. International Data Transfers</h2>
          <p className="text-gray-700 mb-6">
            Your data may be transferred to and processed in countries outside your residence. We ensure appropriate safeguards are in place for such transfers in compliance with applicable laws.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">10. Changes to This Policy</h2>
          <p className="text-gray-700 mb-6">
            We may update this Privacy Policy periodically. We will notify you of significant changes via email or prominent notice on our platform.
          </p>

          <div className="bg-rose-50 rounded-2xl p-8 mt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
            </p>
            <p className="text-gray-700">
              <strong>Email:</strong> <a href="mailto:privacy@maibeauti.com" className="text-rose-600 hover:text-rose-700">privacy@maibeauti.com</a><br />
              <strong>Address:</strong> MaiBeauti Privacy Team, 123 Beauty Lane, San Francisco, CA 94102<br />
              <strong>Phone:</strong> +1 (555) 123-4567
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
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