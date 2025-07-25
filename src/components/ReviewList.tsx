/**
 * 법회 리뷰 목록 컴포넌트 - 자연 테마
 */

import React from 'react'
import { cn } from '../utils/cn'
import { NatureCard } from './nature/NatureCard'
import type { DharmaReview } from '../types/review'

interface ReviewListProps {
  reviews: DharmaReview[]
  className?: string
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews, className }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    })
  }

  if (reviews.length === 0) {
    return (
      <NatureCard 
        variant="wood" 
        size="lg" 
        className={cn("text-center", className)}
      >
        <div className="space-y-4">
          <div className="text-6xl">🌳</div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-amber-800">
              아직 작성된 리뷰가 없습니다
            </h3>
            <p className="text-amber-600 text-lg">
              첫 번째 법회 리뷰를 작성해 보세요! 🌿
            </p>
          </div>
        </div>
      </NatureCard>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-3xl font-bold text-green-800 flex items-center justify-center gap-2">
          <span>🌲</span> 법회 리뷰 목록 <span>🌲</span>
        </h2>
        <p className="text-green-600 text-lg">
          {reviews.length}개의 소중한 경험이 자연스럽게 공유되었습니다
        </p>
      </div>
      
      {reviews.map((review, index) => {
        const variants = ['leaf', 'wood', 'stone', 'earth'] as const
        const variant = variants[index % variants.length]
        
        return (
          <NatureCard 
            key={review.id} 
            variant={variant} 
            size="md"
            className="border-l-4 border-green-400"
          >
            {/* 헤더 정보 */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="text-2xl">🏛️</span>
                  {review.dharmaName}
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <span className="flex items-center gap-2 text-amber-700 font-semibold bg-amber-100 px-3 py-1 rounded-full">
                    📅 {formatDate(review.date)}
                  </span>
                  <span className="flex items-center gap-2 text-green-700 font-semibold bg-green-100 px-3 py-1 rounded-full">
                    🏯 {review.location}
                  </span>
                </div>
              </div>
              
              <div className="text-right space-y-2">
                {review.authorName && (
                  <div className="px-4 py-2 bg-stone-100 rounded-full border-2 border-stone-200">
                    <span className="text-sm font-bold text-stone-700">
                      👤 {review.authorName}
                    </span>
                  </div>
                )}
                <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  작성일: {formatDate(review.createdAt)}
                </div>
              </div>
            </div>

            {/* 리뷰 내용 */}
            <div className="space-y-3">
              <div className="h-px bg-gradient-to-r from-transparent via-green-300 to-transparent" />
              <NatureCard 
                variant="earth" 
                size="sm"
                className="bg-gradient-to-br from-yellow-50 to-amber-50"
              >
                <p className="text-gray-800 leading-relaxed text-lg whitespace-pre-wrap">
                  {review.reviewContent}
                </p>
              </NatureCard>
            </div>
          </NatureCard>
        )
      })}
    </div>
  )
}