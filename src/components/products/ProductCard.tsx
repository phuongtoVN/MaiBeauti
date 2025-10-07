'use client';

import React from 'react';
import { Product } from '@/lib/products';
import { Star, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.bestseller && (
          <span className="bg-gradient-to-r from-rose-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            BESTSELLER
          </span>
        )}
        {product.new && (
          <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            NEW
          </span>
        )}
        {hasDiscount && (
          <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            -{discountPercentage}%
          </span>
        )}
      </div>

      {/* Out of Stock Overlay */}
      {!product.inStock && (
        <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center">
          <span className="text-white text-xl font-bold">OUT OF STOCK</span>
        </div>
      )}

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Product Info */}
      <div className="p-6">
        {/* Category */}
        <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-2">
          {product.category}
        </p>

        {/* Product Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-200 text-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        {/* Best For Tags */}
        {product.concerns.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {product.concerns.slice(0, 2).map((concern) => (
              <span
                key={concern}
                className="text-xs bg-rose-50 text-rose-700 px-2 py-1 rounded-full"
              >
                {concern.split('-').join(' ')}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            {hasDiscount ? (
              <>
                <span className="text-2xl font-bold text-gray-900">
                  ${product.discountPrice}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ${product.price}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-gray-900">
                ${product.price}
              </span>
            )}
          </div>

          <button
            onClick={() => onAddToCart && onAddToCart(product)}
            disabled={!product.inStock}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
              product.inStock
                ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>

        {/* Size Info */}
        <p className="text-xs text-gray-500 mt-3">Size: {product.size}</p>
      </div>
    </div>
  );
}