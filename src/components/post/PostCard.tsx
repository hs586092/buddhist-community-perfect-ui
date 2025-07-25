/**
 * PostCard Component
 * 
 * Displays individual posts with comprehensive features:
 * - Rich content display with media support
 * - Reactions and engagement metrics
 * - Comment system with nested replies
 * - Share and interaction actions
 * - Author information and metadata
 * - Accessibility-first design
 */

import React, { useState, useCallback } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '../../utils/cn'
import { GlassButton } from '../ui/GlassButton'
import type { Post, PostReaction, ReactionType } from '../../types/post'
import { CommentSection } from './CommentSection'
import { ReactionButton } from './ReactionButton'
import { ShareButton } from './ShareButton'
import { PostMedia } from './PostMedia'

interface PostCardProps {
  post: Post
  onReact?: (postId: string, reactionType: ReactionType) => Promise<void>
  onComment?: (postId: string, content: string, parentId?: string) => Promise<void>
  onShare?: (postId: string) => Promise<void>
  onEdit?: (postId: string) => void
  onDelete?: (postId: string) => Promise<void>
  currentUserId?: string
  className?: string
  showComments?: boolean
  isExpanded?: boolean
  onToggleExpanded?: (postId: string) => void
}

/**
 * Post card component with rich content display and interaction features
 */
