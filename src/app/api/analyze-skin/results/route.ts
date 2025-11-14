import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Get Analysis Results API Endpoint
 * 
 * GET /api/analyze-skin/results?id={analysisId}
 * 
 * Response:
 * {
 *   success: true,
 *   analysis: SkinAnalysis object
 * }
 */

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const analysisId = searchParams.get('id');

    if (!analysisId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Analysis ID is required' 
        },
        { status: 400 }
      );
    }

    console.log('📥 Fetching analysis:', analysisId);

    // Fetch analysis from database
    const { data: analysis, error } = await supabase
      .from('skin_analyses')
      .select('*')
      .eq('id', analysisId)
      .single();

    if (error) {
      console.error('❌ Database error:', error);
      throw error;
    }

    if (!analysis) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Analysis not found' 
        },
        { status: 404 }
      );
    }

    console.log('✅ Analysis found');

    return NextResponse.json({
      success: true,
      analysis: {
        id: analysis.id,
        skinScore: analysis.skin_score,
        acneLevel: analysis.acne_level,
        poresLevel: analysis.pores_level,
        darkCircles: analysis.dark_circles,
        concerns: analysis.concerns,
        createdAt: analysis.created_at,
      },
    });

  } catch (error: any) {
    console.error('💥 Error fetching analysis:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch analysis',
      },
      { status: 500 }
    );
  }
}