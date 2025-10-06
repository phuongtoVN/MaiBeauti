'use client';
import Footer from '@/components/Footer';
import { useState } from 'react';
import Header from '@/components/Header';
import { 
  Sparkles, 
  Search, 
  BookOpen, 
  Camera, 
  MessageSquare, 
  AlertTriangle,
  ShoppingBag,
  User,
  Package,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
  icon: any;
}

const articles: Article[] = [
  // Getting Started
  {
    id: 'first-analysis',
    category: 'Getting Started',
    title: 'How to Take Your First Skin Analysis',
    description: 'Step-by-step guide to getting accurate results',
    icon: Camera,
    content: `
      <h3>Step 1: Prepare Your Environment</h3>
      <p>For the most accurate analysis, find a well-lit area. Natural daylight from a window works best. Avoid harsh overhead lights or direct sunlight.</p>
      
      <h3>Step 2: Prepare Your Face</h3>
      <ul>
        <li>Remove all makeup if possible</li>
        <li>Cleanse your face gently</li>
        <li>Pat dry and wait 5 minutes</li>
        <li>Remove glasses and pull hair back</li>
      </ul>
      
      <h3>Step 3: Take Your Photo</h3>
      <p>Click "Take Selfie" or "Upload Photo" on the analysis page. Face the camera directly with your entire face visible in frame. Keep a neutral expression and ensure even lighting across your face.</p>
      
      <h3>Step 4: Review Results</h3>
      <p>Your analysis will complete in 30 seconds. Review your skin quality score, identified concerns, and personalized recommendations.</p>
      
      <h3>Tips for Best Results:</h3>
      <ul>
        <li>Use the front-facing camera for better framing</li>
        <li>Take photos at the same time of day for tracking progress</li>
        <li>Avoid filters or beauty modes</li>
        <li>Ensure your face fills at least 60% of the frame</li>
      </ul>
    `
  },
  {
    id: 'understanding-results',
    category: 'Getting Started',
    title: 'Understanding Your Analysis Results',
    description: 'What each metric means and how to interpret your score',
    icon: BookOpen,
    content: `
      <h3>Your Skin Quality Score</h3>
      <p>This is an overall assessment from 0-100 based on multiple factors:</p>
      <ul>
        <li><strong>80-100 (Excellent):</strong> Minimal concerns, maintain current routine</li>
        <li><strong>60-79 (Good):</strong> Minor issues, simple improvements needed</li>
        <li><strong>40-59 (Fair):</strong> Several concerns, targeted treatment recommended</li>
        <li><strong>0-39 (Needs Attention):</strong> Multiple issues, comprehensive routine needed</li>
      </ul>
      
      <h3>Individual Metrics</h3>
      <p><strong>Acne Level:</strong> Measures severity and distribution of breakouts, inflammation, and congestion.</p>
      <p><strong>Dark Circles:</strong> Assesses under-eye discoloration and puffiness.</p>
      <p><strong>Pore Size:</strong> Evaluates enlarged pores, typically in T-zone areas.</p>
      <p><strong>Wrinkle Level:</strong> Detects fine lines and deeper wrinkles around eyes, forehead, and mouth.</p>
      
      <h3>Skin Type Classification</h3>
      <ul>
        <li><strong>Oily:</strong> Excess sebum production, prone to shine</li>
        <li><strong>Dry:</strong> Low moisture, may feel tight or flaky</li>
        <li><strong>Combination:</strong> Oily T-zone with dry cheeks</li>
        <li><strong>Normal:</strong> Balanced, minimal concerns</li>
      </ul>
      
      <h3>Your Concerns List</h3>
      <p>These are prioritized issues identified by our AI. Start addressing the top 2-3 concerns first before tackling others.</p>
    `
  },
  {
    id: 'create-account',
    category: 'Getting Started',
    title: 'Creating and Managing Your Account',
    description: 'Save your results and track progress over time',
    icon: User,
    content: `
      <h3>Why Create an Account?</h3>
      <ul>
        <li>Save unlimited skin analyses</li>
        <li>Track improvements over time with progress charts</li>
        <li>Access your results from any device</li>
        <li>Save favorite products and routines</li>
        <li>Receive personalized skincare tips</li>
      </ul>
      
      <h3>How to Sign Up</h3>
      <p>After completing your first analysis, click "Save Results" or "Create Account" at the top of the page. You'll need:</p>
      <ul>
        <li>Email address</li>
        <li>Password (minimum 8 characters)</li>
        <li>Optional: Name and birthday for age-specific recommendations</li>
      </ul>
      
      <h3>Managing Your Profile</h3>
      <p>Click your profile icon in the top-right corner to:</p>
      <ul>
        <li>Update personal information</li>
        <li>View analysis history</li>
        <li>Manage email preferences</li>
        <li>Change password</li>
        <li>Delete account (if needed)</li>
      </ul>
      
      <h3>Privacy & Security</h3>
      <p>Your account is protected with industry-standard encryption. We never share your personal data or photos with third parties.</p>
    `
  },

  // Using the AI Consultant
  {
    id: 'ai-chat',
    category: 'AI Consultant',
    title: 'How to Chat with the AI Dermatologist',
    description: 'Get personalized skincare advice through conversation',
    icon: MessageSquare,
    content: `
      <h3>What is the AI Consultant?</h3>
      <p>Our AI Dermatologist is a conversational chatbot trained on dermatological research and skincare science. It provides personalized product recommendations based on your analysis results.</p>
      
      <h3>How to Use the Chat</h3>
      <ol>
        <li>Find the chat window on your results page (right sidebar on desktop, bottom button on mobile)</li>
        <li>Click on suggested questions or type your own</li>
        <li>The AI will respond with personalized advice and product recommendations</li>
        <li>Continue asking follow-up questions to refine recommendations</li>
      </ol>
      
      <h3>Example Questions to Ask</h3>
      <ul>
        <li>"What products should I use for my acne?"</li>
        <li>"How can I reduce wrinkles around my eyes?"</li>
        <li>"Is this routine suitable for sensitive skin?"</li>
        <li>"What ingredients should I look for/avoid?"</li>
        <li>"Can I use these products while pregnant?"</li>
      </ul>
      
      <h3>Tips for Better Responses</h3>
      <ul>
        <li>Be specific about your concerns and preferences</li>
        <li>Mention any skin sensitivities or allergies</li>
        <li>Ask about product compatibility with your current routine</li>
        <li>Request budget-friendly or luxury alternatives</li>
      </ul>
      
      <h3>Important Note</h3>
      <p>While our AI is highly trained, it's not a replacement for professional medical advice. For persistent skin conditions or medical concerns, consult a licensed dermatologist.</p>
    `
  },
  {
    id: 'product-recommendations',
    category: 'AI Consultant',
    title: 'Getting Personalized Product Recommendations',
    description: 'How the AI matches products to your skin needs',
    icon: ShoppingBag,
    content: `
      <h3>How Recommendations Work</h3>
      <p>Our AI analyzes your skin assessment and matches you with products based on:</p>
      <ul>
        <li>Your specific skin concerns and severity</li>
        <li>Skin type (oily, dry, combination, normal)</li>
        <li>Ingredient efficacy for your issues</li>
        <li>Product reviews from users with similar skin</li>
        <li>Dermatological research and clinical studies</li>
      </ul>
      
      <h3>Types of Recommendations</h3>
      <p><strong>Individual Products:</strong> Targeted treatments for specific concerns (acne serum, eye cream, etc.)</p>
      <p><strong>Complete Kits:</strong> Full morning and evening routines addressing all your concerns at once</p>
      <p><strong>Alternatives:</strong> Budget-friendly or luxury options for the same concern</p>
      
      <h3>Customizing Recommendations</h3>
      <p>Tell the AI about your preferences:</p>
      <ul>
        <li>Budget range</li>
        <li>Cruelty-free/vegan requirements</li>
        <li>Ingredient preferences or sensitivities</li>
        <li>Brand preferences</li>
        <li>Fragrance-free options</li>
      </ul>
      
      <h3>Understanding Product Details</h3>
      <p>Each recommended product shows:</p>
      <ul>
        <li><strong>Why it's recommended:</strong> How it addresses your specific concern</li>
        <li><strong>Key ingredients:</strong> Active components and their benefits</li>
        <li><strong>How to use:</strong> Application instructions</li>
        <li><strong>Expected results:</strong> Timeline for seeing improvement</li>
      </ul>
    `
  },

  // Troubleshooting
  {
    id: 'camera-issues',
    category: 'Troubleshooting',
    title: 'Camera Won\'t Start or Shows Black Screen',
    description: 'Fix camera permission and display issues',
    icon: Camera,
    content: `
      <h3>Common Causes</h3>
      <ul>
        <li>Camera permissions not granted</li>
        <li>Camera already in use by another app</li>
        <li>Browser doesn't support camera access</li>
        <li>Device privacy settings blocking access</li>
      </ul>
      
      <h3>Solution 1: Check Browser Permissions</h3>
      <p><strong>Chrome/Edge:</strong></p>
      <ol>
        <li>Click the lock icon in the address bar</li>
        <li>Find "Camera" in the permissions list</li>
        <li>Set to "Allow"</li>
        <li>Refresh the page</li>
      </ol>
      
      <p><strong>Safari:</strong></p>
      <ol>
        <li>Safari menu → Preferences → Websites</li>
        <li>Click "Camera" in the left sidebar</li>
        <li>Find maibeauti.com and set to "Allow"</li>
        <li>Refresh the page</li>
      </ol>
      
      <h3>Solution 2: Close Other Apps</h3>
      <p>If another application is using your camera (Zoom, Skype, etc.), close it completely and try again.</p>
      
      <h3>Solution 3: Try a Different Browser</h3>
      <p>MaiBeauti works best on the latest versions of Chrome, Safari, Firefox, and Edge. Update your browser or try a different one.</p>
      
      <h3>Solution 4: Check Device Settings</h3>
      <p><strong>Windows:</strong> Settings → Privacy → Camera → Allow apps to access camera</p>
      <p><strong>Mac:</strong> System Preferences → Security & Privacy → Camera → Check the box for your browser</p>
      
      <h3>Still Not Working?</h3>
      <p>Use the "Upload Photo" option instead and take a selfie with your phone's camera app, then upload it.</p>
    `
  },
  {
    id: 'upload-errors',
    category: 'Troubleshooting',
    title: 'Photo Upload Fails or Shows Error',
    description: 'Resolve image upload and format issues',
    icon: AlertTriangle,
    content: `
      <h3>File Size Issues</h3>
      <p>Maximum file size is 5MB. If your photo is too large:</p>
      <ul>
        <li>Use your phone's built-in photo editor to resize</li>
        <li>Reduce image quality in camera settings</li>
        <li>Use a free online image compressor</li>
      </ul>
      
      <h3>File Format Issues</h3>
      <p>Supported formats: JPG, JPEG, PNG. If you have a different format:</p>
      <ul>
        <li>Take a new photo with your camera (saves as JPG automatically)</li>
        <li>Use an image converter tool to change the format</li>
        <li>Screenshot the image and save (creates PNG)</li>
      </ul>
      
      <h3>Network Issues</h3>
      <p>If upload is slow or fails:</p>
      <ul>
        <li>Check your internet connection</li>
        <li>Try a different WiFi network or use mobile data</li>
        <li>Disable VPN temporarily</li>
        <li>Clear browser cache and try again</li>
      </ul>
      
      <h3>Browser Issues</h3>
      <ol>
        <li>Clear your browser cache and cookies</li>
        <li>Disable browser extensions temporarily</li>
        <li>Try incognito/private browsing mode</li>
        <li>Update your browser to the latest version</li>
      </ol>
      
      <h3>Error: "Invalid Image Format"</h3>
      <p>This means the file is corrupted or not a real image. Take a fresh photo with your camera app and try uploading again.</p>
    `
  },
  {
    id: 'analysis-failed',
    category: 'Troubleshooting',
    title: 'Analysis Failed - No Face Detected',
    description: 'What to do when the AI can\'t analyze your photo',
    icon: AlertTriangle,
    content: `
      <h3>Why This Happens</h3>
      <p>The AI needs to detect your face clearly to perform analysis. Common issues:</p>
      <ul>
        <li>Face is too small or too far from camera</li>
        <li>Photo is too dark or overexposed</li>
        <li>Face is partially obscured (hair, hands, mask)</li>
        <li>Photo is blurry or out of focus</li>
        <li>Face is at an extreme angle</li>
      </ul>
      
      <h3>How to Fix It</h3>
      <h4>Lighting</h4>
      <p>Face a window with natural daylight. Avoid shadows on one side of your face. Don't take photos in direct sunlight (too bright) or in dark rooms.</p>
      
      <h4>Framing</h4>
      <p>Your face should fill 60-80% of the frame. Get closer to the camera if your face appears small in the preview.</p>
      
      <h4>Clarity</h4>
      <p>Hold your phone steady or rest it on a surface. Clean your camera lens. Ensure the image is in focus before taking the photo.</p>
      
      <h4>Positioning</h4>
      <p>Face the camera directly (not from an angle). Pull hair away from your face. Remove glasses and accessories.</p>
      
      <h3>Best Practices</h3>
      <ol>
        <li>Stand near a window during daytime</li>
        <li>Use your phone's front camera</li>
        <li>Face the camera straight-on</li>
        <li>Ensure entire face is visible</li>
        <li>Keep a neutral expression</li>
        <li>Make sure image is sharp and clear</li>
      </ol>
    `
  },

  // Products & Orders
  {
    id: 'shopping-guide',
    category: 'Products & Orders',
    title: 'How to Shop Recommended Products',
    description: 'Adding products to cart and checking out',
    icon: ShoppingBag,
    content: `
      <h3>Browsing Products</h3>
      <p>After your analysis, you'll see personalized product recommendations. Each product card shows:</p>
      <ul>
        <li>Product name and image</li>
        <li>Why it's recommended for you</li>
        <li>Price and any current discounts</li>
        <li>Star rating and review count</li>
        <li>"Add to Cart" button</li>
      </ul>
      
      <h3>Adding to Cart</h3>
      <ol>
        <li>Click "Add to Cart" on any product</li>
        <li>Or add a complete kit with one click</li>
        <li>Cart icon in top-right shows item count</li>
        <li>Continue shopping or proceed to checkout</li>
      </ol>
      
      <h3>Viewing Your Cart</h3>
      <p>Click the cart icon to review items. You can:</p>
      <ul>
        <li>Adjust quantities</li>
        <li>Remove items</li>
        <li>See order total</li>
        <li>Apply promo codes</li>
      </ul>
      
      <h3>Checkout Process</h3>
      <ol>
        <li><strong>Shipping:</strong> Enter delivery address</li>
        <li><strong>Payment:</strong> Add card or use Apple/Google Pay</li>
        <li><strong>Review:</strong> Confirm order details</li>
        <li><strong>Complete:</strong> Receive confirmation email</li>
      </ol>
      
      <h3>Discounts & Offers</h3>
      <ul>
        <li>15% off first purchase (applied automatically)</li>
        <li>20% off complete kits</li>
        <li>Free shipping on orders $50+</li>
        <li>Enter promo codes at checkout</li>
      </ul>
      
      <h3>Guest Checkout</h3>
      <p>You don't need an account to purchase. However, creating one lets you track orders and save payment information for faster future checkouts.</p>
    `
  },
  {
    id: 'order-tracking',
    category: 'Products & Orders',
    title: 'Tracking Your Order',
    description: 'Monitor shipping status and delivery',
    icon: Package,
    content: `
      <h3>Order Confirmation</h3>
      <p>Immediately after placing your order, you'll receive an email with:</p>
      <ul>
        <li>Order number</li>
        <li>Items purchased</li>
        <li>Total amount charged</li>
        <li>Estimated delivery date</li>
      </ul>
      
      <h3>Shipping Notification</h3>
      <p>When your order ships (usually within 1-2 business days), you'll receive another email with:</p>
      <ul>
        <li>Tracking number</li>
        <li>Carrier name (USPS, UPS, FedEx, etc.)</li>
        <li>Link to track package</li>
        <li>Expected delivery date</li>
      </ul>
      
      <h3>Tracking Your Package</h3>
      <ol>
        <li>Click the tracking link in your shipping email</li>
        <li>Or visit your account → Orders → View Details</li>
        <li>Enter tracking number on carrier website</li>
        <li>See real-time location and status</li>
      </ol>
      
      <h3>Delivery Times</h3>
      <ul>
        <li><strong>Standard:</strong> 5-7 business days</li>
        <li><strong>Express:</strong> 2-3 business days</li>
        <li><strong>International:</strong> 10-14 business days</li>
      </ul>
      
      <h3>Package Not Arrived?</h3>
      <p>If your order is delayed:</p>
      <ol>
        <li>Check tracking for latest update</li>
        <li>Verify delivery address in order confirmation</li>
        <li>Check with neighbors or building management</li>
        <li>Contact carrier directly with tracking number</li>
        <li>If still missing after expected delivery date, contact our support</li>
      </ol>
      
      <h3>Lost or Stolen Packages</h3>
      <p>If tracking shows "delivered" but you didn't receive it:</p>
      <ul>
        <li>File a claim with the carrier</li>
        <li>Contact our support team</li>
        <li>We'll investigate and arrange a replacement or refund</li>
      </ul>
    `
  },

  // Account & Billing
  {
    id: 'payment-methods',
    category: 'Account & Billing',
    title: 'Managing Payment Methods',
    description: 'Add, update, or remove payment information',
    icon: User,
    content: `
      <h3>Accepted Payment Methods</h3>
      <ul>
        <li>Credit/Debit Cards (Visa, Mastercard, American Express, Discover)</li>
        <li>Apple Pay</li>
        <li>Google Pay</li>
        <li>PayPal (coming soon)</li>
      </ul>
      
      <h3>Adding a Payment Method</h3>
      <ol>
        <li>Go to Account → Payment Methods</li>
        <li>Click "Add New Card"</li>
        <li>Enter card number, expiry date, CVV</li>
        <li>Add billing address</li>
        <li>Optionally set as default payment method</li>
        <li>Click "Save"</li>
      </ol>
      
      <h3>Security</h3>
      <p>We use Stripe for secure payment processing. Your card information is encrypted and never stored on our servers. We only store the last 4 digits for order confirmation.</p>
      
      <h3>Updating Payment Information</h3>
      <p>To update expiry date or billing address:</p>
      <ol>
        <li>Go to Account → Payment Methods</li>
        <li>Click "Edit" on the card</li>
        <li>Update information</li>
        <li>Click "Save Changes"</li>
      </ol>
      
      <h3>Removing a Payment Method</h3>
      <ol>
        <li>Go to Account → Payment Methods</li>
        <li>Click "Remove" on the card you want to delete</li>
        <li>Confirm deletion</li>
      </ol>
      
      <h3>Declined Payments</h3>
      <p>If your payment is declined:</p>
      <ul>
        <li>Verify card number and expiry date are correct</li>
        <li>Check with your bank about transaction limits</li>
        <li>Ensure billing address matches your bank records</li>
        <li>Try a different card</li>
        <li>Contact your bank if issues persist</li>
      </ul>
    `
  },
  {
    id: 'delete-account',
    category: 'Account & Billing',
    title: 'Deleting Your Account',
    description: 'How to permanently remove your account and data',
    icon: User,
    content: `
      <h3>Before You Delete</h3>
      <p>Please note that deleting your account will:</p>
      <ul>
        <li>Permanently erase all saved analyses</li>
        <li>Remove your order history (but not cancel pending orders)</li>
        <li>Delete saved payment methods</li>
        <li>Unsubscribe you from all emails</li>
        <li>Remove your profile and preferences</li>
      </ul>
      
      <h3>What Happens to Orders</h3>
      <p>Active orders will still be processed and shipped. To cancel pending orders, do so BEFORE deleting your account.</p>
      
      <h3>How to Delete Your Account</h3>
      <ol>
        <li>Log in to your account</li>
        <li>Go to Account Settings</li>
        <li>Scroll to "Delete Account" section at bottom</li>
        <li>Click "Delete My Account"</li>
        <li>Confirm by entering your password</li>
        <li>Click "Permanently Delete"</li>
      </ol>
      
      <h3>Data Retention</h3>
      <p>For legal and financial record-keeping, we retain:</p>
      <ul>
        <li>Order receipts and transaction records (7 years)</li>
        <li>Anonymized data for improving our AI (no photos or personal info)</li>
      </ul>
      
      <h3>Changed Your Mind?</h3>
      <p>You have 30 days to recover your account after deletion. Contact support with your registered email to restore it. After 30 days, deletion is permanent.</p>
      
      <h3>Alternative: Temporary Deactivation</h3>
      <p>If you're not ready to permanently delete, you can deactivate your account instead. This:</p>
      <ul>
        <li>Hides your profile</li>
        <li>Stops all emails</li>
        <li>Preserves your data</li>
        <li>Can be reversed anytime</li>
      </ul>
    `
  },

  // Shipping & Returns
  {
    id: 'return-process',
    category: 'Shipping & Returns',
    title: 'How to Return Products',
    description: 'Step-by-step return and refund process',
    icon: Package,
    content: `
      <h3>Our Return Policy</h3>
      <p>60-day money-back guarantee. If you're not satisfied, return products within 60 days for a full refund.</p>
      
      <h3>Return Requirements</h3>
      <ul>
        <li>Products must be at least 50% full</li>
        <li>Include original packaging if possible</li>
        <li>Return within 60 days of delivery</li>
        <li>Items must be in sellable condition</li>
      </ul>
      
      <h3>How to Initiate a Return</h3>
      <ol>
        <li>Contact support at support@maibeauti.com</li>
        <li>Include order number and items to return</li>
        <li>Explain reason for return (helps us improve)</li>
        <li>We'll email you a prepaid return label within 24 hours</li>
      </ol>
      
      <h3>Packing Your Return</h3>
      <ol>
        <li>Place items in a box or padded envelope</li>
        <li>Print and attach the return label</li>
        <li>Drop off at USPS, UPS, or FedEx location</li>
        <li>Keep tracking number for your records</li>
      </ol>
      
      <h3>Refund Timeline</h3>
      <ul>
        <li><strong>Processing:</strong> We inspect returns within 2 business days of arrival</li>
        <li><strong>Refund issued:</strong> 1 business day after approval</li>
        <li><strong>Appears in account:</strong> 5-7 business days depending on your bank</li>
      </ul>
      
      <h3>Refund Method</h3>
      <p>Refunds are issued to the original payment method. If paid by card, the refund goes back to that card. If paid by PayPal, refunded to your PayPal account.</p>
      
      <h3>Exchanges</h3>
      <p>We currently don't offer direct exchanges. Return the unwanted item for a refund, then place a new order for the product you want.</p>
      
      <h3>Questions About Your Return?</h3>
      <p>Contact support at support@maibeauti.com with your return tracking number and we'll help you track its status.</p>
    `
  }
];

