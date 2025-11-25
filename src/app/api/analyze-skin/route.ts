import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { analyzeSkin, validateImage } from '@/lib/facepp';
import sharp from 'sharp';

/**
 * Skin Analysis API Endpoint
 * 
 * POST /api/analyze-skin
 * 
 * Request body:
 * {
 *   image: string,        // Base64 image WITH data:image prefix
 *   userId?: string       // Optional user ID (for logged-in users)
 * }
 * 
 * Response:
 * {
 *   success: true,
 *   analysisId: string,
 *   results: SkinAnalysisResult
 * }
 */

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { image, userId } = body;

    console.log('📥 Received skin analysis request');

    // Validate input
    if (!image) {
      return NextResponse.json(
        {
          success: false,
          error: 'No image provided'
        },
        { status: 400 }
      );
    }

    // Convert base64 to buffer and compress
    console.log('🔄 Processing and compressing image...');
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    let buffer = Buffer.from(base64Data, 'base64');

    // Check if buffer is valid
    if (!buffer || buffer.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid image data'
        },
        { status: 400 }
      );
    }

    // Validate image format with sharp
    let imageInfo;
    try {
      imageInfo = await sharp(buffer).metadata();
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid image format. Please upload a valid JPG or PNG.'
        },
        { status: 400 }
      );
    }

    // Compress the image if needed
    // Face++ works better with optimized images
    if (imageInfo.width && imageInfo.width > 1024) {
      console.log('📐 Resizing image to optimize for Face++ API...');
      buffer = await sharp(buffer)
        .resize(1024, null, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: 85 })
        .toBuffer();
    }

    // Convert to base64 without prefix (Face++ requirement)
    const imageBase64 = buffer.toString('base64');

    console.log('✅ Image processed and ready');

    // Validate image
    try {
      validateImage(imageBase64);
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          error: error.message
        },
        { status: 400 }
      );
    }

    console.log('✅ Image validated');

    // Call Face++ API using our utility function
    console.log('🔄 Analyzing skin with Face++ API...');
    const analysisResult = await analyzeSkin(imageBase64);

    console.log('✅ Face++ analysis complete');

    // Upload image to Supabase Storage
    console.log('📤 Uploading image to Supabase Storage...');
    const filename = `analysis_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;

    // Upload the buffer to the 'skin-analyses' bucket
    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from('skin-analyses')
      .upload(filename, buffer, {
        contentType: 'image/jpeg',
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Storage upload error:', uploadError);
      console.warn('⚠️ Falling back to placeholder image due to upload failure');
    }

    // Get public URL
    let imageUrl = 'placeholder-image-url';
    if (uploadData) {
      const { data: { publicUrl } } = supabaseAdmin
        .storage
        .from('skin-analyses')
        .getPublicUrl(filename);

      imageUrl = publicUrl;
      console.log('✅ Image uploaded successfully:', imageUrl);
    }

    // Save analysis to database
    console.log('💾 Saving analysis to database...');
    const { data, error } = await supabaseAdmin
      .from('skin_analyses')
      .insert({
        user_id: userId || null,
        image_url: imageUrl,
        facepp_response: analysisResult.rawResponse,
        skin_score: analysisResult.skinScore,
        acne_level: analysisResult.acneLevel,
        pores_level: analysisResult.poresLevel,
        dark_circles: analysisResult.darkCirclesLevel,
        skin_tone: null, // TODO: Add skin tone detection later
        concerns: analysisResult.concerns,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Database error:', error);
      throw new Error('Failed to save analysis to database');
    }

    console.log('✅ Analysis saved to database with ID:', data.id);

    // Return success response
    return NextResponse.json({
      success: true,
      analysisId: data.id,
      results: {
        skinScore: analysisResult.skinScore,
        acneLevel: analysisResult.acneLevel,
        poresLevel: analysisResult.poresLevel,
        darkCirclesLevel: analysisResult.darkCirclesLevel,
        age: analysisResult.age,
        concerns: analysisResult.concerns,
      },
    });

  } catch (error: any) {
    console.error('💥 Analysis error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Analysis failed. Please try again.',
      },
      { status: 500 }
    );
  }
}