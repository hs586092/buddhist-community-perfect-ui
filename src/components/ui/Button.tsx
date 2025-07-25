/**
 * 영성 커뮤니티를 위한 평화로운 버튼 컴포넌트
 * 마음의 평안을 주는 디자인으로 제작
 */

import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { motion, type MotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';

// 버튼 인터페이스
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'lotus' | 'sage';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
}

// 로딩 스피너 컴포넌트
const LoadingSpinner = ({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <svg 
      className={cn('animate-spin', sizeClasses[size])} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

// 버튼 컴포넌트
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    className, 
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    disabled,
    ...props 
  }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          // 기본 스타일
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 ease-out',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          
          // 크기 스타일
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-sm': size === 'md',
            'px-6 py-3 text-base': size === 'lg',
            'px-8 py-4 text-lg': size === 'xl',
          },
          
          // 변형 스타일  
          {
            // Primary - Serenity Blue
            'bg-serenity-600 text-white hover:bg-serenity-700 focus:ring-serenity-500 shadow-sm hover:shadow-md': variant === 'primary',
            
            // Secondary - Neutral
            'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus:ring-neutral-500': variant === 'secondary',
            
            // Outline
            'border-2 border-serenity-600 text-serenity-600 hover:bg-serenity-50 focus:ring-serenity-500': variant === 'outline',
            
            // Ghost
            'text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-500': variant === 'ghost',
            
            // Lotus - Special accent
            'bg-gradient-to-r from-lotus-500 to-lotus-600 text-white hover:from-lotus-600 hover:to-lotus-700 focus:ring-lotus-500 shadow-sm hover:shadow-md': variant === 'lotus',
            
            // Sage - Natural theme
            'bg-sage-600 text-white hover:bg-sage-700 focus:ring-sage-500 shadow-sm hover:shadow-md': variant === 'sage',
          },
          
          // 전체 너비
          {
            'w-full': fullWidth,
          },
          
          // 로딩/비활성화 상태
          {
            'cursor-not-allowed opacity-50': disabled || loading,
          },
          
          className
        )}
        disabled={disabled || loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      >
        {loading && <LoadingSpinner size={size === 'sm' ? 'sm' : size === 'xl' ? 'lg' : 'md'} />}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
