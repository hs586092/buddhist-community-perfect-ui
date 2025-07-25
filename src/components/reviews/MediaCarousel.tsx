import React from 'react';

interface MediaCarouselProps {
  media: any[];
  onDoubleTap?: () => void;
  className?: string;
}

export const MediaCarousel: React.FC<MediaCarouselProps> = ({
  media,
  onDoubleTap,
  className = ''
}) => {
  if (!media || media.length === 0) {
    return null;
  }

  return (
    <div className={`bg-gray-100 rounded-lg p-4 ${className}`} onDoubleClick={onDoubleTap}>
      <div className="text-center text-gray-500">
        📷 Media ({media.length} items)
      </div>
    </div>
  );
};
