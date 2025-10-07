'use client';

import React, { useState } from 'react';
import { Testimonial } from '@/lib/mockAnalysisData';
import { Star, Calendar } from 'lucide-react';

interface BeforeAfterCardProps {
  testimonial: Testimonial;
}

export default function BeforeAfterCard({ testimonial }: BeforeAfterCardProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.clientX, rect);
  };
  
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(touch.clientX, rect);
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
      {/* Before/After Slider */}
      <div
        className="relative aspect-square cursor-ew-resize select-none"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
      >
        {/* Before Image */}
        <div className="absolute inset-0">
          <img
            src={testimonial.beforeImage}
            alt="Before"
            className="w-full h-full object-cover"
            draggable="false"
          />
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
            BEFORE
          </div>
        </div>
        
        {/* After Image */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={testimonial.afterImage}
            alt="After"
            className="w-full h-full object-cover"
            draggable="false"
          />
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            AFTER
          </div>
        </div>
        
        {/* Slider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center">
            <div className="flex gap-1">
              <div className="w-0.5 h-4 bg-gray-400"></div>
              <div className="w-0.5 h-4 bg-gray-400"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonial Content */}
      <div className="p-6">
        {/* Name and Age */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900">
            {testimonial.name}, {testimonial.age}
          </h3>
          <div className="flex items-center gap-1">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </div>
        
        {/* Concern Tag */}
        <div className="inline-block px-3 py-1 bg-rose-50 text-rose-700 text-sm font-semibold rounded-full mb-3">
          {testimonial.concern}
        </div>
        
        {/* Timeline */}
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Results in {testimonial.timeline}</span>
        </div>
        
        {/* Quote */}
        <p className="text-gray-700 italic">
          "{testimonial.quote}"
        </p>
      </div>
    </div>
  );
}