'use client';

import React from 'react';
import { X } from 'lucide-react';

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  skinTypes: string[];
  concerns: string[];
  minRating: number;
}

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export default function ProductFilters({
  filters,
  onFilterChange,
  onClose,
  isMobile = false,
}: ProductFiltersProps) {
  const categories = [
    { id: 'cleanser', label: 'Cleansers' },
    { id: 'moisturizer', label: 'Moisturizers' },
    { id: 'serum', label: 'Serums' },
    { id: 'treatment', label: 'Treatments' },
    { id: 'sunscreen', label: 'Sunscreen' },
  ];

  const skinTypes = [
    { id: 'all', label: 'All Skin Types' },
    { id: 'dry', label: 'Dry' },
    { id: 'oily', label: 'Oily' },
    { id: 'combination', label: 'Combination' },
    { id: 'sensitive', label: 'Sensitive' },
    { id: 'acne-prone', label: 'Acne-Prone' },
  ];

  const concerns = [
    { id: 'acne', label: 'Acne & Breakouts' },
    { id: 'wrinkles', label: 'Wrinkles' },
    { id: 'dark-circles', label: 'Dark Circles' },
    { id: 'large-pores', label: 'Large Pores' },
    { id: 'dryness', label: 'Dryness' },
    { id: 'oiliness', label: 'Oiliness' },
    { id: 'dark-spots', label: 'Dark Spots' },
    { id: 'dullness', label: 'Dullness' },
  ];

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handleSkinTypeToggle = (skinType: string) => {
    const newSkinTypes = filters.skinTypes.includes(skinType)
      ? filters.skinTypes.filter((s) => s !== skinType)
      : [...filters.skinTypes, skinType];
    onFilterChange({ ...filters, skinTypes: newSkinTypes });
  };

  const handleConcernToggle = (concern: string) => {
    const newConcerns = filters.concerns.includes(concern)
      ? filters.concerns.filter((c) => c !== concern)
      : [...filters.concerns, concern];
    onFilterChange({ ...filters, concerns: newConcerns });
  };

  const handlePriceChange = (index: 0 | 1, value: number) => {
    const newPriceRange: [number, number] = [...filters.priceRange];
    newPriceRange[index] = value;
    onFilterChange({ ...filters, priceRange: newPriceRange });
  };

  const handleClearAll = () => {
    onFilterChange({
      categories: [],
      priceRange: [0, 100],
      skinTypes: [],
      concerns: [],
      minRating: 0,
    });
  };

  const activeFilterCount =
    filters.categories.length +
    filters.skinTypes.length +
    filters.concerns.length +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 100 ? 1 : 0);

  return (
    <div className={`bg-white ${isMobile ? 'h-full overflow-y-auto' : 'rounded-2xl shadow-lg'} p-6`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Filters</h2>
          {activeFilterCount > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
            </p>
          )}
        </div>
        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Clear All Button */}
      {activeFilterCount > 0 && (
        <button
          onClick={handleClearAll}
          className="w-full mb-6 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
        >
          Clear All Filters
        </button>
      )}

      {/* Categories */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(category.id)}
                onChange={() => handleCategoryToggle(category.id)}
                className="w-5 h-5 rounded border-gray-300 text-rose-500 focus:ring-rose-500"
              />
              <span className="text-gray-700">{category.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Price Range</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Min</label>
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                min="0"
                max={filters.priceRange[1]}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Max</label>
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                min={filters.priceRange[0]}
                max="100"
              />
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={filters.priceRange[1]}
            onChange={(e) => handlePriceChange(1, Number(e.target.value))}
            className="w-full accent-rose-500"
          />
        </div>
      </div>

      {/* Skin Type */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Skin Type</h3>
        <div className="space-y-2">
          {skinTypes.map((skinType) => (
            <label
              key={skinType.id}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <input
                type="checkbox"
                checked={filters.skinTypes.includes(skinType.id)}
                onChange={() => handleSkinTypeToggle(skinType.id)}
                className="w-5 h-5 rounded border-gray-300 text-rose-500 focus:ring-rose-500"
              />
              <span className="text-gray-700">{skinType.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Concerns */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Skin Concerns</h3>
        <div className="space-y-2">
          {concerns.map((concern) => (
            <label
              key={concern.id}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <input
                type="checkbox"
                checked={filters.concerns.includes(concern.id)}
                onChange={() => handleConcernToggle(concern.id)}
                className="w-5 h-5 rounded border-gray-300 text-rose-500 focus:ring-rose-500"
              />
              <span className="text-gray-700">{concern.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Minimum Rating</h3>
        <div className="space-y-2">
          {[4.5, 4.0, 3.5, 3.0].map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === rating}
                onChange={() => onFilterChange({ ...filters, minRating: rating })}
                className="w-5 h-5 border-gray-300 text-rose-500 focus:ring-rose-500"
              />
              <span className="text-gray-700">{rating}+ Stars</span>
            </label>
          ))}
          <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
            <input
              type="radio"
              name="rating"
              checked={filters.minRating === 0}
              onChange={() => onFilterChange({ ...filters, minRating: 0 })}
              className="w-5 h-5 border-gray-300 text-rose-500 focus:ring-rose-500"
            />
            <span className="text-gray-700">All Ratings</span>
          </label>
        </div>
      </div>
    </div>
  );
}