export default function HelpCenterPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(articles.map(article => article.category)))];

  // Filter articles based on search and category
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group articles by category for display
  const groupedArticles = filteredArticles.reduce((acc, article) => {
    if (!acc[article.category]) {
      acc[article.category] = [];
    }
    acc[article.category].push(article);
    return acc;
  }, {} as Record<string, Article[]>);

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      'Getting Started': BookOpen,
      'AI Consultant': MessageSquare,
      'Troubleshooting': AlertTriangle,
      'Products & Orders': ShoppingBag,
      'Account & Billing': User,
      'Shipping & Returns': Package
    };
    return icons[category] || BookOpen;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      {/* Navigation */}
      <Header />

      {selectedArticle ? (
        // Article View
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => setSelectedArticle(null)}
            className="flex items-center space-x-2 text-rose-600 hover:text-rose-700 font-semibold mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Help Center</span>
          </button>

          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                <selectedArticle.icon className="w-6 h-6 text-rose-600" />
              </div>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
                {selectedArticle.category}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {selectedArticle.title}
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              {selectedArticle.description}
            </p>

            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
              style={{
                lineHeight: '1.8'
              }}
            />

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-600 mb-4">Was this article helpful?</p>
              <div className="flex space-x-4">
                <button className="px-6 py-2 border-2 border-gray-300 rounded-full hover:border-green-500 hover:text-green-600 transition">
                  👍 Yes
                </button>
                <button className="px-6 py-2 border-2 border-gray-300 rounded-full hover:border-red-500 hover:text-red-600 transition">
                  👎 No
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-br from-rose-50 to-purple-50 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Still need help?
            </h3>
            <p className="text-gray-600 mb-4">
              Our support team is here to assist you.
            </p>
            <button
              onClick={() => router.push('/contact')}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition"
            >
              Contact Support
            </button>
          </div>
        </div>
      ) : (
        // Help Center Overview
        <>
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-rose-500 to-purple-600 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                How can we help you?
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
                Search our knowledge base for guides, tutorials, and answers
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for help..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-16 pr-6 py-5 rounded-full text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-white/30"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Category Filter */}
          <section className="py-8 bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2 rounded-full font-semibold transition ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Articles Grid */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {Object.keys(groupedArticles).length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No articles found matching your search.</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                    }}
                    className="mt-4 text-rose-600 hover:text-rose-700 font-semibold"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="space-y-12">
                  {Object.entries(groupedArticles).map(([category, categoryArticles]) => {
                    const Icon = getCategoryIcon(category);
                    return (
                      <div key={category}>
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-rose-600" />
                          </div>
                          <h2 className="text-2xl font-bold text-gray-900">{category}</h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {categoryArticles.map((article) => (
                            <button
                              key={article.id}
                              onClick={() => setSelectedArticle(article)}
                              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition text-left group"
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <article.icon className="w-6 h-6 text-rose-600" />
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-rose-500 transition" />
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-rose-600 transition">
                                {article.title}
                              </h3>
                              <p className="text-gray-600 text-sm">
                                {article.description}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Contact CTA */}
          <section className="py-16 bg-white border-t border-gray-200">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Can't find what you're looking for?
              </h2>
              <p className="text-gray-600 mb-8">
                Our support team is ready to help you with any questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/contact')}
                  className="px-8 py-4 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition"
                >
                  Contact Support
                </button>
                <button
                  onClick={() => router.push('/faq')}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:border-rose-500 hover:text-rose-600 transition"
                >
                  View FAQs
                </button>
              </div>
            </div>
          </section>
        </>
      )}

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
                <li><button onClick={() => router.push('/help')} className="hover:text-white transition">Help Center</button></li>
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