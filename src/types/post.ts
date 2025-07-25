/**
 * Post System Types
 * 
 * Comprehensive type definitions for the post system including posts, comments, and reactions
 */

// Post-related enums
export enum PostType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  POLL = 'poll',
  EVENT = 'event',
  TEACHING = 'teaching'
}

export enum PostVisibility {
  PUBLIC = 'public',
  COMMUNITY = 'community',
  FOLLOWERS = 'followers',
  PRIVATE = 'private'
}

export enum ReactionType {
  LIKE = 'like',
  LOVE = 'love',
  GRATITUDE = 'gratitude',
  WISDOM = 'wisdom',
  PEACE = 'peace',
  COMPASSION = 'compassion'
}

// Post content structure
export interface PostContent {
  text?: string;
  html?: string;
  markdown?: string;
  images?: MediaAttachment[];
  videos?: MediaAttachment[];
  audio?: MediaAttachment[];
  poll?: PollData;
  event?: EventData;
  mentions?: string[];
  hashtags?: string[];
}

export interface MediaAttachment {
  id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  thumbnailUrl?: string;
  alt?: string;
  width?: number;
  height?: number;
  duration?: number; // for audio/video
  size: number;
  mimeType: string;
  uploadedAt: string;
}

export interface PollData {
  question: string;
  options: PollOption[];
  allowMultiple: boolean;
  expiresAt?: string;
  totalVotes: number;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

export interface EventData {
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location?: EventLocation;
  attendees: number;
  maxAttendees?: number;
}

export interface EventLocation {
  name?: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isOnline: boolean;
  onlineUrl?: string;
}

// Main Post interface
export interface Post {
  id: string;
  type: PostType;
  content: PostContent;
  author: PostAuthor;
  visibility: PostVisibility;
  createdAt: string;
  updatedAt: string;
  editedAt?: string;
  publishedAt?: string;
  
  // Engagement metrics
  stats: PostStats;
  
  // User interactions
  reactions: PostReaction[];
  comments: PostComment[];
  
  // Moderation and meta
  isEdited: boolean;
  isPinned: boolean;
  isArchived: boolean;
  tags: string[];
  category?: string;
  
  // Related posts
  parentId?: string; // for shares/reposts
  originalPost?: Post;
  
  // Rich metadata
  metadata?: PostMetadata;
}

export interface PostAuthor {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  role?: string;
  isVerified?: boolean;
  reputation?: number;
}

export interface PostStats {
  likes: number;
  comments: number;
  shares: number;
  views: number;
  reactions: { [key in ReactionType]: number };
}

export interface PostReaction {
  id: string;
  type: ReactionType;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
}

export interface PostComment {
  id: string;
  postId: string;
  parentId?: string; // for nested comments
  content: string;
  html?: string;
  author: PostAuthor;
  createdAt: string;
  updatedAt: string;
  editedAt?: string;
  isEdited: boolean;
  
  // Engagement
  likes: number;
  reactions: PostReaction[];
  replies: PostComment[];
  
  // Moderation
  isHidden: boolean;
  reportCount: number;
  
  // Rich features
  mentions?: string[];
  attachments?: MediaAttachment[];
}

export interface PostMetadata {
  readTime?: number; // estimated reading time in minutes
  wordCount?: number;
  language?: string;
  originalLanguage?: string;
  isTranslated?: boolean;
  sensitivity?: 'general' | 'mature' | 'sensitive';
  topics?: string[];
  relatedPosts?: string[];
}

// Rich Editor types
export interface EditorContent {
  html: string;
  text: string;
  markdown?: string;
  wordCount: number;
  characterCount: number;
  mentions: string[];
  hashtags: string[];
}

export interface EditorState {
  content: EditorContent;
  isEditing: boolean;
  isDirty: boolean;
  isSaving: boolean;
  autosaveAt?: string;
  version: number;
}

export interface EditorConfig {
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  allowHtml?: boolean;
  allowMarkdown?: boolean;
  allowMentions?: boolean;
  allowHashtags?: boolean;
  allowMedia?: boolean;
  mediaTypes?: ('image' | 'video' | 'audio')[];
  autosave?: boolean;
  autosaveDelay?: number;
  spellcheck?: boolean;
  readOnly?: boolean;
}

// API request/response types
export interface CreatePostRequest {
  type: PostType;
  content: Omit<PostContent, 'mentions' | 'hashtags'>;
  visibility: PostVisibility;
  tags?: string[];
  category?: string;
  publishAt?: string;
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> {
  id: string;
}

export interface CreateCommentRequest {
  postId: string;
  parentId?: string;
  content: string;
  mentions?: string[];
}

export interface ReactToPostRequest {
  postId: string;
  type: ReactionType;
}

export interface PostsResponse {
  posts: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters?: {
    type?: PostType;
    author?: string;
    category?: string;
    tags?: string[];
    dateRange?: {
      start: string;
      end: string;
    };
  };
}

// Post feed and filtering
export interface PostFilter {
  type?: PostType[];
  author?: string[];
  category?: string[];
  tags?: string[];
  visibility?: PostVisibility[];
  dateRange?: {
    start: string;
    end: string;
  };
  hasMedia?: boolean;
  sortBy?: 'newest' | 'oldest' | 'popular' | 'trending' | 'engagement';
  searchQuery?: string;
}

export interface PostFeedConfig {
  filter: PostFilter;
  pagination: {
    page: number;
    limit: number;
  };
  realTimeUpdates: boolean;
  autoLoadMore: boolean;
}