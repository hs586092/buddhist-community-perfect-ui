/**
 * 영성 커뮤니티 타입 정의
 * 집회 리뷰, 절 리뷰, 영성 포스팅을 위한 타입 시스템
 */

// 공통 타입
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar?: string;
  bio?: string;
  isVerified: boolean;
  spiritualLevel: 'beginner' | 'intermediate' | 'advanced' | 'teacher';
  joinedAt: string;
  location?: string;
}

// 사찰/절 관련 타입
export interface Temple {
  id: string;
  name: string;
  fullName?: string;
  address: string;
  city: string;
  province: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  description?: string;
  foundedYear?: number;
  denomination: 'jogye' | 'taego' | 'cheontae' | 'others';
  features: TempleFeature[];
  images: string[];
  contactInfo?: {
    phone?: string;
    website?: string;
    email?: string;
  };
  rating: number;
  reviewCount: number;
}

export type TempleFeature = 
  | 'meditation'
  | 'templestay'
  | 'dharma_talk'
  | 'tea_ceremony'
  | 'walking_meditation'
  | 'cultural_programs'
  | 'retreats'
  | 'study_groups';

// 집회/모임 관련 타입
export interface Gathering extends BaseEntity {
  title: string;
  description: string;
  type: GatheringType;
  temple: Temple;
  organizer: User;
  scheduledAt: string;
  duration: number; // minutes
  maxParticipants?: number;
  currentParticipants: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  tags: string[];
  requirements?: string[];
  cost?: number;
  registrationDeadline?: string;
  images?: string[];
}

export type GatheringType = 
  | 'meditation'
  | 'dharma_talk'
  | 'tea_ceremony'
  | 'walking_meditation'
  | 'chanting'
  | 'study_group'
  | 'retreat'
  | 'cultural_event';

// 리뷰 관련 타입
export interface TempleReview extends BaseEntity {
  temple: Temple;
  author: User;
  title: string;
  content: string;
  rating: number; // 1-5
  category: ReviewCategory;
  visitDate: string;
  isRecommended: boolean;
  helpfulCount: number;
  images?: string[];
  tags: string[];
  pros?: string[];
  cons?: string[];
}

export interface GatheringReview extends BaseEntity {
  gathering: Gathering;
  author: User;
  title: string;
  content: string;
  rating: number; // 1-5
  attendedAt: string;
  isRecommended: boolean;
  helpfulCount: number;
  images?: string[];
  learnings?: string[]; // 배운 점들
  improvements?: string[]; // 개선사항 제안
}

export type ReviewCategory = 
  | 'meditation'
  | 'experience'
  | 'nature'
  | 'beginner'
  | 'cultural'
  | 'retreat';

// 영성 포스팅 관련 타입
export interface SpiritualPost extends BaseEntity {
  author: User;
  title: string;
  content: string;
  excerpt?: string;
  type: PostType;
  category: PostCategory;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
  featuredImage?: string;
  images?: string[];
  likeCount: number;
  commentCount: number;
  shareCount: number;
  readingTime: number; // estimated minutes
  temple?: Temple; // 특정 사찰과 관련된 포스트인 경우
}

export type PostType = 
  | 'reflection'    // 성찰/깨달음
  | 'teaching'      // 법문/가르침
  | 'experience'    // 경험담
  | 'guide'         // 가이드/방법론
  | 'news'          // 소식/공지
  | 'question'      // 질문/토론
  | 'poetry';       // 시/게송

export type PostCategory = 
  | 'meditation'
  | 'dharma'
  | 'daily_practice'
  | 'temple_life'
  | 'buddhist_culture'
  | 'philosophy'
  | 'community';

// 댓글 시스템
export interface Comment extends BaseEntity {
  parentId?: string; // 대댓글용
  content: string;
  author: User;
  postId?: string;
  reviewId?: string;
  likeCount: number;
  replies?: Comment[];
  isEdited: boolean;
  editedAt?: string;
}

// 좋아요/북마크 시스템
export interface Like {
  id: string;
  userId: string;
  targetId: string;
  targetType: 'post' | 'review' | 'comment' | 'gathering';
  createdAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  targetId: string;
  targetType: 'post' | 'temple' | 'gathering';
  createdAt: string;
  notes?: string;
}

// 알림 시스템
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  data?: any; // 추가 데이터
  createdAt: string;
  actionUrl?: string;
}

export type NotificationType = 
  | 'new_gathering'
  | 'gathering_reminder'
  | 'review_reply'
  | 'post_like'
  | 'new_follower'
  | 'system_update';

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// 검색 및 필터링
export interface SearchFilters {
  query?: string;
  category?: string;
  location?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  rating?: number;
  sortBy?: 'latest' | 'popular' | 'rating' | 'distance';
  tags?: string[];
}

// 통계 및 분석
export interface SpiritualStats {
  totalPosts: number;
  totalReviews: number;
  totalGatherings: number;
  averageRating: number;
  popularTags: Array<{
    tag: string;
    count: number;
  }>;
  monthlyActivity: Array<{
    month: string;
    posts: number;
    reviews: number;
    gatherings: number;
  }>;
}

// 폼 데이터 타입
export interface CreatePostFormData {
  title: string;
  content: string;
  type: PostType;
  category: PostCategory;
  tags: string[];
  featuredImage?: File;
  images?: File[];
  templeId?: string;
}

export interface CreateReviewFormData {
  title: string;
  content: string;
  rating: number;
  category: ReviewCategory;
  visitDate: string;
  isRecommended: boolean;
  images?: File[];
  tags: string[];
  pros?: string[];
  cons?: string[];
}

export interface CreateGatheringFormData {
  title: string;
  description: string;
  type: GatheringType;
  templeId: string;
  scheduledAt: string;
  duration: number;
  maxParticipants?: number;
  cost?: number;
  registrationDeadline?: string;
  requirements?: string[];
  tags: string[];
  images?: File[];
}