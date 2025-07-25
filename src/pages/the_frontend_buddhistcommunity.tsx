import { motion } from 'framer-motion';
import { useState } from 'react';

interface SimpleReview {
  id: number;
  title: string;
  author: string;
  rating: number;
  content: string;
  date: string;
  temple: string;
  likes: number;
}

const SIMPLE_REVIEWS: SimpleReview[] = [
  {
    id: 1,
    title: "조계사 아침 명상",
    author: "평화로운마음",
    rating: 5,
    content: "새벽 명상이 정말 평화로웠습니다. 스님의 지도가 마음을 차분하게 해주었어요.",
    date: "2시간 전",
    temple: "조계사",
    likes: 12
  },
  {
    id: 2,
    title: "봉은사 차 명상",
    author: "법구상구",
    rating: 4,
    content: "차 명상을 통해 현재 순간에 집중하는 법을 배웠습니다. 추천합니다.",
    date: "5시간 전",
    temple: "봉은사",
    likes: 8
  },
  {
    id: 3,
    title: "남산공원 걸음명상",
    author: "자연사랑",
    rating: 5,
    content: "자연 속에서 하는 걸음명상이 도심의 스트레스를 말끔히 씻어주었습니다.",
    date: "1일 전",
    temple: "야외명상",
    likes: 15
  }
];

export const BuddhistDashboard = () => {
  const [selectedReview, setSelectedReview] = useState<SimpleReview | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-orange-100">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-orange-900">
            🪷 불교 집회 리뷰 커뮤니티
          </h1>
          <p className="text-orange-700 mt-1">
            전국 사찰과 명상 모임 후기를 공유해보세요
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SIMPLE_REVIEWS.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: review.id * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedReview(review)}
              whileHover={{ scale: 1.02 }}
            >
              {/* Rating Stars */}
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ⭐
                  </span>
                ))}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {review.title}
              </h3>

              {/* Temple */}
              <div className="text-orange-600 text-sm mb-3 font-medium">
                📍 {review.temple}
              </div>

              {/* Content Preview */}
              <p className="text-gray-700 mb-4 leading-relaxed">
                {review.content.length > 80
                  ? review.content.substring(0, 80) + "..."
                  : review.content}
              </p>

              {/* Footer */}
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div>
                  <span className="font-medium">{review.author}</span> • {review.date}
                </div>
                <div className="flex items-center space-x-2">
                  <span>❤️ {review.likes}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Review Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-8 right-8"
        >
          <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110">
            <span className="text-2xl">✍️</span>
          </button>
        </motion.div>

        {/* Modal for Selected Review */}
        {selectedReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedReview(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedReview.title}
                </h2>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${i < selectedReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ⭐
                  </span>
                ))}
              </div>

              <div className="text-orange-600 mb-4 font-medium">
                📍 {selectedReview.temple}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                {selectedReview.content}
              </p>

              <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t">
                <div>
                  <span className="font-medium">{selectedReview.author}</span> • {selectedReview.date}
                </div>
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 hover:text-red-500">
                    <span>❤️</span>
                    <span>{selectedReview.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-blue-500">
                    <span>💬</span>
                    <span>댓글</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
};
