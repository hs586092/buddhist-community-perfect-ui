/**
 * 법회 리뷰 작성 폼 컴포넌트 - 자연 테마
 */

import React, { useState } from 'react'
import { cn } from '../utils/cn'
import { NatureCard } from './nature/NatureCard'
import { NatureInput } from './nature/NatureInput'
import { NatureButton } from './nature/NatureButton'
import type { ReviewFormData, DharmaReview } from '../types/review'

interface ReviewFormProps {
  onSubmit: (reviewData: ReviewFormData) => void
  className?: string
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, className }) => {
  const [formData, setFormData] = useState<ReviewFormData>({
    dharmaName: '',
    date: '',
    location: '',
    reviewContent: '',
    authorName: ''
  })

  const handleInputChange = (field: keyof ReviewFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 필수 필드 검증
    if (!formData.dharmaName.trim() || !formData.date || !formData.location.trim() || !formData.reviewContent.trim()) {
      alert('모든 필수 항목을 입력해주세요.')
      return
    }

    onSubmit(formData)
    
    // 폼 초기화
    setFormData({
      dharmaName: '',
      date: '',
      location: '',
      reviewContent: '',
      authorName: ''
    })
  }

  return (
    <NatureCard 
      variant="leaf" 
      size="lg" 
      className={cn("", className)}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-green-800 flex items-center justify-center gap-2">
            <span>🌿</span> 법회 리뷰 작성 <span>🌿</span>
          </h2>
          <p className="text-green-600 text-lg">
            소중한 법회 경험을 자연스럽게 나누어 주세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 법회명 */}
          <NatureInput
            label="🏛️ 법회명 *"
            value={formData.dharmaName}
            onChange={(e) => handleInputChange('dharmaName', e.target.value)}
            placeholder="일요법회, 수요법회, 특별법회 등"
            nature="forest"
            required
          />

          {/* 날짜 */}
          <NatureInput
            label="📅 법회 날짜 *"
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            nature="meadow"
            required
          />

          {/* 장소 */}
          <NatureInput
            label="🏯 장소 (절명/사찰명) *"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="조계사, 봉은사, 불광사 등"
            nature="earth"
            required
          />

          {/* 작성자명 (선택사항) */}
          <NatureInput
            label="👤 작성자명 (선택사항)"
            value={formData.authorName || ''}
            onChange={(e) => handleInputChange('authorName', e.target.value)}
            placeholder="익명으로 남겨둘 수 있습니다"
            nature="stone"
          />

          {/* 리뷰 내용 */}
          <NatureInput
            label="📝 리뷰 내용 *"
            multiline
            rows={6}
            value={formData.reviewContent}
            onChange={(e) => handleInputChange('reviewContent', e.target.value)}
            placeholder="법회에 대한 소감이나 경험을 자유롭게 작성해주세요..."
            nature="forest"
            required
          />

          {/* 제출 버튼 */}
          <div className="pt-4">
            <NatureButton
              type="submit"
              variant="leaf"
              size="lg"
              fullWidth
            >
              🌱 리뷰 작성하기 🌱
            </NatureButton>
          </div>
        </form>
      </div>
    </NatureCard>
  )
}