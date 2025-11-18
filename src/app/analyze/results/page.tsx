'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import ScoreGauge from '@/components/results/ScoreGauge';
import ConcernCard from '@/components/results/ConcernCard';
import ProductCarousel from '@/components/results/ProductCarousel';
import KitShowcase from '@/components/results/KitShowcase';
import BeforeAfterCard from '@/components/results/BeforeAfterCard';
import { mockTestimonials, SkinConcern } from '@/lib/mockAnalysisData';
import { useCartStore } from '@/store/cartStore';
import { useAnalysisStore } from '@/store/analysisStore';
import { useToastStore } from '@/store/toastStore';
import { MessageCircle, X, Sparkles, Loader2, AlertCircle } from 'lucide-react';

// ✨ UPDATED: Real API Response Types with OPTIONAL severity scores
// This works with both old and new backend!
interface ApiAnalysisResult {
  id: string;
  skinScore: number;
  acneLevel: string;
  acneSeverity?: number;        // ← Optional (for new backend)
  poresLevel: string;
  poresSeverity?: number;       // ← Optional (for new backend)
  darkCirclesLevel: string;
  darkCirclesSeverity?: number; // ← Optional (for new backend)
  age: number;
  concerns: string[];
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  concerns: string[];
  rating: number;
  reviewCount: number;
  description: string;
}

interface RoutineStep {
  step: number;
  timeOfDay: 'morning' | 'evening';
  product: Product;
  instruction: string;
}

interface PersonalizedKit {
  morningRoutine: RoutineStep[];
  eveningRoutine: RoutineStep[];
  totalPrice: number;
  savings: number;
  bundlePrice: number;
}

