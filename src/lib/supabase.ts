/**
 * Supabase Client Configuration
 * 
 * This file creates Supabase clients for both client-side and server-side operations
 */

import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

/**
 * Client-side Supabase client with SSR support
 * Use this in React components and client-side code
 * Properly handles cookies and session persistence
 */
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * Admin client for server-side operations
 * Use this ONLY in API routes or server components
 * Bypasses row-level security
 */
export const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
  : null;

// Type definitions for database tables
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  ingredients: string[];
  benefits: string[];
  skin_types: string[];
  concerns: string[];
  rating: number;
  reviews_count: number;
  in_stock: boolean;
  created_at: string;
}

export interface SkinAnalysis {
  id: string;
  user_id: string;
  image_url: string;
  skin_score: number;
  concerns: string[];
  recommendations: string[];
  acne_level: string;
  wrinkles_level: string;
  dark_circles: string;
  skin_tone: string;
  facepp_response: any;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  shipping_address: any;
  created_at: string;
  updated_at: string;
}