import React, { useState } from 'react';
import { Calendar, Heart, MessageCircle, MoreHorizontal, Shield, ThumbsUp } from 'lucide-react';
import { Review, User } from '../../types';
import { Rating } from './Rating';

interface ReviewListProps {
  reviews: Review[];
  onLikeReview?: (reviewId: string) => void;
  onReplyToReview?: (reviewId: string) => void;
  onReportReview?: (reviewId: string) => void;
  currentUserId?: string;
  className?: string;
}

interface ReviewItemProps {
  review: Review;
  onLike?: (reviewId: string) => void;
  onReply?: (reviewId: string) => void;
  onReport?: (reviewId: string) => void;
  isOwner?: boolean;
}

const ReviewItem: React.FC<ReviewItemProps> = ({
  review,
  onLike,
  onReply,
  onReport,
  isOwner = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return '방금 전';
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const shouldTruncate = review.content.length > 200;
  const displayContent = isExpanded || !shouldTruncate 
    ? review.content 
    : review.content.slice(0, 200) + '...';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {review.user?.username?.[0]?.toUpperCase() || '?'}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">
                {review.user?.username || '익명'}
              </span>
              {review.isVerified && (
                <Shield className="w-4 h-4 text-blue-500" />
              )}
              {review.attendanceVerified && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  출석 확인
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(review.createdAt)}</span>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          
          {showActions && (
            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-32">
              {!isOwner && (
                <button
                  onClick={() => {
                    onReport?.(review.id);
                    setShowActions(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  신고하기
                </button>
              )}
              <button
                onClick={() => setShowActions(false)}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                링크 복사
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 평점 */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Rating value={review.rating} readonly size="sm" />
          <span className="font-medium text-gray-900">{review.rating}.0</span>
        </div>
        
        {/* 세부 평점 */}
        {(review.contentQuality || review.teachingClarity || review.atmosphere) && (
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {review.contentQuality && (
              <span>내용: {review.contentQuality}.0</span>
            )}
            {review.teachingClarity && (
              <span>설법: {review.teachingClarity}.0</span>
            )}
            {review.atmosphere && (
              <span>분위기: {review.atmosphere}.0</span>
            )}
          </div>
        )}
      </div>

      {/* 제목 */}
      <h4 className="font-semibold text-gray-900 text-lg mb-3">
        {review.title}
      </h4>

      {/* 내용 */}
      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {displayContent}
        </p>
        
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
          >
            {isExpanded ? '접기' : '더 보기'}
          </button>
        )}
      </div>

      {/* 이미지 */}
      {review.images && review.images.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {review.images.slice(0, 3).map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`Review image ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
            ))}
            {review.images.length > 3 && (
              <div className="relative">
                <img
                  src={review.images[3]}
                  alt="More images"
                  className="w-full h-24 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                  <span className="text-white font-medium">
                    +{review.images.length - 3}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
        <button
          onClick={() => onLike?.(review.id)}
          className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
        >
          <Heart className="w-5 h-5" />
          <span className="text-sm font-medium">
            {review.likeCount > 0 ? review.likeCount : '도움돼요'}
          </span>
        </button>
        
        <button
          onClick={() => onReply?.(review.id)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">
            {review.commentCount > 0 ? `댓글 ${review.commentCount}` : '댓글'}
          </span>
        </button>
        
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <ThumbsUp className="w-4 h-4" />
          <span>도움됨 {review.helpfulCount}</span>
        </div>
      </div>
    </div>
  );
};

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  onLikeReview,
  onReplyToReview,
  onReportReview,
  currentUserId,
  className = ''
}) => {
  const [sortBy, setSortBy] = useState<'latest' | 'rating' | 'helpful'>('latest');

  const sortedReviews = React.useMemo(() => {
    const sorted = [...reviews];
    
    switch (sortBy) {
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'helpful':
        return sorted.sort((a, b) => b.helpfulCount - a.helpfulCount);
      case 'latest':
      default:
        return sorted.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  }, [reviews, sortBy]);

  if (reviews.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          아직 리뷰가 없습니다
        </h3>
        <p className="text-gray-500">
          첫 번째 리뷰를 작성해보세요!
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* 정렬 옵션 */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          리뷰 {reviews.length}개
        </h3>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">정렬:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="latest">최신순</option>
            <option value="rating">평점순</option>
            <option value="helpful">도움순</option>
          </select>
        </div>
      </div>

      {/* 리뷰 목록 */}
      <div className="space-y-6">
        {sortedReviews.map((review) => (
          <ReviewItem
            key={review.id}
            review={review}
            onLike={onLikeReview}
            onReply={onReplyToReview}
            onReport={onReportReview}
            isOwner={review.userId === currentUserId}
          />
        ))}
      </div>
    </div>
  );
};