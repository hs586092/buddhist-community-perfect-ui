import React, { useState, useMemo } from 'react';
import TempleCard from '../components/temple/TempleCard';
import ReviewCard from '../components/temple/ReviewCard';
import { temples, reviews } from '../data/temples';
import { Temple, Review, ReviewFilter } from '../types/temple';

const TempleReviewPage: React.FC = () => {
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<ReviewFilter>({
    sortBy: 'latest'
  });
  const [showFilters, setShowFilters] = useState(false);

  // 필터링된 사찰 목록
  const filteredTemples = useMemo(() => {
    return temples.filter(temple => {
      const matchesSearch = temple.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           temple.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           temple.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCity = !filter.city || temple.location.city === filter.city;
      const matchesSect = !filter.sect || temple.sect === filter.sect;
      
      return matchesSearch && matchesCity && matchesSect;
    });
  }, [searchTerm, filter]);

  // 선택된 사찰의 리뷰들
  const templeReviews = useMemo(() => {
    if (!selectedTemple) return [];
    
    let filtered = reviews.filter(review => review.templeId === selectedTemple.id);
    
    // 평점 필터
    if (filter.rating) {
      filtered = filtered.filter(review => review.rating.overall >= filter.rating!);
    }
    
    // 정렬
    switch (filter.sortBy) {
      case 'rating':
        return filtered.sort((a, b) => b.rating.overall - a.rating.overall);
      case 'helpful':
        return filtered.sort((a, b) => b.helpful - a.helpful);
      case 'latest':
      default:
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [selectedTemple, filter]);

  const handleTempleSelect = (temple: Temple) => {
    setSelectedTemple(temple);
  };

  const handleBackToList = () => {
    setSelectedTemple(null);
  };

  const cities = Array.from(new Set(temples.map(t => t.location.city)));
  const sects = Array.from(new Set(temples.map(t => t.sect)));

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

  if (selectedTemple) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* 헤더 */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
            <button
              onClick={handleBackToList}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
            >
              <span>←</span>
              <span>사찰 목록으로 돌아가기</span>
            </button>
            
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-200 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🏛️</span>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedTemple.name}</h1>
                <p className="text-gray-600 mb-2">📍 {selectedTemple.location.address}</p>
                <p className="text-gray-700">{selectedTemple.description}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${
                            i < Math.floor(selectedTemple.rating.average) 
                              ? 'text-yellow-400' 
                              : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="font-semibold">{selectedTemple.rating.average}</span>
                    <span className="text-gray-500">({selectedTemple.rating.count}개 리뷰)</span>
                  </div>
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full">
                    {selectedTemple.sect}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 리뷰 목록 */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* 리뷰 필터 */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">
                리뷰 {templeReviews.length}개
              </h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                필터 {showFilters ? '숨기기' : '보기'}
              </button>
            </div>
            
            {showFilters && (
              <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
                <select
                  value={filter.sortBy}
                  onChange={(e) => setFilter(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="latest">최신순</option>
                  <option value="rating">평점순</option>
                  <option value="helpful">도움됨순</option>
                </select>
                
                <select
                  value={filter.rating || ''}
                  onChange={(e) => setFilter(prev => ({ 
                    ...prev, 
                    rating: e.target.value ? Number(e.target.value) : undefined 
                  }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">모든 평점</option>
                  <option value="5">⭐⭐⭐⭐⭐ 5점</option>
                  <option value="4">⭐⭐⭐⭐ 4점 이상</option>
                  <option value="3">⭐⭐⭐ 3점 이상</option>
                </select>
              </div>
            )}
          </div>

          {/* 리뷰 목록 */}
          <div className="space-y-6">
            {templeReviews.length > 0 ? (
              templeReviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  아직 리뷰가 없습니다
                </h3>
                <p className="text-gray-600">
                  이 사찰의 첫 번째 리뷰를 작성해보세요!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🏛️ 법회 리뷰
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              전국 사찰의 법회와 수행 프로그램 리뷰를 확인하세요
            </p>
            
            {/* 통계 */}
            <div className="flex justify-center gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-amber-600">{stats.totalTemples}</div>
                <div className="text-sm text-gray-600">등록된 사찰</div>
              </div>
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

          {/* 검색 및 필터 */}
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="사찰명, 지역으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors"
              >
                필터
              </button>
            </div>

            {showFilters && (
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                <div className="flex flex-wrap gap-4">
                  <select
                    value={filter.city || ''}
                    onChange={(e) => setFilter(prev => ({ 
                      ...prev, 
                      city: e.target.value || undefined 
                    }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">모든 지역</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>

                  <select
                    value={filter.sect || ''}
                    onChange={(e) => setFilter(prev => ({ 
                      ...prev, 
                      sect: e.target.value as Temple['sect'] || undefined 
                    }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">모든 종단</option>
                    {sects.map(sect => (
                      <option key={sect} value={sect}>{sect}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 사찰 목록 */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {filteredTemples.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemples.map(temple => (
              <TempleCard
                key={temple.id}
                temple={temple}
                onClick={handleTempleSelect}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-600">
              다른 검색어나 필터를 시도해보세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TempleReviewPage;