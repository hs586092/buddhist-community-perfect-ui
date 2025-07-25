/**
 * LotusIcon - 심플 아이콘 (네비게이션용)
 * 미니멀한 연꽃 아이콘
 */

import React from 'react';

interface LotusIconProps {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  className?: string;
  filled?: boolean;
}

export const LotusIcon: React.FC<LotusIconProps> = ({
  size = 24,
  color = 'currentColor',
  strokeWidth = 1.5,
  className = '',
  filled = false
}) => {
  const svgSize = typeof size === 'number' ? `${size}px` : size;
  
  return (
    <svg
      width={svgSize}
      height={svgSize}
      viewBox="0 0 24 24"
      fill={filled ? color : "none"}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="연꽃 아이콘"
    >
      {/* 외부 3개 꽃잎 */}
      <g stroke={color} strokeWidth={strokeWidth} fill={filled ? color : "none"} strokeLinecap="round">
        {/* 상단 꽃잎 */}
        <path d="M12 4 C10 5, 9 7, 10 9 C11 10, 13 10, 14 9 C15 7, 14 5, 12 4 Z" />
        
        {/* 우하단 꽃잎 */}
        <path d="M18 14 C17 12, 15 12, 14 13 C13 15, 14 17, 16 17 C17 16, 18 15, 18 14 Z" />
        
        {/* 좌하단 꽃잎 */}
        <path d="M6 14 C7 12, 9 12, 10 13 C11 15, 10 17, 8 17 C7 16, 6 15, 6 14 Z" />
      </g>

      {/* 내부 3개 꽃잎 */}
      <g stroke={color} strokeWidth={strokeWidth} fill={filled ? color : "none"} strokeLinecap="round" opacity={filled ? "0.7" : "0.8"}>
        {/* 상단 내부 꽃잎 */}
        <path d="M12 8 C11 8.5, 10.5 10, 11.5 11 C12.5 11.5, 13.5 11, 13.5 10 C13 8.5, 12 8, 12 8 Z" />
        
        {/* 우하단 내부 꽃잎 */}
        <path d="M15.5 13 C14.5 12.5, 13.5 13.5, 14 14.5 C14.5 15.5, 15.5 15.5, 16 14.5 C15.5 13.5, 15.5 13, 15.5 13 Z" />
        
        {/* 좌하단 내부 꽃잎 */}
        <path d="M8.5 13 C9.5 12.5, 10.5 13.5, 10 14.5 C9.5 15.5, 8.5 15.5, 8 14.5 C8.5 13.5, 8.5 13, 8.5 13 Z" />
      </g>

      {/* 중심부 */}
      <g>
        <circle 
          cx="12" 
          cy="12" 
          r="2" 
          stroke={color} 
          strokeWidth={strokeWidth} 
          fill={filled ? color : "none"} 
          opacity={filled ? "0.5" : "0.6"}
        />
        <circle 
          cx="12" 
          cy="12" 
          r="0.8" 
          fill={color} 
          opacity="0.4"
        />
      </g>
    </svg>
  );
};

export default LotusIcon;