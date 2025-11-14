import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Product Recommendations API
 * 
 * GET /api/products/recommendations?analysisId={id}
 * 
 * Returns personalized product recommendations based on skin analysis
 */

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const analysisId = searchParams.get('analysisId');

    if (!analysisId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Analysis ID is required' 
        },
        { status: 400 }
      );
    }

    console.log('📊 Getting recommendations for analysis:', analysisId);

    // Get analysis data
    const { data: analysis, error: analysisError } = await supabaseAdmin
      .from('skin_analyses')
      .select('*')
      .eq('id', analysisId)
      .single();

    if (analysisError) {
      console.error('❌ Analysis fetch error:', analysisError);
      throw new Error('Analysis not found');
    }

    console.log('✅ Analysis found with concerns:', analysis.concerns);

    // Get recommended products based on concerns
    let recommendedProducts = [];
    
    if (analysis.concerns && analysis.concerns.length > 0) {
      // Get products that target these concerns
      const { data: products, error: productsError } = await supabaseAdmin
        .from('products')
        .select('*')
        .overlaps('concerns', analysis.concerns)
        .eq('in_stock', true)
        .order('rating', { ascending: false })
        .limit(10);

      if (productsError) {
        console.error('❌ Products fetch error:', productsError);
        throw productsError;
      }

      recommendedProducts = products || [];
    }

    // If no matching products or no concerns, get popular products
    if (recommendedProducts.length === 0) {
      console.log('ℹ️  No specific recommendations, showing popular products');
      
      const { data: popularProducts, error: popularError } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .order('rating', { ascending: false })
        .limit(10);

      if (popularError) {
        console.error('❌ Popular products fetch error:', popularError);
        throw popularError;
      }

      recommendedProducts = popularProducts || [];
    }

    console.log(`✅ Found ${recommendedProducts.length} recommended products`);

    // Return recommendations with analysis summary
    return NextResponse.json({
      success: true,
      analysis: {
        id: analysis.id,
        skinScore: analysis.skin_score,
        concerns: analysis.concerns,
        acneLevel: analysis.acne_level,
        poresLevel: analysis.pores_level,
        darkCircles: analysis.dark_circles,
      },
      recommendations: recommendedProducts,
      count: recommendedProducts.length,
    });

  } catch (error: any) {
    console.error('💥 Recommendations error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to get recommendations',
      },
      { status: 500 }
    );
  }
}