'use client';

import { ShoppingCart, Star } from 'lucide-react';

interface ProductCardInChatProps {
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
    targetsConcern: string;
    rating: number;
  };
  onAddToCart: (productId: string) => void;
}

export default function ProductCardInChat({ product, onAddToCart }: ProductCardInChatProps) {
  return (
    <div className="bg-white border-2 border-rose-100 rounded-xl p-4 mt-3 max-w-sm">
      <img 
        src={product.image} 
        alt={product.name}
        className="w-full h-40 object-cover rounded-lg mb-3"
      />
      <h3 className="font-bold text-gray-900 mb-1">{product.name}</h3>
      <p className="text-sm text-gray-600 mb-2">{product.targetsConcern}</p>
      
      <div className="flex items-center space-x-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < product.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-rose-600">${product.price}</span>
        <button
          onClick={() => onAddToCart(product.id)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-full hover:shadow-lg transition"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}