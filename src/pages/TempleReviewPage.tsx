import React, { useState, useMemo } from 'react';
import ReviewCard from '../components/temple/ReviewCard';
import { temples, reviews } from '../data/temples';

const TempleReviewPage: React.FC = () => {
  const [sortBy, setSortBy] = useState<'latest' | 'rating' | 'helpful'>('latest');

  // 모든 리뷰를 정렬해서 보여주기
  const sortedReviews = useMemo(() => {
    const allReviews = reviews.map(review => {
      const temple = temples.find(t => t.id === review.templeId);
      return {
        ...review,
        templeName: temple?.name || '알 수 없는 사찰'
      };
    });

    switch (sortBy) {
      case 'rating':
        return allReviews.sort((a, b) => b.rating.overall - a.rating.overall);
      case 'helpful':
        return allReviews.sort((a, b) => b.helpful - a.helpful);
      case 'latest':
      default:
        return allReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [sortBy]);

  // 통계 계산
  const stats = useMemo(() => {
    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((sum, r) => sum + r.rating.overall, 0) / totalReviews;
    return {
      totalTemples: temples.length,
      totalReviews,
      averageRating: averageRating.toFixed(1)
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🏛️ 법회 리뷰
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              불자들의 진솔한 법회 경험을 나누는 공간
            </p>
            
            {/* 통계 */}
            <div className="flex justify-center gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-amber-600">{stats.totalReviews}</div>
                <div className="text-sm text-gray-600">총 리뷰</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">⭐ {stats.averageRating}</div>
                <div className="text-sm text-gray-600">평균 평점</div>
              </div>
            </div>
          </div>

          {/* 간단한 정렬 */}
          <div className="flex justify-center mb-6">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="latest">최신순</option>
              <option value="rating">평점순</option>
              <option value="helpful">도움됨순</option>
            </select>
          </div>
        </div>
      </div>

      {/* 리뷰 목록 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-6">
          {sortedReviews.map(review => (
            <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-6">
              {/* 사찰 이름 표시 */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🏛️</span>
                <span className="font-semibold text-gray-900">{review.templeName}</span>
              </div>
              <ReviewCard review={review} compact={false} />
            </div>
          ))}
        </div>

        {sortedReviews.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              아직 리뷰가 없습니다
            </h3>
            <p className="text-gray-600">
              첫 번째 법회 리뷰를 작성해보세요!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TempleReviewPage;