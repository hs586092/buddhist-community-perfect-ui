/**
 * PostFeed Component
 * 
 * Displays a feed of posts with comprehensive features:
 * - Infinite scrolling with performance optimization
 * - Advanced filtering and sorting options
 * - Real-time post updates
 * - Skeleton loading states
 * - Error handling and retry mechanisms
 * - Accessibility support
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { cn } from '../../utils/cn'
import { GlassButton } from '../ui/GlassButton'
import { GlassInput } from '../ui/GlassInput'
import { PostCard } from './PostCard'
import { RichTextEditor } from './RichTextEditor'
import { PostType, PostVisibility } from '../../types/post'
import type { 
  Post, 
  PostFilter, 
  PostFeedConfig, 
  ReactionType,
  EditorContent 
} from '../../types/post'

interface PostFeedProps {
  posts?: Post[]
  loading?: boolean
  error?: string | null
  hasMorePosts?: boolean
  currentUserId?: string
  onLoadMore?: () => Promise<void>
  onCreatePost?: (content: EditorContent, type: PostType, visibility: PostVisibility) => Promise<void>
  onReact?: (postId: string, reactionType: ReactionType) => Promise<void>
  onComment?: (postId: string, content: string, parentId?: string) => Promise<void>
  onShare?: (postId: string) => Promise<void>
  onEditPost?: (postId: string) => void
  onDeletePost?: (postId: string) => Promise<void>
  onFilterChange?: (filter: PostFilter) => void
  initialFilter?: PostFilter
  showCreatePost?: boolean
  className?: string
}

interface PostSkeletonProps {
  count?: number
}

interface FilterBarProps {
  filter: PostFilter
  onFilterChange: (filter: PostFilter) => void
  className?: string
}

/**
 * Skeleton loader for posts
 */
const PostSkeleton: React.FC<PostSkeletonProps> = ({ count = 3 }) => (
  <div className="space-y-6">
    {Array.from({ length: count }).map((_, index) => (
      <div 
        key={index}
        className="rounded-lg border border-white/20 bg-white/5 dark:bg-black/20 backdrop-blur-sm p-4 animate-pulse"
      >
        {/* Header skeleton */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32" />
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-24" />
          </div>
        </div>
        
        {/* Content skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full" />
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
        </div>
        
        {/* Actions skeleton */}
        <div className="flex items-center gap-4 pt-3 border-t border-white/10">
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16" />
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-20" />
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16" />
        </div>
      </div>
    ))}
  </div>
)

/**
 * Filter bar component
 */
const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  onFilterChange,
  className
}) => {
  const [searchQuery, setSearchQuery] = useState(filter.searchQuery || '')
  
  // Debounced search
  const searchTimeoutRef = useRef<NodeJS.Timeout>()
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      onFilterChange({
        ...filter,
        searchQuery: value.trim() || undefined
      })
    }, 300)
  }, [filter, onFilterChange])

  // Filter options
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'trending', label: 'Trending' },
    { value: 'engagement', label: 'Most Engaged' }
  ] as const

  const postTypeOptions = [
    { value: PostType.TEXT, label: 'Text', icon: '📝' },
    { value: PostType.IMAGE, label: 'Images', icon: '📷' },
    { value: PostType.VIDEO, label: 'Videos', icon: '🎥' },
    { value: PostType.AUDIO, label: 'Audio', icon: '🎵' },
    { value: PostType.POLL, label: 'Polls', icon: '📊' },
    { value: PostType.EVENT, label: 'Events', icon: '📅' },
    { value: PostType.TEACHING, label: 'Teachings', icon: '📿' }
  ] as const

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search */}
      <div className="flex gap-3">
        <GlassInput
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="flex-1"
        />
        <GlassButton
          variant="ghost"
          size="sm"
          onClick={() => {
            setSearchQuery('')
            onFilterChange({ ...filter, searchQuery: undefined })
          }}
          disabled={!searchQuery}
          title="Clear search"
        >
          ✕
        </GlassButton>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort:</span>
          <select
            value={filter.sortBy || 'newest'}
            onChange={(e) => onFilterChange({
              ...filter,
              sortBy: e.target.value as any
            })}
            className="px-3 py-1 text-sm rounded-md border border-white/20 bg-white/5 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Post types */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Type:</span>
          <div className="flex flex-wrap gap-1">
            {postTypeOptions.map(type => (
              <button
                key={type.value}
                onClick={() => {
                  const currentTypes = filter.type || []
                  const newTypes = currentTypes.includes(type.value)
                    ? currentTypes.filter(t => t !== type.value)
                    : [...currentTypes, type.value]
                  
                  onFilterChange({
                    ...filter,
                    type: newTypes.length > 0 ? newTypes : undefined
                  })
                }}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 text-xs rounded-full border transition-all",
                  filter.type?.includes(type.value)
                    ? "border-primary-500 bg-primary-500/20 text-primary-600"
                    : "border-white/20 hover:border-primary-500/50"
                )}
                title={type.label}
              >
                <span>{type.icon}</span>
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Media filter */}
        <button
          onClick={() => onFilterChange({
            ...filter,
            hasMedia: filter.hasMedia ? undefined : true
          })}
          className={cn(
            "flex items-center gap-1 px-2 py-1 text-xs rounded-full border transition-all",
            filter.hasMedia
              ? "border-primary-500 bg-primary-500/20 text-primary-600"
              : "border-white/20 hover:border-primary-500/50"
          )}
        >
          <span>📎</span>
          <span>With Media</span>
        </button>

        {/* Clear filters */}
        {(filter.type?.length || filter.hasMedia || filter.searchQuery) && (
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={() => onFilterChange({})}
            className="text-xs"
          >
            Clear Filters
          </GlassButton>
        )}
      </div>
    </div>
  )
}

