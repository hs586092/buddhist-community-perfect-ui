/**
 * LotusBud - 봉오리 상태 연꽃 (로딩/버튼용)
 * 미니멀한 선화 스타일의 연꽃 봉오리
 */

import React from 'react';

interface LotusBudProps {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  className?: string;
  animate?: boolean;
}

export const LotusBud: React.FC<LotusBudProps> = ({
  size = 60,
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
      viewBox="0 0 60 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="연꽃 봉오리 일러스트"
    >
      {/* 외부 봉오리 형태 */}
      <g stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round">
        {/* 메인 봉오리 형태 */}
        <path 
          d="M30 15 C22 18, 18 25, 20 35 C22 45, 25 50, 30 52 C35 50, 38 45, 40 35 C42 25, 38 18, 30 15 Z"
          className={animate ? "animate-pulse" : ""}
          style={{ animationDelay: '0s' }}
        />
        
        {/* 봉오리 꽃잎 라인들 */}
        <path 
          d="M30 15 C26 20, 24 28, 26 36 C28 42, 30 45, 30 52"
          className={animate ? "animate-pulse" : ""}
          style={{ animationDelay: '0.3s' }}
        />
        <path 
          d="M30 15 C34 20, 36 28, 34 36 C32 42, 30 45, 30 52"
          className={animate ? "animate-pulse" : ""}
          style={{ animationDelay: '0.6s' }}
        />
        
        {/* 측면 봉오리 꽃잎 힌트 */}
        <path 
          d="M22 25 C24 22, 28 24, 30 28"
          opacity="0.7"
          className={animate ? "animate-pulse" : ""}
          style={{ animationDelay: '0.9s' }}
        />
        <path 
          d="M38 25 C36 22, 32 24, 30 28"
          opacity="0.7"
          className={animate ? "animate-pulse" : ""}
          style={{ animationDelay: '1.2s' }}
        />
        
        {/* 하단 분리선 */}
        <path 
          d="M25 48 C27 50, 33 50, 35 48"
          opacity="0.5"
        />
      </g>

      {/* 줄기 */}
      <g stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round">
        <path 
          d="M30 52 L30 72"
          className={animate ? "animate-pulse" : ""}
          style={{ animationDelay: '1.5s' }}
        />
        
        {/* 줄기 잎사귀 힌트 */}
        <path 
          d="M30 58 C35 56, 38 60, 35 64 C32 66, 30 64, 30 62"
          opacity="0.6"
          className={animate ? "animate-pulse" : ""}
          style={{ animationDelay: '1.8s' }}
        />
      </g>

      {/* 봉오리 끝 디테일 */}
      <g stroke={color} strokeWidth={strokeWidth * 0.8} fill="none" strokeLinecap="round">
        <path d="M28 18 C29 16, 31 16, 32 18" opacity="0.4" />
        <path d="M27 22 C28 20, 32 20, 33 22" opacity="0.3" />
      </g>

      {/* 중심 점 */}
      <circle cx="30" cy="32" r="1" fill={color} opacity="0.3" />
    </svg>
  );
};

export default LotusBud;