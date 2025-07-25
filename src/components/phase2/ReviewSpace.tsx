import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
  id: string;
  templeName: string;
  teacherName?: string;      // 법사님 성함
  content: string;
  author: string;
  date: string;
  reviewDate: string;        // 실제 참석 날짜
  dharmaTopic?: string;      // 법문 주제
  heartRating: number;       // 1-5, 마음에 와닿은 정도 (연꽃 꽃잎)
  innerThoughts: string;     // 개인적 느낌/깨달음
  emotionalTags: string[];   // 감정 태그
  recommendToSangha: boolean; // 다른 불자에게 추천 여부
  engagement: number;        // 공감 수
  isAnonymous: boolean;      // 익명 여부
}

interface ReviewSpaceProps {
  onBack: () => void;
  className?: string;
}

// 한국 주요 사찰 목록
const koreanTemples = [
  '조계사', '불국사', '해인사', '범어사', '통도사', '화엄사', '송광사', '법주사',
  '직지사', '백양사', '선암사', '대흥사', '금산사', '관룡사', '국청사', '보문사',
  '천은사', '쌍계사', '석왕사', '개심사', '무량사', '관촉사', '갑사', '마곡사'
];

// 감정 태그 목록
const emotionalTags = [
  '#평화로운', '#깨달음', '#감사한마음', '#고요한', '#따뜻한', '#경건한',
  '#마음챙김', '#자비로운', '#지혜로운', '#정화되는', '#차분한', '#영감받은',
  '#성찰적인', '#겸손한', '#희망찬', '#용서하는', '#자유로운', '#연민어린'
];

const mockReviews: Review[] = [
  {
    id: '1',
    templeName: '조계사',
    teacherName: '법륜스님',
    content: '새벽 예불에 참가했습니다. 도심 속에서도 이렇게 고요한 시간을 가질 수 있다는 것이 감사했어요.',
    innerThoughts: '번잡한 일상을 잠시 내려놓고 진정한 나 자신과 마주할 수 있는 시간이었습니다. 스님의 법문이 마음 깊이 와닿았습니다.',
    author: '구름',
    date: '2024-01-15',
    reviewDate: '2024-01-15',
    dharmaTopic: '마음챙김과 현재순간',
    heartRating: 5,
    emotionalTags: ['#평화로운', '#깨달음', '#감사한마음'],
    recommendToSangha: true,
    engagement: 24,
    isAnonymous: false
  },
  {
    id: '2', 
    templeName: '불국사',
    content: '경주 여행 중 들렀는데, 석가탑 앞에서 잠시 명상하는 시간이 참 평화로웠습니다. 천년의 역사가 느껴지는 곳이에요. 석가탑의 위엄 앞에서 작은 나를 돌아보게 되었습니다.',
    author: '바람',
    date: '2024-01-12',
    gratitude: 4,
    engagement: 18
  },
  {
    id: '3',
    templeName: '해인사',
    content: '팔만대장경을 직접 보고 왔어요. 선조들의 지혜와 정성이 고스란히 전해져 마음이 숙연해졌습니다. 목판 하나하나에 담긴 정성을 생각하니 절로 고개가 숙여졌습니다.',
    author: '이슬',
    date: '2024-01-10',
    gratitude: 5,
    engagement: 31
  },
  {
    id: '4',
    templeName: '범어사',
    content: '부산의 명산인 금정산에 자리한 범어사에서 산사체험을 했습니다. 새벽 4시 기상부터 시작된 하루 일정이 힘들었지만, 마음이 정화되는 느낌이었어요.',
    author: '연꽃',
    date: '2024-01-08',
    gratitude: 4,
    engagement: 15
  }
];

