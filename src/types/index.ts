import type { ReactNode } from 'react'

// ==========================================
// 🎯 BASE & GLOBAL TYPES
// ==========================================

export interface BaseProps {
  className?: string
  children?: ReactNode
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState<T> {
  data: T | null
  loading: LoadingState
  error: string | null
}

// Theme types
export type Theme = 'light' | 'dark' | 'system'

export interface ThemeConfig {
  theme: Theme
  primaryColor: string
  accentColor: string
}

// Component size variants
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'

// Form types
export interface FormFieldProps {
  label?: string
  error?: string
  required?: boolean
  disabled?: boolean
  helperText?: string
}

// Navigation types
export interface NavItem {
  id: string
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  children?: NavItem[]
}

// Modal types
export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: Size
}

// ==========================================
// 👤 USER DOMAIN (Enhanced)
// ==========================================

export interface User {
  id: string
  username: string
  email: string
  fullName?: string
  temple?: string
  dharmaName?: string
  level: UserLevel
  joinDate: string
  profileImage?: string
  practiceYears?: number
  specialties?: PracticeSpecialty[]
  reviewCount: number
  postCount: number
  meditationMinutes: number
  isActive: boolean
  notifications?: NotificationSettings
  privacy?: PrivacySettings
  createdAt: string
  updatedAt: string
}

export enum UserLevel {
  SEEKER = 'SEEKER',        // 구도자
  PRACTITIONER = 'PRACTITIONER',  // 수행자  
  EXPERIENCED = 'EXPERIENCED',     // 경험자
  GUIDE = 'GUIDE',          // 안내자
  TEACHER = 'TEACHER',      // 지도자
  MASTER = 'MASTER'         // 법사
}

export enum PracticeSpecialty {
  MEDITATION = 'MEDITATION',      // 명상
  SUTRA_STUDY = 'SUTRA_STUDY',   // 경전 공부
  CHANTING = 'CHANTING',         // 염불
  MINDFULNESS = 'MINDFULNESS',   // 마음챙김
  YOGA = 'YOGA',                 // 요가
  TEA_CEREMONY = 'TEA_CEREMONY'  // 차 명상
}

export interface NotificationSettings {
  reviews: boolean
  comments: boolean
  mentions: boolean
  follows: boolean
  dharmaUpdates: boolean
}

export interface PrivacySettings {
  profileVisibility: VisibilityLevel
  reviewVisibility: VisibilityLevel
  practiceVisibility: VisibilityLevel
}

export enum VisibilityLevel {
  PUBLIC = 'PUBLIC',
  FRIENDS = 'FRIENDS',
  PRIVATE = 'PRIVATE'
}

// ==========================================
// 🏛️ DHARMA REVIEW DOMAIN
// ==========================================

export interface DharmaSession {
  id: string
  title: string
  temple: string
  monk: string
  date: string
  duration?: number
  capacity?: number
  description?: string
  category: DharmaCategory
  tags?: string[]
  language: Language
  images?: string[]
  audioUrl?: string
  videoUrl?: string
  avgRating: number
  reviewCount: number
  attendeeCount: number
  status: SessionStatus
  isOnline: boolean
  onlineUrl?: string
  createdBy: string
  isActive: boolean
  isFeatured?: boolean
  createdAt: string
  updatedAt: string
}

export enum DharmaCategory {
  MEDITATION = 'MEDITATION',              // 명상
  SUTRA_STUDY = 'SUTRA_STUDY',           // 경전 공부
  DHARMA_TALK = 'DHARMA_TALK',           // 법문
  CEREMONY = 'CEREMONY',                  // 의식/법회
  RETREAT = 'RETREAT',                    // 수련회
  DISCUSSION = 'DISCUSSION',              // 토론/문답
  CHANTING = 'CHANTING',                 // 염불
  TEA_CEREMONY = 'TEA_CEREMONY',         // 차 명상
  WALKING_MEDITATION = 'WALKING_MEDITATION', // 행선
  COMMUNITY_SERVICE = 'COMMUNITY_SERVICE'     // 봉사
}

export enum SessionStatus {
  SCHEDULED = 'SCHEDULED',   // 예정
  ONGOING = 'ONGOING',       // 진행중
  COMPLETED = 'COMPLETED',   // 완료
  CANCELLED = 'CANCELLED',   // 취소
  POSTPONED = 'POSTPONED'    // 연기
}

