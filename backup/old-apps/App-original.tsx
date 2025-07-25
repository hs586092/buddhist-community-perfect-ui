/**
 * 법회 리뷰 사이트 메인 앱 - 자연 테마
 */

import React, { useState, useEffect } from 'react'
import { ReviewForm } from './components/ReviewForm'
import { ReviewList } from './components/ReviewList'
import { NatureCard } from './components/nature/NatureCard'
import type { DharmaReview, ReviewFormData } from './types/review'
import './index.css'

const App: React.FC = () => {
  const [reviews, setReviews] = useState<DharmaReview[]>([])

  // 로컬 스토리지에서 리뷰 데이터 로드
  useEffect(() => {
    const savedReviews = localStorage.getItem('dharmaReviews')
    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews))
      } catch (error) {
        console.error('리뷰 데이터 로드 실패:', error)
      }
    }
  }, [])

  // 리뷰 데이터가 변경될 때 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('dharmaReviews', JSON.stringify(reviews))
  }, [reviews])

  // 새 리뷰 추가
  const handleAddReview = (formData: ReviewFormData) => {
    const newReview: DharmaReview = {
      id: Date.now().toString(), // 간단한 ID 생성
      dharmaName: formData.dharmaName,
      date: formData.date,
      location: formData.location,
      reviewContent: formData.reviewContent,
      createdAt: new Date().toISOString(),
      authorName: formData.authorName || undefined
    }

    setReviews(prev => [newReview, ...prev]) // 최신 리뷰가 위에 오도록
    alert('리뷰가 성공적으로 작성되었습니다!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-emerald-100 relative">
      {/* 자연 배경 요소들 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 left-10 text-6xl">🌿</div>
        <div className="absolute top-40 right-20 text-4xl">🍃</div>
        <div className="absolute bottom-40 left-1/4 text-5xl">🌱</div>
        <div className="absolute bottom-20 right-10 text-7xl">🌳</div>
        <div className="absolute top-60 left-1/3 text-3xl">🏔️</div>
        <div className="absolute bottom-60 right-1/3 text-4xl">🌾</div>
      </div>

      {/* 헤더 */}
      <header className="relative z-10 py-8">
        <NatureCard 
          variant="leaf"
          size="lg"
          className="mx-4 max-w-4xl mx-auto"
        >
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-green-800 flex items-center justify-center gap-4">
              <span>🏛️</span> 법회 리뷰 <span>🌿</span>
            </h1>
            <p className="text-2xl text-green-600 font-medium">
              자연스럽고 평화로운 법회 경험 나눔터
            </p>
            <div className="flex items-center justify-center gap-8 text-lg">
              <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
                <span>🌱</span>
                <span className="text-green-700 font-semibold">자연스러운 공유</span>
              </div>
              <div className="flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full">
                <span>📝</span>
                <span className="text-amber-700 font-semibold">소중한 기록</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full">
                <span>🤝</span>
                <span className="text-emerald-700 font-semibold">함께하는 소통</span>
              </div>
            </div>
          </div>
        </NatureCard>
      </header>

      {/* 메인 컨텐츠 - 한 페이지에 모든 내용 */}
      <main className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        {/* 통계 카드 */}
        <div className="mb-8">
          <NatureCard 
            variant="earth" 
            size="md"
            className="text-center"
          >
            <div className="flex items-center justify-center gap-8">
              <div className="space-y-2">
                <p className="text-4xl font-bold text-amber-800">
                  {reviews.length}
                </p>
                <p className="text-amber-600 font-semibold">총 리뷰 수</p>
              </div>
              <div className="text-6xl">📊</div>
              <div className="space-y-2">
                <p className="text-4xl font-bold text-green-800">
                  {reviews.filter(r => r.authorName).length}
                </p>
                <p className="text-green-600 font-semibold">작성자 표시</p>
              </div>
            </div>
          </NatureCard>
        </div>

        <div className="space-y-12">
          {/* 리뷰 작성 폼 */}
          <div>
            <ReviewForm onSubmit={handleAddReview} />
          </div>

          {/* 리뷰 목록 */}
          <div>
            <ReviewList reviews={reviews} />
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="relative z-10 mt-16">
        <NatureCard 
          variant="stone"
          size="md"
          className="mx-4 mb-4 max-w-4xl mx-auto"
        >
          <div className="text-center space-y-3">
            <p className="text-xl font-bold text-slate-700">
              🌿 법회 리뷰 사이트 🌿
            </p>
            <p className="text-slate-600">
              자연스럽고 평화로운 법회 경험 나눔의 공간
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <span>자연과 함께</span>
              <span className="text-green-500">🌱</span>
              <span>만든 소중한 공간</span>
            </div>
          </div>
        </NatureCard>
      </footer>
    </div>
  )
}

export default App