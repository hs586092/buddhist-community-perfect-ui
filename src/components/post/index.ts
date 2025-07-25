/**
 * Post Components Barrel Export
 * 
 * Centralized exports for all post-related components
 */

export { RichTextEditor } from './RichTextEditor'
export { PostCard } from './PostCard'
export { PostFeed } from './PostFeed'
export { CommentSection } from './CommentSection'
export { ReactionButton } from './ReactionButton'
export { ShareButton } from './ShareButton'
export { PostMedia } from './PostMedia'

// Re-export types for convenience
export type {
  Post,
  PostType,
  PostVisibility,
  PostContent,
  PostComment,
  PostReaction,
  ReactionType,
  PostFilter,
  PostFeedConfig,
  EditorContent,
  EditorState,
  EditorConfig,
  MediaAttachment
} from '../../types/post'