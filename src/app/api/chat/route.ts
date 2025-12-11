import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabaseAdmin } from '@/lib/supabase';
import { products } from '@/lib/products';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key',
});

// Simple in-memory rate limiting
const rateLimit = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // 10 requests per minute

function checkRateLimit(ip: string) {
  const now = Date.now();
  const record = rateLimit.get(ip) || { count: 0, lastReset: now };

  if (now - record.lastReset > RATE_LIMIT_WINDOW) {
    record.count = 0;
    record.lastReset = now;
  }

  if (record.count >= MAX_REQUESTS) {
    return false;
  }

  record.count++;
  rateLimit.set(ip, record);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many messages. Please wait a moment.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { messages, analysisId } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // 1. Fetch Context (if analysisId is provided)
    let context = '';
    if (analysisId && supabaseAdmin) {
      console.log('🔍 Fetching analysis context for chat:', analysisId);
      const { data: analysis, error } = await supabaseAdmin
        .from('skin_analyses')
        .select('*')
        .eq('id', analysisId)
        .single();

      if (!error && analysis) {
        context = `
USER SKIN ANALYSIS CONTEXT:
- Skin Score: ${analysis.skin_score}/100
- Acne Level: ${analysis.acne_level} (Severity: ${analysis.acne_severity || 'N/A'})
- Pores Level: ${analysis.pores_level} (Severity: ${analysis.pores_severity || 'N/A'})
- Dark Circles: ${analysis.dark_circles} (Severity: ${analysis.dark_circles_severity || 'N/A'})
- Age: ${analysis.age}
- Concerns: ${Array.isArray(analysis.concerns) ? analysis.concerns.join(', ') : analysis.concerns}
`;
      }
    }

    // 2. Prepare Product Catalog Summary (optimized for tokens)
    const productCatalog = products.map(p =>
      `- ${p.name} (ID: ${p.id}): $${p.price}. For: ${p.concerns.join(', ')}. Key ingredients: ${p.ingredients.slice(0, 3).join(', ')}.`
    ).join('\n');

    // 3. Construct System Prompt
    const systemPrompt = `
You are Mai, an expert AI skincare consultant for MaiBeauti.

PERSONA:
- Friendly, approachable, knowledgeable "big sister" vibe.
- Encouraging and positive.
- Scientific but accessible explanations.
- Concises responses (under 150 words unless explaining a routine).

CRITICAL OUTPUT FORMAT:
You MUST respond with valid JSON only. format:
{
  "content": "Your conversational response here (use markdown for bolding/lists)",
  "suggestedActions": [
    { "label": "Short Button Text", "action": "navigate" | "analyze_skin" | "add_to_cart", "value": "url_or_id" }
  ],
  "productCards": [
    { 
      "id": "exact_product_id_from_catalog", 
      "name": "Exact Name", 
      "price": 29, 
      "image": "image_url_from_catalog", 
      "whyRecommended": "1 sentence why this fits the user",
      "rating": 4.8,
      "originalPrice": 35 
    }
  ]
}

BUSINESS RULES:
1. Skin Analysis is FREE. If asked, say it's free and provide an action to "/analyze-skin".
2. If user has specific concerns (acne, aging), recommend 1-3 products from the catalog.
3. If recommending products, MUST include "productCards" in the JSON.
4. If explaining a routine, use bullet points in the "content".
5. Always offer a "suggestedAction" relevant to the conversation.

PRODUCT CATALOG:
${productCatalog}

USER CONTEXT:
${context ? context : 'No specific skin analysis provided yet. Encourage them to take the free analysis to get personalized results.'}

CURRENT CONVERSATION HISTORY:
(See user messages)
`;

    // 4. Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: "json_object" },
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-10), // Keep last 10 messages for memory
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const replyContent = completion.choices[0].message.content;

    // Parse JSON
    let parsedReply;
    try {
      parsedReply = JSON.parse(replyContent || '{}');
    } catch {
      console.error("Failed to parse OpenAI JSON:", replyContent);
      // Fallback if model fails to output JSON
      parsedReply = {
        content: replyContent || "I'm having a little trouble formatting my response, but I'm here to help!",
        suggestedActions: []
      };
    }

    // Hydrate product cards with full image URLs if needed (though prompt should have them, safer to just rely on ID in future, but for now prompt has catalog)
    // We can just return the parsed reply directly as our prompt instructed the model to include imagery. 
    // Optimization: In a real app we might just get IDs and hydrate from DB here.
    // For now, let's look up the images from our local catalog to ensure they are correct (model might hallucinate URLs)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (parsedReply.productCards) {
      parsedReply.productCards = parsedReply.productCards.map((card: any) => {
        const product = products.find(p => p.id === card.id);
        if (product) {
          return {
            ...card,
            image: product.image, // Ensure correct image
            originalPrice: product.discountPrice ? product.price : undefined, // Logic adjustment if needed
            price: product.discountPrice || product.price // Logic adjustment
          };
        }
        return card;
      });
    }

    return NextResponse.json(parsedReply);

  } catch (error) {
    console.error('💥 Chat API Error:', error);
    return NextResponse.json(
      {
        content: "I'm having a little trouble connecting right now. Please try again in a moment!",
        suggestedActions: [
          { label: "Browse Products", action: "navigate", value: "/products" }
        ]
      },
      { status: 500 }
    );
  }
}