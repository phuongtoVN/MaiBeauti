export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: 'cleanser' | 'moisturizer' | 'serum' | 'treatment' | 'sunscreen';
  skinType: string[];
  concerns: string[];
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  ingredients: string[];
  howToUse: string;
  size: string;
  inStock: boolean;
  bestseller?: boolean;
  new?: boolean;
}

export const products: Product[] = [
  {
    id: 'gentle-foam-cleanser',
    name: 'Gentle Foam Cleanser',
    description: 'A lightweight, pH-balanced cleanser that removes impurities without stripping natural oils. Perfect for daily use.',
    price: 28,
    discountPrice: 22,
    category: 'cleanser',
    skinType: ['all', 'sensitive', 'dry'],
    concerns: ['dryness', 'sensitivity'],
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop'
    ],
    rating: 4.8,
    reviewCount: 342,
    ingredients: ['Glycerin', 'Ceramides', 'Hyaluronic Acid', 'Niacinamide'],
    howToUse: 'Apply to damp skin, massage gently, rinse with lukewarm water. Use morning and evening.',
    size: '150ml',
    inStock: true,
    bestseller: true
  },
  {
    id: 'acne-clearing-cleanser',
    name: 'Acne Clearing Cleanser',
    description: 'Powerful yet gentle cleanser with 2% salicylic acid to fight breakouts and prevent future acne.',
    price: 32,
    category: 'cleanser',
    skinType: ['oily', 'combination', 'acne-prone'],
    concerns: ['acne', 'blackheads', 'large-pores'],
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop'
    ],
    rating: 4.6,
    reviewCount: 289,
    ingredients: ['Salicylic Acid 2%', 'Tea Tree Oil', 'Zinc PCA', 'Aloe Vera'],
    howToUse: 'Use once daily in the evening. Gradually increase to twice daily if skin tolerates well.',
    size: '150ml',
    inStock: true
  },
  {
    id: 'hydrating-moisturizer',
    name: 'Hydrating Daily Moisturizer',
    description: 'Lightweight gel-cream formula that delivers intense hydration without feeling heavy. Suitable for all skin types.',
    price: 38,
    discountPrice: 30,
    category: 'moisturizer',
    skinType: ['all', 'dry', 'dehydrated'],
    concerns: ['dryness', 'fine-lines', 'dullness'],
    image: 'https://images.unsplash.com/photo-1620916297193-a4a8b6d05420?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1620916297193-a4a8b6d05420?w=400&h=400&fit=crop'
    ],
    rating: 4.9,
    reviewCount: 523,
    ingredients: ['Hyaluronic Acid', 'Squalane', 'Vitamin E', 'Peptides'],
    howToUse: 'Apply to clean, damp skin morning and evening. Can be layered under sunscreen.',
    size: '50ml',
    inStock: true,
    bestseller: true
  },
  {
    id: 'vitamin-c-serum',
    name: 'Brightening Vitamin C Serum',
    description: '15% pure L-ascorbic acid formula that brightens, evens tone, and protects against environmental damage.',
    price: 48,
    category: 'serum',
    skinType: ['all', 'dull', 'aging'],
    concerns: ['dark-spots', 'dullness', 'uneven-tone', 'fine-lines'],
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop'
    ],
    rating: 4.7,
    reviewCount: 412,
    ingredients: ['Vitamin C 15%', 'Vitamin E', 'Ferulic Acid', 'Hyaluronic Acid'],
    howToUse: 'Apply 3-4 drops to clean skin in the morning before moisturizer. Store in cool, dark place.',
    size: '30ml',
    inStock: true,
    new: true
  },
  {
    id: 'retinol-night-serum',
    name: 'Advanced Retinol Night Serum',
    description: 'Time-released 0.5% retinol formula that reduces wrinkles, improves texture, and minimizes pores while you sleep.',
    price: 52,
    category: 'serum',
    skinType: ['all', 'aging', 'mature'],
    concerns: ['wrinkles', 'fine-lines', 'large-pores', 'texture'],
    image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop'
    ],
    rating: 4.8,
    reviewCount: 367,
    ingredients: ['Retinol 0.5%', 'Peptides', 'Niacinamide', 'Ceramides'],
    howToUse: 'Use at night only. Start 2x per week, gradually increase frequency. Always use SPF during the day.',
    size: '30ml',
    inStock: true,
    bestseller: true
  },
  {
    id: 'niacinamide-serum',
    name: 'Pore Refining Niacinamide Serum',
    description: '10% niacinamide serum that minimizes pores, controls oil production, and improves skin texture.',
    price: 35,
    category: 'serum',
    skinType: ['oily', 'combination', 'large-pores'],
    concerns: ['large-pores', 'oiliness', 'texture', 'blackheads'],
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop'
    ],
    rating: 4.7,
    reviewCount: 298,
    ingredients: ['Niacinamide 10%', 'Zinc PCA', 'Hyaluronic Acid', 'Panthenol'],
    howToUse: 'Apply morning and evening after cleansing. Can be mixed with moisturizer.',
    size: '30ml',
    inStock: true
  },
  {
    id: 'eye-cream',
    name: 'Intensive Eye Repair Cream',
    description: 'Rich, nourishing eye cream that targets dark circles, puffiness, and fine lines around the delicate eye area.',
    price: 42,
    discountPrice: 35,
    category: 'treatment',
    skinType: ['all'],
    concerns: ['dark-circles', 'puffiness', 'fine-lines', 'wrinkles'],
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop'
    ],
    rating: 4.6,
    reviewCount: 234,
    ingredients: ['Caffeine', 'Vitamin K', 'Peptides', 'Hyaluronic Acid'],
    howToUse: 'Gently pat around eye area morning and evening using ring finger.',
    size: '15ml',
    inStock: true
  },
  {
    id: 'acne-spot-treatment',
    name: 'Fast-Acting Acne Spot Treatment',
    description: 'Concentrated treatment with 5% benzoyl peroxide to quickly reduce the appearance of blemishes overnight.',
    price: 24,
    category: 'treatment',
    skinType: ['oily', 'acne-prone', 'combination'],
    concerns: ['acne', 'breakouts', 'blemishes'],
    image: 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=400&h=400&fit=crop'
    ],
    rating: 4.5,
    reviewCount: 456,
    ingredients: ['Benzoyl Peroxide 5%', 'Sulfur', 'Tea Tree Oil', 'Aloe Vera'],
    howToUse: 'Apply directly to blemishes after cleansing. Use once or twice daily.',
    size: '20ml',
    inStock: true
  },
  {
    id: 'exfoliating-mask',
    name: 'AHA/BHA Exfoliating Mask',
    description: 'Weekly treatment mask with alpha and beta hydroxy acids to deeply exfoliate and reveal smoother, brighter skin.',
    price: 36,
    category: 'treatment',
    skinType: ['all', 'dull', 'textured'],
    concerns: ['dullness', 'texture', 'blackheads', 'large-pores'],
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop'
    ],
    rating: 4.8,
    reviewCount: 189,
    ingredients: ['Glycolic Acid', 'Salicylic Acid', 'Lactic Acid', 'Kaolin Clay'],
    howToUse: 'Apply thin layer to clean skin 1-2 times per week. Leave on for 10 minutes, rinse thoroughly.',
    size: '50ml',
    inStock: true
  },
  {
    id: 'sunscreen-spf50',
    name: 'Invisible Shield SPF 50+',
    description: 'Ultra-lightweight mineral sunscreen that leaves no white cast. Broad spectrum UVA/UVB protection.',
    price: 34,
    category: 'sunscreen',
    skinType: ['all'],
    concerns: ['sun-damage', 'aging', 'dark-spots'],
    image: 'https://images.unsplash.com/photo-1556228852-80b8c6e93c2d?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1556228852-80b8c6e93c2d?w=400&h=400&fit=crop'
    ],
    rating: 4.9,
    reviewCount: 678,
    ingredients: ['Zinc Oxide', 'Titanium Dioxide', 'Vitamin E', 'Green Tea Extract'],
    howToUse: 'Apply generously as last step of morning routine. Reapply every 2 hours when in sun.',
    size: '50ml',
    inStock: true,
    bestseller: true
  },
  {
    id: 'hydrating-toner',
    name: 'Balancing Hydration Toner',
    description: 'Alcohol-free toner that balances pH, hydrates, and preps skin for better absorption of following products.',
    price: 26,
    category: 'treatment',
    skinType: ['all', 'dry', 'dehydrated'],
    concerns: ['dryness', 'dullness', 'sensitivity'],
    image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop'
    ],
    rating: 4.6,
    reviewCount: 312,
    ingredients: ['Hyaluronic Acid', 'Rose Water', 'Glycerin', 'Allantoin'],
    howToUse: 'Apply to clean skin with cotton pad or hands. Follow with serum and moisturizer.',
    size: '200ml',
    inStock: true
  },
  {
    id: 'night-cream',
    name: 'Restorative Night Cream',
    description: 'Rich overnight cream that deeply nourishes and repairs skin while you sleep. Wake up to softer, smoother skin.',
    price: 45,
    discountPrice: 38,
    category: 'moisturizer',
    skinType: ['dry', 'mature', 'aging'],
    concerns: ['dryness', 'wrinkles', 'fine-lines', 'dullness'],
    image: 'https://images.unsplash.com/photo-1556228994-a4c56ee87071?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1556228994-a4c56ee87071?w=400&h=400&fit=crop'
    ],
    rating: 4.7,
    reviewCount: 267,
    ingredients: ['Peptides', 'Shea Butter', 'Ceramides', 'Vitamin E'],
    howToUse: 'Apply to clean skin every evening as last step of routine.',
    size: '50ml',
    inStock: true
  },
  {
    id: 'oil-control-moisturizer',
    name: 'Mattifying Oil-Control Moisturizer',
    description: 'Lightweight, oil-free moisturizer that controls shine and minimizes pores without clogging them.',
    price: 32,
    category: 'moisturizer',
    skinType: ['oily', 'combination', 'acne-prone'],
    concerns: ['oiliness', 'large-pores', 'shine'],
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop'
    ],
    rating: 4.5,
    reviewCount: 189,
    ingredients: ['Niacinamide', 'Witch Hazel', 'Silica', 'Hyaluronic Acid'],
    howToUse: 'Apply to clean skin morning and evening. Can be used under makeup.',
    size: '50ml',
    inStock: true
  },
  {
    id: 'hyaluronic-serum',
    name: 'Ultra Hydrating Hyaluronic Serum',
    description: 'Multi-weight hyaluronic acid serum that provides deep, long-lasting hydration for plump, dewy skin.',
    price: 40,
    category: 'serum',
    skinType: ['all', 'dry', 'dehydrated'],
    concerns: ['dryness', 'fine-lines', 'dullness'],
    image: 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=400&h=400&fit=crop'
    ],
    rating: 4.8,
    reviewCount: 445,
    ingredients: ['Hyaluronic Acid (Multi-weight)', 'Vitamin B5', 'Glycerin'],
    howToUse: 'Apply to damp skin morning and evening before moisturizer.',
    size: '30ml',
    inStock: true,
    bestseller: true
  },
  {
    id: 'gentle-exfoliator',
    name: 'Gentle Daily Exfoliator',
    description: 'Mild enzyme exfoliator that removes dead skin cells without irritation. Perfect for sensitive skin.',
    price: 29,
    category: 'cleanser',
    skinType: ['all', 'sensitive'],
    concerns: ['dullness', 'texture', 'flakiness'],
    image: 'https://images.unsplash.com/photo-1556228852-80b8c6e93c2d?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1556228852-80b8c6e93c2d?w=400&h=400&fit=crop'
    ],
    rating: 4.6,
    reviewCount: 201,
    ingredients: ['Papaya Enzyme', 'Jojoba Beads', 'Aloe Vera', 'Chamomile'],
    howToUse: 'Use 2-3 times per week on damp skin. Massage gently and rinse.',
    size: '100ml',
    inStock: true
  },
  {
    id: 'peptide-serum',
    name: 'Age-Defying Peptide Complex',
    description: 'Advanced peptide formula that targets multiple signs of aging, improving firmness and elasticity.',
    price: 58,
    category: 'serum',
    skinType: ['all', 'aging', 'mature'],
    concerns: ['wrinkles', 'fine-lines', 'loss-of-firmness', 'sagging'],
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop'
    ],
    rating: 4.9,
    reviewCount: 156,
    ingredients: ['Matrixyl 3000', 'Argireline', 'Copper Peptides', 'Hyaluronic Acid'],
    howToUse: 'Apply morning and evening after cleansing, before moisturizer.',
    size: '30ml',
    inStock: true,
    new: true
  },
  {
    id: 'clay-mask',
    name: 'Purifying Clay Mask',
    description: 'Deep-cleansing clay mask that draws out impurities, excess oil, and minimizes the appearance of pores.',
    price: 31,
    category: 'treatment',
    skinType: ['oily', 'combination', 'acne-prone'],
    concerns: ['blackheads', 'large-pores', 'oiliness', 'congestion'],
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop'
    ],
    rating: 4.6,
    reviewCount: 278,
    ingredients: ['Kaolin Clay', 'Bentonite Clay', 'Charcoal', 'Tea Tree Oil'],
    howToUse: 'Apply thin layer to clean skin 1-2 times per week. Leave on 10-15 minutes, rinse.',
    size: '75ml',
    inStock: true
  },
  {
    id: 'tinted-sunscreen',
    name: 'Tinted Mineral Sunscreen SPF 45',
    description: 'Lightly tinted sunscreen that evens skin tone while providing broad spectrum protection.',
    price: 38,
    category: 'sunscreen',
    skinType: ['all'],
    concerns: ['sun-damage', 'uneven-tone', 'aging'],
    image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop'
    ],
    rating: 4.7,
    reviewCount: 392,
    ingredients: ['Zinc Oxide', 'Iron Oxides', 'Vitamin C', 'Squalane'],
    howToUse: 'Apply as last step of morning routine. Can replace foundation for light coverage.',
    size: '50ml',
    inStock: true
  },
  {
    id: 'sensitive-moisturizer',
    name: 'Calming Sensitive Skin Moisturizer',
    description: 'Fragrance-free, hypoallergenic moisturizer that soothes redness and strengthens skin barrier.',
    price: 36,
    category: 'moisturizer',
    skinType: ['sensitive', 'reactive', 'rosacea'],
    concerns: ['redness', 'sensitivity', 'irritation', 'dryness'],
    image: 'https://images.unsplash.com/photo-1556228994-a4c56ee87071?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1556228994-a4c56ee87071?w=400&h=400&fit=crop'
    ],
    rating: 4.8,
    reviewCount: 324,
    ingredients: ['Centella Asiatica', 'Ceramides', 'Colloidal Oatmeal', 'Panthenol'],
    howToUse: 'Apply to clean skin morning and evening. Can be reapplied as needed.',
    size: '50ml',
    inStock: true
  },
  {
    id: 'lip-treatment',
    name: 'Overnight Lip Repair Treatment',
    description: 'Intensive lip balm that heals, hydrates, and plumps lips overnight for softer, smoother results.',
    price: 18,
    category: 'treatment',
    skinType: ['all'],
    concerns: ['dryness', 'chapped-lips', 'fine-lines'],
    image: 'https://images.unsplash.com/photo-1620916297193-a4a8b6d05420?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1620916297193-a4a8b6d05420?w=400&h=400&fit=crop'
    ],
    rating: 4.7,
    reviewCount: 412,
    ingredients: ['Shea Butter', 'Peptides', 'Hyaluronic Acid', 'Vitamin E'],
    howToUse: 'Apply generously to lips before bed. Can be used during the day as needed.',
    size: '15ml',
    inStock: true
  }
];