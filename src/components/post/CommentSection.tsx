/**
 * CommentSection Component
 * 
 * Displays and manages post comments with features:
 * - Nested comment threads
 * - Reply functionality
 * - Comment reactions
 * - Real-time updates
 * - Accessibility support
 */

import React, { useState, useCallback } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '../../utils/cn'
import { GlassButton } from '../ui/GlassButton'
import { GlassInput } from '../ui/GlassInput'
import { ReactionType } from '../../types/post'
import type { PostComment } from '../../types/post'

interface CommentSectionProps {
  postId: string
  comments: PostComment[]
  onComment?: (content: string, parentId?: string) => Promise<void>
  onReactToComment?: (commentId: string, reactionType: ReactionType) => Promise<void>
  onDeleteComment?: (commentId: string) => Promise<void>
  currentUserId?: string
  maxDepth?: number
  className?: string
}

interface CommentItemProps {
  comment: PostComment
  onReply?: (content: string) => Promise<void>
  onReact?: (reactionType: ReactionType) => Promise<void>
  onDelete?: () => Promise<void>
  currentUserId?: string
  depth?: number
  maxDepth?: number
}

/**
 * Individual comment item with nested reply support
 */
const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onReply,
  onReact,
  onDelete,
  currentUserId,
  depth = 0,
  maxDepth = 3
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check if current user is comment author
  const isAuthor = currentUserId === comment.author.id

  // Handle reply submission
  const handleReplySubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent.trim() || !onReply || isSubmitting) return

    setIsSubmitting(true)
    try {
      await onReply(replyContent)
      setReplyContent('')
      setShowReplyForm(false)
    } finally {
      setIsSubmitting(false)
    }
  }, [replyContent, onReply, isSubmitting])

  // Handle like reaction
  const handleLike = useCallback(async () => {
    if (!onReact) return
    await onReact(ReactionType.LIKE)
  }, [onReact])

  return (
    <div 
      className={cn(
        "group relative",
        depth > 0 && "ml-8 pl-4 border-l-2 border-white/10"
      )}
    >
      {/* Comment content */}
      <div className="flex gap-3">
        {/* Author avatar */}
        <div className="flex-shrink-0">
          {comment.author.avatar ? (
            <img
              src={comment.author.avatar}
              alt={`${comment.author.name}'s avatar`}
              className="w-8 h-8 rounded-full border border-white/20"
            />
          ) : (
            <div 
              className="w-8 h-8 rounded-full bg-primary-500/20 border border-white/20 flex items-center justify-center"
              aria-label={`${comment.author.name}'s avatar`}
            >
              <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                {comment.author.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Comment body */}
        <div className="flex-1 min-w-0">
          {/* Author and metadata */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
              {comment.author.name}
            </span>
            
            {comment.author.role && (
              <span className="px-1.5 py-0.5 text-xs rounded-full bg-primary-500/20 text-primary-600 dark:text-primary-400">
                {comment.author.role}
              </span>
            )}
            
            <time 
              dateTime={comment.createdAt}
              className="text-xs text-gray-500 dark:text-gray-400"
              title={new Date(comment.createdAt).toLocaleString()}
            >
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </time>
            
            {comment.isEdited && comment.editedAt && (
              <span 
                className="text-xs text-gray-500 dark:text-gray-400"
                title={`Edited ${formatDistanceToNow(new Date(comment.editedAt), { addSuffix: true })}`}
              >
                (edited)
              </span>
            )}
          </div>

          {/* Comment content */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {comment.html ? (
              <div dangerouslySetInnerHTML={{ __html: comment.html }} />
            ) : (
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                {comment.content}
              </p>
            )}
          </div>

          {/* Comment actions */}
          <div className="flex items-center gap-3 mt-2">
            {/* Like button */}
            {onReact && (
              <button
                onClick={handleLike}
                className={cn(
                  "flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400",
                  "hover:text-primary-600 transition-colors",
                  comment.likes > 0 && "text-primary-600"
                )}
              >
                <span>👍</span>
                {comment.likes > 0 && <span>{comment.likes}</span>}
              </button>
            )}

            {/* Reply button */}
            {onReply && depth < maxDepth && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors"
              >
                Reply
              </button>
            )}

            {/* Delete button (author only) */}
            {isAuthor && onDelete && (
              <button
                onClick={onDelete}
                className="text-xs text-red-500 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                Delete
              </button>
            )}
          </div>

          {/* Reply form */}
          {showReplyForm && (
            <form onSubmit={handleReplySubmit} className="mt-3">
              <div className="flex gap-2">
                <GlassInput
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={`Reply to ${comment.author.name}...`}
                  className="flex-1 text-sm"
                  disabled={isSubmitting}
                />
                <GlassButton
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!replyContent.trim() || isSubmitting}
                  loading={isSubmitting}
                >
                  Reply
                </GlassButton>
              </div>
            </form>
          )}

          {/* Nested replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={onReply ? (content) => onReply(content) : undefined}
                  onReact={onReact}
                  currentUserId={currentUserId}
                  depth={depth + 1}
                  maxDepth={maxDepth}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Comment section with new comment form and comment thread display
 */
export const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  comments,
  onComment,
  onReactToComment,
  onDeleteComment,
  currentUserId,
  maxDepth = 3,
  className
}) => {
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle new comment submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !onComment || isSubmitting) return

    setIsSubmitting(true)
    try {
      await onComment(newComment)
      setNewComment('')
    } finally {
      setIsSubmitting(false)
    }
  }, [newComment, onComment, isSubmitting])

  // Filter root comments (no parent)
  const rootComments = comments.filter(comment => !comment.parentId)

  return (
    <div className={cn("space-y-4", className)}>
      {/* New comment form */}
      {currentUserId && onComment && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <GlassInput
            multiline
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full resize-none"
            disabled={isSubmitting}
          />
          <div className="flex justify-end">
            <GlassButton
              type="submit"
              variant="primary"
              size="sm"
              disabled={!newComment.trim() || isSubmitting}
              loading={isSubmitting}
            >
              Post Comment
            </GlassButton>
          </div>
        </form>
      )}

      {/* Comments list */}
      {rootComments.length > 0 ? (
        <div className="space-y-4">
          {rootComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={onComment ? (content) => onComment(content, comment.id) : undefined}
              onReact={onReactToComment ? (type) => onReactToComment(comment.id, type) : undefined}
              onDelete={onDeleteComment ? () => onDeleteComment(comment.id) : undefined}
              currentUserId={currentUserId}
              depth={0}
              maxDepth={maxDepth}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="text-sm">No comments yet.</p>
          {currentUserId && (
            <p className="text-xs mt-1">Be the first to share your thoughts!</p>
          )}
        </div>
      )}
    </div>
  )
}

CommentSection.displayName = 'CommentSection'