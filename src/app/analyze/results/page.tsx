'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import ScoreGauge from '@/components/results/ScoreGauge';
import ConcernCard from '@/components/results/ConcernCard';
import ProductCarousel from '@/components/results/ProductCarousel';
import KitShowcase from '@/components/results/KitShowcase';
import BeforeAfterCard from '@/components/results/BeforeAfterCard';
import { mockAnalysisResults, mockTestimonials, AnalysisResult } from '@/lib/mockAnalysisData';
import { getRecommendedProducts, generatePersonalizedKit } from '@/lib/mockRecommendations';
import { useCartStore } from '@/store/cartStore';
import { useAnalysisStore } from '@/store/analysisStore';
import { useToastStore } from '@/store/toastStore';
import { MessageCircle, X, Sparkles } from 'lucide-react';

export default function AnalysisResultsPage() {
  const searchParams = useSearchParams();
  const analysisId = searchParams.get('id') || 'demo-1';
  
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [showChat, setShowChat] = useState(false);
  
  const { addItem, openCart, clearCart } = useCartStore();
  const { setCurrentAnalysis, setPersonalizedKit } = useAnalysisStore();
  const { addToast } = useToastStore();
  
  // Load analysis results - only runs when analysisId changes
  useEffect(() => {
    const result = mockAnalysisResults[analysisId] || mockAnalysisResults['demo-1'];
    setAnalysis(result);
    setCurrentAnalysis(result);
    
    // Generate and save kit immediately when analysis loads
    const kit = generatePersonalizedKit(result);
    setPersonalizedKit(kit);
  }, [analysisId, setCurrentAnalysis, setPersonalizedKit]);
  
  // NOW we can do conditional rendering
  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your skin...</p>
        </div>
      </div>
    );
  }
  
  // Generate products and kit after analysis is loaded
  const recommendedProducts = getRecommendedProducts(analysis, 5);
  const personalizedKit = generatePersonalizedKit(analysis);
  
  const handleAddToCart = (product: any) => {
    console.log('Results page: Adding to cart ->', product.name);
    console.log('Product object:', product);
    addItem(product);
    addToast(`Added ${product.name} to cart!`, 'success');
    console.log('Results page: Opening cart');
    openCart();
  };
  
  const handleGetKit = () => {
    // Add all kit products to cart
    clearCart(); // Clear existing cart first
    
    const allKitProducts = new Set([
      ...personalizedKit.morningRoutine.map(step => step.product),
      ...personalizedKit.eveningRoutine.map(step => step.product)
    ]);
    
    allKitProducts.forEach(product => {
      addItem(product);
    });
    
    addToast(`Added complete kit (${allKitProducts.size} products) to cart!`, 'success');
    openCart();
  };
  
  const handleFixConcern = (concernId: string) => {
    // Scroll to product recommendations
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Sparkles className="w-4 h-4" />
              Analysis Complete
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
                {analysis.userName ? `${analysis.userName}'s` : 'Your'} Skin Analysis
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We've identified your key concerns and created a personalized treatment plan
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Analyzed Photo */}
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={analysis.imageUrl}
                  alt="Your skin analysis"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4">
                <div className="text-sm text-gray-600 mb-1">Skin Type</div>
                <div className="text-xl font-bold text-gray-900">{analysis.skinType}</div>
              </div>
            </div>
            
            {/* Score Gauge */}
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Your Skin Quality Score
              </h2>
              <ScoreGauge score={analysis.skinQualityScore} size={250} strokeWidth={16} />
              <p className="text-gray-600 mt-6 text-center max-w-md">
                Based on our AI analysis, your skin shows potential for significant improvement with the right routine.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Concerns Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Your Primary Skin Concerns
            </h2>
            <p className="text-xl text-gray-600">
              Let's address these issues with targeted treatments
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analysis.primaryConcerns.map((concern) => (
              <ConcernCard
                key={concern.id}
                concern={concern}
                onFixClick={() => handleFixConcern(concern.id)}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Product Recommendations */}
      {recommendedProducts.length > 0 && (
        <section id="products-section" className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Your Personalized Product Recommendations
              </h2>
              <p className="text-xl text-gray-600">
                Hand-picked solutions based on your unique skin profile
              </p>
            </div>
            
            <ProductCarousel
              products={recommendedProducts}
              onAddToCart={handleAddToCart}
            />
          </div>
        </section>
      )}
      
      {/* Complete Kit Showcase */}
      {personalizedKit && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <KitShowcase
              kit={personalizedKit}
              onGetKit={handleGetKit}
            />
          </div>
        </section>
      )}
      
      {/* Social Proof - Before/After */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Real Results from Real People
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands who've transformed their skin with MaiBeauti
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockTestimonials.map((testimonial) => (
              <BeforeAfterCard
                key={testimonial.id}
                testimonial={testimonial}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      {personalizedKit && (
        <section className="py-20 px-4 bg-gradient-to-r from-rose-500 to-purple-600">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Skin?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Your personalized routine is waiting. Start your journey to healthier, more radiant skin today.
            </p>
            <button
              onClick={handleGetKit}
              className="px-12 py-5 bg-white text-rose-600 font-bold text-xl rounded-2xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Get My Complete Kit - ${personalizedKit.bundlePrice}
            </button>
            <p className="mt-6 text-sm opacity-75">
              ✓ 30-Day Money-Back Guarantee  ✓ Free Shipping Over $50  ✓ Expert Support
            </p>
          </div>
        </section>
      )}
      
      {/* Floating Chat Button (Mobile) */}
      <button
        onClick={() => setShowChat(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
      
      {/* Mobile Chat Modal */}
      {showChat && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Chat with Mai</h3>
              <button
                onClick={() => setShowChat(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 text-center">
                Chat functionality coming soon! For now, explore your personalized recommendations above.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}