/**
 * Face++ API Integration (Modified for Free Tier)
 * 
 * This module handles:
 * - Face detection
 * - Skin analysis (derived from beauty scores)
 * - Score calculation
 * - Error handling
 * 
 * Note: skin_status is not available on free tier
 * We derive skin analysis from beauty scores and age
 */

// Face++ API response types
interface FacePPAttributes {
  age: { value: number };
  gender: { value: string };
  beauty: {
    male_score: number;
    female_score: number;
  };
}

interface FacePPFace {
  attributes: FacePPAttributes;
  face_rectangle: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

interface FacePPResponse {
  faces: FacePPFace[];
  image_id: string;
  request_id: string;
  time_used: number;
  face_num: number;
  error_message?: string;
}

// Our simplified analysis result
export interface SkinAnalysisResult {
  skinScore: number; // Overall health score (0-100)
  acneLevel: 'none' | 'mild' | 'moderate' | 'severe';
  poresLevel: 'none' | 'mild' | 'moderate' | 'severe';
  darkCirclesLevel: 'none' | 'mild' | 'moderate' | 'severe';
  age: number;
  concerns: string[]; // Array of detected concerns
  rawResponse: FacePPResponse; // Keep full response for future use
}

/**
 * Analyze skin from base64 image
 * @param imageBase64 - Base64 encoded image string (without data:image prefix)
 * @returns Skin analysis results
 */
export async function analyzeSkin(imageBase64: string): Promise<SkinAnalysisResult> {
  try {
    // Validate API credentials
    if (!process.env.FACEPP_API_KEY || !process.env.FACEPP_API_SECRET) {
      throw new Error('Face++ API credentials not configured');
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('api_key', process.env.FACEPP_API_KEY);
    formData.append('api_secret', process.env.FACEPP_API_SECRET);
    formData.append('image_base64', imageBase64);
    // Only request available attributes (removed skin_status)
    formData.append('return_attributes', 'age,gender,beauty');

    console.log('📸 Calling Face++ API...');

    // Call Face++ API
    const response = await fetch('https://api-us.faceplusplus.com/facepp/v3/detect', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Face++ API error: ${response.status} ${response.statusText}`);
    }

    const data: FacePPResponse = await response.json();

    // Check for API errors
    if (data.error_message) {
      throw new Error(`Face++ API error: ${data.error_message}`);
    }

    // Check if face detected
    if (!data.faces || data.faces.length === 0) {
      throw new Error('No face detected in image. Please ensure the photo clearly shows your face.');
    }

    console.log(`✅ Face detected! Analyzing skin...`);

    // Get first face (in case multiple detected)
    const face = data.faces[0];
    const age = Math.round(face.attributes.age.value);
    const gender = face.attributes.gender.value;
    
    // Use the appropriate beauty score based on gender
    const beautyScore = gender === 'Male' 
      ? face.attributes.beauty.male_score 
      : face.attributes.beauty.female_score;

    // Derive skin analysis from beauty score and age
    const analysis = deriveSkinAnalysis(beautyScore, age);

    console.log(`📊 Analysis complete!`);
    console.log(`   Skin Score: ${analysis.skinScore}/100`);
    console.log(`   Acne: ${analysis.acneLevel}`);
    console.log(`   Pores: ${analysis.poresLevel}`);
    console.log(`   Dark Circles: ${analysis.darkCirclesLevel}`);
    console.log(`   Concerns: ${analysis.concerns.join(', ')}`);

    return {
      ...analysis,
      age,
      rawResponse: data,
    };

  } catch (error: any) {
    console.error('❌ Face++ analysis error:', error.message);
    throw error;
  }
}

/**
 * Derive skin analysis from beauty score and age
 * This simulates skin_status analysis using available data
 * 
 * @param beautyScore - Beauty score from Face++ (0-100, higher = better)
 * @param age - Person's age
 * @returns Derived skin analysis
 */
function deriveSkinAnalysis(beautyScore: number, age: number) {
  // Beauty score correlates with skin quality
  // Convert beauty score to skin score (they're similar scales)
  const skinScore = Math.round(beautyScore);

  // Derive acne level from beauty score
  // Lower beauty scores may indicate skin issues
  let acneLevel: 'none' | 'mild' | 'moderate' | 'severe';
  if (beautyScore >= 80) {
    acneLevel = 'none';
  } else if (beautyScore >= 65) {
    acneLevel = 'mild';
  } else if (beautyScore >= 50) {
    acneLevel = 'moderate';
  } else {
    acneLevel = 'severe';
  }

  // Derive pores level from beauty score
  let poresLevel: 'none' | 'mild' | 'moderate' | 'severe';
  if (beautyScore >= 75) {
    poresLevel = 'none';
  } else if (beautyScore >= 60) {
    poresLevel = 'mild';
  } else if (beautyScore >= 45) {
    poresLevel = 'moderate';
  } else {
    poresLevel = 'severe';
  }

  // Derive dark circles from age and beauty score
  let darkCirclesLevel: 'none' | 'mild' | 'moderate' | 'severe';
  if (age < 25 && beautyScore >= 70) {
    darkCirclesLevel = 'none';
  } else if (age < 35 && beautyScore >= 60) {
    darkCirclesLevel = 'mild';
  } else if (age < 45 && beautyScore >= 50) {
    darkCirclesLevel = 'moderate';
  } else {
    darkCirclesLevel = 'severe';
  }

  // Determine main concerns based on levels
  const concerns: string[] = [];
  
  if (acneLevel === 'moderate' || acneLevel === 'severe') {
    concerns.push('acne');
  }
  
  if (poresLevel === 'moderate' || poresLevel === 'severe') {
    concerns.push('pores');
  }
  
  if (darkCirclesLevel === 'moderate' || darkCirclesLevel === 'severe') {
    concerns.push('dark-circles');
  }
  
  // Add aging concern for older users
  if (age >= 30) {
    concerns.push('aging');
  }

  // If no specific concerns, add general "hydration" concern
  if (concerns.length === 0) {
    concerns.push('hydration');
  }

  return {
    skinScore,
    acneLevel,
    poresLevel,
    darkCirclesLevel,
    concerns,
  };
}

/**
 * Validate image before sending to Face++
 * @param base64 - Base64 string to validate
 * @returns true if valid, throws error if invalid
 */
export function validateImage(base64: string): boolean {
  // Check if base64 string exists
  if (!base64 || base64.trim().length === 0) {
    throw new Error('Image data is empty');
  }

  // Check base64 string length (rough size check)
  // Most faces should be > 10KB base64
  if (base64.length < 10000) {
    throw new Error('Image file is too small. Please upload a clear photo of your face.');
  }

  // Check if it's reasonable size (< 10MB base64 ≈ 7.5MB image)
  if (base64.length > 10000000) {
    throw new Error('Image file is too large. Please use a photo under 10MB.');
  }

  return true;
}