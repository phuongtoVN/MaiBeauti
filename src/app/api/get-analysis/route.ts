import { NextResponse } from 'next/server';

interface StoredAnalysis {
  skinQualityScore: number | null;
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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'No analysis ID provided' },
      { status: 400 }
    );
  }

  const analysis = global.tempAnalysis?.[id];

  if (!analysis) {
    return NextResponse.json(
      { success: false, error: 'Analysis not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    analysis,
  });
}