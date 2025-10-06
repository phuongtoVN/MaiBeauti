'use client';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { Sparkles, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  // Skin Analysis
  {
    category: 'Skin Analysis',
    question: 'How long does the skin analysis take?',
    answer: 'Our AI analysis typically completes in under 30 seconds after you upload your photo. You\'ll receive instant results with detailed insights about your skin quality, concerns, and personalized product recommendations.'
  },
  {
    category: 'Skin Analysis',
    question: 'How accurate is the AI skin analysis?',
    answer: 'Our AI is trained on millions of skin images and validated against professional dermatological assessments. It analyzes over 50 skin attributes with dermatology-grade accuracy. However, for medical concerns, we always recommend consulting with a licensed dermatologist.'
  },
  {
    category: 'Skin Analysis',
    question: 'What should I do before taking my selfie?',
    answer: 'For best results: use natural lighting (face a window), remove makeup if possible, face the camera directly, and ensure your full face is visible. Avoid harsh overhead lights or direct sunlight, as these can affect the analysis.'
  },
  {
    category: 'Skin Analysis',
    question: 'Can I analyze my skin multiple times?',
    answer: 'Yes! We recommend analyzing your skin every 4-6 weeks to track improvements and adjust your routine as needed. With an account, you can save and compare your results over time.'
  },
  {
    category: 'Skin Analysis',
    question: 'What skin concerns can the AI detect?',
    answer: 'Our AI detects acne, dark circles, enlarged pores, wrinkles, fine lines, skin texture, dryness, oiliness, and more. It also identifies your skin type (oily, dry, combination, or normal) to provide personalized recommendations.'
  },
  
  // Privacy & Security
  {
    category: 'Privacy & Security',
    question: 'Is my photo data secure?',
    answer: 'Absolutely. All photos are encrypted during upload and processing. We use industry-standard security protocols and never share your data with third parties. Your privacy is our top priority, and you can delete your data at any time.'
  },
  {
    category: 'Privacy & Security',
    question: 'Do you store my photos?',
    answer: 'Photos are temporarily stored only for analysis purposes and to allow you to view your results. If you create an account, photos are saved so you can track progress over time. You can delete them anytime from your dashboard.'
  },
  {
    category: 'Privacy & Security',
    question: 'Who has access to my skin analysis results?',
    answer: 'Only you have access to your results. Our team cannot view your individual analysis or photos. All data is anonymized for improving our AI models, and you can opt out at any time.'
  },
  
  // Products & Recommendations
  {
    category: 'Products & Recommendations',
    question: 'How are products recommended?',
    answer: 'Our AI matches your unique skin profile with products proven to work for similar skin types and concerns. Recommendations are based on ingredient efficacy, dermatological research, user reviews, and your specific analysis results.'
  },
  {
    category: 'Products & Recommendations',
    question: 'Can I customize my product recommendations?',
    answer: 'Yes! You can filter by budget, brand preferences, ingredient preferences (like cruelty-free or vegan), and specific concerns. Our AI chat can also help you find alternatives based on your needs.'
  },
  {
    category: 'Products & Recommendations',
    question: 'Are the recommended products suitable for sensitive skin?',
    answer: 'We offer options for all skin sensitivities. During your analysis or in the chat, let us know if you have sensitive skin, and we\'ll recommend gentle, hypoallergenic products. Always patch test new products first.'
  },
  {
    category: 'Products & Recommendations',
    question: 'How long until I see results from the recommended products?',
    answer: 'Most users notice improvements within 2-4 weeks of consistent use. However, results vary based on your skin concerns and the products used. More significant issues like deep wrinkles or severe acne may take 6-12 weeks.'
  },
  {
    category: 'Products & Recommendations',
    question: 'Can I use these products with my current routine?',
    answer: 'Our AI chat can help assess compatibility with your existing products. Generally, we recommend introducing new products one at a time and waiting 1-2 weeks before adding another to monitor how your skin responds.'
  },
  
  // Orders & Shipping
  {
    category: 'Orders & Shipping',
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 5-7 business days. Express shipping (2-3 days) is available at checkout. International orders typically arrive within 10-14 business days. You\'ll receive tracking information once your order ships.'
  },
  {
    category: 'Orders & Shipping',
    question: 'Do you offer free shipping?',
    answer: 'Yes! We offer free standard shipping on orders over $50. Complete skincare kits automatically qualify for free shipping.'
  },
  {
    category: 'Orders & Shipping',
    question: 'Can I track my order?',
    answer: 'Absolutely. Once your order ships, you\'ll receive an email with tracking information. You can also track your order from your account dashboard.'
  },
  {
    category: 'Orders & Shipping',
    question: 'Do you ship internationally?',
    answer: 'Yes, we currently ship to most countries. Shipping rates and delivery times vary by location. International orders may be subject to customs duties and taxes, which are the customer\'s responsibility.'
  },
  
  // Returns & Refunds
  {
    category: 'Returns & Refunds',
    question: 'What is your return policy?',
    answer: 'We offer a 60-day money-back guarantee. If you\'re not satisfied with your purchase, return it within 60 days for a full refund. Products must be at least 50% full to qualify for return.'
  },
  {
    category: 'Returns & Refunds',
    question: 'How do I return a product?',
    answer: 'Contact our support team at support@maibeauti.com to initiate a return. We\'ll provide you with a prepaid return label and instructions. Refunds are processed within 5-7 business days after we receive your return.'
  },
  {
    category: 'Returns & Refunds',
    question: 'What if a product causes irritation?',
    answer: 'Discontinue use immediately and contact us. We\'ll help you find a gentler alternative and process a full refund. Your skin health and safety are our top priorities.'
  },
  
  // Account & Technical
  {
    category: 'Account & Technical',
    question: 'Do I need an account to use MaiBeauti?',
    answer: 'No, you can get a free skin analysis without creating an account. However, an account lets you save results, track progress over time, save payment information, and receive personalized tips.'
  },
  {
    category: 'Account & Technical',
    question: 'How do I create an account?',
    answer: 'After your first analysis, you\'ll see an option to create an account. You can also sign up from our homepage. It takes less than a minute and only requires your email and a password.'
  },
  {
    category: 'Account & Technical',
    question: 'I forgot my password. What should I do?',
    answer: 'Click "Forgot Password" on the login page and enter your email. We\'ll send you a link to reset your password. If you don\'t receive the email, check your spam folder or contact support.'
  },
  {
    category: 'Account & Technical',
    question: 'The app isn\'t working properly. What should I do?',
    answer: 'Try refreshing the page, clearing your browser cache, or using a different browser. If issues persist, contact our support team with details about the problem, including screenshots if possible.'
  },
  {
    category: 'Account & Technical',
    question: 'Which browsers are supported?',
    answer: 'MaiBeauti works best on the latest versions of Chrome, Safari, Firefox, and Edge. For the camera feature, you\'ll need to grant camera permissions in your browser settings.'
  },
  
  // Pricing & Discounts
  {
    category: 'Pricing & Discounts',
    question: 'Is the skin analysis free?',
    answer: 'Yes! Our AI skin analysis is completely free with no credit card required. You\'ll get detailed results, personalized recommendations, and access to our AI chat consultant at no cost.'
  },
  {
    category: 'Pricing & Discounts',
    question: 'Do you offer discounts?',
    answer: 'Yes! We offer: 15% off for first-time customers, 20% off complete skincare kits, seasonal promotions, and a referral program. Subscribe to our newsletter to get exclusive discount codes.'
  },
  {
    category: 'Pricing & Discounts',
    question: 'Can I get a refund if I find a better price elsewhere?',
    answer: 'We strive to offer competitive pricing. If you find an identical product at a lower price within 7 days of purchase, contact us and we\'ll match the price or refund the difference.'
  }
];

export default function FAQPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(faqs.map(faq => faq.category)))];

  // Filter FAQs based on search and category
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-rose-500 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Find answers to common questions about MaiBeauti, our AI skin analysis, and products.
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-full focus:border-rose-500 focus:ring-0 transition"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <p className="text-gray-600 mb-6">
            {filteredFAQs.length} {filteredFAQs.length === 1 ? 'question' : 'questions'} found
          </p>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No questions found matching your search.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                  }}
                  className="mt-4 text-rose-600 hover:text-rose-700 font-semibold"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              filteredFAQs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left"
                  >
                    <div className="flex-1">
                      <span className="inline-block px-3 py-1 bg-rose-100 text-rose-700 text-xs font-semibold rounded-full mb-2">
                        {faq.category}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {faq.question}
                      </h3>
                    </div>
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                    )}
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-5 text-gray-700">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-8">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <button
            onClick={() => router.push('/contact')}
            className="px-8 py-4 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition"
          >
            Contact Support
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
                <li><button onClick={() => router.push('/contact')} className="hover:text-white transition">Contact</button></li>
                <li><button className="hover:text-white transition">Privacy Policy</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button onClick={() => router.push('/faq')} className="hover:text-white transition">FAQ</button></li>
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