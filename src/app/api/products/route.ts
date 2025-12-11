import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Products API Endpoint
 * 
 * GET /api/products
 * 
 * Query parameters:
 * - category: Filter by category (cleanser, serum, moisturizer, etc.)
 * - skinType: Filter by skin type (oily, dry, combination, sensitive)
 * - concern: Filter by concern (acne, aging, dark-circles, pores)
 */

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const skinType = searchParams.get('skinType');
    const concern = searchParams.get('concern');

    // Start building query
    let query = supabase
      .from('products')
      .select('*')
      .eq('in_stock', true)
      .order('created_at', { ascending: false });

    // Apply filters if provided
    if (category) {
      query = query.eq('category', category);
    }

    if (skinType) {
      query = query.contains('skin_types', [skinType]);
    }

    if (concern) {
      query = query.contains('concerns', [concern]);
    }

    // Execute query
    const { data: products, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      count: products?.length || 0,
      products: products || [],
    });

  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || 'Failed to fetch products',
      },
      { status: 500 }
    );
  }
}