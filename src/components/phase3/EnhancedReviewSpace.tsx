import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DharmaReview {
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

interface EnhancedReviewSpaceProps {
  onBack: () => void;
  className?: string;
}

// 한국 주요 사찰 목록
const koreanTemples = [
  '조계사', '불국사', '해인사', '범어사', '통도사', '화엄사', '송광사', '법주사',
  '직지사', '백양사', '선암사', '대흥사', '금산사', '관룡사', '국청사', '보문사',
  '천은사', '쌍계사', '석왕사', '개심사', '무량사', '관촉사', '갑사', '마곡사',
  '용주사', '봉선사', '신흥사', '월정사', '상원사', '건봉사', '낙산사', '오대산',
  '태화산', '용문사', '운문사', '동화사', '파계사', '청도사', '표충사', '삼화사'
];

// 감정 태그 목록
const emotionalTags = [
  '#평화로운', '#깨달음', '#감사한마음', '#고요한', '#따뜻한', '#경건한',
  '#마음챙김', '#자비로운', '#지혜로운', '#정화되는', '#차분한', '#영감받은',
  '#성찰적인', '#겸손한', '#희망찬', '#용서하는', '#자유로운', '#연민어린',
  '#신성한', '#치유되는', '#위안받는', '#공경하는', '#새로운', '#밝아지는'
];

// 법문 주제 목록
const dharmaTopics = [
  '마음챙김과 현재순간', '자비와 연민', '무상과 변화', '인연과 업',
  '사성제와 팔정도', '지혜와 깨달음', '선정과 명상', '불성과 본래면목',
  '보살도와 자리이타', '중도사상', '일체유심조', '무아와 무상',
  '고통의 원인과 해법', '참회와 정진', '신심과 믿음', '포용과 화해'
];

const mockReviews: DharmaReview[] = [
  {
    id: '1',
    templeName: '조계사',
    teacherName: '법련스님',
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
    teacherName: '혜안스님',
    content: '경주 여행 중 들렀는데, 석가탑 앞에서 잠시 명상하는 시간이 참 평화로웠습니다.',
    innerThoughts: '천년의 역사가 느껴지는 곳이에요. 석가탑의 위엄 앞에서 작은 나를 돌아보게 되었습니다.',
    author: '바람',
    date: '2024-01-12',
    reviewDate: '2024-01-12',
    dharmaTopic: '무상과 변화',
    heartRating: 4,
    emotionalTags: ['#고요한', '#성찰적인'],
    recommendToSangha: true,
    engagement: 18,
    isAnonymous: false
  }
];

export const EnhancedReviewSpace: React.FC<EnhancedReviewSpaceProps> = ({
  onBack,
  className = ""
}) => {
  const [mode, setMode] = useState<'read' | 'write'>('read');
  const [reviews, setReviews] = useState<DharmaReview[]>(mockReviews);
  const [newReview, setNewReview] = useState({
    templeName: '',
    teacherName: '',
    content: '',
    dharmaTopic: '',
    heartRating: 3,
    innerThoughts: '',
    reviewDate: new Date().toISOString().split('T')[0],
    recommendToSangha: true,
    isAnonymous: false
  });

  const [templeSearchResults, setTempleSearchResults] = useState<string[]>([]);
  const [showTempleDropdown, setShowTempleDropdown] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [topicSearchResults, setTopicSearchResults] = useState<string[]>([]);
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 글쓰기 모드로 전환 시 포커스
  useEffect(() => {
    if (mode === 'write' && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 300);
    }
  }, [mode]);

  // 연꽃 꽃잎 평점 시스템
  const getLotusIcon = (level: number) => {
    const lotusStages = ['🌿', '🌱', '🌸', '🌺', '🧡'];
    return lotusStages[level - 1] || '🌿';
  };

  const getLotusText = (level: number) => {
    const texts = ['시작', '자람', '개화', '만개', '완성'];
    return texts[level - 1] || '시작';
  };

  const getHeartRatingText = (level: number) => {
    const texts = ['조금 와닿음', '어느정도', '마음에 와닿음', '깊이 감동', '영혼에 새겨짐'];
    return texts[level - 1] || '어느정도';
  };

  // 사찰 자동완성 기능
  const handleTempleSearch = (searchTerm: string) => {
    setNewReview(prev => ({ ...prev, templeName: searchTerm }));
    
    if (searchTerm.length > 0) {
      const filtered = koreanTemples.filter(temple => 
        temple.includes(searchTerm)
      );
      setTempleSearchResults(filtered.slice(0, 8));
      setShowTempleDropdown(filtered.length > 0);
    } else {
      setShowTempleDropdown(false);
    }
  };

  // 법문 주제 자동완성
  const handleTopicSearch = (searchTerm: string) => {
    setNewReview(prev => ({ ...prev, dharmaTopic: searchTerm }));
    
    if (searchTerm.length > 0) {
      const filtered = dharmaTopics.filter(topic => 
        topic.includes(searchTerm)
      );
      setTopicSearchResults(filtered.slice(0, 6));
      setShowTopicDropdown(filtered.length > 0);
    } else {
      setShowTopicDropdown(false);
    }
  };

  // 감정 태그 토글
  const toggleEmotionalTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag].slice(0, 4) // 최대 4개
    );
  };

  const handleSubmitReview = () => {
    if (newReview.templeName.trim() && newReview.content.trim()) {
      const review: DharmaReview = {
        id: Date.now().toString(),
        templeName: newReview.templeName.trim(),
        teacherName: newReview.teacherName.trim() || undefined,
        content: newReview.content.trim(),
        innerThoughts: newReview.innerThoughts.trim(),
        author: newReview.isAnonymous ? '익명의 불자' : '새싹', // 실제 구현에서는 사용자 닉네임
        date: new Date().toLocaleDateString('ko-KR'),
        reviewDate: newReview.reviewDate,
        dharmaTopic: newReview.dharmaTopic.trim() || undefined,
        heartRating: newReview.heartRating,
        emotionalTags: selectedTags,
        recommendToSangha: newReview.recommendToSangha,
        engagement: 0,
        isAnonymous: newReview.isAnonymous
      };

      setReviews(prev => [review, ...prev]);
      setNewReview({ 
        templeName: '', 
        teacherName: '',
        content: '', 
        dharmaTopic: '',
        heartRating: 3,
        innerThoughts: '',
        reviewDate: new Date().toISOString().split('T')[0],
        recommendToSangha: true,
        isAnonymous: false
      });
      setSelectedTags([]);
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

  return (
    <div className={`min-h-screen bg-gradient-to-br from-amber-50/80 via-orange-50/60 to-yellow-50/40 ${className}`}>
      {/* 헤더 */}
      <motion.header 
        className="bg-gradient-to-r from-amber-600/90 to-orange-500/90 backdrop-blur-md text-white py-8 px-8 shadow-xl border-b border-white/20"
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
                rotateY: { duration: 8, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, repeatType: "reverse" }
              }}
            >
              🪷
            </motion.div>
            <div>
              <h1 className="text-3xl font-light mb-1 dharma-text">법회 리뷰</h1>
              <p className="text-white/90 text-lg dharma-text">사찰에서의 소중한 경험을 나누세요</p>
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
              🪷 후기 보기
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
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/60 hover:shadow-2xl transition-all duration-500 zen-card"
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
                        <h3 className="text-xl font-semibold text-gray-800 mb-1 dharma-text">
                          {review.templeName}
                        </h3>
                        {review.teacherName && (
                          <p className="text-sm text-amber-600 mb-1">
                            {review.teacherName}
                          </p>
                        )}
                        <div className="flex items-center space-x-3 text-sm text-gray-500">
                          <span className="font-medium">{review.isAnonymous ? '익명의 불자' : review.author}</span>
                          <span>•</span>
                          <span>{review.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* 연꽃 평점 */}
                    <div className="flex flex-col items-center">
                      <span className="text-3xl mb-1">{getLotusIcon(review.heartRating)}</span>
                      <span className="text-xs text-gray-500 font-medium text-center">
                        {getLotusText(review.heartRating)}
                      </span>
                    </div>
                  </div>

                  {/* 법문 주제 */}
                  {review.dharmaTopic && (
                    <div className="mb-4">
                      <span className="inline-block bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                        📿 {review.dharmaTopic}
                      </span>
                    </div>
                  )}

                  <p className="text-gray-700 leading-relaxed text-lg mb-4 dharma-text">
                    {review.content}
                  </p>

                  {/* 내적 느낌 */}
                  {review.innerThoughts && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 mb-4 border-l-4 border-amber-300">
                      <p className="text-gray-600 italic leading-relaxed dharma-text">
                        💭 {review.innerThoughts}
                      </p>
                    </div>
                  )}

                  {/* 감정 태그 */}
                  {review.emotionalTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {review.emotionalTags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 추천 여부 */}
                  {review.recommendToSangha && (
                    <div className="flex items-center space-x-2 mb-4 text-green-600">
                      <span className="text-lg">✨</span>
                      <span className="text-sm font-medium">동참들에게 추천</span>
                    </div>
                  )}

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
                        <span className="font-medium">감사</span>
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
                      {review.engagement > 0 && `${review.engagement}명이 감사했어요`}
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
                  <div className="text-8xl mb-6">🪷</div>
                  <h3 className="text-2xl font-light text-gray-600 mb-2 dharma-text">
                    아직 작성된 후기가 없어요
                  </h3>
                  <p className="text-lg text-gray-500 dharma-text">
                    첫 번째 후기를 작성해보세요
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* 쓰기 모드 - Part 1 */}
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
                    🪷
                  </motion.div>
                  <h2 className="text-3xl font-light text-gray-800 mb-3 dharma-text">
                    소중한 경험을 나누어주세요
                  </h2>
                  <p className="text-lg text-gray-600 dharma-text">
                    사찰에서 느낀 마음을 천천히 적어보세요
                  </p>
                </div>

                <div className="space-y-8">
                  {/* 사찰명 입력 - 자동완성 */}
                  <div className="relative">
                    <label className="block text-lg font-medium text-gray-700 mb-3 flex items-center space-x-2">
                      <span>🏛️</span>
                      <span>사찰명</span>
                    </label>
                    <input
                      type="text"
                      value={newReview.templeName}
                      onChange={(e) => handleTempleSearch(e.target.value)}
                      onFocus={() => setShowTempleDropdown(templeSearchResults.length > 0)}
                      placeholder="어느 사찰을 다녀오셨나요?"
                      className="w-full px-6 py-4 text-lg border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-200 focus:border-amber-400 transition-all duration-300 bg-white/80 backdrop-blur-sm dharma-text zen-input"
                    />
                    
                    {/* 사찰 자동완성 드롭다운 */}
                    {showTempleDropdown && templeSearchResults.length > 0 && (
                      <motion.div
                        className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl max-h-60 overflow-y-auto"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {templeSearchResults.map((temple) => (
                          <button
                            key={temple}
                            onClick={() => {
                              setNewReview(prev => ({ ...prev, templeName: temple }));
                              setShowTempleDropdown(false);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-amber-50 transition-colors duration-200 first:rounded-t-2xl last:rounded-b-2xl dharma-text"
                          >
                            🏛️ {temple}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  {/* 법사님 성함 */}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3 flex items-center space-x-2">
                      <span>👨‍🏫</span>
                      <span>법사님 성함 (선택사항)</span>
                    </label>
                    <input
                      type="text"
                      value={newReview.teacherName}
                      onChange={(e) => setNewReview(prev => ({ ...prev, teacherName: e.target.value }))}
                      placeholder="법문을 해주신 스님의 성함"
                      className="w-full px-6 py-4 text-lg border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-200 focus:border-amber-400 transition-all duration-300 bg-white/80 backdrop-blur-sm dharma-text zen-input"
                    />
                  </div>

                  {/* 참석 날짜 */}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3 flex items-center space-x-2">
                      <span>📅</span>
                      <span>참석 날짜</span>
                    </label>
                    <input
                      type="date"
                      value={newReview.reviewDate}
                      onChange={(e) => setNewReview(prev => ({ ...prev, reviewDate: e.target.value }))}
                      className="w-full px-6 py-4 text-lg border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-200 focus:border-amber-400 transition-all duration-300 bg-white/80 backdrop-blur-sm dharma-text zen-input"
                    />
                  </div>

                  {/* 법문 주제 - 자동완성 */}
                  <div className="relative">
                    <label className="block text-lg font-medium text-gray-700 mb-3 flex items-center space-x-2">
                      <span>📿</span>
                      <span>법문 주제 (선택사항)</span>
                    </label>
                    <input
                      type="text"
                      value={newReview.dharmaTopic}
                      onChange={(e) => handleTopicSearch(e.target.value)}
                      onFocus={() => setShowTopicDropdown(topicSearchResults.length > 0)}
                      placeholder="어떤 주제의 법문이었나요?"
                      className="w-full px-6 py-4 text-lg border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-200 focus:border-amber-400 transition-all duration-300 bg-white/80 backdrop-blur-sm dharma-text zen-input"
                    />
                    
                    {/* 법문 주제 자동완성 드롭다운 */}
                    {showTopicDropdown && topicSearchResults.length > 0 && (
                      <motion.div
                        className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl max-h-60 overflow-y-auto"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {topicSearchResults.map((topic) => (
                          <button
                            key={topic}
                            onClick={() => {
                              setNewReview(prev => ({ ...prev, dharmaTopic: topic }));
                              setShowTopicDropdown(false);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-amber-50 transition-colors duration-200 first:rounded-t-2xl last:rounded-b-2xl dharma-text"
                          >
                            📿 {topic}
                          </button>
                        ))}
                      </motion.div>
                    )}
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
                      placeholder="사찰에서의 경험, 법문을 들으며 느낀 점을 자유롭게 적어주세요..."
                      rows={6}
                      className="w-full px-6 py-4 text-lg border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-200 focus:border-amber-400 transition-all duration-300 resize-none bg-white/80 backdrop-blur-sm leading-relaxed dharma-text zen-textarea"
                    />
                    <div className="text-right mt-2 text-sm text-gray-500">
                      {newReview.content.length}자
                    </div>
                  </div>

                  {/* 개인적 느낌/깨달음 */}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3 flex items-center space-x-2">
                      <span>🧘‍♀️</span>
                      <span>개인적 느낌과 깨달음</span>
                    </label>
                    <textarea
                      value={newReview.innerThoughts}
                      onChange={(e) => setNewReview(prev => ({ ...prev, innerThoughts: e.target.value }))}
                      placeholder="마음 깊은 곳에서 우러나온 느낌이나 깨달음을 적어보세요..."
                      rows={4}
                      className="w-full px-6 py-4 text-lg border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-200 focus:border-amber-400 transition-all duration-300 resize-none bg-white/80 backdrop-blur-sm leading-relaxed dharma-text zen-textarea"
                    />
                  </div>

                  {/* 연꽃 꽃잎 평점 시스템 */}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-4 flex items-center space-x-2">
                      <span>{getLotusIcon(newReview.heartRating)}</span>
                      <span>마음에 와닿은 정도</span>
                    </label>
                    <div className="flex items-center space-x-6">
                      <div className="flex-1">
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={newReview.heartRating}
                          onChange={(e) => setNewReview(prev => ({ 
                            ...prev, 
                            heartRating: parseInt(e.target.value) 
                          }))}
                          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                          style={{
                            background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${(newReview.heartRating - 1) * 25}%, #e5e7eb ${(newReview.heartRating - 1) * 25}%, #e5e7eb 100%)`
                          }}
                        />
                        <div className="flex justify-between text-sm text-gray-500 mt-2">
                          <span>시작</span>
                          <span>자람</span>
                          <span>개화</span>
                          <span>만개</span>
                          <span>완성</span>
                        </div>
                      </div>
                      <div className="min-w-[140px] text-center">
                        <div className="text-3xl mb-1">{getLotusIcon(newReview.heartRating)}</div>
                        <div className="text-lg font-medium text-gray-700 dharma-text">
                          {getHeartRatingText(newReview.heartRating)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 감정 태그 선택 */}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-4 flex items-center space-x-2">
                      <span>🏷️</span>
                      <span>감정 태그 (최대 4개)</span>
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                      {emotionalTags.map((tag) => (
                        <motion.button
                          key={tag}
                          onClick={() => toggleEmotionalTag(tag)}
                          className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                            selectedTags.includes(tag)
                              ? 'bg-amber-500 text-white shadow-md'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={!selectedTags.includes(tag) && selectedTags.length >= 4}
                        >
                          {tag}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* 추천 여부 및 익명 옵션 */}
                  <div className="flex items-center justify-between p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newReview.recommendToSangha}
                          onChange={(e) => setNewReview(prev => ({ ...prev, recommendToSangha: e.target.checked }))}
                          className="w-5 h-5 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 focus:ring-2"
                        />
                        <span className="text-lg font-medium text-gray-700 dharma-text">
                          ✨ 다른 불자분들께 추천
                        </span>
                      </label>
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newReview.isAnonymous}
                          onChange={(e) => setNewReview(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                          className="w-5 h-5 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 focus:ring-2"
                        />
                        <span className="text-lg font-medium text-gray-700 dharma-text">
                          🤫 익명으로 작성
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* 제출 버튼 */}
                  <div className="flex justify-center pt-8">
                    <motion.button
                      onClick={handleSubmitReview}
                      disabled={!newReview.templeName.trim() || !newReview.content.trim()}
                      className={`px-12 py-4 text-xl rounded-2xl font-medium transition-all duration-300 dharma-text ${
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

export default EnhancedReviewSpace;