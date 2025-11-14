'use client';

import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import Header from '@/components/Header';
export default function ShippingInfo() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      {/* Navigation */}
      <Header />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Shipping Information</h1>
        <p className="text-gray-500 mb-12">Last Updated: October 6, 2025</p>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-6">
            At MaiBeauti, we're committed to delivering your personalized skincare products safely and efficiently. Here's everything you need to know about our shipping process.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">1. Processing Time</h2>
          <p className="text-gray-700 mb-6">
            Orders are typically processed within 1-2 business days. During peak seasons or promotional periods, processing may take up to 3-5 business days.
          </p>
          
          <div className="bg-rose-50 border-l-4 border-rose-500 p-6 my-6 rounded-r-lg">
            <p className="text-gray-800">
              <strong className="text-rose-600">Please note:</strong> Orders placed after 2 PM EST will be processed the next business day. We do not process orders on weekends or holidays.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">2. Shipping Methods & Rates</h2>
          <p className="text-gray-700 mb-6">We offer several shipping options to meet your needs:</p>

          <div className="overflow-hidden rounded-xl shadow-lg my-8">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-rose-500 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Shipping Method</th>
                  <th className="px-6 py-4 text-left font-semibold">Delivery Time</th>
                  <th className="px-6 py-4 text-left font-semibold">Cost</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-gray-700">Standard Shipping</td>
                  <td className="px-6 py-4 text-gray-700">5-7 business days</td>
                  <td className="px-6 py-4 text-gray-700">$5.99 (FREE on orders over $50)</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-gray-700">Express Shipping</td>
                  <td className="px-6 py-4 text-gray-700">2-3 business days</td>
                  <td className="px-6 py-4 text-gray-700">$12.99</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-gray-700">Next Day Air</td>
                  <td className="px-6 py-4 text-gray-700">1 business day</td>
                  <td className="px-6 py-4 text-gray-700">$24.99</td>
                </tr>
                <tr className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-gray-700">International Shipping</td>
                  <td className="px-6 py-4 text-gray-700">7-21 business days</td>
                  <td className="px-6 py-4 text-gray-700">Calculated at checkout</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">3. Free Shipping</h2>
          <p className="text-gray-700 mb-6">
            Enjoy FREE standard shipping on all orders over $50 within the continental United States!
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">4. International Shipping</h2>
          <p className="text-gray-700 mb-4">We ship to over 50 countries worldwide. International shipping rates are calculated based on:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li>Destination country</li>
            <li>Package weight and dimensions</li>
            <li>Selected shipping method</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">International Customers Please Note:</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li><strong>Customs & Duties:</strong> You may be responsible for customs fees, import duties, and taxes imposed by your country</li>
            <li><strong>Delivery Time:</strong> International orders may take longer due to customs clearance</li>
            <li><strong>Address Accuracy:</strong> Ensure your shipping address is complete and accurate to avoid delays</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">5. Order Tracking</h2>
          <p className="text-gray-700 mb-4">Once your order ships, you'll receive:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li>Shipping confirmation email with tracking number</li>
            <li>Real-time tracking updates via email and SMS (if enabled)</li>
            <li>Access to tracking through your MaiBeauti account dashboard</li>
          </ul>

          <div className="bg-rose-50 border-l-4 border-rose-500 p-6 my-6 rounded-r-lg">
            <p className="text-gray-800">
              <strong className="text-rose-600">Track Your Order:</strong> Log into your account and visit the "Order History" section to view real-time tracking information.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">6. Shipping Restrictions</h2>
          <p className="text-gray-700 mb-4">Currently, we cannot ship to:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li>PO Boxes or APO/FPO addresses</li>
            <li>Countries with import restrictions on cosmetic products</li>
            <li>Areas with shipping embargoes</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">7. Package Protection</h2>
          <p className="text-gray-700 mb-4">All orders are carefully packaged to ensure your products arrive in perfect condition. We use:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li>Protective cushioning materials</li>
            <li>Temperature-controlled packaging for sensitive products</li>
            <li>Eco-friendly, recyclable materials whenever possible</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">8. Delivery Issues</h2>
          
          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">Lost or Stolen Packages</h3>
          <p className="text-gray-700 mb-4">If your package is marked as delivered but you haven't received it:</p>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-6">
            <li>Check with neighbors or building management</li>
            <li>Verify the shipping address in your order confirmation</li>
            <li>Wait 24-48 hours as packages are sometimes marked delivered early</li>
            <li>Contact us if the package doesn't arrive within 48 hours</li>
          </ol>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">Damaged Packages</h3>
          <p className="text-gray-700 mb-4">If your order arrives damaged:</p>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-6">
            <li>Take photos of the damaged package and products</li>
            <li>Contact us within 48 hours of delivery</li>
            <li>We'll arrange a replacement or refund</li>
          </ol>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">9. Address Changes</h2>
          <p className="text-gray-700 mb-4">Need to change your shipping address?</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li><strong>Before shipping:</strong> Contact us immediately to update the address</li>
            <li><strong>After shipping:</strong> Address changes may not be possible, but we'll do our best to assist</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">10. Holidays & Weather</h2>
          <p className="text-gray-700 mb-4">Shipping times may be affected by:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li>Major holidays and peak shopping seasons</li>
            <li>Severe weather conditions</li>
            <li>Carrier delays beyond our control</li>
          </ul>
          <p className="text-gray-700 mb-6">We'll keep you informed of any delays affecting your order.</p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">11. Subscription Orders</h2>
          <p className="text-gray-700 mb-4">If you're enrolled in our subscription service:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li>Your orders ship automatically based on your selected frequency</li>
            <li>You'll receive a reminder email 3 days before each shipment</li>
            <li>Shipping is always FREE for subscription orders</li>
            <li>You can modify or pause your subscription anytime</li>
          </ul>

          <div className="bg-rose-50 rounded-2xl p-8 mt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Questions About Shipping?</h2>
            <p className="text-gray-700 mb-4">
              Our customer service team is here to help!
            </p>
            <p className="text-gray-700">
              <strong>Email:</strong> <a href="mailto:shipping@maibeauti.com" className="text-rose-600 hover:text-rose-700">shipping@maibeauti.com</a><br />
              <strong>Phone:</strong> +1 (555) 123-4567<br />
              <strong>Live Chat:</strong> Available Mon-Fri, 9 AM - 6 PM EST<br />
              <strong>Help Center:</strong> <button onClick={() => router.push('/faq')} className="text-rose-600 hover:text-rose-700 underline">Visit our FAQ section</button>
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