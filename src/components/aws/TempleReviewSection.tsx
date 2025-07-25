import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TempleService, Temple, Review, CreateReviewData } from '../../services/TempleService';
import { User } from '../../services/AuthService';

interface TempleReviewSectionProps {
  user: User | null;
  onBack: () => void;
}

export const TempleReviewSection: React.FC<TempleReviewSectionProps> = ({ user, onBack }) => {
  const [temples, setTemples] = useState<Temple[]>([]);
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewFormData, setReviewFormData] = useState<CreateReviewData>({
    title: '',
    content: '',
    rating: 5,
    category: '명상',
    isRecommended: true,
    tags: []
  });

  useEffect(() => {
    loadTemples();
  }, []);

  useEffect(() => {
    if (selectedTemple) {
      loadTempleReviews(selectedTemple.templeId);
    }
  }, [selectedTemple]);

  const loadTemples = async () => {
    try {
      setIsLoading(true);
      const response = await TempleService.getTemples({ limit: 20 });
      setTemples(response.temples);
    } catch (error) {
      console.error('사찰 목록 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTempleReviews = async (templeId: string) => {
    try {
      const response = await TempleService.getTempleReviews(templeId, { limit: 10 });
      setReviews(response.reviews);
    } catch (error) {
      console.error('리뷰 로드 실패:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadTemples();
      return;
    }

    try {
      setIsLoading(true);
      const response = await TempleService.searchTemples(searchQuery);
      setTemples(response.temples);
    } catch (error) {
      console.error('사찰 검색 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateReview = async () => {
    if (!user || !selectedTemple) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      await TempleService.createReview(selectedTemple.templeId, reviewFormData);
      alert('리뷰가 성공적으로 작성되었습니다!');
      setShowReviewForm(false);
      setReviewFormData({
        title: '',
        content: '',
        rating: 5,
        category: '명상',
        isRecommended: true,
        tags: []
      });
      // 리뷰 목록 다시 로드
      await loadTempleReviews(selectedTemple.templeId);
    } catch (error) {
      console.error('리뷰 작성 실패:', error);
      alert('리뷰 작성에 실패했습니다.');
    }
  };

  const renderTempleList = () => (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">법회 리뷰</h1>
          <p className="text-gray-600">전국 사찰의 법회와 수행 프로그램 후기를 확인하세요</p>
        </div>
        <button
          onClick={onBack}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
        >
          ← 홈으로
        </button>
      </div>

      {/* 검색 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 mb-8">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="사찰명을 검색하세요..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            검색
          </button>
        </div>
      </div>

      {/* 사찰 목록 */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mx-auto mb-4 flex items-center justify-center lotus-bloom">
            <span className="text-white text-2xl">🪷</span>
          </div>
          <p className="text-gray-600">사찰 정보를 불러오고 있습니다...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {temples.map((temple) => (
            <motion.div
              key={temple.templeId}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 cursor-pointer card-hover"
              onClick={() => setSelectedTemple(temple)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{temple.name}</h3>
                  <p className="text-sm text-gray-500">{temple.city}, {temple.province}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-semibold">{temple.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-gray-500">{temple.reviewCount}개 리뷰</p>
                </div>
              </div>

              {temple.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{temple.description}</p>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                {temple.features.slice(0, 3).map((feature, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {feature}
                  </span>
                ))}
                {temple.features.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{temple.features.length - 3}개
                  </span>
                )}
              </div>

              <div className="text-blue-600 text-sm font-medium">
                리뷰 보기 →
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {temples.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">🏛️</span>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchQuery ? '검색 결과가 없습니다' : '등록된 사찰이 없습니다'}
          </h3>
          <p className="text-gray-600">
            {searchQuery ? '다른 검색어로 다시 시도해보세요.' : '곧 더 많은 사찰 정보를 제공할 예정입니다.'}
          </p>
        </div>
      )}
    </div>
  );

  const renderTempleDetail = () => (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => setSelectedTemple(null)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
        >
          ← 사찰 목록
        </button>
        {user && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            리뷰 작성
          </button>
        )}
      </div>

      {/* 사찰 정보 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedTemple?.name}</h1>
            <p className="text-lg text-gray-600 mb-2">{selectedTemple?.fullName}</p>
            <p className="text-gray-500">{selectedTemple?.address}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-yellow-500 text-2xl">★</span>
              <span className="text-2xl font-bold">{selectedTemple?.rating.toFixed(1)}</span>
            </div>
            <p className="text-gray-500">{selectedTemple?.reviewCount}개 리뷰</p>
          </div>
        </div>

        {selectedTemple?.description && (
          <p className="text-gray-700 mb-6">{selectedTemple.description}</p>
        )}

        <div className="flex flex-wrap gap-2">
          {selectedTemple?.features.map((feature, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* 리뷰 목록 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">리뷰 ({reviews.length})</h2>
        
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.reviewId} className="border-b border-gray-100 pb-6 last:border-b-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{review.title}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{review.username || '익명'}</span>
                      <span>•</span>
                      <span>{review.category}</span>
                      <span>•</span>
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-semibold">{review.rating}</span>
                  </div>
                </div>

                <p className="text-gray-700 mb-3">{review.content}</p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {review.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {review.isRecommended && (
                      <span className="text-green-600">👍 추천</span>
                    )}
                    <span>도움됨 {review.helpfulCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">📝</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">아직 리뷰가 없습니다</h3>
            <p className="text-gray-600 mb-4">이 사찰의 첫 번째 리뷰를 작성해보세요!</p>
            {user && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                리뷰 작성하기
              </button>
            )}
          </div>
        )}
      </div>

      {/* 리뷰 작성 모달 */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">리뷰 작성</h3>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제목
                  </label>
                  <input
                    type="text"
                    value={reviewFormData.title}
                    onChange={(e) => setReviewFormData({ ...reviewFormData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="리뷰 제목을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    평점
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setReviewFormData({ ...reviewFormData, rating })}
                        className={`text-2xl ${
                          rating <= reviewFormData.rating ? 'text-yellow-500' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    카테고리
                  </label>
                  <select
                    value={reviewFormData.category}
                    onChange={(e) => setReviewFormData({ ...reviewFormData, category: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="명상">명상</option>
                    <option value="법문">법문</option>
                    <option value="체험">체험</option>
                    <option value="행사">행사</option>
                    <option value="템플스테이">템플스테이</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    리뷰 내용
                  </label>
                  <textarea
                    value={reviewFormData.content}
                    onChange={(e) => setReviewFormData({ ...reviewFormData, content: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="법회나 프로그램에 대한 솔직한 후기를 작성해주세요"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="recommend"
                    checked={reviewFormData.isRecommended}
                    onChange={(e) => setReviewFormData({ ...reviewFormData, isRecommended: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="recommend" className="ml-2 text-sm text-gray-700">
                    이 사찰을 다른 불자들에게 추천합니다
                  </label>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => setShowReviewForm(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleCreateReview}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={!reviewFormData.title || !reviewFormData.content}
                  >
                    리뷰 작성
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return selectedTemple ? renderTempleDetail() : renderTempleList();
};