'use client';

import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilters, { FilterState } from '@/components/products/ProductFilters';
import { products, Product } from '@/lib/products';
import { Search, SlidersHorizontal, X } from 'lucide-react';

type SortOption = 'newest' | 'price-low' | 'price-high' | 'rating' | 'popular';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 100],
    skinTypes: [],
    concerns: [],
    minRating: 0,
  });

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
  }, [products, searchQuery, filters, sortBy]);

  const handleAddToCart = (product: Product) => {
    // TODO: Implement cart functionality with Zustand
    console.log('Adding to cart:', product);
    alert(`Added ${product.name} to cart!`);
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
            {/* Desktop Filters Sidebar */}
            <aside className="hidden md:block w-80 flex-shrink-0">
              <div className="sticky top-24">
                <ProductFilters
                  filters={filters}
                  onFilterChange={setFilters}
                />
              </div>
            </aside>

            {/* Product Grid */}
            <main className="flex-1">
              <ProductGrid
                products={filteredAndSortedProducts}
                onAddToCart={handleAddToCart}
              />
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