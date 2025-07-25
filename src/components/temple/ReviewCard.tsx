import React, { useState } from 'react';
import { Review } from '../../types/temple';

interface ReviewCardProps {
  review: Review;
  compact?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, compact = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpful);
  const [hasVoted, setHasVoted] = useState(false);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${
          i < Math.floor(rating) 
            ? 'text-yellow-400' 
            : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  const handleHelpful = () => {
    if (!hasVoted) {
      setHelpfulCount(prev => prev + 1);
      setHasVoted(true);
    }
  };

  const getLevelColor = (level: Review['author']['level']) => {
    const colors = {
      '초심자': 'bg-green-100 text-green-800',
      '수행자': 'bg-blue-100 text-blue-800',
      '오랜 신자': 'bg-purple-100 text-purple-800'
    };
    return colors[level];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (compact) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm">{review.author.avatar}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900">{review.author.name}</span>
              <div className="flex">
                {renderStars(review.rating.overall)}
              </div>
              {review.verified && (
                <span className="text-xs text-green-600">✓ 방문인증</span>
              )}
            </div>
            <p className="text-gray-600 text-sm line-clamp-2">
              {review.content.text}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              {formatDate(review.visitDate)} 방문 • {formatDate(review.createdAt)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-sm transition-shadow">
      {/* 리뷰 헤더 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-lg">{review.author.avatar}</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-900">{review.author.name}</span>
              <span className={`px-2 py-1 text-xs rounded-full ${getLevelColor(review.author.level)}`}>
                {review.author.level}
              </span>
              {review.verified && (
                <span className="text-xs text-green-600 font-medium">✓ 방문인증</span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              {formatDate(review.visitDate)} 방문 • {formatDate(review.createdAt)} 작성
            </div>
          </div>
        </div>
      </div>

      {/* 제목 */}
      <h4 className="font-bold text-gray-900 mb-2">{review.content.title}</h4>

      {/* 별점 */}
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-600">전체:</span>
          <div className="flex">{renderStars(review.rating.overall)}</div>
          <span className="text-sm font-medium">{review.rating.overall}</span>
        </div>
        {!compact && (
          <>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">시설:</span>
              <div className="flex">{renderStars(review.rating.facility)}</div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">법문:</span>
              <div className="flex">{renderStars(review.rating.teaching)}</div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">분위기:</span>
              <div className="flex">{renderStars(review.rating.atmosphere)}</div>
            </div>
          </>
        )}
      </div>

      {/* 리뷰 내용 */}
      <div className="text-gray-700 mb-4">
        <p className={`${!isExpanded ? 'line-clamp-3' : ''}`}>
          {review.content.text}
        </p>
        {review.content.text.length > 150 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 text-sm mt-1 hover:underline"
          >
            {isExpanded ? '접기' : '더 보기'}
          </button>
        )}
      </div>

      {/* 장단점 */}
      {(review.content.pros.length > 0 || review.content.cons.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {review.content.pros.length > 0 && (
            <div>
              <div className="text-sm font-medium text-green-700 mb-2">👍 좋았던 점</div>
              <ul className="text-sm text-gray-600 space-y-1">
                {review.content.pros.map((pro, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-green-500 text-xs mt-1">•</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {review.content.cons.length > 0 && (
            <div>
              <div className="text-sm font-medium text-red-700 mb-2">👎 아쉬웠던 점</div>
              <ul className="text-sm text-gray-600 space-y-1">
                {review.content.cons.map((con, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-red-500 text-xs mt-1">•</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 태그 */}
      {review.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {review.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 도움됨 버튼 */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={handleHelpful}
          className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors ${
            hasVoted
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          disabled={hasVoted}
        >
          <span>👍</span>
          <span>도움됨 {helpfulCount}</span>
        </button>
        
        <div className="text-xs text-gray-400">
          {review.sessionId && '특정 법회 리뷰'}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;