import { supabaseAdmin } from './supabase';
import { products as mockProducts } from './products';

/**
 * Seed Products Script
 * 
 * This script:
 * 1. Transforms mock products to match database schema
 * 2. Inserts them into Supabase
 * 3. Handles duplicates gracefully
 * 
 * Run once to populate database
 */

export async function seedProducts() {
  console.log('🌱 Starting product seeding...');
  console.log(`📦 Found ${mockProducts.length} products to seed`);

  try {
    // Transform products to match database schema
    const productsData = mockProducts.map(product => ({
      // Required fields
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      
      // Optional pricing
      discount_price: product.discountPrice || null,
      
      // Arrays
      skin_types: product.skinType || [],
      concerns: product.concerns || [],
      images: product.images || [],
      ingredients: product.ingredients || [],
      
      // Strings
      image_url: product.image || null,
      how_to_use: product.howToUse || null,
      size: product.size || '50ml',
      
      // Numbers
      rating: product.rating || 0,
      review_count: product.reviewCount || 0,
      
      // Boolean
      in_stock: product.inStock !== undefined ? product.inStock : true,
    }));

    console.log('✨ Transformed products to database format');

    // Check if products already exist
    const { data: existingProducts, error: checkError } = await supabaseAdmin
      .from('products')
      .select('id, name');

    if (checkError) {
      throw checkError;
    }

    if (existingProducts && existingProducts.length > 0) {
      console.log(`⚠️  Found ${existingProducts.length} existing products`);
      console.log('🗑️  Clearing existing products...');
      
      // Delete existing products
      const { error: deleteError } = await supabaseAdmin
        .from('products')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (deleteError) {
        throw deleteError;
      }
      
      console.log('✅ Existing products cleared');
    }

    // Insert new products
    console.log('📥 Inserting products into database...');
    
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert(productsData)
      .select();

    if (error) {
      throw error;
    }

    console.log('✅ Products seeded successfully!');
    console.log(`📊 Inserted ${data?.length || 0} products`);
    
    // Show first 3 products as sample
    if (data && data.length > 0) {
      console.log('\n📦 Sample products:');
      data.slice(0, 3).forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.name} - $${product.price}`);
      });
    }

    return {
      success: true,
      count: data?.length || 0,
      products: data,
    };

  } catch (error: any) {
    console.error('❌ Error seeding products:', error.message);
    throw error;
  }
}

/**
 * Run this function directly if executed as script
 */
if (require.main === module) {
  seedProducts()
    .then(() => {
      console.log('\n✨ Seeding complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Seeding failed:', error);
      process.exit(1);
    });
}