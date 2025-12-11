'use client';

import { ShoppingCart, Star } from 'lucide-react';
import { ProductCard } from '@/store/chatStore';

interface ProductCardInChatProps {
  product: ProductCard;
  onAddToCart: (productId: string) => void;
}

export default function ProductCardInChat({ product, onAddToCart }: ProductCardInChatProps) {
  return (
    <div className="bg-white border text-left border-rose-100 rounded-xl p-3 min-w-[240px] max-w-[260px] flex-shrink-0 shadow-sm hover:shadow-md transition-all">
      <div className="relative aspect-square mb-3 rounded-lg overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.originalPrice && product.originalPrice > product.price && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            SALE
          </span>
        )}
      </div>

      <h3 className="font-bold text-gray-900 text-sm mb-1 leading-tight line-clamp-1">{product.name}</h3>
      <p className="text-xs text-purple-600 font-medium mb-2 line-clamp-2 min-h-[2.5em]">{product.whyRecommended}</p>

      <div className="flex items-center space-x-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={12}
            className={`${i < (product.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        {product.rating && <span className="text-xs text-gray-400 ml-1">({product.rating})</span>}
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex flex-col">
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">${product.originalPrice}</span>
          )}
          <span className="text-lg font-bold text-gray-900">${product.price}</span>
        </div>
        <button
          onClick={() => onAddToCart(product.id)}
          className="flex items-center justify-center w-8 h-8 bg-black text-white rounded-full hover:bg-gray-800 transition shadow-md"
          title="Add to Cart"
        >
          <ShoppingCart size={14} />
        </button>
      </div>
    </div>
  );
}