export enum Language {
  KOREAN = 'KOREAN',
  ENGLISH = 'ENGLISH',
  CHINESE = 'CHINESE',
  JAPANESE = 'JAPANESE'
}

export interface Review {
  id: string
  dharmaSessionId: string
  dharmaSession?: DharmaSession
  userId: string
  user?: User
  rating: number
  title: string
  content: string
  contentQuality?: number
  teachingClarity?: number
  atmosphere?: number
  images?: string[]
  isVerified?: boolean
  attendanceVerified?: boolean
  likeCount: number
  commentCount: number
  helpfulCount: number
  isPublished: boolean
  language: Language
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  reviewId: string
  review?: Review
  userId: string
  user?: User
  parentCommentId?: string
  parentComment?: Comment
  replies?: Comment[]
  content: string
  likeCount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// ==========================================
// 💬 COMMUNITY COMMUNICATION DOMAIN
// ==========================================

export interface Post {
  id: string
  authorId: string
  author?: User
  title: string
  content: string
  excerpt?: string
  category: PostCategory
  tags?: string[]
  images?: string[]
  attachments?: string[]
  viewCount: number
  likeCount: number
  commentCount: number
  shareCount: number
  status: PostStatus
  isPinned?: boolean
  isFeatured?: boolean
  createdAt: string
  updatedAt: string
}

export enum PostCategory {
  DISCUSSION = 'DISCUSSION',    // 토론
  QUESTION = 'QUESTION',        // 질문
  SHARING = 'SHARING',          // 나눔
  NEWS = 'NEWS',                // 소식
  EVENT = 'EVENT',              // 행사
  STUDY = 'STUDY',              // 공부
  MEDITATION = 'MEDITATION',    // 명상
  DAILY_LIFE = 'DAILY_LIFE'     // 일상
}

export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  HIDDEN = 'HIDDEN',
  DELETED = 'DELETED'
}

export interface ChatRoom {
  id: string
  name: string
  description?: string
  type: ChatRoomType
  category: ChatCategory
  maxMembers: number
  isActive: boolean
  memberCount: number
  messageCount: number
  createdAt: string
  updatedAt: string
}

export enum ChatRoomType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  DIRECT_MESSAGE = 'DIRECT_MESSAGE'
}

export enum ChatCategory {
  GENERAL = 'GENERAL',        // 일반
  MEDITATION = 'MEDITATION',  // 명상
  STUDY = 'STUDY',           // 공부
  TEMPLE_LIFE = 'TEMPLE_LIFE', // 사찰생활
  BEGINNERS = 'BEGINNERS',    // 초심자
  ADVANCED = 'ADVANCED'       // 숙련자
}

export interface ChatMessage {
  id: string
  chatRoomId: string
  chatRoom?: ChatRoom
  userId: string
  user?: User
  content: string
  messageType: MessageType
  mediaUrl?: string
  mediaType?: string
  isEdited?: boolean
  isDeleted?: boolean
  createdAt: string
  updatedAt: string
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  AUDIO = 'AUDIO',
  SYSTEM = 'SYSTEM'
}

// ==========================================
// 🧘 PRACTICE MANAGEMENT DOMAIN
// ==========================================

export interface MeditationSession {
  id: string
  userId: string
  user?: User
  title?: string
  type: MeditationType
  duration: number
  scheduledDate?: string
  actualStartTime?: string
  actualEndTime?: string
  notes?: string
  mood?: MoodLevel
  focus?: FocusLevel
  insights?: string
  guidedBy?: string
  audioGuide?: string
  status: SessionStatus
  isCompleted: boolean
  createdAt: string
  updatedAt: string
}

export enum MeditationType {
  SITTING = 'SITTING',              // 좌선
  WALKING = 'WALKING',              // 행선
  CHANTING = 'CHANTING',            // 염불
  BREATHING = 'BREATHING',          // 호흡명상
  MINDFULNESS = 'MINDFULNESS',      // 마음챙김
  LOVING_KINDNESS = 'LOVING_KINDNESS', // 자비명상
  BODY_SCAN = 'BODY_SCAN',          // 바디스캔
  VISUALIZATION = 'VISUALIZATION'    // 관상명상
}

export enum MoodLevel {
  VERY_LOW = 'VERY_LOW',
  LOW = 'LOW',
  NEUTRAL = 'NEUTRAL',
  HIGH = 'HIGH',
  VERY_HIGH = 'VERY_HIGH'
}

