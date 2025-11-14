/**
 * Supabase Client Configuration
 * 
 * This file creates two Supabase clients:
 * 1. supabase - For client-side operations (safe to use in browser)
 * 2. supabaseAdmin - For server-side operations (use in API routes only)
 */

import { createClient } from '@supabase/supabase-js';

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

/**
 * Client-side Supabase client
 * Use this in React components and client-side code
 * Has row-level security enabled
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * Server-side Supabase client (Admin)
 * Use this ONLY in API routes (src/app/api/...)
 * Bypasses row-level security - use carefully!
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * Database type definitions
 * Add these as you build out your schema
 */
export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  category: string;
  skin_types: string[] | null;
  concerns: string[] | null;
  image_url: string | null;
  images: string[] | null;
  rating: number;
  review_count: number;
  ingredients: string[] | null;
  how_to_use: string | null;
  size: string | null;
  in_stock: boolean;
  created_at: string;
  updated_at: string;
};

export type SkinAnalysis = {
  id: string;
  user_id: string | null;
  image_url: string;
  facepp_response: any;
  skin_score: number | null;
  acne_level: string | null;
  pores_level: string | null;
  wrinkles_level: string | null;
  dark_circles: string | null;
  skin_tone: string | null;
  concerns: string[] | null;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string | null;
  email: string;
  total_amount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  promo_code: string | null;
  status: string;
  shipping_address: any;
  stripe_payment_intent: string | null;
  created_at: string;
  updated_at: string;
};