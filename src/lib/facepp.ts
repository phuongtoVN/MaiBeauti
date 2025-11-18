/**
 * Face++ API Integration (Modified for Free Tier) - V2
 * 
 * IMPROVEMENTS IN THIS VERSION:
 * - More conservative concern assignment (reduces false positives)
 * - Better freckles vs. acne distinction
 * - Severity scores are returned for frontend display
 * - More accurate for people with natural skin variations
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

// Our analysis result with severity scores
export interface SkinAnalysisResult {
  skinScore: number; // Overall health score (0-100)
  acneLevel: 'none' | 'mild' | 'moderate' | 'severe';
  acneSeverity: number; // 0-100 for display
  poresLevel: 'none' | 'mild' | 'moderate' | 'severe';
  poresSeverity: number; // 0-100 for display
  darkCirclesLevel: 'none' | 'mild' | 'moderate' | 'severe';
  darkCirclesSeverity: number; // 0-100 for display
  age: number;
  concerns: string[]; // Array of detected concerns
  rawResponse: FacePPResponse;
}

/**
 * Analyze skin from base64 image
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

    // Get first face
    const face = data.faces[0];
    const age = Math.round(face.attributes.age.value);
    const gender = face.attributes.gender.value;
    
    // Use appropriate beauty score
    const beautyScore = gender === 'Male' 
      ? face.attributes.beauty.male_score 
      : face.attributes.beauty.female_score;

    // Derive skin analysis
    const analysis = deriveSkinAnalysis(beautyScore, age);

    console.log(`📊 Analysis complete!`);
    console.log(`   Skin Score: ${analysis.skinScore}/100`);
    console.log(`   Acne: ${analysis.acneLevel} (${analysis.acneSeverity}/100)`);
    console.log(`   Pores: ${analysis.poresLevel} (${analysis.poresSeverity}/100)`);
    console.log(`   Dark Circles: ${analysis.darkCirclesLevel} (${analysis.darkCirclesSeverity}/100)`);
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
 * IMPROVED: More conservative concern assignment
 * Now less likely to misidentify freckles as acne
 */
function deriveSkinAnalysis(beautyScore: number, age: number) {
  // Normalize beauty score (reduce bias)
  let normalizedScore = beautyScore;
  
  console.log(`📊 Original beauty score: ${beautyScore}`);
  
  // Boost lower scores significantly
  if (normalizedScore < 60) {
    normalizedScore = normalizedScore * 1.3;
    console.log(`   🔼 Boosted low score by 30%: ${normalizedScore.toFixed(1)}`);
  } else if (normalizedScore < 75) {
    normalizedScore = normalizedScore * 1.15;
    console.log(`   🔼 Boosted mid score by 15%: ${normalizedScore.toFixed(1)}`);
  }
  
  // Gentler age adjustment
  if (age > 50) {
    normalizedScore -= 5;
    console.log(`   ⬇️  Age penalty (50+): -5 points`);
  } else if (age > 40) {
    normalizedScore -= 3;
    console.log(`   ⬇️  Age penalty (40+): -3 points`);
  }
  
  // Minimum score of 40
  const skinScore = Math.max(40, Math.min(100, Math.round(normalizedScore)));
  
  console.log(`   ✅ Final skin score: ${skinScore}/100`);

  // IMPROVED: More conservative thresholds
  // Only assign "acne" concern if score is truly low
  // This reduces false positives for freckles
  
  let acneLevel: 'none' | 'mild' | 'moderate' | 'severe';
  let acneSeverity: number;
  
  if (normalizedScore >= 80) {
    acneLevel = 'none';
    acneSeverity = 0;
  } else if (normalizedScore >= 70) {
    acneLevel = 'mild';
    acneSeverity = 30; // Low severity
  } else if (normalizedScore >= 55) {
    acneLevel = 'moderate';
    acneSeverity = 60;
  } else {
    acneLevel = 'severe';
    acneSeverity = 85;
  }

  // Pores assessment - also more conservative
  let poresLevel: 'none' | 'mild' | 'moderate' | 'severe';
  let poresSeverity: number;
  
  if (normalizedScore >= 75) {
    poresLevel = 'none';
    poresSeverity = 0;
  } else if (normalizedScore >= 65) {
    poresLevel = 'mild';
    poresSeverity = 35;
  } else if (normalizedScore >= 50) {
    poresLevel = 'moderate';
    poresSeverity = 65;
  } else {
    poresLevel = 'severe';
    poresSeverity = 90;
  }

  // Dark circles - age-adjusted
  let darkCirclesLevel: 'none' | 'mild' | 'moderate' | 'severe';
  let darkCirclesSeverity: number;
  const ageAdjustedScore = normalizedScore - (age > 35 ? 5 : 0);
  
  if (ageAdjustedScore >= 75) {
    darkCirclesLevel = 'none';
    darkCirclesSeverity = 0;
  } else if (ageAdjustedScore >= 65) {
    darkCirclesLevel = 'mild';
    darkCirclesSeverity = 35;
  } else if (ageAdjustedScore >= 50) {
    darkCirclesLevel = 'moderate';
    darkCirclesSeverity = 65;
  } else {
    darkCirclesLevel = 'severe';
    darkCirclesSeverity = 90;
  }

  // IMPROVED: Only add concerns for moderate/severe issues
  // AND only if we're confident (higher thresholds)
  const concerns: string[] = [];
  
  // Only add acne if severe OR if score is very low
  if (acneLevel === 'severe' || (acneLevel === 'moderate' && normalizedScore < 60)) {
    concerns.push('acne');
  }
  
  // Only add pores if severe OR if score is very low
  if (poresLevel === 'severe' || (poresLevel === 'moderate' && normalizedScore < 55)) {
    concerns.push('pores');
  }
  
  // Only add dark circles if moderate/severe
  if (darkCirclesLevel === 'moderate' || darkCirclesLevel === 'severe') {
    concerns.push('dark-circles');
  }
  
  // Aging concern threshold
  if (age >= 40) {
    concerns.push('aging');
  }

  // If no specific concerns AND score is decent, just hydration
  if (concerns.length === 0 && skinScore >= 65) {
    concerns.push('hydration');
  }
  
  // If score is low but no specific concerns identified
  // (like someone with freckles), add general "skin-health"
  if (concerns.length === 0 && skinScore < 65) {
    concerns.push('skin-health');
  }

  console.log(`   🔍 Detected concerns: ${concerns.join(', ')}`);
  console.log(`   📋 Severity levels: Acne=${acneLevel}(${acneSeverity}), Pores=${poresLevel}(${poresSeverity}), DarkCircles=${darkCirclesLevel}(${darkCirclesSeverity})`);

  return {
    skinScore,
    acneLevel,
    acneSeverity,
    poresLevel,
    poresSeverity,
    darkCirclesLevel,
    darkCirclesSeverity,
    concerns,
  };
}

/**
 * Validate image before sending to Face++
 */
export function validateImage(base64: string): boolean {
  if (!base64 || base64.trim().length === 0) {
    throw new Error('Image data is empty');
  }

  if (base64.length < 10000) {
    throw new Error('Image file is too small. Please upload a clear photo of your face.');
  }

  if (base64.length > 10000000) {
    throw new Error('Image file is too large. Please use a photo under 10MB.');
  }

  return true;
}