/**
 * 영성 커뮤니티를 위한 평화로운 네비게이션 컴포넌트
 * 마음의 평안을 주는 디자인으로 제작
 */

import { forwardRef, HTMLAttributes, ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { Button } from './Button';

// 네비게이션 아이템 인터페이스
interface NavigationItem {
  id: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  badge?: string | number;
}

// 네비게이션 컴포넌트 인터페이스
interface NavigationProps extends HTMLAttributes<HTMLElement> {
  items: NavigationItem[];
  activeItem?: string;
  onItemClick?: (item: NavigationItem) => void;
  variant?: 'horizontal' | 'vertical' | 'tabs' | 'pills';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

// 네비게이션 컴포넌트
const Navigation = forwardRef<HTMLElement, NavigationProps>(
  ({ 
    items,
    activeItem,
    onItemClick,
    variant = 'horizontal',
    size = 'md',
    fullWidth = false,
    className,
    ...props 
  }, ref) => {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    const handleItemClick = (item: NavigationItem) => {
      if (item.disabled) return;
      
      if (item.onClick) {
        item.onClick();
      }
      
      if (onItemClick) {
        onItemClick(item);
      }
    };

    const sizeClasses = {
      sm: 'text-sm px-3 py-2',
      md: 'text-sm px-4 py-2.5',
      lg: 'text-base px-5 py-3'
    };

    const variantClasses = {
      horizontal: 'flex flex-row items-center gap-1',
      vertical: 'flex flex-col items-stretch gap-1',
      tabs: 'flex flex-row items-center border-b border-sage-200',
      pills: 'flex flex-row items-center gap-2'
    };

    return (
      <nav
        ref={ref}
        className={cn(
          variantClasses[variant],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {items.map((item) => {
          const isActive = activeItem === item.id || item.active;
          const isHovered = hoveredItem === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => handleItemClick(item)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              disabled={item.disabled}
              className={cn(
                'relative flex items-center gap-2 font-medium transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-serenity-500 focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                sizeClasses[size],

                // 기본 스타일
                variant === 'horizontal' && [
                  'rounded-lg',
                  isActive 
                    ? 'bg-sage-100 text-sage-800 border border-sage-200'
                    : 'text-sage-600 hover:bg-sage-50 hover:text-sage-800'
                ],

                variant === 'vertical' && [
                  'rounded-lg justify-start w-full',
                  isActive 
                    ? 'bg-sage-100 text-sage-800 border border-sage-200'
                    : 'text-sage-600 hover:bg-sage-50 hover:text-sage-800'
                ],

                variant === 'tabs' && [
                  'border-b-2 rounded-none pb-3',
                  isActive 
                    ? 'border-serenity-500 text-serenity-700'
                    : 'border-transparent text-sage-600 hover:text-sage-800 hover:border-sage-300'
                ],

                variant === 'pills' && [
                  'rounded-full',
                  isActive 
                    ? 'bg-serenity-100 text-serenity-800 border border-serenity-200'
                    : 'text-sage-600 hover:bg-sage-50 hover:text-sage-800'
                ]
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* 아이콘 */}
              {item.icon && (
                <span className={cn(
                  'flex-shrink-0',
                  size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'
                )}>
                  {item.icon}
                </span>
              )}

              {/* 라벨 */}
              <span className="whitespace-nowrap">
                {item.label}
              </span>

              {/* 뱃지 */}
              {item.badge && (
                <span className={cn(
                  'ml-2 px-2 py-0.5 text-xs font-medium rounded-full',
                  'bg-serenity-100 text-serenity-700'
                )}>
                  {item.badge}
                </span>
              )}

              {/* 활성 인디케이터 (수직 네비게이션용) */}
              {variant === 'vertical' && isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 w-1 h-full bg-serenity-500 rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>
    );
  }
);

Navigation.displayName = 'Navigation';

// 브레드크럼 컴포넌트
interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  maxItems?: number;
}

const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ 
    items,
    separator = '/',
    maxItems = 5,
    className,
    ...props 
  }, ref) => {
    // 아이템이 너무 많으면 중간을 생략
    const displayItems = items.length > maxItems 
      ? [
          ...items.slice(0, 2),
          { label: '...', href: undefined, onClick: undefined },
          ...items.slice(-2)
        ]
      : items;

    return (
      <nav
        ref={ref}
        className={cn(
          'flex items-center space-x-2 text-sm text-sage-600',
          className
        )}
        aria-label="브레드크럼"
        {...props}
      >
        {displayItems.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            {index > 0 && (
              <span className="text-sage-400 select-none">
                {separator}
              </span>
            )}
            
            {item.label === '...' ? (
              <span className="text-sage-400">...</span>
            ) : index === displayItems.length - 1 ? (
              <span className="font-medium text-sage-800">
                {item.label}
              </span>
            ) : (
              <button
                onClick={item.onClick}
                className="hover:text-sage-800 hover:underline transition-colors"
              >
                {item.label}
              </button>
            )}
          </div>
        ))}
      </nav>
    );
  }
);

Breadcrumb.displayName = 'Breadcrumb';

// 페이지네이션 컴포넌트
interface PaginationProps extends HTMLAttributes<HTMLElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPrevNext?: boolean;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
}

const Pagination = forwardRef<HTMLElement, PaginationProps>(
  ({ 
    currentPage,
    totalPages,
    onPageChange,
    showPrevNext = true,
    showFirstLast = true,
    maxVisiblePages = 5,
    className,
    ...props 
  }, ref) => {
    // 표시할 페이지 번호 계산
    const getVisiblePages = () => {
      const delta = Math.floor(maxVisiblePages / 2);
      let start = Math.max(1, currentPage - delta);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    const visiblePages = getVisiblePages();

    const PageButton = ({ 
      page, 
      isActive = false, 
      disabled = false,
      children 
    }: { 
      page?: number;
      isActive?: boolean;
      disabled?: boolean;
      children: ReactNode;
    }) => (
      <motion.button
        onClick={() => page && onPageChange(page)}
        disabled={disabled}
        className={cn(
          'px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-serenity-500 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          isActive
            ? 'bg-serenity-600 text-white shadow-sm'
            : 'text-sage-700 hover:bg-sage-100 border border-sage-200'
        )}
        whileHover={!disabled && !isActive ? { scale: 1.02 } : {}}
        whileTap={!disabled && !isActive ? { scale: 0.98 } : {}}
      >
        {children}
      </motion.button>
    );

    if (totalPages <= 1) return null;

    return (
      <nav
        ref={ref}
        className={cn(
          'flex items-center justify-center gap-1',
          className
        )}
        aria-label="페이지네이션"
        {...props}
      >
        {/* 첫 페이지 */}
        {showFirstLast && currentPage > 1 && (
          <PageButton page={1}>
            <span className="sr-only">첫 페이지</span>
            ⇤
          </PageButton>
        )}

        {/* 이전 페이지 */}
        {showPrevNext && (
          <PageButton 
            page={currentPage > 1 ? currentPage - 1 : undefined}
            disabled={currentPage <= 1}
          >
            <span className="sr-only">이전 페이지</span>
            ←
          </PageButton>
        )}

        {/* 페이지 번호들 */}
        {visiblePages.map((page) => (
          <PageButton
            key={page}
            page={page}
            isActive={page === currentPage}
          >
            {page}
          </PageButton>
        ))}

        {/* 다음 페이지 */}
        {showPrevNext && (
          <PageButton 
            page={currentPage < totalPages ? currentPage + 1 : undefined}
            disabled={currentPage >= totalPages}
          >
            <span className="sr-only">다음 페이지</span>
            →
          </PageButton>
        )}

        {/* 마지막 페이지 */}
        {showFirstLast && currentPage < totalPages && (
          <PageButton page={totalPages}>
            <span className="sr-only">마지막 페이지</span>
            ⇥
          </PageButton>
        )}
      </nav>
    );
  }
);

Pagination.displayName = 'Pagination';

export {
  Navigation,
  Breadcrumb,
  Pagination,
  type NavigationItem,
  type BreadcrumbItem
};