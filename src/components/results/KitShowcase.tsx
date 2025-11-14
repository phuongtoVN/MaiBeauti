'use client';

import React from 'react';
import { PersonalizedKit } from '@/lib/mockRecommendations';
import { Sunrise, Moon, Clock, Package, TrendingUp } from 'lucide-react';
import { getUrgencyMessage } from '@/lib/mockRecommendations';

interface KitShowcaseProps {
  kit: PersonalizedKit;
  onGetKit?: () => void;
}

export default function KitShowcase({ kit, onGetKit }: KitShowcaseProps) {
  const urgencyMessage = getUrgencyMessage();
  const discountPercent = Math.round((kit.savings / kit.totalPrice) * 100);
  
  return (
    <div className="bg-gradient-to-br from-rose-50 to-purple-50 rounded-3xl p-8 shadow-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-3">
          Your Complete Personalized Kit
        </h2>
        <p className="text-xl text-gray-600">
          Everything you need for healthy, glowing skin
        </p>
      </div>
      
      {/* Routines Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Morning Routine */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl">
              <Sunrise className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Morning Routine</h3>
          </div>
          
          <div className="space-y-4">
            {kit.morningRoutine.map((step) => (
              <div key={`morning-${step.step}`} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-rose-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-1">{step.product.name}</h4>
                  <p className="text-sm text-gray-600 mb-1">{step.instruction}</p>
                  <p className="text-sm font-semibold text-rose-600">
                    ${step.product.discountPrice || step.product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Evening Routine */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
              <Moon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Evening Routine</h3>
          </div>
          
          <div className="space-y-4">
            {kit.eveningRoutine.map((step) => (
              <div key={`evening-${step.step}`} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-rose-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-1">{step.product.name}</h4>
                  <p className="text-sm text-gray-600 mb-1">{step.instruction}</p>
                  <p className="text-sm font-semibold text-rose-600">
                    ${step.product.discountPrice || step.product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Pricing Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <Package className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">Individual Prices</p>
            <p className="text-2xl font-bold text-gray-400 line-through">
              ${kit.totalPrice}
            </p>
          </div>
          
          <div className="text-center">
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">Your Savings</p>
            <p className="text-2xl font-bold text-green-500">
              ${kit.savings}
            </p>
            <p className="text-xs text-green-600 font-semibold">
              {discountPercent}% OFF
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-purple-600 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-white font-bold text-lg">$</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Bundle Price</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
              ${kit.bundlePrice}
            </p>
          </div>
        </div>
        
        {/* Urgency Indicator */}
        <div className="flex items-center justify-center gap-2 mb-4 p-3 bg-rose-50 rounded-lg">
          <Clock className="w-4 h-4 text-rose-600 animate-pulse" />
          <span className="text-sm font-semibold text-rose-600">
            🔥 {urgencyMessage}
          </span>
        </div>
        
        {/* Main CTA */}
        <button
          onClick={onGetKit}
          className="w-full py-5 px-8 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-xl rounded-2xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
          GET MY COMPLETE KIT NOW
          <span className="block text-sm mt-1 opacity-90">
            Free shipping on orders over $50
          </span>
        </button>
      </div>
      
      {/* Benefits */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-3xl mb-2">✨</div>
          <p className="text-sm font-semibold text-gray-700">Personalized</p>
        </div>
        <div className="text-center">
          <div className="text-3xl mb-2">🔬</div>
          <p className="text-sm font-semibold text-gray-700">Clinically Tested</p>
        </div>
        <div className="text-center">
          <div className="text-3xl mb-2">🌿</div>
          <p className="text-sm font-semibold text-gray-700">Clean Ingredients</p>
        </div>
        <div className="text-center">
          <div className="text-3xl mb-2">💯</div>
          <p className="text-sm font-semibold text-gray-700">Money Back</p>
        </div>
      </div>
    </div>
  );
}