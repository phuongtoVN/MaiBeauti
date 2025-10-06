import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    // Check if image is provided
    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Convert base64 to buffer
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    let buffer = Buffer.from(base64Data, 'base64');

    // Check if buffer is valid
    if (!buffer || buffer.length === 0) {
      return NextResponse.json(
        { error: 'Invalid image data' },
        { status: 400 }
      );
    }

    // Wrap sharp code in try-catch to handle invalid images
    let imageInfo;
    try {
      imageInfo = await sharp(buffer).metadata();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid image format. Please upload a valid JPG or PNG.' },
        { status: 400 }
      );
    }

    // Compress the image if it's too large
    // Face++ has a 2MB limit, so let's compress to max 1MB to be safe
    if (imageInfo.width && imageInfo.width > 1024) {
      buffer = await sharp(buffer)
        .resize(1024, null, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .jpeg({ quality: 85 })
        .toBuffer();
    }

    // Convert back to base64
    const compressedBase64 = buffer.toString('base64');

    // Call Face++ API
    const formData = new FormData();
    formData.append('api_key', process.env.FACEPP_API_KEY!);
    formData.append('api_secret', process.env.FACEPP_API_SECRET!);
    formData.append('image_base64', compressedBase64);
    formData.append('return_attributes', 'skinstatus');

    const faceppResponse = await fetch(
      'https://api-us.faceplusplus.com/facepp/v1/skinanalyze',
      {
        method: 'POST',
        body: formData,
      }
    );

    const responseText = await faceppResponse.text();
    console.log('Face++ Status:', faceppResponse.status);
    console.log('Face++ Response:', responseText);

    if (!faceppResponse.ok) {
      console.error('Face++ API Error:', responseText);
      return NextResponse.json(
        { error: 'Face++ API error: ' + responseText },
        { status: 500 }
      );
    }

    let faceppData;
    try {
      faceppData = JSON.parse(responseText);
      console.log('Full Face++ Response:', JSON.stringify(faceppData, null, 2));
    } catch (e) {
      console.error('Failed to parse response:', responseText);
      return NextResponse.json(
        { error: 'Invalid response from Face++ API' },
        { status: 500 }
      );
    }

    // Check if face was detected
    if (!faceppData.result) {
      return NextResponse.json(
        { error: 'No face detected. Please upload a clear photo of your face.' },
        { status: 400 }
      );
    }

    // Extract skin analysis data - result is an object, not an array
    const skinData = faceppData.result;
    console.log('Skin Data:', JSON.stringify(skinData, null, 2));

    // Calculate average pore score from different face regions
    const avgPores = (
      (skinData.pores_forehead?.value || 0) +
      (skinData.pores_left_cheek?.value || 0) +
      (skinData.pores_right_cheek?.value || 0) +
      (skinData.pores_jaw?.value || 0)
    ) / 4;

    // Calculate average wrinkle score
    const avgWrinkles = (
      (skinData.forehead_wrinkle?.value || 0) +
      (skinData.nasolabial_fold?.value || 0) +
      (skinData.crows_feet?.value || 0) +
      (skinData.glabella_wrinkle?.value || 0) +
      (skinData.eye_finelines?.value || 0)
    ) / 5;

    // Map skin_type number to description
    const skinTypeMap: { [key: number]: string } = {
      0: 'oily',
      1: 'dry',
      2: 'neutral',
      3: 'combination'
    };

    // Parse the results using actual Face++ fields
    const analysis = {
      skinQualityScore: 100 - (
        (skinData.acne?.value || 0) * 0.3 +
        (skinData.dark_circle?.value || 0) * 0.2 +
        avgPores * 0.2 +
        avgWrinkles * 0.3
      ), // Calculate quality score from issues
      acneLevel: (skinData.acne?.value || 0).toString(),
      darkCircles: (skinData.dark_circle?.value || 0).toString(),
      poresLevel: avgPores.toString(),
      wrinkleLevel: avgWrinkles.toString(),
      skinTone: skinTypeMap[skinData.skin_type?.skin_type || 2] || 'neutral',
    };

    // Generate concerns based on analysis
    const concerns: string[] = [];
    if (parseFloat(analysis.acneLevel) > 50) concerns.push('acne');
    if (parseFloat(analysis.darkCircles) > 50) concerns.push('dark circles');
    if (parseFloat(analysis.poresLevel) > 50) concerns.push('enlarged pores');
    if (parseFloat(analysis.wrinkleLevel) > 50) concerns.push('wrinkles');

    // Generate recommendations
    const recommendations = generateRecommendations(concerns, analysis.skinTone);

    // TODO: Save to database (we'll implement this after setting up authentication)
    // For now, return a mock analysis ID
    const analysisId = Date.now().toString();

    // Store in memory temporarily (in production, save to database)
    global.tempAnalysis = global.tempAnalysis || {};
    global.tempAnalysis[analysisId] = {
      ...analysis,
      concerns,
      recommendations,
      imageUrl: image,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      analysisId,
      data: {
        ...analysis,
        concerns,
        recommendations,
      },
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 }
    );
  }
}

function generateRecommendations(concerns: string[], skinTone: string): string[] {
  const recommendations: string[] = [];

  if (concerns.includes('acne')) {
    recommendations.push('Use a gentle salicylic acid cleanser');
    recommendations.push('Apply a non-comedogenic moisturizer');
    recommendations.push('Consider products with niacinamide');
  }

  if (concerns.includes('dark circles')) {
    recommendations.push('Use an eye cream with caffeine');
    recommendations.push('Ensure adequate sleep and hydration');
    recommendations.push('Try products with vitamin K');
  }

  if (concerns.includes('enlarged pores')) {
    recommendations.push('Use a pore-refining toner with BHA');
    recommendations.push('Apply a clay mask weekly');
    recommendations.push('Always remove makeup before bed');
  }

  if (concerns.includes('wrinkles')) {
    recommendations.push('Use a retinol serum at night');
    recommendations.push('Apply sunscreen daily (SPF 30+)');
    recommendations.push('Use a hydrating serum with hyaluronic acid');
  }

  if (recommendations.length === 0) {
    recommendations.push('Maintain your current skincare routine');
    recommendations.push('Use sunscreen daily to prevent damage');
    recommendations.push('Stay hydrated and eat a balanced diet');
  }

  return recommendations;
}

interface StoredAnalysis {
  skinQualityScore: number;
  acneLevel: string;
  darkCircles: string;
  poresLevel: string;
  wrinkleLevel: string;
  skinTone: string;
  concerns: string[];
  recommendations: string[];
  imageUrl: string;
  timestamp: string;
}

declare global {
  var tempAnalysis: Record<string, StoredAnalysis> | undefined;
}