export const PostCard: React.FC<PostCardProps> = ({
  post,
  onReact,
  onComment,
  onShare,
  onEdit,
  onDelete,
  currentUserId,
  className,
  showComments = true,
  isExpanded = false,
  onToggleExpanded
}) => {
  const [showAllComments, setShowAllComments] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Check if current user has reacted
  const userReaction = currentUserId 
    ? post.reactions.find(r => r.userId === currentUserId)
    : null

  // Handle reaction
  const handleReaction = useCallback(async (reactionType: ReactionType) => {
    if (!onReact || !currentUserId || isProcessing) return
    
    setIsProcessing(true)
    try {
      await onReact(post.id, reactionType)
    } finally {
      setIsProcessing(false)
    }
  }, [onReact, currentUserId, post.id, isProcessing])

  // Handle comment submission
  const handleComment = useCallback(async (content: string, parentId?: string) => {
    if (!onComment || !currentUserId) return
    
    await onComment(post.id, content, parentId)
  }, [onComment, currentUserId, post.id])

  // Handle share
  const handleShare = useCallback(async () => {
    if (!onShare || isProcessing) return
    
    setIsProcessing(true)
    try {
      await onShare(post.id)
    } finally {
      setIsProcessing(false)
    }
  }, [onShare, post.id, isProcessing])

  // Handle expand/collapse
  const handleToggleExpanded = useCallback(() => {
    onToggleExpanded?.(post.id)
  }, [onToggleExpanded, post.id])

  // Check if current user is post author
  const isAuthor = currentUserId === post.author.id

  // Format post date
  const postDate = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
  const isEdited = post.isEdited && post.editedAt

  // Determine if content should be truncated
  const shouldTruncate = !isExpanded && post.content.text && post.content.text.length > 300

  return (
    <article 
      className={cn(
        "relative rounded-lg border border-white/20 bg-white/5 dark:bg-black/20 backdrop-blur-sm",
        "hover:border-primary-500/30 transition-all duration-200",
        className
      )}
      aria-labelledby={`post-${post.id}-title`}
    >
      {/* Post header */}
      <header className="flex items-start gap-3 p-4 pb-0">
        {/* Author avatar */}
        <div className="flex-shrink-0">
          {post.author.avatar ? (
            <img
              src={post.author.avatar}
              alt={`${post.author.name}'s avatar`}
              className="w-10 h-10 rounded-full border border-white/20"
            />
          ) : (
            <div 
              className="w-10 h-10 rounded-full bg-primary-500/20 border border-white/20 flex items-center justify-center"
              aria-label={`${post.author.name}'s avatar`}
            >
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                {post.author.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Author info and metadata */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 
              id={`post-${post.id}-title`}
              className="font-medium text-gray-900 dark:text-gray-100 truncate"
            >
              {post.author.name}
            </h3>
            
            {post.author.isVerified && (
              <span className="text-blue-500" title="Verified account">
                ✓
              </span>
            )}
            
            {post.author.role && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-primary-500/20 text-primary-600 dark:text-primary-400">
                {post.author.role}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
            <time dateTime={post.createdAt} title={new Date(post.createdAt).toLocaleString()}>
              {postDate}
            </time>
            
            {isEdited && (
              <>
                <span>•</span>
                <span title={`Edited ${formatDistanceToNow(new Date(post.editedAt!), { addSuffix: true })}`}>
                  edited
                </span>
              </>
            )}
            
            <span>•</span>
            <span className="capitalize">{post.visibility}</span>
            
            {post.isPinned && (
              <>
                <span>•</span>
                <span className="text-yellow-600">📌 Pinned</span>
              </>
            )}
          </div>
        </div>

        {/* Action menu */}
        {isAuthor && (
          <div className="flex items-center gap-1">
            {onEdit && (
              <GlassButton
                variant="ghost"
                size="sm"
                onClick={() => onEdit(post.id)}
                title="Edit post"
                className="p-1.5"
              >
                ✏️
              </GlassButton>
            )}
            
            {onDelete && (
              <GlassButton
                variant="ghost"
                size="sm"
                onClick={() => onDelete(post.id)}
                title="Delete post"
                className="p-1.5 text-red-600 hover:text-red-700"
              >
                🗑️
              </GlassButton>
            )}
          </div>
        )}
      </header>

      {/* Post content */}
      <main className="px-4 py-3">
        {/* Text content */}
        {post.content.html && (
          <div 
            className={cn(
              "prose prose-sm dark:prose-invert max-w-none",
              shouldTruncate && "line-clamp-6"
            )}
            dangerouslySetInnerHTML={{ __html: post.content.html }}
          />
        )}
        
        {/* Expand/Collapse button for long content */}
        {shouldTruncate && onToggleExpanded && (
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={handleToggleExpanded}
            className="mt-2 text-primary-600 hover:text-primary-700"
          >
            Show more
          </GlassButton>
        )}
        
        {isExpanded && post.content.text && post.content.text.length > 300 && onToggleExpanded && (
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={handleToggleExpanded}
            className="mt-2 text-primary-600 hover:text-primary-700"
          >
            Show less
          </GlassButton>
        )}

        {/* Media content */}
        {(post.content.images?.length || post.content.videos?.length || post.content.audio?.length) && (
          <PostMedia
            images={post.content.images}
            videos={post.content.videos}
            audio={post.content.audio}
            className="mt-3"
          />
        )}

        {/* Poll content */}
        {post.content.poll && (
          <div className="mt-3 p-3 rounded-lg border border-white/10 bg-white/5 dark:bg-black/10">
            <h4 className="font-medium mb-3">{post.content.poll.question}</h4>
            <div className="space-y-2">
              {post.content.poll.options.map((option) => (
                <div key={option.id} className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <div 
                      className="h-8 rounded-full bg-primary-500/20 flex items-center px-3 relative overflow-hidden"
                    >
                      <div 
                        className="absolute inset-0 bg-primary-500/30 transition-all duration-300"
                        style={{ width: `${option.percentage}%` }}
                      />
                      <span className="relative z-10 text-sm">{option.text}</span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 min-w-[3rem] text-right">
                    {option.percentage}%
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {post.content.poll.totalVotes} votes
              {post.content.poll.expiresAt && (
                <span> • Expires {formatDistanceToNow(new Date(post.content.poll.expiresAt), { addSuffix: true })}</span>
              )}
            </div>
          </div>
        )}

        {/* Event content */}
        {post.content.event && (
          <div className="mt-3 p-3 rounded-lg border border-white/10 bg-white/5 dark:bg-black/10">
            <div className="flex items-start gap-3">
              <div className="text-2xl">📅</div>
              <div className="flex-1">
                <h4 className="font-medium">{post.content.event.title}</h4>
                {post.content.event.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {post.content.event.description}
                  </p>
                )}
                <div className="mt-2 space-y-1 text-sm text-gray-500 dark:text-gray-400">
                  <div>📅 {new Date(post.content.event.startDate).toLocaleDateString()}</div>
                  {post.content.event.location && (
                    <div>📍 {post.content.event.location.name || post.content.event.location.address}</div>
                  )}
                  <div>👥 {post.content.event.attendees} attending</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-600 dark:text-gray-300 hover:bg-gray-500/30 cursor-pointer transition-colors"
                role="button"
                tabIndex={0}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </main>

      {/* Engagement bar */}
      <footer className="border-t border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Reactions */}
          <div className="flex items-center gap-1">
            <ReactionButton
              reactions={post.reactions}
              userReaction={userReaction}
              onReact={handleReaction}
              disabled={!currentUserId || isProcessing}
            />
          </div>

          {/* Comment count */}
          <button
            onClick={() => setShowAllComments(!showAllComments)}
            className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors"
            disabled={post.stats.comments === 0}
          >
            💬 {post.stats.comments} {post.stats.comments === 1 ? 'comment' : 'comments'}
          </button>

          {/* Share */}
          <ShareButton
            post={post}
            onShare={handleShare}
            disabled={isProcessing}
          />
        </div>

        {/* Comments section */}
        {showComments && showAllComments && (
          <CommentSection
            postId={post.id}
            comments={post.comments}
            onComment={handleComment}
            currentUserId={currentUserId}
            className="mt-4"
          />
        )}
      </footer>
    </article>
  )
}

PostCard.displayName = 'PostCard'