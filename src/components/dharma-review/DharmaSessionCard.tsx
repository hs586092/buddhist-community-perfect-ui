import React from 'react';
import { Calendar, MapPin, User, Clock, Users, Wifi, WifiOff } from 'lucide-react';
import { DharmaSession, DharmaCategory, SessionStatus } from '../../types';
import { Rating } from './Rating';

interface DharmaSessionCardProps {
  session: DharmaSession;
  onViewDetails?: (sessionId: string) => void;
  onWriteReview?: (sessionId: string) => void;
  compact?: boolean;
  className?: string;
}

const categoryIcons: Record<DharmaCategory, string> = {
  MEDITATION: '🧘‍♀️',
  SUTRA_STUDY: '📜',
  DHARMA_TALK: '🎋',
  CEREMONY: '🏛️',
  RETREAT: '⛰️',
  DISCUSSION: '💬',
  CHANTING: '🙏',
  TEA_CEREMONY: '🍵',
  WALKING_MEDITATION: '🚶‍♀️',
  COMMUNITY_SERVICE: '🤝'
};

const categoryLabels: Record<DharmaCategory, string> = {
  MEDITATION: '명상',
  SUTRA_STUDY: '경전 공부',
  DHARMA_TALK: '법문',
  CEREMONY: '법회',
  RETREAT: '수련회',
  DISCUSSION: '토론',
  CHANTING: '염불',
  TEA_CEREMONY: '차 명상',
  WALKING_MEDITATION: '행선',
  COMMUNITY_SERVICE: '봉사'
};

const statusColors: Record<SessionStatus, string> = {
  SCHEDULED: 'bg-blue-100 text-blue-800',
  ONGOING: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800',
  POSTPONED: 'bg-yellow-100 text-yellow-800'
};

const statusLabels: Record<SessionStatus, string> = {
  SCHEDULED: '예정',
  ONGOING: '진행중',
  COMPLETED: '완료',
  CANCELLED: '취소',
  POSTPONED: '연기'
};

export const DharmaSessionCard: React.FC<DharmaSessionCardProps> = ({
  session,
  onViewDetails,
  onWriteReview,
  compact = false,
  className = ''
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canWriteReview = session.status === 'COMPLETED';

  return (
    <div className={`
      bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300
      ${compact ? 'p-4' : 'p-6'} ${className}
    `}>
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">
              {categoryIcons[session.category]}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {categoryLabels[session.category]}
            </span>
            <span className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${statusColors[session.status]}
            `}>
              {statusLabels[session.status]}
            </span>
          </div>
          
          <h3 className={`font-bold text-gray-900 mb-2 ${compact ? 'text-lg' : 'text-xl'}`}>
            {session.title}
          </h3>
          
          {!compact && session.description && (
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {session.description}
            </p>
          )}
        </div>
        
        {session.isFeatured && (
          <div className="ml-4">
            <span className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              추천
            </span>
          </div>
        )}
      </div>

      {/* 세부 정보 */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{session.temple}</span>
          {session.isOnline && (
            <div className="flex items-center gap-1 ml-2">
              <Wifi className="w-4 h-4 text-blue-500" />
              <span className="text-blue-600 font-medium">온라인</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>{session.monk}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(session.date)}</span>
          <span className="mx-2">•</span>
          <Clock className="w-4 h-4" />
          <span>{formatTime(session.date)}</span>
          {session.duration && (
            <>
              <span className="mx-2">•</span>
              <span>{session.duration}분</span>
            </>
          )}
        </div>
        
        {session.capacity && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>참가자: {session.attendeeCount}/{session.capacity}명</span>
          </div>
        )}
      </div>

      {/* 평점 및 리뷰 */}
      {session.reviewCount > 0 && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
          <Rating value={session.avgRating} readonly size="sm" />
          <span className="text-sm font-medium text-gray-900">
            {session.avgRating.toFixed(1)}
          </span>
          <span className="text-sm text-gray-500">
            ({session.reviewCount}개 리뷰)
          </span>
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex gap-2">
        <button
          onClick={() => onViewDetails?.(session.id)}
          className={`
            flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg 
            hover:bg-gray-50 transition-colors font-medium
            ${compact ? 'text-sm' : ''}
          `}
        >
          자세히 보기
        </button>
        
        {canWriteReview && (
          <button
            onClick={() => onWriteReview?.(session.id)}
            className={`
              flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg 
              hover:bg-blue-700 transition-colors font-medium
              ${compact ? 'text-sm' : ''}
            `}
          >
            리뷰 작성
          </button>
        )}
      </div>
    </div>
  );
};