/**
 * 영성 커뮤니티를 위한 평화로운 입력 컴포넌트
 * 마음의 평안을 주는 디자인으로 제작
 */

import { forwardRef, InputHTMLAttributes, ReactNode, useState } from 'react';
import { cn } from '../../utils/cn';

// 입력 컴포넌트 인터페이스
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  variant?: 'default' | 'filled' | 'outline';
  inputSize?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

// 기본 Input 컴포넌트
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className,
    label,
    description,
    error,
    leftIcon,
    rightIcon,
    variant = 'default',
    inputSize = 'md',
    fullWidth = false,
    type = 'text',
    ...props 
  }, ref) => {
    const [focused, setFocused] = useState(false);

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {/* 라벨 */}
        {label && (
          <label className="block text-sm font-medium text-sage-800">
            {label}
          </label>
        )}

        {/* 입력 컨테이너 */}
        <div className="relative">
          {/* 왼쪽 아이콘 */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-500">
              {leftIcon}
            </div>
          )}

          {/* 입력 필드 */}
          <input
            ref={ref}
            type={type}
            className={cn(
              // 기본 스타일
              'block w-full rounded-lg border transition-all duration-200 ease-out',
              'focus:outline-none focus:ring-2 focus:ring-offset-1',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'placeholder:text-sage-400',

              // 크기 스타일
              {
                'px-3 py-2 text-sm': inputSize === 'sm',
                'px-4 py-3 text-base': inputSize === 'md',
                'px-5 py-4 text-lg': inputSize === 'lg',
              },

              // 아이콘 패딩 조정
              {
                'pl-10': leftIcon && inputSize === 'sm',
                'pl-11': leftIcon && inputSize === 'md',
                'pl-12': leftIcon && inputSize === 'lg',
                'pr-10': rightIcon && inputSize === 'sm',
                'pr-11': rightIcon && inputSize === 'md',
                'pr-12': rightIcon && inputSize === 'lg',
              },

              // 변형 스타일
              {
                // 기본 스타일
                'bg-white border-sage-200 focus:border-serenity-500 focus:ring-serenity-500/20': 
                  variant === 'default' && !error,
                
                // 채워진 스타일
                'bg-sage-50 border-transparent focus:bg-white focus:border-serenity-500 focus:ring-serenity-500/20': 
                  variant === 'filled' && !error,
                
                // 아웃라인 스타일
                'bg-transparent border-2 border-sage-300 focus:border-serenity-500 focus:ring-serenity-500/20': 
                  variant === 'outline' && !error,

                // 에러 상태
                'border-red-300 focus:border-red-500 focus:ring-red-500/20': error,
              },

              className
            )}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />

          {/* 오른쪽 아이콘 */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sage-500">
              {rightIcon}
            </div>
          )}
        </div>

        {/* 설명 텍스트 */}
        {description && !error && (
          <p className="text-sm text-sage-600">
            {description}
          </p>
        )}

        {/* 에러 메시지 */}
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <span>⚠️</span>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea 컴포넌트
interface TextareaProps extends Omit<InputProps, 'leftIcon' | 'rightIcon'> {
  rows?: number;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps & Omit<InputHTMLAttributes<HTMLTextAreaElement>, keyof TextareaProps>>(
  ({ 
    className,
    label,
    description,
    error,
    variant = 'default',
    inputSize = 'md',
    fullWidth = false,
    rows = 4,
    resize = 'vertical',
    ...props 
  }, ref) => {
    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {/* 라벨 */}
        {label && (
          <label className="block text-sm font-medium text-sage-800">
            {label}
          </label>
        )}

        {/* 텍스트 영역 */}
        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            // 기본 스타일
            'block w-full rounded-lg border transition-all duration-200 ease-out',
            'focus:outline-none focus:ring-2 focus:ring-offset-1',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'placeholder:text-sage-400',

            // 크기 스타일
            {
              'px-3 py-2 text-sm': inputSize === 'sm',
              'px-4 py-3 text-base': inputSize === 'md',
              'px-5 py-4 text-lg': inputSize === 'lg',
            },

            // 리사이즈 스타일
            {
              'resize-none': resize === 'none',
              'resize': resize === 'both',
              'resize-x': resize === 'horizontal',
              'resize-y': resize === 'vertical',
            },

            // 변형 스타일
            {
              // 기본 스타일
              'bg-white border-sage-200 focus:border-serenity-500 focus:ring-serenity-500/20': 
                variant === 'default' && !error,
              
              // 채워진 스타일
              'bg-sage-50 border-transparent focus:bg-white focus:border-serenity-500 focus:ring-serenity-500/20': 
                variant === 'filled' && !error,
              
              // 아웃라인 스타일
              'bg-transparent border-2 border-sage-300 focus:border-serenity-500 focus:ring-serenity-500/20': 
                variant === 'outline' && !error,

              // 에러 상태
              'border-red-300 focus:border-red-500 focus:ring-red-500/20': error,
            },

            className
          )}
          {...props}
        />

        {/* 설명 텍스트 */}
        {description && !error && (
          <p className="text-sm text-sage-600">
            {description}
          </p>
        )}

        {/* 에러 메시지 */}
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <span>⚠️</span>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// Select 컴포넌트
interface SelectProps extends Omit<InputProps, 'leftIcon' | 'rightIcon'> {
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, keyof SelectProps>>(
  ({ 
    className,
    label,
    description,
    error,
    variant = 'default',
    inputSize = 'md',
    fullWidth = false,
    options,
    placeholder,
    ...props 
  }, ref) => {
    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {/* 라벨 */}
        {label && (
          <label className="block text-sm font-medium text-sage-800">
            {label}
          </label>
        )}

        {/* 셀렉트 컨테이너 */}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              // 기본 스타일
              'block w-full rounded-lg border transition-all duration-200 ease-out appearance-none',
              'focus:outline-none focus:ring-2 focus:ring-offset-1',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'bg-white',

              // 크기 스타일
              {
                'px-3 py-2 text-sm': inputSize === 'sm',
                'px-4 py-3 text-base': inputSize === 'md',
                'px-5 py-4 text-lg': inputSize === 'lg',
              },

              // 화살표를 위한 오른쪽 패딩
              'pr-10',

              // 변형 스타일
              {
                // 기본 스타일
                'border-sage-200 focus:border-serenity-500 focus:ring-serenity-500/20': 
                  variant === 'default' && !error,
                
                // 채워진 스타일
                'bg-sage-50 border-transparent focus:bg-white focus:border-serenity-500 focus:ring-serenity-500/20': 
                  variant === 'filled' && !error,
                
                // 아웃라인 스타일
                'bg-transparent border-2 border-sage-300 focus:border-serenity-500 focus:ring-serenity-500/20': 
                  variant === 'outline' && !error,

                // 에러 상태
                'border-red-300 focus:border-red-500 focus:ring-red-500/20': error,
              },

              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* 드롭다운 화살표 */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg 
              className="w-4 h-4 text-sage-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* 설명 텍스트 */}
        {description && !error && (
          <p className="text-sm text-sage-600">
            {description}
          </p>
        )}

        {/* 에러 메시지 */}
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <span>⚠️</span>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Input, Textarea, Select };