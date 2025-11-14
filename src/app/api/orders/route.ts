import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Orders API Endpoint
 * 
 * POST /api/orders - Create new order
 * GET /api/orders?orderId={id} - Get order details
 */

// ============================================
// POST - Create Order
// ============================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('📦 Creating new order...');

    // Validate required fields
    const requiredFields = ['email', 'totalAmount', 'subtotal', 'tax', 'shippingAddress', 'items'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { 
            success: false,
            error: `Missing required field: ${field}` 
          },
          { status: 400 }
        );
      }
    }

    // Validate items array
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Order must contain at least one item' 
        },
        { status: 400 }
      );
    }

    // Create order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: body.userId || null,
        email: body.email,
        total_amount: body.totalAmount,
        subtotal: body.subtotal,
        tax: body.tax,
        shipping: body.shipping || 0,
        discount: body.discount || 0,
        promo_code: body.promoCode || null,
        status: 'pending',
        shipping_address: body.shippingAddress,
      })
      .select()
      .single();

    if (orderError) {
      console.error('❌ Order creation error:', orderError);
      throw new Error('Failed to create order');
    }

    console.log('✅ Order created with ID:', order.id);

    // Create order items
    const orderItems = body.items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId || item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('❌ Order items creation error:', itemsError);
      // Try to delete the order since items failed
      await supabaseAdmin
        .from('orders')
        .delete()
        .eq('id', order.id);
      
      throw new Error('Failed to create order items');
    }

    console.log(`✅ Created ${orderItems.length} order items`);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      order: {
        id: order.id,
        email: order.email,
        totalAmount: order.total_amount,
        status: order.status,
        createdAt: order.created_at,
      },
    });

  } catch (error: any) {
    console.error('💥 Order creation error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create order',
      },
      { status: 500 }
    );
  }
}

// ============================================
// GET - Retrieve Order
// ============================================
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Order ID is required' 
        },
        { status: 400 }
      );
    }

    console.log('📦 Fetching order:', orderId);

    // Fetch order with items and product details
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .eq('id', orderId)
      .single();

    if (error) {
      console.error('❌ Order fetch error:', error);
      throw new Error('Order not found');
    }

    console.log('✅ Order found with', order.order_items?.length, 'items');

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        email: order.email,
        totalAmount: order.total_amount,
        subtotal: order.subtotal,
        tax: order.tax,
        shipping: order.shipping,
        discount: order.discount,
        promoCode: order.promo_code,
        status: order.status,
        shippingAddress: order.shipping_address,
        items: order.order_items,
        createdAt: order.created_at,
      },
    });

  } catch (error: any) {
    console.error('💥 Order fetch error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch order',
      },
      { status: 500 }
    );
  }
}