/**
 * 법회 리뷰 사이트 - Modern Apple + Stripe + Notion Design
 */

import React, { useState, useEffect } from 'react'
import type { DharmaReview, ReviewFormData } from './types/review'
import { AppleCard } from './components/modern/AppleCard'
import { AppleInput } from './components/modern/AppleInput'
import { AppleButton } from './components/modern/AppleButton'
import { NotionPage, NotionSection, NotionGrid, NotionBlock, NotionHeader, NotionEmptyState, NotionStats } from './components/notion/NotionLayout'
import './styles/stripe-gradients.css'
import './styles/linear-animations.css'

const SimpleApp: React.FC = () => {
  const [reviews, setReviews] = useState<DharmaReview[]>([])
  const [formData, setFormData] = useState({
    dharmaName: '',
    date: '',
    location: '',
    reviewContent: '',
    authorName: ''
  })

  // 로컬 스토리지에서 리뷰 로드
  useEffect(() => {
    const saved = localStorage.getItem('dharmaReviews')
    if (saved) {
      try {
        setReviews(JSON.parse(saved))
      } catch (error) {
        console.error('데이터 로드 실패:', error)
      }
    }
  }, [])

  // 리뷰 저장
  useEffect(() => {
    localStorage.setItem('dharmaReviews', JSON.stringify(reviews))
  }, [reviews])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.dharmaName.trim() || !formData.date || !formData.location.trim() || !formData.reviewContent.trim()) {
      alert('필수 항목을 모두 입력해주세요.')
      return
    }

    const newReview: DharmaReview = {
      id: Date.now().toString(),
      dharmaName: formData.dharmaName,
      date: formData.date,
      location: formData.location,
      reviewContent: formData.reviewContent,
      authorName: formData.authorName || undefined,
      createdAt: new Date().toISOString()
    }

    setReviews(prev => [newReview, ...prev])
    setFormData({
      dharmaName: '',
      date: '',
      location: '',
      reviewContent: '',
      authorName: ''
    })
    alert('리뷰가 성공적으로 작성되었습니다!')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <NotionPage className="stripe-mesh-1">
      {/* Modern Header */}
      <NotionHeader
        icon={<div className="text-4xl">🏛️</div>}
        title="법회 리뷰"
        subtitle="현대적이고 미니멀한 법회 경험 나눔 플랫폼"
        actions={
          <AppleCard variant="glass" size="sm" className="px-4 py-2">
            <div className="text-sm font-medium stripe-text-gradient-primary">
              Modern • Clean • Elegant
            </div>
          </AppleCard>
        }
      />

      {/* Modern Stats */}
      <NotionSection spacing="lg">
        <NotionStats
          stats={[
            {
              label: '총 리뷰 수',
              value: reviews.length,
              icon: <div className="text-xl">📊</div>
            },
            {
              label: '작성자 표시',
              value: reviews.filter(r => r.authorName).length,
              icon: <div className="text-xl">👤</div>
            },
            {
              label: '이번 주 리뷰',
              value: reviews.filter(r => {
                const reviewDate = new Date(r.createdAt)
                const weekAgo = new Date()
                weekAgo.setDate(weekAgo.getDate() - 7)
                return reviewDate > weekAgo
              }).length,
              icon: <div className="text-xl">📈</div>
            },
            {
              label: '평균 리뷰 길이',
              value: reviews.length > 0 ? Math.round(reviews.reduce((acc, r) => acc + r.reviewContent.length, 0) / reviews.length) : 0,
              icon: <div className="text-xl">📝</div>
            }
          ]}
        />
      </NotionSection>

      <NotionGrid columns={2} gap="lg">
        {/* Modern Review Form */}
        <AppleCard variant="glass" size="lg" className="stripe-gradient-overlay">
          <NotionSection title="리뷰 작성" subtitle="소중한 법회 경험을 공유해 주세요">
            <form onSubmit={handleSubmit} className="space-y-6 animate-linear-stagger-slide">
              <AppleInput
                label="🏛️ 법회명"
                value={formData.dharmaName}
                onChange={(e) => setFormData(prev => ({ ...prev, dharmaName: e.target.value }))}
                placeholder="일요법회, 수요법회, 특별법회 등"
                required
              />

              <AppleInput
                label="📅 법회 날짜"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />

              <AppleInput
                label="🏯 장소 (절명/사찰명)"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="조계사, 봉은사, 불광사 등"
                required
              />

              <AppleInput
                label="👤 작성자명 (선택사항)"
                value={formData.authorName}
                onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
                placeholder="익명으로 남겨둘 수 있습니다"
              />

              <AppleInput
                label="📝 리뷰 내용"
                multiline
                rows={6}
                value={formData.reviewContent}
                onChange={(e) => setFormData(prev => ({ ...prev, reviewContent: e.target.value }))}
                placeholder="법회에 대한 소감이나 경험을 자유롭게 작성해주세요..."
                required
              />

              <AppleButton 
                type="submit" 
                size="lg" 
                fullWidth 
                className="stripe-gradient-primary hover-linear-lift"
              >
                리뷰 작성하기
              </AppleButton>
            </form>
          </NotionSection>
        </AppleCard>

        {/* Modern Review List */}
        <div className="space-y-6">
          <NotionSection 
            title="리뷰 목록" 
            subtitle={`${reviews.length}개의 소중한 경험이 공유되었습니다`}
          >
            {reviews.length === 0 ? (
              <NotionEmptyState
                icon={<div className="text-6xl">🏛️</div>}
                title="아직 작성된 리뷰가 없습니다"
                description="첫 번째 법회 리뷰를 작성해 보세요!"
                action={
                  <AppleButton 
                    variant="secondary" 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    리뷰 작성하기
                  </AppleButton>
                }
              />
            ) : (
              <div className="space-y-4 animate-linear-stagger-fade">
                {reviews.map((review, index) => {
                  const gradients = [
                    'stripe-gradient-primary-soft',
                    'stripe-gradient-success-soft', 
                    'stripe-gradient-warning-soft',
                    'stripe-gradient-subtle-1'
                  ]
                  const gradientClass = gradients[index % gradients.length]

                  return (
                    <AppleCard 
                      key={review.id} 
                      variant="elevated" 
                      size="lg"
                      className={`${gradientClass} hover-linear-lift transition-linear border-l-4 stripe-border-gradient`}
                    >
                      <NotionBlock hover={false} className="bg-transparent border-none p-0 shadow-none">
                        <div className="flex flex-col sm:flex-row sm:justify-between mb-4 gap-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3">
                              <span>🏛️</span> {review.dharmaName}
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-3">
                              <AppleCard variant="outlined" size="sm" className="px-3 py-1 inline-block">
                                <span className="text-sm font-medium flex items-center gap-2">
                                  📅 {formatDate(review.date)}
                                </span>
                              </AppleCard>
                              <AppleCard variant="outlined" size="sm" className="px-3 py-1 inline-block">
                                <span className="text-sm font-medium flex items-center gap-2">
                                  🏯 {review.location}
                                </span>
                              </AppleCard>
                            </div>
                          </div>

                          <div className="text-right space-y-2 flex-shrink-0">
                            {review.authorName && (
                              <AppleCard variant="glass" size="sm" className="px-3 py-2">
                                <span className="text-sm font-medium stripe-text-gradient-primary">
                                  👤 {review.authorName}
                                </span>
                              </AppleCard>
                            )}
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              작성: {formatDate(review.createdAt)}
                            </div>
                          </div>
                        </div>

                        <AppleCard variant="glass" size="md" className="mt-4">
                          <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                            {review.reviewContent}
                          </p>
                        </AppleCard>
                      </NotionBlock>
                    </AppleCard>
                  )
                })
                }
              </div>
            )}
          </NotionSection>
        </div>
      </NotionGrid>

      {/* Modern Footer */}
      <NotionSection className="mt-16">
        <AppleCard variant="glass" size="lg" className="text-center stripe-gradient-overlay">
          <div className="space-y-4">
            <div className="text-2xl font-bold stripe-text-gradient-primary">
              🏛️ 법회 리뷰 플랫폼
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              현대적이고 미니멀한 법회 경험 나눔의 공간
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Apple Design</span>
              <span>•</span>
              <span>Stripe Gradients</span>
              <span>•</span>
              <span>Notion Layouts</span>
            </div>
          </div>
        </AppleCard>
      </NotionSection>
    </NotionPage>
  )
}

export default SimpleApp