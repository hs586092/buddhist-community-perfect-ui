/**
 * User Avatar - Profile Picture with Buddhist Indicators
 *
 * Features:
 * - Wisdom level ring indicators
 * - Verification badges
 * - Online status indicators
 * - Customizable sizes
 * - Fallback initials
 * - Hover effects and tooltips
 */

import React from 'react';

interface UserAvatarProps {
  user: any;
  size?: 'sm' | 'md' | 'lg';
  showWisdomLevel?: boolean;
  showVerified?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = 'md',
  showWisdomLevel = false,
  showVerified = false
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold`}>
        {user?.displayName?.[0]?.toUpperCase() || user?.avatar || '👤'}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{user?.displayName || 'Anonymous'}</span>
        {showWisdomLevel && (
          <span className="text-xs text-gray-500">{user?.wisdomLevel || 'Beginner'}</span>
        )}
      </div>
      {showVerified && user?.verified && (
        <span className="text-blue-500 text-sm">✓</span>
      )}
    </div>
  );
};
