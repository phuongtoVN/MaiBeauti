'use client';

import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilters, { FilterState } from '@/components/products/ProductFilters';
import { products, Product } from '@/lib/products';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useToastStore } from '@/store/toastStore';

type SortOption = 'newest' | 'price-low' | 'price-high' | 'rating' | 'popular';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showDesktopFilters, setShowDesktopFilters] = useState(false); // Hidden by default
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 100],
    skinTypes: [],
    concerns: [],
    minRating: 0,
  });

  const { addItem, openCart } = useCartStore();
  const { addToast } = useToastStore();

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.concerns.some((concern) => concern.includes(query))
      );
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      result = result.filter((product) =>
        filters.categories.includes(product.category)
      );
    }

    // Apply price filter
    const effectivePrice = (product: Product) =>
      product.discountPrice || product.price;
    result = result.filter(
      (product) =>
        effectivePrice(product) >= filters.priceRange[0] &&
        effectivePrice(product) <= filters.priceRange[1]
    );

    // Apply skin type filter
    if (filters.skinTypes.length > 0) {
      result = result.filter((product) =>
        filters.skinTypes.some((type) => product.skinType.includes(type))
      );
    }

    // Apply concerns filter
    if (filters.concerns.length > 0) {
      result = result.filter((product) =>
        filters.concerns.some((concern) => product.concerns.includes(concern))
      );
    }

    // Apply rating filter
    if (filters.minRating > 0) {
      result = result.filter((product) => product.rating >= filters.minRating);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => effectivePrice(a) - effectivePrice(b));
        break;
      case 'price-high':
        result.sort((a, b) => effectivePrice(b) - effectivePrice(a));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
        break;
      case 'popular':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return result;
  }, [searchQuery, filters, sortBy]);

  const handleAddToCart = (product: Product) => {
    console.log('Adding product to cart:', product.name);
    addItem(product);
    addToast(`Added ${product.name} to cart!`, 'success');
    openCart();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
              Shop Products
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover personalized skincare solutions curated by AI to address your unique skin concerns
          </p>
        </div>
      </section>

      {/* Search and Sort Bar */}
      <section className="pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="md:hidden flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-shadow"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>

            {/* Desktop Filter Button */}
            <button
              onClick={() => setShowDesktopFilters(!showDesktopFilters)}
              className="hidden md:flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-shadow"
            >
              <SlidersHorizontal className="w-5 h-5" />
              {showDesktopFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-gray-600">
            Showing {filteredAndSortedProducts.length} of {products.length} products
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            {/* Desktop Filters Sidebar - Only show when toggled */}
            {showDesktopFilters && (
              <aside className="hidden md:block w-80 flex-shrink-0">
                <div className="sticky top-24">
                  <ProductFilters
                    filters={filters}
                    onFilterChange={setFilters}
                  />
                </div>
              </aside>
            )}

            {/* Product Grid */}
            <main className="flex-1">
              {filteredAndSortedProducts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-xl text-gray-600">No products found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedProducts.map((product) => {
                    const hasDiscount = product.discountPrice && product.discountPrice < product.price;
                    const discountPercentage = hasDiscount 
                      ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
                      : 0;

                    return (
                      <div key={product.id} className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                        {/* Badges */}
                        {(product.bestseller || product.new || hasDiscount) && (
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
                          <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-2">
                            {product.category}
                          </p>

                          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                            {product.name}
                          </h3>

                          {/* Rating */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(product.rating)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'fill-gray-200 text-gray-200'
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
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
                              onClick={() => handleAddToCart(product)}
                              className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-rose-500 to-purple-600 text-white hover:shadow-lg hover:scale-105"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <span className="hidden sm:inline">Add</span>
                            </button>
                          </div>

                          <p className="text-xs text-gray-500 mt-3">Size: {product.size}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </main>
          </div>
        </div>
      </section>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="absolute inset-y-0 left-0 w-full max-w-md bg-white shadow-2xl">
            <ProductFilters
              filters={filters}
              onFilterChange={setFilters}
              onClose={() => setShowMobileFilters(false)}
              isMobile={true}
            />
          </div>
        </div>
      )}

      {/* Footer CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-rose-500 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Not sure where to start?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Let our AI consultant analyze your skin and recommend the perfect routine
          </p>
          <button className="px-8 py-4 bg-white text-rose-600 font-bold text-lg rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            Get Your Free Skin Analysis
          </button>
        </div>
      </section>
    </div>
  );
}