/**
 * Main PostFeed component
 */
export const PostFeed: React.FC<PostFeedProps> = ({
  posts = [],
  loading = false,
  error = null,
  hasMorePosts = false,
  currentUserId,
  onLoadMore,
  onCreatePost,
  onReact,
  onComment,
  onShare,
  onEditPost,
  onDeletePost,
  onFilterChange,
  initialFilter = {},
  showCreatePost = true,
  className
}) => {
  // State
  const [filter, setFilter] = useState<PostFilter>(initialFilter)
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set())
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  
  // Refs
  const observerRef = useRef<IntersectionObserver>()
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Filter change handler
  const handleFilterChange = useCallback((newFilter: PostFilter) => {
    setFilter(newFilter)
    onFilterChange?.(newFilter)
  }, [onFilterChange])

  // Post expansion
  const handleToggleExpanded = useCallback((postId: string) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }, [])

  // Create post handler
  const handleCreatePost = useCallback(async (content: EditorContent) => {
    if (!onCreatePost || !content.html.trim()) return

    setIsCreatingPost(true)
    try {
      await onCreatePost(content, PostType.TEXT, PostVisibility.PUBLIC)
      setIsCreatingPost(false)
    } catch (error) {
      console.error('Failed to create post:', error)
    } finally {
      setIsCreatingPost(false)
    }
  }, [onCreatePost])

  // Infinite scroll setup
  useEffect(() => {
    if (!onLoadMore || !hasMorePosts || loading || loadingMore) return

    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting) {
          setLoadingMore(true)
          try {
            await onLoadMore()
          } finally {
            setLoadingMore(false)
          }
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    )

    const currentRef = loadMoreRef.current
    if (currentRef) {
      observerRef.current.observe(currentRef)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [onLoadMore, hasMorePosts, loading, loadingMore])

  // Cleanup observer
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  // Memoized filtered posts (in real app, filtering would be done server-side)
  const filteredPosts = useMemo(() => {
    let result = [...posts]

    // Apply client-side filtering for demo purposes
    if (filter.type?.length) {
      result = result.filter(post => filter.type!.includes(post.type))
    }

    if (filter.hasMedia) {
      result = result.filter(post => 
        post.content.images?.length || 
        post.content.videos?.length || 
        post.content.audio?.length
      )
    }

    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase()
      result = result.filter(post =>
        post.content.text?.toLowerCase().includes(query) ||
        post.author.name.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return result
  }, [posts, filter])

  return (
    <div className={cn("max-w-2xl mx-auto space-y-6", className)}>
      {/* Create post section */}
      {showCreatePost && currentUserId && (
        <div className="rounded-lg border border-white/20 bg-white/5 dark:bg-black/20 backdrop-blur-sm p-4">
          <RichTextEditor
            onSave={handleCreatePost}
            disabled={isCreatingPost}
            autoFocus={false}
            config={{
              placeholder: "What's on your mind? Share your thoughts with the community...",
              maxLength: 5000,
              autosave: false
            }}
          />
        </div>
      )}

      {/* Filter bar */}
      <FilterBar
        filter={filter}
        onFilterChange={handleFilterChange}
      />

      {/* Error state */}
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-center">
          <p className="text-red-600 dark:text-red-400 mb-3">{error}</p>
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={() => window.location.reload()}
          >
            Try Again
          </GlassButton>
        </div>
      )}

      {/* Posts list */}
      <div className="space-y-6">
        {loading && posts.length === 0 ? (
          <PostSkeleton count={5} />
        ) : filteredPosts.length > 0 ? (
          <>
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={currentUserId}
                onReact={onReact}
                onComment={onComment}
                onShare={onShare}
                onEdit={onEditPost}
                onDelete={onDeletePost}
                isExpanded={expandedPosts.has(post.id)}
                onToggleExpanded={handleToggleExpanded}
              />
            ))}

            {/* Load more trigger */}
            {hasMorePosts && (
              <div ref={loadMoreRef} className="py-8 text-center">
                {loadingMore ? (
                  <PostSkeleton count={2} />
                ) : (
                  <GlassButton
                    variant="ghost"
                    onClick={onLoadMore}
                    disabled={loading}
                  >
                    Load More Posts
                  </GlassButton>
                )}
              </div>
            )}
          </>
        ) : (
          /* Empty state */
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No posts found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {filter.searchQuery || filter.type?.length || filter.hasMedia
                ? "Try adjusting your filters to see more posts."
                : "Be the first to share something with the community!"
              }
            </p>
            {(filter.searchQuery || filter.type?.length || filter.hasMedia) && (
              <GlassButton
                variant="primary"
                onClick={() => handleFilterChange({})}
              >
                Clear Filters
              </GlassButton>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

PostFeed.displayName = 'PostFeed'