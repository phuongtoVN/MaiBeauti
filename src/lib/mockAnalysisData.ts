export interface SkinConcern {
  id: string;
  name: string;
  severity: number; // 0-100
  severityLevel: 'mild' | 'moderate' | 'severe';
  description: string;
  color: string;
}

export interface AnalysisResult {
  analysisId: string;
  imageUrl: string;
  skinQualityScore: number; // 0-100
  primaryConcerns: SkinConcern[];
  skinTone: string;
  skinType: string;
  timestamp: string;
  userName?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  age: number;
  concern: string;
  rating: number;
  timeline: string;
  quote: string;
  beforeImage: string;
  afterImage: string;
}

// Sample analysis results
export const mockAnalysisResults: Record<string, AnalysisResult> = {
  'demo-1': {
    analysisId: 'demo-1',
    imageUrl: 'https://images.unsplash.com/photo-1616683693094-0b7f3c7e9d00?w=600&h=600&fit=crop',
    skinQualityScore: 62,
    skinTone: 'Medium',
    skinType: 'Combination',
    timestamp: new Date().toISOString(),
    userName: 'Sarah',
    primaryConcerns: [
      {
        id: 'acne',
        name: 'Acne & Breakouts',
        severity: 75,
        severityLevel: 'moderate',
        description: 'Active breakouts detected on T-zone with some inflammation',
        color: 'red'
      },
      {
        id: 'pores',
        name: 'Large Pores',
        severity: 68,
        severityLevel: 'moderate',
        description: 'Enlarged pores visible on nose and cheeks',
        color: 'orange'
      },
      {
        id: 'dark-spots',
        name: 'Dark Spots',
        severity: 45,
        severityLevel: 'mild',
        description: 'Post-inflammatory hyperpigmentation from previous breakouts',
        color: 'yellow'
      },
      {
        id: 'texture',
        name: 'Uneven Texture',
        severity: 52,
        severityLevel: 'mild',
        description: 'Slightly rough texture with some bumps',
        color: 'amber'
      }
    ]
  },
  'demo-2': {
    analysisId: 'demo-2',
    imageUrl: 'https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=600&h=600&fit=crop',
    skinQualityScore: 48,
    skinTone: 'Fair',
    skinType: 'Dry',
    timestamp: new Date().toISOString(),
    userName: 'Emma',
    primaryConcerns: [
      {
        id: 'wrinkles',
        name: 'Fine Lines & Wrinkles',
        severity: 82,
        severityLevel: 'severe',
        description: 'Visible fine lines around eyes and forehead',
        color: 'red'
      },
      {
        id: 'dark-circles',
        name: 'Dark Circles',
        severity: 71,
        severityLevel: 'moderate',
        description: 'Prominent dark circles under both eyes',
        color: 'orange'
      },
      {
        id: 'dryness',
        name: 'Dryness & Dehydration',
        severity: 65,
        severityLevel: 'moderate',
        description: 'Dry patches and flakiness visible',
        color: 'orange'
      },
      {
        id: 'dullness',
        name: 'Dullness',
        severity: 58,
        severityLevel: 'mild',
        description: 'Lack of radiance and uneven tone',
        color: 'yellow'
      }
    ]
  },
  'demo-3': {
    analysisId: 'demo-3',
    imageUrl: 'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?w=600&h=600&fit=crop',
    skinQualityScore: 71,
    skinTone: 'Medium-Dark',
    skinType: 'Oily',
    timestamp: new Date().toISOString(),
    userName: 'Maya',
    primaryConcerns: [
      {
        id: 'oiliness',
        name: 'Excess Oil',
        severity: 78,
        severityLevel: 'moderate',
        description: 'Shiny T-zone with excessive sebum production',
        color: 'orange'
      },
      {
        id: 'pores',
        name: 'Large Pores',
        severity: 72,
        severityLevel: 'moderate',
        description: 'Visibly enlarged pores on nose and cheeks',
        color: 'orange'
      },
      {
        id: 'blackheads',
        name: 'Blackheads',
        severity: 55,
        severityLevel: 'mild',
        description: 'Clogged pores with oxidized sebum',
        color: 'yellow'
      },
      {
        id: 'uneven-tone',
        name: 'Uneven Skin Tone',
        severity: 48,
        severityLevel: 'mild',
        description: 'Slight discoloration in certain areas',
        color: 'yellow'
      }
    ]
  }
};

// Sample testimonials
export const mockTestimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Jessica M.',
    age: 28,
    concern: 'Acne',
    rating: 5,
    timeline: '6 weeks',
    quote: 'My skin has never been clearer! The personalized routine really works.',
    beforeImage: 'https://images.unsplash.com/photo-1616683693094-0b7f3c7e9d00?w=300&h=300&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=300&h=300&fit=crop'
  },
  {
    id: 'test-2',
    name: 'Amanda R.',
    age: 35,
    concern: 'Anti-Aging',
    rating: 5,
    timeline: '8 weeks',
    quote: 'The fine lines around my eyes have visibly reduced. I look younger!',
    beforeImage: 'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?w=300&h=300&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1616683693094-0b7f3c7e9d00?w=300&h=300&fit=crop'
  },
  {
    id: 'test-3',
    name: 'Olivia K.',
    age: 24,
    concern: 'Dark Circles',
    rating: 5,
    timeline: '4 weeks',
    quote: 'Finally found an eye cream that actually works on my dark circles!',
    beforeImage: 'https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=300&h=300&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?w=300&h=300&fit=crop'
  },
  {
    id: 'test-4',
    name: 'Rachel P.',
    age: 31,
    concern: 'Pores',
    rating: 5,
    timeline: '5 weeks',
    quote: 'My pores look so much smaller now. My makeup goes on smoother too!',
    beforeImage: 'https://images.unsplash.com/photo-1616683693094-0b7f3c7e9d00?w=300&h=300&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=300&h=300&fit=crop'
  },
  {
    id: 'test-5',
    name: 'Sophie L.',
    age: 26,
    concern: 'Dullness',
    rating: 5,
    timeline: '3 weeks',
    quote: 'Everyone is asking what I did to get such glowing skin!',
    beforeImage: 'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?w=300&h=300&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1616683693094-0b7f3c7e9d00?w=300&h=300&fit=crop'
  },
  {
    id: 'test-6',
    name: 'Lauren H.',
    age: 29,
    concern: 'Combination Skin',
    rating: 5,
    timeline: '7 weeks',
    quote: 'Finally balanced my combination skin. No more oily T-zone!',
    beforeImage: 'https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=300&h=300&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?w=300&h=300&fit=crop'
  }
];

// Helper function to get severity color
export const getSeverityColor = (level: 'mild' | 'moderate' | 'severe') => {
  switch (level) {
    case 'mild':
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        border: 'border-yellow-300',
        gradient: 'from-yellow-400 to-orange-400'
      };
    case 'moderate':
      return {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        border: 'border-orange-300',
        gradient: 'from-orange-500 to-red-500'
      };
    case 'severe':
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-300',
        gradient: 'from-red-500 to-pink-600'
      };
  }
};

// Helper function to get score color
export const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-yellow-500';
  if (score >= 40) return 'text-orange-500';
  return 'text-red-500';
};

// Helper function to get score message
export const getScoreMessage = (score: number) => {
  if (score >= 80) return 'Excellent skin health!';
  if (score >= 60) return 'Good, but room for improvement';
  if (score >= 40) return 'Needs attention';
  return 'Requires immediate care';
};