/**
 * Review Skeleton - Loading State Component
 *
 * Features:
 * - Shimmer animation effects
 * - Varied heights for masonry layout
 * - Responsive design
 * - Buddhist-inspired gentle animations
 */

import React from 'react';

export const ReviewSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse break-inside-avoid mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="w-3 h-3 bg-gray-200 rounded"></div>
      </div>

      {/* Content */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="h-3 bg-gray-200 rounded w-8"></div>
          <div className="h-3 bg-gray-200 rounded w-8"></div>
          <div className="h-3 bg-gray-200 rounded w-8"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  );
};
