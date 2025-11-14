'use client';

import React from 'react';
import { SkinConcern, getSeverityColor } from '@/lib/mockAnalysisData';
import { AlertCircle, TrendingUp } from 'lucide-react';
import { calculateImprovement } from '@/lib/mockRecommendations';

interface ConcernCardProps {
  concern: SkinConcern;
  onFixClick?: () => void;
}

export default function ConcernCard({ concern, onFixClick }: ConcernCardProps) {
  const colors = getSeverityColor(concern.severityLevel);
  const improvement = calculateImprovement(concern);
  
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-rose-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${colors.bg}`}>
            <AlertCircle className={`w-6 h-6 ${colors.text}`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{concern.name}</h3>
            <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text}`}>
              {concern.severityLevel.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
      
      {/* Severity Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Severity Level</span>
          <span className="text-sm font-bold text-gray-900">{concern.severity}/100</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${colors.gradient} transition-all duration-1000 ease-out rounded-full`}
            style={{ width: `${concern.severity}%` }}
          />
        </div>
      </div>
      
      {/* Description */}
      <p className="text-sm text-gray-600 mb-4">
        {concern.description}
      </p>
      
      {/* Improvement Potential */}
      <div className={`flex items-center gap-2 mb-4 p-3 rounded-lg ${colors.bg} bg-opacity-30`}>
        <TrendingUp className={`w-4 h-4 ${colors.text}`} />
        <span className={`text-sm font-semibold ${colors.text}`}>
          {improvement}
        </span>
      </div>
      
      {/* CTA Button */}
      <button
        onClick={onFixClick}
        className="w-full py-3 px-4 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        Fix This Now
      </button>
    </div>
  );
}