'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/lib/products';
import { ChevronLeft, ChevronRight, Star, ShoppingCart } from 'lucide-react';

interface ProductCarouselProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
  autoRotate?: boolean;
  rotateInterval?: number;
}

export default function ProductCarousel({
  products,
  onAddToCart,
  autoRotate = true,
  rotateInterval = 5000
}: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };
  
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  
  // Auto-rotate effect
  useEffect(() => {
    if (!autoRotate || isPaused || products.length <= 1) return;
    
    const interval = setInterval(nextSlide, rotateInterval);
    return () => clearInterval(interval);
  }, [autoRotate, isPaused, rotateInterval, currentIndex]);
  
  if (products.length === 0) return null;
  
  const currentProduct = products[currentIndex];
  const hasDiscount = currentProduct.discountPrice && currentProduct.discountPrice < currentProduct.price;
  
  return (
    <div
      className="relative bg-white rounded-2xl shadow-lg overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Product Display */}
      <div className="p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image */}
          <div className="md:w-1/2">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
              <img
                src={currentProduct.image}
                alt={currentProduct.name}
                className="w-full h-full object-cover"
              />
              {hasDiscount && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  SAVE ${currentProduct.price - currentProduct.discountPrice!}
                </div>
              )}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="md:w-1/2 flex flex-col justify-center">
            <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-2">
              {currentProduct.category}
            </p>
            
            <h3 className="text-3xl font-bold text-gray-900 mb-3">
              {currentProduct.name}
            </h3>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(currentProduct.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {currentProduct.rating} ({currentProduct.reviewCount} reviews)
              </span>
            </div>
            
            {/* Description */}
            <p className="text-gray-600 mb-4">
              {currentProduct.description}
            </p>
            
            {/* Best For */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">Best for:</p>
              <div className="flex flex-wrap gap-2">
                {currentProduct.concerns.slice(0, 3).map((concern) => (
                  <span
                    key={concern}
                    className="px-3 py-1 bg-rose-50 text-rose-700 text-sm rounded-full"
                  >
                    {concern.split('-').join(' ')}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Price and CTA */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                {hasDiscount ? (
                  <>
                    <span className="text-3xl font-bold text-gray-900">
                      ${currentProduct.discountPrice}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      ${currentProduct.price}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">
                    ${currentProduct.price}
                  </span>
                )}
              </div>
              
              <button
                onClick={() => onAddToCart && onAddToCart(currentProduct)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Kit
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Arrows */}
      {products.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Previous product"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Next product"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </>
      )}
      
      {/* Dots Indicator */}
      {products.length > 1 && (
        <div className="flex items-center justify-center gap-2 pb-6">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-gradient-to-r from-rose-500 to-purple-600'
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to product ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}