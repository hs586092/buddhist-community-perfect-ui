/**
 * LotusBloom - 완전히 핀 연꽃 (Hero 섹션용)
 * 미니멀한 선화 스타일의 연꽃 일러스트
 */

import React from 'react';

interface LotusBloomProps {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  className?: string;
  animate?: boolean;
}

export const LotusBloom: React.FC<LotusBloomProps> = ({
  size = 120,
  color = 'currentColor',
  strokeWidth = 1.5,
  className = '',
  animate = false
}) => {
  const svgSize = typeof size === 'number' ? `${size}px` : size;
  
  return (
    <svg
      width={svgSize}
      height={svgSize}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="연꽃 일러스트"
    >
      {/* 외부 꽃잎 레이어 */}
      <g stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round">
        {/* 큰 꽃잎들 - 8개 */}
        <path 
          d="M60 20 C50 25, 45 35, 50 45 C55 50, 65 50, 70 45 C75 35, 70 25, 60 20 Z"
          className={animate ? "animate-pulse" : ""}
          style={{ animationDelay: '0s' }}
        />
        <path 
          d="M85 35 C80 30, 70 32, 65 40 C65 50, 70 55, 80 52 C88 48, 90 40, 85 35 Z"
          className={animate ? "animate-pulse" : ""}
          style={{ animationDelay: '0.2s' }}
        />
        <path 
          d="M95 60 C90 50, 80 48, 70 55 C65 62, 65 72, 70 75 C80 78, 90 70, 95 60 Z"
          className={animate ? "animate-pulse" : ""}
          style={{ animationDelay: '0.4s' }}
        />
        <path 
          d="M85 85 C75 90, 70 80, 65 75 C65 65, 70 58, 80 62 C88 65, 90 75, 85 85 Z"
          className={animate ? "animate-pulse" : ""}
          style={{ animationDelay: '0.6s' }}
        />
        <path 
          d="M60 100 C50 95, 45 85, 50 75 C55 70, 65 70, 70 75 C75 85, 70 95, 60 100 Z"
          className={animate ? "animate-pulse" : ""}
          style={{ animationDelay: '0.8s' }}
        />
        <path 
          d="M35 85 C30 80, 28 70, 35 65 C45 62, 55 65, 55 75 C52 82, 45 88, 35 85 Z"
          className={animate ? "animate-pulse" : ""}
          style={{ animationDelay: '1.0s' }}
        />
        <path 
          d="M25 60 C20 50, 22 40, 30 38 C40 38, 50 45, 50 55 C48 65, 35 68, 25 60 Z"
          className={animate ? "animate-pulse" : ""}
          style={{ animationDelay: '1.2s' }}
        />
        <path 
          d="M35 35 C30 25, 35 20, 45 25 C52 30, 55 40, 50 45 C42 48, 38 42, 35 35 Z"
          className={animate ? "animate-pulse" : ""}
          style={{ animationDelay: '1.4s' }}
        />
      </g>

      {/* 내부 꽃잎 레이어 */}
      <g stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" opacity="0.8">
        {/* 중간 꽃잎들 - 6개 */}
        <path d="M60 35 C55 38, 52 45, 58 50 C64 52, 68 48, 65 42 C62 38, 60 35, 60 35 Z" />
        <path d="M75 42 C72 38, 68 40, 68 45 C68 50, 72 52, 76 50 C78 46, 77 42, 75 42 Z" />
        <path d="M78 60 C75 58, 72 62, 75 66 C78 68, 82 66, 82 62 C80 58, 78 60, 78 60 Z" />
        <path d="M75 78 C72 75, 68 78, 68 82 C70 85, 75 85, 78 82 C78 78, 75 78, 75 78 Z" />
        <path d="M60 85 C55 82, 52 78, 58 75 C64 75, 68 78, 65 82 C62 84, 60 85, 60 85 Z" />
        <path d="M45 78 C42 75, 40 78, 42 82 C45 85, 50 83, 52 80 C50 76, 45 78, 45 78 Z" />
      </g>

      {/* 중심부 - 연꽃 수술 */}
      <g stroke={color} strokeWidth={strokeWidth} fill="none">
        <circle cx="60" cy="60" r="8" opacity="0.6" />
        <circle cx="60" cy="60" r="4" opacity="0.4" />
        <circle cx="60" cy="60" r="2" fill={color} opacity="0.3" />
      </g>

      {/* 중심 점들 - 수술 디테일 */}
      <g fill={color} opacity="0.5">
        <circle cx="58" cy="58" r="0.8" />
        <circle cx="62" cy="58" r="0.8" />
        <circle cx="58" cy="62" r="0.8" />
        <circle cx="62" cy="62" r="0.8" />
        <circle cx="60" cy="60" r="1" opacity="0.8" />
      </g>
    </svg>
  );
};

export default LotusBloom;