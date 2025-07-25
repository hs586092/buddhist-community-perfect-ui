import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  value?: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  value = 0,
  onChange,
  readonly = false,
  size = 'md',
  showValue = false,
  className = ''
}) => {
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [currentRating, setCurrentRating] = useState<number>(value);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleClick = (rating: number) => {
    if (readonly) return;
    
    setCurrentRating(rating);
    onChange?.(rating);
  };

  const handleMouseEnter = (rating: number) => {
    if (readonly) return;
    setHoverRating(rating);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverRating(0);
  };

  const getStarColor = (index: number) => {
    const rating = hoverRating || currentRating;
    return index <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300';
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            className={`
              ${sizeClasses[size]} 
              ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} 
              transition-all duration-200 
              ${getStarColor(star)}
            `}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            aria-label={`${star}점 평가`}
          >
            <Star className="w-full h-full" />
          </button>
        ))}
      </div>
      
      {showValue && (
        <span className="ml-2 text-sm text-gray-600 font-medium">
          {currentRating.toFixed(1)}
        </span>
      )}
    </div>
  );
};