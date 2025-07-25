import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

interface TempleReview {
  id: number;
  title: string;
  author: string;
  avatar: string;
  rating: number;
  content: string;
  date: string;
  temple: string;
  location: string;
  likes: number;
  category: string;
  isVerified?: boolean;
}

const TEMPLE_REVIEWS: TempleReview[] = [
  {
    id: 1,
    title: "고요한 아침 명상",
    author: "평화로운마음",
    avatar: "🧘‍♀️",
    rating: 5,
    content: "새벽 명상이 일상의 평온을 가져다주었습니다. 스님의 지도로 깊은 통찰을 얻었어요.",
    date: "2시간 전",
    temple: "조계사",
    location: "서울",
    likes: 24,
    category: "명상",
    isVerified: true
  },
  {
    id: 2,
    title: "차명상의 깊은 여운",
    author: "법구상구",
    avatar: "🍵",
    rating: 5,
    content: "한 잔의 차에 담긴 마음챙김의 순간들. 현재에 온전히 머무르는 법을 배웠습니다.",
    date: "1일 전",
    temple: "봉은사",
    location: "강남",
    likes: 18,
    category: "체험",
    isVerified: true
  },
  {
    id: 3,
    title: "자연 속 걸음명상",
    author: "자연사랑",
    avatar: "🌲",
    rating: 5,
    content: "숲길을 걸으며 자연과 하나되는 경험. 도심에서 잃어버린 평온을 되찾았어요.",
    date: "3일 전",
    temple: "송광사",
    location: "순천",
    likes: 31,
    category: "자연",
    isVerified: false
  },
  {
    id: 4,
    title: "첫 수행의 기쁨",
    author: "첫발걸음",
    avatar: "🙏",
    rating: 4,
    content: "초심자도 편안하게 참여할 수 있는 따뜻한 분위기였습니다.",
    date: "1주 전",
    temple: "불국사",
    location: "경주",
    likes: 22,
    category: "초심",
    isVerified: false
  }
];

const CATEGORIES = ["전체", "명상", "체험", "자연", "초심"];

export default function BuddhistDashboard() {
  const [selectedReview, setSelectedReview] = useState<TempleReview | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const filteredReviews = selectedCategory === "전체"
    ? TEMPLE_REVIEWS
    : TEMPLE_REVIEWS.filter(review => review.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50" style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif"
    }}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-medium">템</span>
              </div>
              <span className="text-lg font-medium text-gray-900">
                Temple Community
              </span>
            </div>

            <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
              로그인
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center py-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mx-auto mb-8 flex items-center justify-center"
            >
              <span className="text-3xl">🪷</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-5xl font-bold text-gray-900 mb-4 tracking-tight"
            >
              Temple Community
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              전국 사찰의 수행 경험을 나누고 깊은 통찰을 함께 만들어가는 공간
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex items-center justify-center gap-4"
            >
              <button 
                onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors"
              >
                둘러보기
              </button>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">
                시작하기
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">최근 후기</h2>
              <p className="text-gray-600">다른 수행자들의 경험을 둘러보세요</p>
            </div>
            <button className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
              후기 작성
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedReview(review)}
                className="bg-white rounded-2xl p-6 border border-gray-200 cursor-pointer hover:shadow-lg transition-all duration-200"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{review.avatar}</span>
                    <div>
                      <h3 className="font-medium text-gray-900">{review.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{review.author}</span>
                        {review.isVerified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                </div>

                {/* Temple Info */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                    {review.category}
                  </span>
                  <span className="text-sm text-gray-600">
                    {review.temple} · {review.location}
                  </span>
                </div>

                {/* Content */}
                <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-2">
                  {review.content}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-gray-500">
                    <span>❤️</span>
                    <span>{review.likes}</span>
                  </div>
                  <span className="text-blue-500 font-medium">자세히 보기</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Review Detail Modal */}
      <AnimatePresence>
        {selectedReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedReview(null)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedReview.avatar}</span>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedReview.title}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{selectedReview.author}</span>
                      {selectedReview.isVerified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="text-gray-400">✕</span>
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${i < selectedReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                  {selectedReview.category}
                </span>
                <span className="text-xs text-gray-500">{selectedReview.date}</span>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  {selectedReview.temple} · {selectedReview.location}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">{selectedReview.content}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <span>❤️</span>
                    <span className="text-sm">{selectedReview.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <span>💬</span>
                    <span className="text-sm">댓글</span>
                  </button>
                </div>
                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors">
                  방문하기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

