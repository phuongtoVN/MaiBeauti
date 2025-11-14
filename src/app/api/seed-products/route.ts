import { NextResponse } from 'next/server';
import { seedProducts } from '@/lib/seedProducts';

/**
 * Seed Products API Endpoint
 * 
 * GET /api/seed-products
 * 
 * This endpoint triggers the product seeding process.
 * Should only be used in development!
 */

export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Seeding not allowed in production' },
      { status: 403 }
    );
  }

  try {
    const result = await seedProducts();

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${result.count} products`,
      products: result.products,
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}