export enum FocusLevel {
  VERY_POOR = 'VERY_POOR',
  POOR = 'POOR',
  AVERAGE = 'AVERAGE',
  GOOD = 'GOOD',
  EXCELLENT = 'EXCELLENT'
}

// ==========================================
// 🔄 SUPPORTING ENTITIES
// ==========================================

export interface Attendance {
  id: string
  dharmaSessionId: string
  dharmaSession?: DharmaSession
  userId: string
  user?: User
  status: AttendanceStatus
  checkInTime?: string
  checkOutTime?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export enum AttendanceStatus {
  REGISTERED = 'REGISTERED',
  CHECKED_IN = 'CHECKED_IN',
  ATTENDED = 'ATTENDED',
  NO_SHOW = 'NO_SHOW',
  CANCELLED = 'CANCELLED'
}

export interface Follow {
  id: string
  followerId: string
  follower?: User
  followingId: string
  following?: User
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  user?: User
  type: NotificationType
  title: string
  content: string
  relatedId?: string
  relatedType?: string
  isRead: boolean
  isArchived?: boolean
  createdAt: string
  updatedAt: string
}

export enum NotificationType {
  REVIEW_COMMENT = 'REVIEW_COMMENT',
  REVIEW_LIKE = 'REVIEW_LIKE',
  POST_COMMENT = 'POST_COMMENT',
  POST_LIKE = 'POST_LIKE',
  FOLLOW = 'FOLLOW',
  MENTION = 'MENTION',
  DHARMA_SESSION_REMINDER = 'DHARMA_SESSION_REMINDER',
  SYSTEM_ANNOUNCEMENT = 'SYSTEM_ANNOUNCEMENT'
}

// ==========================================
// 📝 FORM TYPES
// ==========================================

export interface CreateReviewForm {
  dharmaSessionId: string
  rating: number
  title: string
  content: string
  contentQuality?: number
  teachingClarity?: number
  atmosphere?: number
  images?: File[]
}

export interface CreatePostForm {
  title: string
  content: string
  excerpt?: string
  category: PostCategory
  tags?: string[]
  images?: File[]
  attachments?: File[]
}

export interface CreateMeditationSessionForm {
  title?: string
  type: MeditationType
  duration: number
  scheduledDate?: string
  notes?: string
  guidedBy?: string
}

export interface UserProfileForm {
  fullName?: string
  temple?: string
  dharmaName?: string
  level: UserLevel
  practiceYears?: number
  specialties?: PracticeSpecialty[]
  profileImage?: File
  notifications?: NotificationSettings
  privacy?: PrivacySettings
}

// ==========================================
// 🎨 UI STATE TYPES
// ==========================================

export interface UIState {
  theme: Theme
  sidebar: {
    isOpen: boolean
    activeTab: string
  }
  modal: {
    isOpen: boolean
    type?: string
    data?: any
  }
  loading: {
    global: boolean
    [key: string]: boolean
  }
  errors: {
    [key: string]: string | null
  }
}

// ==========================================
// 🔍 FILTER & SORT TYPES
// ==========================================

export interface DharmaSessionFilters {
  temple?: string
  category?: DharmaCategory
  language?: Language
  status?: SessionStatus
  dateFrom?: string
  dateTo?: string
  isOnline?: boolean
}

export interface ReviewFilters {
  rating?: number
  dharmaSessionId?: string
  userId?: string
  isVerified?: boolean
  dateFrom?: string
  dateTo?: string
}

export interface PostFilters {
  category?: PostCategory
  authorId?: string
  tags?: string[]
  status?: PostStatus
  dateFrom?: string
  dateTo?: string
}

export type SortOrder = 'asc' | 'desc'

export interface SortOptions {
  field: string
  order: SortOrder
}

// ==========================================
// 📊 ANALYTICS TYPES
// ==========================================

export interface UserAnalytics {
  totalReviews: number
  avgRating: number
  totalPosts: number
  totalMeditationMinutes: number
  streakDays: number
  achievementCount: number
  followersCount: number
  followingCount: number
}

export interface PlatformAnalytics {
  totalUsers: number
  activeUsers: number
  totalReviews: number
  totalPosts: number
  totalMeditationSessions: number
  popularTemples: Array<{ name: string; count: number }>
  popularCategories: Array<{ category: DharmaCategory; count: number }>
}
