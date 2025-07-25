import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
  id: string;
  templeName: string;
  content: string;
  author: string;
  date: Date;
  gratitude: number; // 1-5, 감사 지수
}

interface ReviewSpaceProps {
  onBack: () => void;
  className?: string;
}

export const ReviewSpace: React.FC<ReviewSpaceProps> = ({
  onBack,
  className = ""
}) => {
  const [mode, setMode] = useState<'read' | 'write'>('read');
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      templeName: '조계사',
      content: '새벽 예불에 참가했습니다. 도심 속에서도 이렇게 고요한 시간을 가질 수 있다는 것이 감사했어요. 스님의 법문이 마음 깊이 와닿았습니다.',
      author: '구름',
      date: new Date('2024-01-15'),
      gratitude: 5
    },
    {
      id: '2', 
      templeName: '불국사',
      content: '경주 여행 중 들렀는데, 석가탑 앞에서 잠시 명상하는 시간이 참 평화로웠습니다. 천년의 역사가 느껴지는 곳이에요.',
      author: '바람',
      date: new Date('2024-01-12'),
      gratitude: 4
    },
    {
      id: '3',
      templeName: '해인사',
      content: '팔만대장경을 직접 보고 왔어요. 선조들의 지혜와 정성이 고스란히 전해져 마음이 숙연해졌습니다.',
      author: '이슬',
      date: new Date('2024-01-10'),
      gratitude: 5
    }
  ]);

  const [newReview, setNewReview] = useState({
    templeName: '',
    content: '',
    gratitude: 3
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 글쓰기 모드로 전환 시 포커스
  useEffect(() => {
    if (mode === 'write' && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [mode]);

  const handleSubmitReview = () => {
    if (newReview.templeName.trim() && newReview.content.trim()) {
      const review: Review = {
        id: Date.now().toString(),
        templeName: newReview.templeName,
        content: newReview.content,
        author: '익명', // 실제 구현에서는 사용자 닉네임
        date: new Date(),
        gratitude: newReview.gratitude
      };

      setReviews(prev => [review, ...prev]);
      setNewReview({ templeName: '', content: '', gratitude: 3 });
      setMode('read');
    }
  };

  const getGratitudeIcon = (level: number) => {
    const icons = ['🤍', '🤍', '💛', '🧡', '❤️'];
    return icons[level - 1] || '🤍';
  };

  return (
    <div className={`min-h-screen bg-zen-white ${className}`}>
      {/* 헤더 */}
      <motion.header 
        className="bg-dharma-gold text-white py-6 px-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              className="text-3xl"
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              📿
            </motion.div>
            <div>
              <h1 className="text-2xl font-light">법회 리뷰</h1>
              <p className="text-white/80 text-sm">사찰에서의 소중한 경험을 나누세요</p>
            </div>
          </div>

          <button
            onClick={onBack}
            className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium hover:bg-white/30 transition-colors"
          >
            ← 홈으로
          </button>
        </div>
      </motion.header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto p-8">
        {/* 모드 전환 */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-gray-100 rounded-full p-1 flex">
            <button
              onClick={() => setMode('read')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                mode === 'read' 
                  ? 'bg-dharma-gold text-white shadow-sm' 
                  : 'text-meditation-gray hover:text-gray-800'
              }`}
            >
              📖 후기 보기
            </button>
            <button
              onClick={() => setMode('write')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                mode === 'write' 
                  ? 'bg-dharma-gold text-white shadow-sm' 
                  : 'text-meditation-gray hover:text-gray-800'
              }`}
            >
              ✍️ 후기 쓰기
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* 읽기 모드 */}
          {mode === 'read' && (
            <motion.div
              key="read"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {reviews.map((review, index) => (
                <motion.article
                  key={review.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2, shadow: "0 8px 25px rgba(0,0,0,0.1)" }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-dharma-gold/10 rounded-xl flex items-center justify-center">
                        <span className="text-dharma-gold text-xl">🏛️</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{review.templeName}</h3>
                        <div className="flex items-center space-x-2 text-sm text-meditation-gray">
                          <span>{review.author}</span>
                          <span>•</span>
                          <span>{review.date.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* 감사 지수 */}
                    <div className="flex items-center space-x-1">
                      <span className="text-2xl">{getGratitudeIcon(review.gratitude)}</span>
                      <span className="text-sm text-meditation-gray">감사</span>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed">{review.content}</p>

                  {/* 반응 영역 (단순화) */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center space-x-4 text-sm text-meditation-gray">
                      <button className="hover:text-dharma-gold transition-colors">
                        🙏 공감
                      </button>
                      <button className="hover:text-dharma-gold transition-colors">
                        💬 댓글
                      </button>
                    </div>
                    <div className="text-xs text-meditation-gray/60">
                      {Math.floor(Math.random() * 20 + 5)}명이 공감했어요
                    </div>
                  </div>
                </motion.article>
              ))}

              {reviews.length === 0 && (
                <motion.div
                  className="text-center py-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-6xl mb-4">📿</div>
                  <p className="text-meditation-gray">아직 작성된 후기가 없어요</p>
                  <p className="text-sm text-meditation-gray/70 mt-2">
                    첫 번째 후기를 작성해보세요
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* 쓰기 모드 */}
          {mode === 'write' && (
            <motion.div
              key="write"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
            >
              <div className="text-center mb-8">
                <div className="text-4xl mb-2">✍️</div>
                <h2 className="text-xl font-light text-gray-800">소중한 경험을 나누어주세요</h2>
                <p className="text-sm text-meditation-gray mt-2">
                  사찰에서 느낀 마음을 천천히 적어보세요
                </p>
              </div>

              <div className="space-y-6">
                {/* 사찰명 입력 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🏛️ 사찰명
                  </label>
                  <input
                    type="text"
                    value={newReview.templeName}
                    onChange={(e) => setNewReview(prev => ({ ...prev, templeName: e.target.value }))}
                    placeholder="어느 사찰을 다녀오셨나요?"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-dharma-gold/50 focus:border-dharma-gold transition-colors"
                  />
                </div>

                {/* 후기 내용 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    💭 후기 내용
                  </label>
                  <textarea
                    ref={textareaRef}
                    value={newReview.content}
                    onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="사찰에서의 경험, 느낀 점, 감사한 마음을 자유롭게 적어주세요..."
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-dharma-gold/50 focus:border-dharma-gold transition-colors resize-none"
                  />
                </div>

                {/* 감사 지수 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getGratitudeIcon(newReview.gratitude)} 감사한 마음
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={newReview.gratitude}
                      onChange={(e) => setNewReview(prev => ({ ...prev, gratitude: parseInt(e.target.value) }))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #D4A574 0%, #D4A574 ${(newReview.gratitude - 1) * 25}%, #e2e8f0 ${(newReview.gratitude - 1) * 25}%, #e2e8f0 100%)`
                      }}
                    />
                    <span className="text-sm text-meditation-gray min-w-[60px]">
                      {newReview.gratitude === 1 && '조금'}
                      {newReview.gratitude === 2 && '보통'}
                      {newReview.gratitude === 3 && '감사'}
                      {newReview.gratitude === 4 && '매우 감사'}
                      {newReview.gratitude === 5 && '깊이 감사'}
                    </span>
                  </div>
                </div>

                {/* 제출 버튼 */}
                <div className="flex justify-center pt-4">
                  <motion.button
                    onClick={handleSubmitReview}
                    disabled={!newReview.templeName.trim() || !newReview.content.trim()}
                    className={`px-8 py-3 rounded-xl font-medium transition-all ${
                      newReview.templeName.trim() && newReview.content.trim()
                        ? 'bg-dharma-gold text-white hover:bg-dharma-gold/90 shadow-lg hover:shadow-xl'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    🙏 후기 남기기
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ReviewSpace;