export const ReviewSpace: React.FC<ReviewSpaceProps> = ({
  onBack,
  className = ""
}) => {
  const [mode, setMode] = useState<'read' | 'write'>('read');
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [newReview, setNewReview] = useState({
    templeName: '',
    content: '',
    gratitude: 3
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 글쓰기 모드로 전환 시 포커스
  useEffect(() => {
    if (mode === 'write' && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 300);
    }
  }, [mode]);

  const handleSubmitReview = () => {
    if (newReview.templeName.trim() && newReview.content.trim()) {
      const review: Review = {
        id: Date.now().toString(),
        templeName: newReview.templeName.trim(),
        content: newReview.content.trim(),
        author: '익명', // 실제 구현에서는 사용자 닉네임
        date: new Date().toLocaleDateString('ko-KR'),
        gratitude: newReview.gratitude,
        engagement: 0
      };

      setReviews(prev => [review, ...prev]);
      setNewReview({ templeName: '', content: '', gratitude: 3 });
      setMode('read');
    }
  };

  const handleEngagement = (reviewId: string) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, engagement: review.engagement + 1 }
        : review
    ));
  };

  const getGratitudeIcon = (level: number) => {
    const icons = ['🤍', '💙', '💛', '🧡', '❤️'];
    return icons[level - 1] || '🤍';
  };

  const getGratitudeText = (level: number) => {
    const texts = ['조금', '보통', '감사', '매우 감사', '깊이 감사'];
    return texts[level - 1] || '보통';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 ${className}`}>
      {/* 헤더 */}
      <motion.header 
        className="bg-gradient-to-r from-amber-600 to-orange-500 text-white py-8 px-8 shadow-lg"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <motion.div
              className="text-4xl"
              animate={{ 
                rotateY: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotateY: { duration: 6, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, repeatType: "reverse" }
              }}
            >
              📿
            </motion.div>
            <div>
              <h1 className="text-3xl font-light mb-1">법회 리뷰</h1>
              <p className="text-white/90 text-lg">사찰에서의 소중한 경험을 나누세요</p>
            </div>
          </div>

          <motion.button
            onClick={onBack}
            className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-lg font-medium hover:bg-white/30 transition-all duration-300 border border-white/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← 홈으로 돌아가기
          </motion.button>
        </div>
      </motion.header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-6xl mx-auto p-8">
        {/* 모드 전환 */}
        <motion.div 
          className="flex justify-center mb-12"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 flex shadow-lg border border-white/50">
            <motion.button
              onClick={() => setMode('read')}
              className={`px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 ${
                mode === 'read' 
                  ? 'bg-amber-500 text-white shadow-md' 
                  : 'text-amber-600 hover:text-amber-700 hover:bg-white/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              📖 후기 보기
            </motion.button>
            <motion.button
              onClick={() => setMode('write')}
              className={`px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 ${
                mode === 'write' 
                  ? 'bg-amber-500 text-white shadow-md' 
                  : 'text-amber-600 hover:text-amber-700 hover:bg-white/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ✍️ 후기 쓰기
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* 읽기 모드 */}
          {mode === 'read' && (
            <motion.div
              key="read"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4 }}
              className="grid gap-8 md:grid-cols-1 lg:grid-cols-2"
            >
              {reviews.map((review, index) => (
                <motion.article
                  key={review.id}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/60 hover:shadow-2xl transition-all duration-500"
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    delay: index * 0.1,
                    duration: 0.5,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    y: -8, 
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center shadow-inner">
                        <span className="text-amber-600 text-2xl">🏛️</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">
                          {review.templeName}
                        </h3>
                        <div className="flex items-center space-x-3 text-sm text-gray-500">
                          <span className="font-medium">{review.author}</span>
                          <span>•</span>
                          <span>{review.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* 감사 지수 */}
                    <div className="flex flex-col items-center">
                      <span className="text-3xl mb-1">{getGratitudeIcon(review.gratitude)}</span>
                      <span className="text-sm text-gray-500 font-medium">
                        {getGratitudeText(review.gratitude)}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed text-lg mb-6 line-clamp-4">
                    {review.content}
                  </p>

                  {/* 반응 영역 */}
                  <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                    <div className="flex items-center space-x-6">
                      <motion.button
                        onClick={() => handleEngagement(review.id)}
                        className="flex items-center space-x-2 text-amber-600 hover:text-amber-700 transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="text-xl">🙏</span>
                        <span className="font-medium">공감</span>
                        <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-sm">
                          {review.engagement}
                        </span>
                      </motion.button>
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors duration-200">
                        <span className="text-xl">💬</span>
                        <span className="font-medium">댓글</span>
                      </button>
                    </div>
                    <div className="text-sm text-gray-400">
                      {review.engagement > 0 && `${review.engagement}명이 공감했어요`}
                    </div>
                  </div>
                </motion.article>
              ))}

              {reviews.length === 0 && (
                <motion.div
                  className="col-span-full text-center py-20"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-8xl mb-6">📿</div>
                  <h3 className="text-2xl font-light text-gray-600 mb-2">
                    아직 작성된 후기가 없어요
                  </h3>
                  <p className="text-lg text-gray-500">
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
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-white/60">
                <div className="text-center mb-10">
                  <motion.div
                    className="text-6xl mb-4"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 3, -3, 0]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      repeatType: "reverse" 
                    }}
                  >
                    ✍️
                  </motion.div>
                  <h2 className="text-3xl font-light text-gray-800 mb-3">
                    소중한 경험을 나누어주세요
                  </h2>
                  <p className="text-lg text-gray-600">
                    사찰에서 느낀 마음을 천천히 적어보세요
                  </p>
                </div>

                <div className="space-y-8">
                  {/* 사찰명 입력 */}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3 flex items-center space-x-2">
                      <span>🏛️</span>
                      <span>사찰명</span>
                    </label>
                    <input
                      type="text"
                      value={newReview.templeName}
                      onChange={(e) => setNewReview(prev => ({ ...prev, templeName: e.target.value }))}
                      placeholder="어느 사찰을 다녀오셨나요?"
                      className="w-full px-6 py-4 text-lg border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-200 focus:border-amber-400 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    />
                  </div>

                  {/* 후기 내용 */}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3 flex items-center space-x-2">
                      <span>💭</span>
                      <span>후기 내용</span>
                    </label>
                    <textarea
                      ref={textareaRef}
                      value={newReview.content}
                      onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="사찰에서의 경험, 느낀 점, 감사한 마음을 자유롭게 적어주세요..."
                      rows={10}
                      className="w-full px-6 py-4 text-lg border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-200 focus:border-amber-400 transition-all duration-300 resize-none bg-white/80 backdrop-blur-sm leading-relaxed"
                    />
                    <div className="text-right mt-2 text-sm text-gray-500">
                      {newReview.content.length}자
                    </div>
                  </div>

                  {/* 감사 지수 */}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-4 flex items-center space-x-2">
                      <span>{getGratitudeIcon(newReview.gratitude)}</span>
                      <span>감사한 마음</span>
                    </label>
                    <div className="flex items-center space-x-6">
                      <div className="flex-1">
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={newReview.gratitude}
                          onChange={(e) => setNewReview(prev => ({ 
                            ...prev, 
                            gratitude: parseInt(e.target.value) 
                          }))}
                          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                          style={{
                            background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${(newReview.gratitude - 1) * 25}%, #e5e7eb ${(newReview.gratitude - 1) * 25}%, #e5e7eb 100%)`
                          }}
                        />
                        <div className="flex justify-between text-sm text-gray-500 mt-2">
                          <span>조금</span>
                          <span>보통</span>
                          <span>감사</span>
                          <span>매우</span>
                          <span>깊이</span>
                        </div>
                      </div>
                      <div className="min-w-[120px] text-center">
                        <div className="text-2xl mb-1">{getGratitudeIcon(newReview.gratitude)}</div>
                        <div className="text-lg font-medium text-gray-700">
                          {getGratitudeText(newReview.gratitude)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 제출 버튼 */}
                  <div className="flex justify-center pt-8">
                    <motion.button
                      onClick={handleSubmitReview}
                      disabled={!newReview.templeName.trim() || !newReview.content.trim()}
                      className={`px-12 py-4 text-xl rounded-2xl font-medium transition-all duration-300 ${
                        newReview.templeName.trim() && newReview.content.trim()
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                      whileHover={{ 
                        scale: newReview.templeName.trim() && newReview.content.trim() ? 1.05 : 1
                      }}
                      whileTap={{ 
                        scale: newReview.templeName.trim() && newReview.content.trim() ? 0.95 : 1
                      }}
                    >
                      🙏 후기 남기기
                    </motion.button>
                  </div>
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