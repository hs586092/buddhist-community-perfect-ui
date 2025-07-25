/**
 * 영성 커뮤니티를 위한 평화로운 카드 컴포넌트
 * 마음의 평안을 주는 디자인으로 제작
 */

import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { LotusLeaf } from '../lotus';

// 카드 베이스 인터페이스
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'glass' | 'elevated' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

// 카드 컴포넌트
const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    children, 
    className, 
    variant = 'default',
    size = 'md',
    padding = 'md',
    hover = false,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // 기본 스타일
          'rounded-xl border transition-all duration-300 ease-out',
          
          // 변형 스타일
          {
            // 기본 카드
            'bg-white border-neutral-200 shadow-sm': variant === 'default',
            
            // 글래스 카드 
            'glass border-opacity-20 backdrop-blur-xl': variant === 'glass',
            
            // 입체감 있는 카드
            'bg-white border-neutral-200 shadow-lg': variant === 'elevated',
            
            // 아웃라인 카드
            'bg-transparent border-2 border-sage-200': variant === 'outline',
          },
          
          // 크기 스타일
          {
            'max-w-sm': size === 'sm',
            'max-w-md': size === 'md', 
            'max-w-lg': size === 'lg',
          },
          
          // 패딩 스타일
          {
            'p-0': padding === 'none',
            'p-3': padding === 'sm',
            'p-6': padding === 'md',
            'p-8': padding === 'lg',
          },
          
          // 호버 효과
          {
            'hover:shadow-lg hover:-translate-y-1 cursor-pointer': hover,
          },
          
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// 카드 헤더 컴포넌트
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col space-y-1.5 pb-4', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

// 카드 제목 컴포넌트
interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, className, as: Component = 'h3', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'font-semibold text-neutral-900 leading-tight tracking-tight',
          'text-lg', // 기본 크기
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

CardTitle.displayName = 'CardTitle';

// 카드 설명 컴포넌트
interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          'text-sm text-neutral-600 leading-relaxed',
          className
        )}
        {...props}
      >
        {children}
      </p>
    );
  }
);

CardDescription.displayName = 'CardDescription';

