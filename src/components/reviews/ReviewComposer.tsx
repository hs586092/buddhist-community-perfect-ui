import { motion } from 'framer-motion';
import React, { useState } from 'react';

interface ReviewComposerProps {
  onClose?: () => void;
  onSubmit?: (review: any) => void;
}

export const ReviewComposer: React.FC<ReviewComposerProps> = ({
  onClose,
  onSubmit
}) => {
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (onSubmit && content.trim()) {
      onSubmit({
        id: `review-${Date.now()}`,
        content: [{ type: 'text', content }],
        author: { displayName: 'Current User' },
        createdAt: new Date().toISOString(),
        metrics: { gratitude: 0, comments: 0, shares: 0, views: 0 }
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-lg w-full"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">새 리뷰 작성</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="경험을 공유해주세요..."
          className="w-full h-32 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-amber-200"
        />

        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
          >
            작성 완료
          </button>
        </div>
      </motion.div>
    </div>
  );
};