export default function AnalysisResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const analysisId = searchParams.get('id');
  
  // State
  const [analysis, setAnalysis] = useState<ApiAnalysisResult | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [personalizedKit, setPersonalizedKitState] = useState<PersonalizedKit | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  
  // ✨ NEW: State for uploaded image
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  const { addItem, openCart, clearCart } = useCartStore();
  const { setCurrentAnalysis, setPersonalizedKit } = useAnalysisStore();
  const { addToast } = useToastStore();
  
  // Fetch Analysis Results from Real API
  useEffect(() => {
    if (!analysisId) {
      setError('No analysis ID provided');
      setLoading(false);
      return;
    }

    // ✨ NEW: Load uploaded image from localStorage
    console.log('🔍 Loading image from localStorage for analysis:', analysisId);
    const savedImage = localStorage.getItem(`analysis_image_${analysisId}`);
    if (savedImage) {
      setUploadedImage(savedImage);
      console.log('✅ Image loaded from localStorage');
    } else {
      console.warn('⚠️ No saved image found for analysis:', analysisId);
    }

    // Clean up old images (keep last 10)
    cleanupOldImages();

    fetchAnalysis();
    fetchRecommendations();
  }, [analysisId]);

  // ✨ NEW: Helper function to clean up old analysis images
  const cleanupOldImages = () => {
    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith('analysis_image_') && !key.includes('_timestamp')
      );
      
      if (keys.length > 10) {
        // Get timestamps and sort
        const imagesWithTimestamps = keys.map(key => {
          const timestampKey = `${key}_timestamp`;
          const timestamp = localStorage.getItem(timestampKey) || '';
          return { key, timestamp };
        }).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
        
        // Remove oldest images
        const toRemove = imagesWithTimestamps.slice(0, keys.length - 10);
        toRemove.forEach(({ key }) => {
          localStorage.removeItem(key);
          localStorage.removeItem(`${key}_timestamp`);
        });
        
        console.log('🧹 Cleaned up', toRemove.length, 'old analysis images');
      }
    } catch (err) {
      console.error('Error cleaning up old images:', err);
    }
  };

  // Generate kit when we have both analysis and products
  useEffect(() => {
    if (analysis && products.length > 0) {
      console.log('🎁 Generating kit with', products.length, 'products for concerns:', analysis.concerns);
      const kit = generateKitFromProducts(analysis.concerns, products);
      setPersonalizedKitState(kit);
      setPersonalizedKit(kit);
    }
  }, [analysis, products]);

  const fetchAnalysis = async () => {
    try {
      console.log('🔍 Fetching analysis:', analysisId);
      
      const response = await fetch(`/api/analyze-skin/results?id=${analysisId}`);
      const data = await response.json();

      console.log('📊 API Response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load analysis');
      }

      if (!data.analysis) {
        console.error('❌ data.analysis is undefined!');
        throw new Error('Invalid API response format');
      }

      const apiData = data.analysis;
      
      console.log('✅ Analysis data:', apiData);

      // ✨ UPDATED: Extract severity scores if available (new backend)
      // Otherwise leave as undefined (old backend)
      const safeAnalysis: ApiAnalysisResult = {
        id: apiData.id || analysisId!,
        skinScore: apiData.skinScore || 0,
        acneLevel: apiData.acneLevel || 'none',
        acneSeverity: apiData.acneSeverity,           // ← May be undefined
        poresLevel: apiData.poresLevel || 'none',
        poresSeverity: apiData.poresSeverity,         // ← May be undefined
        darkCirclesLevel: apiData.darkCircles || apiData.darkCirclesLevel || 'none',
        darkCirclesSeverity: apiData.darkCirclesSeverity, // ← May be undefined
        age: apiData.age || 25,
        concerns: apiData.concerns || [],
        createdAt: apiData.createdAt || new Date().toISOString(),
      };

      // Log whether we're using new or old backend
      if (safeAnalysis.acneSeverity !== undefined) {
        console.log('✅ NEW BACKEND: Using actual severity scores:', {
          acne: safeAnalysis.acneSeverity,
          pores: safeAnalysis.poresSeverity,
          darkCircles: safeAnalysis.darkCirclesSeverity,
        });
      } else {
        console.log('⚠️ OLD BACKEND: Falling back to hardcoded severity scores');
      }

      setAnalysis(safeAnalysis);
      
      const analysisForStore = {
        analysisId: safeAnalysis.id,
        imageUrl: uploadedImage || 'https://images.unsplash.com/photo-1616683693094-0b7f3c7e9d00?w=600&h=600&fit=crop',
        skinQualityScore: safeAnalysis.skinScore,
        primaryConcerns: mapConcerns(safeAnalysis),
        skinTone: 'Medium',
        skinType: 'Combination',
        timestamp: safeAnalysis.createdAt,
      };
      setCurrentAnalysis(analysisForStore as any);
      
      setLoading(false);
      
    } catch (err: any) {
      console.error('❌ Error loading analysis:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    if (!analysisId) return;
    
    setLoadingProducts(true);
    try {
      console.log('🔦 Fetching recommendations for:', analysisId);
      
      const response = await fetch(
        `/api/products/recommendations?analysisId=${analysisId}`
      );
      
      const data = await response.json();
      console.log('🎯 Recommendations response:', data);

      if (response.ok && data.recommendations) {
        console.log('✅ Got', data.recommendations.length, 'products');
        setProducts(data.recommendations);
      } else {
        console.warn('⚠️ No recommendations returned');
        setProducts([]);
      }
    } catch (err) {
      console.error('❌ Error fetching recommendations:', err);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  // ✨ SMART: Works with both old and new backend!
  const mapConcerns = (apiResult: ApiAnalysisResult): SkinConcern[] => {
    const concerns: SkinConcern[] = [];
    
    // Check if we have the new severity scores from backend
    const hasNewSeverityScores = apiResult.acneSeverity !== undefined;
    
    if (hasNewSeverityScores) {
      console.log('📊 Using NEW backend severity scores');
      
      // NEW BACKEND: Only show concerns with severity > 0
      if (apiResult.acneSeverity! > 0) {
        concerns.push({
          id: 'acne',
          name: 'Acne & Breakouts',
          severity: apiResult.acneSeverity!,  // ← Use actual severity!
          severityLevel: apiResult.acneLevel as 'mild' | 'moderate' | 'severe',
          description: getSeverityDescription('acne', apiResult.acneLevel),
          color: 'red'
        });
      }
      
      if (apiResult.poresSeverity! > 0) {
        concerns.push({
          id: 'pores',
          name: 'Large Pores',
          severity: apiResult.poresSeverity!,  // ← Use actual severity!
          severityLevel: apiResult.poresLevel as 'mild' | 'moderate' | 'severe',
          description: getSeverityDescription('pores', apiResult.poresLevel),
          color: 'orange'
        });
      }
      
      if (apiResult.darkCirclesSeverity! > 0) {
        concerns.push({
          id: 'dark-circles',
          name: 'Dark Circles',
          severity: apiResult.darkCirclesSeverity!,  // ← Use actual severity!
          severityLevel: apiResult.darkCirclesLevel as 'mild' | 'moderate' | 'severe',
          description: getSeverityDescription('dark-circles', apiResult.darkCirclesLevel),
          color: 'purple'
        });
      }
    } else {
      console.log('📊 Using OLD backend - fallback to hardcoded scores');
      
      // OLD BACKEND: Show all non-'none' concerns (like before)
      if (apiResult.acneLevel && apiResult.acneLevel !== 'none') {
        concerns.push({
          id: 'acne',
          name: 'Acne & Breakouts',
          severity: getFallbackSeverityScore(apiResult.acneLevel),  // ← Hardcoded
          severityLevel: apiResult.acneLevel as 'mild' | 'moderate' | 'severe',
          description: getSeverityDescription('acne', apiResult.acneLevel),
          color: 'red'
        });
      }
      
      if (apiResult.poresLevel && apiResult.poresLevel !== 'none') {
        concerns.push({
          id: 'pores',
          name: 'Large Pores',
          severity: getFallbackSeverityScore(apiResult.poresLevel),  // ← Hardcoded
          severityLevel: apiResult.poresLevel as 'mild' | 'moderate' | 'severe',
          description: getSeverityDescription('pores', apiResult.poresLevel),
          color: 'orange'
        });
      }
      
      if (apiResult.darkCirclesLevel && apiResult.darkCirclesLevel !== 'none') {
        concerns.push({
          id: 'dark-circles',
          name: 'Dark Circles',
          severity: getFallbackSeverityScore(apiResult.darkCirclesLevel),  // ← Hardcoded
          severityLevel: apiResult.darkCirclesLevel as 'mild' | 'moderate' | 'severe',
          description: getSeverityDescription('dark-circles', apiResult.darkCirclesLevel),
          color: 'purple'
        });
      }
    }
    
    console.log(`📋 Mapped ${concerns.length} concerns:`, 
      concerns.map(c => `${c.name}: ${c.severity}/100`)
    );
    
    return concerns;
  };

  // Fallback severity scores for old backend (same as before)
  const getFallbackSeverityScore = (level: string): number => {
    switch (level?.toLowerCase()) {
      case 'severe': return 80;
      case 'moderate': return 60;
      case 'mild': return 40;
      default: return 0;
    }
  };

  const getSeverityDescription = (type: string, level: string): string => {
    const descriptions: Record<string, Record<string, string>> = {
      'acne': {
        'severe': 'Significant breakouts detected - intensive treatment recommended',
        'moderate': 'Moderate acne present - targeted treatment needed',
        'mild': 'Minor breakouts - preventive care recommended'
      },
      'pores': {
        'severe': 'Enlarged pores - pore minimizing routine recommended',
        'moderate': 'Visible pores - toner and serum recommended',
        'mild': 'Slightly enlarged pores - preventive care helps'
      },
      'dark-circles': {
        'severe': 'Significant dark circles - eye cream recommended',
        'moderate': 'Noticeable dark circles - brightening treatment helps',
        'mild': 'Slight discoloration - preventive eye care'
      }
    };
    return descriptions[type]?.[level?.toLowerCase()] || '';
  };

  const generateKitFromProducts = (concerns: string[], recommendedProducts: Product[]): PersonalizedKit => {
    const buildRoutine = (timeOfDay: 'morning' | 'evening'): RoutineStep[] => {
      const routine: RoutineStep[] = [];
      let step = 1;

      const findProduct = (category: string) => {
        return recommendedProducts.find(p => 
          p.category?.toLowerCase() === category.toLowerCase()
        );
      };

      const cleanser = findProduct('cleanser');
      if (cleanser) {
        routine.push({
          step: step++,
          timeOfDay,
          product: cleanser,
          instruction: timeOfDay === 'morning' 
            ? 'Cleanse with lukewarm water, gently massage' 
            : 'Double cleanse if wearing makeup'
        });
      }

      if (concerns.includes('acne')) {
        const acneTreatment = recommendedProducts.find(p => 
          p.concerns?.includes('acne') && p.category !== 'cleanser'
        );
        if (acneTreatment) {
          routine.push({
            step: step++,
            timeOfDay,
            product: acneTreatment,
            instruction: 'Apply to affected areas, let absorb'
          });
        }
      }

      const serum = findProduct('serum');
      if (serum) {
        routine.push({
          step: step++,
          timeOfDay,
          product: serum,
          instruction: 'Apply all over face, pat gently'
        });
      }

      const moisturizer = findProduct('moisturizer');
      if (moisturizer) {
        routine.push({
          step: step++,
          timeOfDay,
          product: moisturizer,
          instruction: timeOfDay === 'morning'
            ? 'Lock in hydration'
            : 'Night cream for repair'
        });
      }

      if (timeOfDay === 'morning') {
        const sunscreen = findProduct('sunscreen');
        if (sunscreen) {
          routine.push({
            step: step++,
            timeOfDay,
            product: sunscreen,
            instruction: 'Apply as final step - never skip!'
          });
        }
      }

      return routine;
    };

    const morningRoutine = buildRoutine('morning');
    const eveningRoutine = buildRoutine('evening');

    const allProducts = [...morningRoutine, ...eveningRoutine];
    const uniqueProducts = Array.from(
      new Map(allProducts.map(s => [s.product.id, s.product])).values()
    );
    
    const totalPrice = uniqueProducts.reduce((sum, p) => sum + p.price, 0);
    const savings = Math.round(totalPrice * 0.25);
    const bundlePrice = totalPrice - savings;

    return {
      morningRoutine,
      eveningRoutine,
      totalPrice,
      savings,
      bundlePrice
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-rose-500 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700">Loading your results...</p>
          <p className="text-sm text-gray-500 mt-2">This will just take a moment</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error || 'Could not load analysis'}</p>
          <button
            onClick={() => router.push('/analyze')}
            className="px-6 py-3 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const concerns = mapConcerns(analysis);
  
  const handleAddToCart = (product: Product) => {
    console.log('Results page: Adding to cart ->', product.name);
    addItem(product);
    addToast(`Added ${product.name} to cart!`, 'success');
    openCart();
  };
  
  const handleGetKit = () => {
    if (!personalizedKit) return;
    
    clearCart();
    
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
                Your Skin Analysis
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We've identified your key concerns and created a personalized treatment plan
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* ✨ UPDATED: Show uploaded photo or fallback */}
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-rose-100 to-purple-100">
                {uploadedImage ? (
                  <>
                    <img
                      src={uploadedImage}
                      alt="Your analyzed photo"
                      className="w-full h-full object-cover"
                    />
                    {/* Optional: Add a small badge showing it's the actual photo */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                      ✨ Your Photo
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center p-8">
                      <Sparkles className="w-16 h-16 text-rose-300 mx-auto mb-4" />
                      <p className="text-gray-500">Your analyzed photo</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4">
                <div className="text-sm text-gray-600 mb-1">Analyzed Age</div>
                <div className="text-xl font-bold text-gray-900">{analysis.age}</div>
              </div>
            </div>
            
            {/* Score Gauge */}
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Your Skin Quality Score
              </h2>
              <ScoreGauge score={analysis.skinScore} size={250} strokeWidth={16} />
              <p className="text-gray-600 mt-6 text-center max-w-md">
                Based on our AI analysis, your skin shows potential for significant improvement with the right routine.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Concerns Grid */}
      {concerns.length > 0 && (
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
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {concerns.map((concern) => (
                <ConcernCard
                  key={concern.id}
                  concern={concern}
                  onFixClick={() => handleFixConcern(concern.id)}
                />
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Product Recommendations */}
      {loadingProducts ? (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <Loader2 className="w-12 h-12 animate-spin text-rose-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading your personalized recommendations...</p>
          </div>
        </section>
      ) : products.length > 0 ? (
        <section id="products-section" className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Your Personalized Product Recommendations
              </h2>
              <p className="text-xl text-gray-600">
                Based on your concerns: <strong>{analysis.concerns.join(', ')}</strong>
              </p>
            </div>
            
            <ProductCarousel
              products={products.slice(0, 6)}
              onAddToCart={handleAddToCart}
            />
          </div>
        </section>
      ) : null}
      
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