import { products, Product } from './products';
import { AnalysisResult, SkinConcern } from './mockAnalysisData';

export interface RoutineStep {
  step: number;
  timeOfDay: 'morning' | 'evening' | 'both';
  product: Product;
  instruction: string;
}

export interface PersonalizedKit {
  morningRoutine: RoutineStep[];
  eveningRoutine: RoutineStep[];
  totalPrice: number;
  savings: number;
  bundlePrice: number;
}

// Map concerns to product IDs
const concernProductMap: Record<string, string[]> = {
  'acne': ['acne-clearing-cleanser', 'acne-spot-treatment', 'niacinamide-serum', 'oil-control-moisturizer'],
  'pores': ['niacinamide-serum', 'clay-mask', 'gentle-exfoliator', 'acne-clearing-cleanser'],
  'dark-spots': ['vitamin-c-serum', 'niacinamide-serum', 'exfoliating-mask', 'tinted-sunscreen'],
  'wrinkles': ['retinol-night-serum', 'peptide-serum', 'eye-cream', 'hydrating-moisturizer'],
  'dark-circles': ['eye-cream', 'vitamin-c-serum', 'hydrating-moisturizer'],
  'dryness': ['gentle-foam-cleanser', 'hyaluronic-serum', 'hydrating-moisturizer', 'night-cream'],
  'oiliness': ['acne-clearing-cleanser', 'niacinamide-serum', 'oil-control-moisturizer', 'clay-mask'],
  'dullness': ['vitamin-c-serum', 'gentle-exfoliator', 'exfoliating-mask', 'hydrating-toner'],
  'texture': ['gentle-exfoliator', 'exfoliating-mask', 'niacinamide-serum', 'retinol-night-serum'],
  'blackheads': ['clay-mask', 'niacinamide-serum', 'gentle-exfoliator', 'acne-clearing-cleanser'],
  'uneven-tone': ['vitamin-c-serum', 'niacinamide-serum', 'tinted-sunscreen', 'exfoliating-mask']
};

// Get recommended products based on analysis
export function getRecommendedProducts(analysis: AnalysisResult, limit: number = 6): Product[] {
  const recommendedIds = new Set<string>();
  
  // Get products for each concern (prioritize by severity)
  const sortedConcerns = [...analysis.primaryConcerns].sort((a, b) => b.severity - a.severity);
  
  for (const concern of sortedConcerns) {
    const concernKey = concern.id.toLowerCase();
    const productIds = concernProductMap[concernKey] || [];
    
    productIds.forEach(id => recommendedIds.add(id));
    
    if (recommendedIds.size >= limit) break;
  }
  
  // Add sunscreen if not already included
  if (!recommendedIds.has('sunscreen-spf50')) {
    recommendedIds.add('sunscreen-spf50');
  }
  
  // Get actual product objects
  const recommendedProducts = Array.from(recommendedIds)
    .map(id => products.find(p => p.id === id))
    .filter((p): p is Product => p !== undefined)
    .slice(0, limit);
  
  return recommendedProducts;
}

// Generate complete personalized routine
export function generatePersonalizedKit(analysis: AnalysisResult): PersonalizedKit {
  const topConcerns = analysis.primaryConcerns.slice(0, 3);
  const allRecommended = getRecommendedProducts(analysis, 15);
  
  // Helper to find product by category
  const findProduct = (category: string, concerns?: string[]) => {
    return allRecommended.find(p => {
      const matchesCategory = p.category === category;
      if (!concerns) return matchesCategory;
      return matchesCategory && p.concerns.some(c => concerns.includes(c));
    }) || allRecommended.find(p => p.category === category);
  };
  
  // Morning Routine
  const morningRoutine: RoutineStep[] = [
    {
      step: 1,
      timeOfDay: 'morning',
      product: findProduct('cleanser')!,
      instruction: 'Cleanse face with lukewarm water, gently massage in circular motions'
    },
    {
      step: 2,
      timeOfDay: 'morning',
      product: findProduct('treatment') || findProduct('serum')!,
      instruction: 'Apply toner to prep skin and balance pH'
    },
    {
      step: 3,
      timeOfDay: 'morning',
      product: findProduct('serum', ['dark-spots', 'dullness'])!,
      instruction: 'Apply serum to target specific concerns, let absorb'
    },
    {
      step: 4,
      timeOfDay: 'morning',
      product: findProduct('moisturizer')!,
      instruction: 'Moisturize to lock in hydration and create protective barrier'
    },
    {
      step: 5,
      timeOfDay: 'morning',
      product: findProduct('sunscreen')!,
      instruction: 'Apply SPF as final step - NEVER skip this!'
    }
  ].filter(step => step.product);
  
  // Evening Routine
  const eveningRoutine: RoutineStep[] = [
    {
      step: 1,
      timeOfDay: 'evening',
      product: findProduct('cleanser')!,
      instruction: 'Double cleanse if wearing makeup, remove all impurities'
    },
    {
      step: 2,
      timeOfDay: 'evening',
      product: findProduct('treatment') || allRecommended.find(p => p.id === 'exfoliating-mask' || p.id === 'clay-mask')!,
      instruction: 'Use treatment 2-3 times per week after cleansing'
    },
    {
      step: 3,
      timeOfDay: 'evening',
      product: findProduct('serum', ['wrinkles', 'acne', 'texture']) || findProduct('serum')!,
      instruction: 'Apply treatment serum to address main concerns'
    },
    {
      step: 4,
      timeOfDay: 'evening',
      product: allRecommended.find(p => p.id === 'eye-cream') || findProduct('treatment')!,
      instruction: 'Gently pat around eye area using ring finger'
    },
    {
      step: 5,
      timeOfDay: 'evening',
      product: allRecommended.find(p => p.id === 'night-cream') || findProduct('moisturizer')!,
      instruction: 'Apply night cream to repair and rejuvenate while you sleep'
    }
  ].filter(step => step.product);
  
  // Calculate pricing
  const allProducts = [...morningRoutine, ...eveningRoutine];
  const uniqueProducts = Array.from(new Set(allProducts.map(s => s.product.id)))
    .map(id => allProducts.find(s => s.product.id === id)!.product);
  
  const totalPrice = uniqueProducts.reduce((sum, p) => sum + p.price, 0);
  const savings = Math.round(totalPrice * 0.25); // 25% bundle discount
  const bundlePrice = totalPrice - savings;
  
  return {
    morningRoutine,
    eveningRoutine,
    totalPrice,
    savings,
    bundlePrice
  };
}

// Generate urgency message
export function getUrgencyMessage(): string {
  const viewers = Math.floor(Math.random() * 30) + 15; // 15-45 people
  return `${viewers} people viewing this kit right now`;
}

// Calculate potential improvement
export function calculateImprovement(concern: SkinConcern): string {
  const improvementPercent = Math.round((concern.severity * 0.6) + Math.random() * 20);
  const weeks = Math.ceil(concern.severity / 15) + 2; // More severe = longer time
  
  return `Up to ${improvementPercent}% improvement in ${weeks} weeks`;
}