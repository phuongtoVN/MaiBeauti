'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingCart, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { getTotalItems, openCart } = useCartStore();
  const { user, signOut } = useAuth();
  const cartItemCount = getTotalItems();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
          MaiBeauti
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/analyze" className="text-gray-700 hover:text-rose-500 font-medium transition-colors">
            Analyze
          </Link>
          <Link href="/products" className="text-gray-700 hover:text-rose-500 font-medium transition-colors">
            Products
          </Link>
          <Link href="/chat" className="text-gray-700 hover:text-rose-500 font-medium transition-colors">
            Chat
          </Link>

          {/* Cart Button */}
          <button
            onClick={openCart}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Shopping cart"
          >
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-rose-500 to-purple-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {cartItemCount > 9 ? '9+' : cartItemCount}
              </span>
            )}
          </button>

          {/* Auth Section */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user.user_metadata?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="font-medium text-gray-700">{user.user_metadata?.name || 'Account'}</span>
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      href="/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <hr className="my-2 border-gray-200" />
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        signOut();
                      }}
                      className="flex items-center gap-3 px-4 py-2 w-full text-left text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/auth/signin" className="px-6 py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="md:hidden flex items-center gap-3">
          {/* Mobile Cart Button */}
          <button
            onClick={openCart}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Shopping cart"
          >
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-rose-500 to-purple-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {cartItemCount > 9 ? '9+' : cartItemCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-6 space-y-4">
            <Link
              href="/analyze"
              onClick={closeMenu}
              className="block text-gray-700 hover:text-rose-500 font-medium py-2 transition-colors"
            >
              Analyze
            </Link>
            <Link
              href="/products"
              onClick={closeMenu}
              className="block text-gray-700 hover:text-rose-500 font-medium py-2 transition-colors"
            >
              Products
            </Link>
            <Link
              href="/chat"
              onClick={closeMenu}
              className="block text-gray-700 hover:text-rose-500 font-medium py-2 transition-colors"
            >
              Chat
            </Link>

            {user ? (
              <>
                <hr className="border-gray-200" />
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className="block text-gray-700 hover:text-rose-500 font-medium py-2 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className="block text-gray-700 hover:text-rose-500 font-medium py-2 transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    closeMenu();
                    signOut();
                  }}
                  className="block w-full text-left text-red-600 hover:text-red-700 font-medium py-2 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                onClick={closeMenu}
                className="block w-full px-6 py-3 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-semibold rounded-lg text-center hover:shadow-lg transition-all duration-300"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}