/**
 * LotusLeaf - 연잎만 (배경 패턴용)
 * 미니멀한 선화 스타일의 연잎
 */

import React from 'react';

interface LotusLeafProps {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  className?: string;
  rotate?: number;
  animate?: boolean;
}

export const LotusLeaf: React.FC<LotusLeafProps> = ({
  size = 80,
  color = 'currentColor',
  strokeWidth = 1.5,
  className = '',
  rotate = 0,
  animate = false
}) => {
  const svgSize = typeof size === 'number' ? `${size}px` : size;
  
  return (
    <svg
      width={svgSize}
      height={svgSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform: `rotate(${rotate}deg)` }}
      role="img"
      aria-label="연잎 일러스트"
    >
      {/* 연잎 외곽선 */}
      <g stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round">
        {/* 메인 연잎 형태 */}
        <path 
          d="M50 15 C35 20, 20 30, 15 45 C12 55, 15 65, 25 75 C35 82, 45 85, 50 85 C55 85, 65 82, 75 75 C85 65, 88 55, 85 45 C80 30, 65 20, 50 15 Z"
          className={animate ? "animate-pulse" : ""}
          style={{ animationDelay: '0s' }}
        />
        
        {/* 연잎 중심 분할선 */}
        <path 
          d="M50 15 L50 85"
          className={animate ? "animate-pulse" : ""}
          style={{ animationDelay: '0.5s' }}
          opacity="0.6"
        />
        
        {/* 연잎 갈래 선들 */}
        <path 
          d="M50 25 C40 35, 30 45, 25 55"
          className={animate ? "animate-pulse" : ""}
          style={{ animationDelay: '1.0s' }}
          opacity="0.4"
        />
        <path 
          d="M50 25 C60 35, 70 45, 75 55"
          className={animate ? "animate-pulse" : ""}
          style={{ animationDelay: '1.5s' }}
          opacity="0.4"
        />
        <path 
          d="M50 35 C42 45, 35 55, 30 65"
          className={animate ? "animate-pulse" : ""}
          style={{ animationDelay: '2.0s' }}
          opacity="0.3"
        />
        <path 
          d="M50 35 C58 45, 65 55, 70 65"
          className={animate ? "animate-pulse" : ""}
          style={{ animationDelay: '2.5s' }}
          opacity="0.3"
        />
        
        {/* 연잎 가장자리 물결 */}
        <path 
          d="M30 25 C28 27, 26 25, 25 28"
          opacity="0.5"
        />
        <path 
          d="M70 25 C72 27, 74 25, 75 28"
          opacity="0.5"
        />
        <path 
          d="M20 50 C18 52, 16 50, 15 53"
          opacity="0.5"
        />
        <path 
          d="M80 50 C82 52, 84 50, 85 53"
          opacity="0.5"
        />
      </g>

      {/* 연잎 줄기 부분 */}
      <g stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round">
        <path 
          d="M50 85 L50 95"
          className={animate ? "animate-pulse" : ""}
          style={{ animationDelay: '3.0s' }}
        />
      </g>

      {/* 연잎 표면 텍스처 */}
      <g stroke={color} strokeWidth={strokeWidth * 0.6} fill="none" strokeLinecap="round" opacity="0.2">
        <path d="M40 40 C42 38, 45 40, 47 38" />
        <path d="M53 38 C55 40, 58 38, 60 40" />
        <path d="M35 55 C37 53, 40 55, 42 53" />
        <path d="M58 53 C60 55, 63 53, 65 55" />
        <path d="M45 65 C47 63, 50 65, 52 63" />
      </g>

      {/* 연잎 중심점 */}
      <circle cx="50" cy="50" r="1.5" fill={color} opacity="0.3" />
    </svg>
  );
};

export default LotusLeaf;