// 카드 콘텐츠 컴포넌트
interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('text-neutral-700', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

// 카드 푸터 컴포넌트
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between pt-4 mt-4 border-t border-neutral-100',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

// 특별한 영성 카드 컴포넌트들

// 사찰 카드
interface TempleCardProps extends Omit<CardProps, 'children'> {
  name: string;
  location: string;
  image?: string;
  rating: number;
  reviewCount: number;
  distance?: string;
  features: string[];
  onClick?: () => void;
}

const TempleCard = forwardRef<HTMLDivElement, TempleCardProps>(
  ({ 
    name,
    location,
    image,
    rating,
    reviewCount,
    distance,
    features,
    onClick,
    className,
    ...props 
  }, ref) => {
    return (
      <Card
        ref={ref}
        hover
        padding="none"
        className={cn('overflow-hidden', className)}
        onClick={onClick}
        {...props}
      >
        {/* 이미지 영역 */}
        {image ? (
          <div className="aspect-video bg-sage-100 relative overflow-hidden">
            <img 
              src={image} 
              alt={name}
              className="w-full h-full object-cover"
            />
            {distance && (
              <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium text-neutral-700">
                {distance}
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-video bg-gradient-to-br from-sage-50 to-sage-100 relative overflow-hidden flex items-center justify-center">
            <LotusLeaf size={80} color="#a3a3a3" animate={false} />
            {distance && (
              <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium text-neutral-700">
                {distance}
              </div>
            )}
          </div>
        )}
        
        {/* 콘텐츠 영역 */}
        <div className="p-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <span>📍</span>
              {location}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* 평점 */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span 
                    key={i} 
                    className={cn(
                      'text-sm',
                      i < rating ? 'text-warmth-400' : 'text-neutral-300'
                    )}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-neutral-600">
                ({reviewCount}개 리뷰)
              </span>
            </div>
            
            {/* 특징 태그 */}
            <div className="flex flex-wrap gap-1">
              {features.slice(0, 3).map((feature) => (
                <span 
                  key={feature}
                  className="px-2 py-1 bg-sage-100 text-sage-700 text-xs rounded-md font-medium"
                >
                  {feature}
                </span>
              ))}
              {features.length > 3 && (
                <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-md">
                  +{features.length - 3}
                </span>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }
);

TempleCard.displayName = 'TempleCard';

// 리뷰 카드
interface ReviewCardProps extends Omit<CardProps, 'children'> {
  title: string;
  author: string;
  avatar: string;
  rating: number;
  content: string;
  date: string;
  temple: string;
  category: string;
  likes: number;
  isVerified?: boolean;
  onClick?: () => void;
}

const ReviewCard = forwardRef<HTMLDivElement, ReviewCardProps>(
  ({ 
    title,
    author,
    avatar,
    rating,
    content,
    date,
    temple,
    category,
    likes,
    isVerified = false,
    onClick,
    className,
    ...props 
  }, ref) => {
    return (
      <Card
        ref={ref}
        hover
        className={cn('cursor-pointer', className)}
        onClick={onClick}
        {...props}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">{avatar}</span>
              <div>
                <CardTitle className="text-base">{title}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <span>{author}</span>
                  {isVerified && (
                    <div className="w-4 h-4 bg-serenity-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'text-sm',
                      i < rating ? 'text-warmth-400' : 'text-neutral-300'
                    )}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-neutral-500">{date}</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 bg-sage-100 text-sage-700 text-xs rounded-md font-medium">
              {category}
            </span>
            <span className="text-sm text-neutral-600">
              {temple}
            </span>
          </div>
          
          <p className="text-sm text-neutral-700 leading-relaxed line-clamp-2 mb-4">
            {content}
          </p>
        </CardContent>
        
        <CardFooter className="pt-3 mt-3">
          <div className="flex items-center gap-1 text-sm text-neutral-500">
            <span>❤️</span>
            <span>{likes}</span>
          </div>
          <span className="text-serenity-600 font-medium text-sm">자세히 보기</span>
        </CardFooter>
      </Card>
    );
  }
);

ReviewCard.displayName = 'ReviewCard';

// 포스트 카드
interface PostCardProps extends Omit<CardProps, 'children'> {
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  readingTime: number;
  category: string;
  tags: string[];
  likeCount: number;
  commentCount: number;
  featuredImage?: string;
  onClick?: () => void;
}

const PostCard = forwardRef<HTMLDivElement, PostCardProps>(
  ({ 
    title,
    excerpt,
    author,
    publishedAt,
    readingTime,
    category,
    tags,
    likeCount,
    commentCount,
    featuredImage,
    onClick,
    className,
    ...props 
  }, ref) => {
    return (
      <Card
        ref={ref}
        hover
        padding="none"
        className={cn('overflow-hidden cursor-pointer', className)}
        onClick={onClick}
        {...props}
      >
        {featuredImage && (
          <div className="aspect-video bg-sage-100 relative overflow-hidden">
            <img 
              src={featuredImage} 
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-6">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-serenity-100 text-serenity-700 text-xs rounded-md font-medium">
                {category}
              </span>
              <span className="text-xs text-neutral-500">{readingTime}분 읽기</span>
            </div>
            <CardTitle className="text-xl leading-tight">{title}</CardTitle>
            <CardDescription className="text-base leading-relaxed line-clamp-2">
              {excerpt}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-wrap gap-1 mb-4">
              {tags.slice(0, 3).map((tag) => (
                <span 
                  key={tag}
                  className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </CardContent>
          
          <CardFooter>
            <div className="flex items-center gap-4 text-sm text-neutral-500">
              <span>{author}</span>
              <span>{publishedAt}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-neutral-500">
              <span className="flex items-center gap-1">
                <span>❤️</span>
                {likeCount}
              </span>
              <span className="flex items-center gap-1">
                <span>💬</span>
                {commentCount}
              </span>
            </div>
          </CardFooter>
        </div>
      </Card>
    );
  }
);

PostCard.displayName = 'PostCard';

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  TempleCard,
  ReviewCard,
  PostCard
};