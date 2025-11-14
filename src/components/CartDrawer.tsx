'use client';

import React, { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CartDrawer() {
  const router = useRouter();
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();

  useEffect(() => {
    console.log('CartDrawer rendered, isOpen:', isOpen);
  }, [isOpen]);

  const total = getTotalPrice();
  const itemCount = getTotalItems();
  const freeShippingThreshold = 50;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - total);
  const hasFreeShipping = total >= freeShippingThreshold;

  console.log('CartDrawer state:', { isOpen, itemCount, total });

  if (!isOpen) return null;

  const handleCheckout = () => {
    closeCart();
    // TODO: Navigate to checkout page
    alert('Checkout functionality coming soon!');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-rose-500" />
            <h2 className="text-2xl font-bold text-gray-900">
              Shopping Cart
              {itemCount > 0 && (
                <span className="text-lg text-gray-500 ml-2">({itemCount})</span>
              )}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Free Shipping Banner */}
        {!hasFreeShipping && items.length > 0 && (
          <div className="p-4 bg-gradient-to-r from-rose-50 to-purple-50 border-b border-gray-200">
            <p className="text-sm text-gray-700 text-center">
              <span className="font-semibold">
                Add ${remainingForFreeShipping.toFixed(2)} more
              </span>{' '}
              for free shipping! 🚚
            </p>
            <div className="w-full h-2 bg-white rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-purple-600 transition-all duration-300"
                style={{ width: `${Math.min((total / freeShippingThreshold) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {hasFreeShipping && items.length > 0 && (
          <div className="p-4 bg-green-50 border-b border-green-200">
            <p className="text-sm text-green-800 text-center font-semibold">
              ✓ You've unlocked free shipping!
            </p>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-20 h-20 text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-600 mb-6">
                Add some products to get started!
              </p>
              <button
                onClick={() => {
                  closeCart();
                  router.push('/products');
                }}
                className="px-6 py-3 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                Shop Products
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const price = item.product.discountPrice || item.product.price;
                const originalPrice = item.product.price;
                const hasDiscount = item.product.discountPrice !== undefined;

                return (
                  <div
                    key={item.product.id}
                    className="flex gap-4 bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {item.product.size}
                      </p>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold text-gray-900">
                          ${price}
                        </span>
                        {hasDiscount && (
                          <span className="text-sm text-gray-500 line-through">
                            ${originalPrice}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="p-1.5 bg-white hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
                          >
                            <Minus className="w-4 h-4 text-gray-600" />
                          </button>
                          <span className="w-8 text-center font-semibold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="p-1.5 bg-white hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
                          >
                            <Plus className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            {/* Subtotal */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-700">Subtotal</span>
              <span className="text-2xl font-bold text-gray-900">
                ${total.toFixed(2)}
              </span>
            </div>

            {/* Shipping Info */}
            <p className="text-sm text-gray-600 text-center mb-4">
              {hasFreeShipping
                ? 'Free shipping included'
                : 'Shipping calculated at checkout'}
            </p>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full py-4 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-lg rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Continue Shopping */}
            <button
              onClick={closeCart}
              className="w-full mt-3 py-3 text-gray-600 font-semibold hover:text-gray-900 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}