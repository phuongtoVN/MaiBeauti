'use client';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { Sparkles, Mail, Clock, MessageSquare, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'support',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', category: 'support', subject: '', message: '' });
      
      // Reset status after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    }, 1500);

    // TODO: Replace with actual API call
    // await fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-rose-500 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Have questions? We're here to help. Our support team typically responds within 24 hours.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Contact Form - Left Side (2 columns) */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Send us a Message
                </h2>

                {status === 'success' && (
                  <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-green-900">Message Sent!</h3>
                      <p className="text-green-700 text-sm">We'll get back to you within 24 hours.</p>
                    </div>
                  </div>
                )}

                {status === 'error' && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-red-900">Oops!</h3>
                      <p className="text-red-700 text-sm">Something went wrong. Please try again.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:ring-0 transition"
                      placeholder="Your name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:ring-0 transition"
                      placeholder="you@example.com"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                      What can we help you with?
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:ring-0 transition"
                    >
                      <option value="support">Technical Support</option>
                      <option value="product">Product Questions</option>
                      <option value="business">Business/Partnership</option>
                      <option value="press">Press/Media Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:ring-0 transition"
                      placeholder="Brief description of your inquiry"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:ring-0 transition resize-none"
                      placeholder="Tell us more about your question or concern..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full px-6 py-4 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                  >
                    {status === 'sending' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Info - Right Sidebar */}
            <div className="space-y-6">
              {/* Contact Methods */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Other Ways to Reach Us
                </h3>
                
                <div className="space-y-4">
                  {/* Email */}
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Email</div>
                      <a href="mailto:support@maibeauti.com" className="text-rose-500 hover:text-rose-600 text-sm">
                        support@maibeauti.com
                      </a>
                    </div>
                  </div>

                  {/* Live Chat */}
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Live Chat</div>
                      <p className="text-gray-600 text-sm">Available 9 AM - 6 PM PST</p>
                    </div>
                  </div>

                  {/* Response Time */}
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Response Time</div>
                      <p className="text-gray-600 text-sm">Within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-gradient-to-br from-rose-50 to-purple-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Quick Help
                </h3>
                <ul className="space-y-3">
                  <li>
                    <button className="text-rose-600 hover:text-rose-700 font-medium text-sm flex items-center space-x-2">
                      <span>View FAQ</span>
                      <span>→</span>
                    </button>
                  </li>
                  <li>
                    <button 
                        onClick={() => router.push('/help')}
                        className="text-rose-600 hover:text-rose-700 font-medium text-sm flex items-center space-x-2"
                    >
                        <span>Help Center</span>
                        <span>→</span>
                    </button>
                </li>
                  <li>
                    <button className="text-rose-600 hover:text-rose-700 font-medium text-sm flex items-center space-x-2">
                      <span>Shipping Info</span>
                      <span>→</span>
                    </button>
                  </li>
                  <li>
                    <button className="text-rose-600 hover:text-rose-700 font-medium text-sm flex items-center space-x-2">
                      <span>Returns Policy</span>
                      <span>→</span>
                    </button>
                  </li>
                </ul>
              </div>

              {/* Business Hours */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Support Hours
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-semibold text-gray-900">9 AM - 6 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-semibold text-gray-900">10 AM - 4 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-semibold text-gray-900">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Teaser Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'How long does the skin analysis take?',
                a: 'Our AI analysis typically completes in under 30 seconds after you upload your photo.'
              },
              {
                q: 'Is my photo data secure?',
                a: 'Yes, all photos are encrypted and processed securely. We never share your data with third parties.'
              },
              {
                q: 'What if I\'m not satisfied with the recommended products?',
                a: 'We offer a 60-day money-back guarantee on all product purchases.'
              },
              {
                q: 'Can I save my analysis results?',
                a: 'Yes, you can create an account to save and track your skin analysis over time.'
              }
            ].map((faq, index) => (
              <details
                key={index}
                className="bg-gradient-to-br from-rose-50 to-purple-50 rounded-xl p-6 cursor-pointer hover:shadow-md transition"
              >
                <summary className="font-semibold text-gray-900 cursor-pointer">
                  {faq.q}
                </summary>
                <p className="mt-3 text-gray-700">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
          <div className="text-center mt-8">
            <button 
                onClick={() => router.push('/faq')}
                className="text-rose-600 hover:text-rose-700 font-semibold"
                >
                View All FAQs →
            </button>
          </div>
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
                <li><button onClick={() => router.push('/contact')} className="hover:text-white transition">Contact</button></li>
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