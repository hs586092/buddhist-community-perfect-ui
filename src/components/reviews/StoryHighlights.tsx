/**
 * Story Highlights - Instagram-style Featured Reviews
 *
 * Features:
 * - Circular story previews
 * - Gradient borders for active stories
 * - Smooth carousel scrolling
 * - Buddhist-themed categories
 */

import React from 'react';

interface StoryHighlightsProps {
  className?: string;
}

export const StoryHighlights: React.FC<StoryHighlightsProps> = ({ className = '' }) => {
  const highlights = [
    { id: 1, title: '명상', emoji: '🧘‍♂️' },
    { id: 2, title: '법문', emoji: '📿' },
    { id: 3, title: '템플', emoji: '🏛️' },
  ];

  return (
    <div className={`flex gap-4 overflow-x-auto pb-4 ${className}`}>
      {highlights.map((highlight) => (
        <div key={highlight.id} className="flex-shrink-0 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-2xl mb-2 cursor-pointer hover:scale-105 transition-transform">
            {highlight.emoji}
          </div>
          <p className="text-xs text-gray-600">{highlight.title}</p>
        </div>
      ))}
    </div>
  );
};
