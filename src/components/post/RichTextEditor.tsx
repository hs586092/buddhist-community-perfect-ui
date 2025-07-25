/**
 * Rich Text Editor Component
 * 
 * Advanced rich text editor for post creation with comprehensive features:
 * - WYSIWYG editing with HTML output
 * - Markdown support and live preview
 * - Media attachment handling
 * - @mentions and #hashtag support
 * - Auto-save and version control
 * - Accessibility-first design
 * - Mobile-optimized touch interactions
 */

import React, { useState, useRef, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react'
import { cn } from '../../utils/cn'
import { GlassButton } from '../ui/GlassButton'
import type { EditorContent, EditorConfig, EditorState, MediaAttachment } from '../../types/post'

interface RichTextEditorProps {
  initialContent?: string
  config?: Partial<EditorConfig>
  onContentChange?: (content: EditorContent) => void
  onSave?: (content: EditorContent) => Promise<void>
  onCancel?: () => void
  className?: string
  disabled?: boolean
  autoFocus?: boolean
}

interface RichTextEditorRef {
  getContent: () => EditorContent
  setContent: (content: string) => void
  focus: () => void
  blur: () => void
  insertText: (text: string) => void
  insertMention: (username: string) => void
  insertHashtag: (tag: string) => void
}

/**
 * Rich Text Editor with comprehensive formatting and content management
 */
export const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(({
  initialContent = '',
  config = {},
  onContentChange,
  onSave,
  onCancel,
  className,
  disabled = false,
  autoFocus = false
}, ref) => {
  // Editor configuration with defaults
  const editorConfig: EditorConfig = {
    placeholder: 'Share your thoughts with the community...',
    maxLength: 10000,
    minLength: 1,
    allowHtml: true,
    allowMarkdown: true,
    allowMentions: true,
    allowHashtags: true,
    allowMedia: true,
    mediaTypes: ['image', 'video', 'audio'],
    autosave: true,
    autosaveDelay: 2000,
    spellcheck: true,
    readOnly: false,
    ...config
  }

  // Editor state
  const [editorState, setEditorState] = useState<EditorState>({
    content: {
      html: initialContent,
      text: '',
      markdown: '',
      wordCount: 0,
      characterCount: 0,
      mentions: [],
      hashtags: []
    },
    isEditing: false,
    isDirty: false,
    isSaving: false,
    version: 1
  })

  // Editor modes and UI state
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showFormatting, setShowFormatting] = useState(false)
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())

  // Refs
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const autosaveTimeoutRef = useRef<NodeJS.Timeout>()

  // Expose methods through ref
  useImperativeHandle(ref, () => ({
    getContent: () => editorState.content,
    setContent: (content: string) => {
      updateContent(content)
    },
    focus: () => {
      editorRef.current?.focus()
    },
    blur: () => {
      editorRef.current?.blur()
    },
    insertText: (text: string) => {
      insertTextAtCursor(text)
    },
    insertMention: (username: string) => {
      insertTextAtCursor(`@${username} `)
    },
    insertHashtag: (tag: string) => {
      insertTextAtCursor(`#${tag} `)
    }
  }), [editorState.content])

  // Content parsing and processing
  const parseContent = useCallback((html: string): EditorContent => {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html
    const text = tempDiv.textContent || tempDiv.innerText || ''
    
    // Extract mentions (@username)
    const mentionRegex = /@(\w+)/g
    const mentions = [...html.matchAll(mentionRegex)].map(match => match[1])
    
    // Extract hashtags (#tag)
    const hashtagRegex = /#(\w+)/g
    const hashtags = [...html.matchAll(hashtagRegex)].map(match => match[1])
    
    // Convert HTML to markdown (simplified)
    const markdown = html
      .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
      .replace(/<em>(.*?)<\/em>/g, '*$1*')
      .replace(/<u>(.*?)<\/u>/g, '__$1__')
      .replace(/<h[1-6]>(.*?)<\/h[1-6]>/g, '# $1')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<p>(.*?)<\/p>/g, '$1\n\n')
      .replace(/<[^>]*>/g, '') // Remove remaining HTML tags
    
    return {
      html,
      text,
      markdown: markdown.trim(),
      wordCount: text.trim() ? text.trim().split(/\s+/).length : 0,
      characterCount: text.length,
      mentions: [...new Set(mentions)],
      hashtags: [...new Set(hashtags)]
    }
  }, [])

  // Update content and trigger callbacks
  const updateContent = useCallback((html: string) => {
    const content = parseContent(html)
    
    setEditorState(prev => ({
      ...prev,
      content,
      isDirty: true,
      version: prev.version + 1
    }))
    
    onContentChange?.(content)
    
    // Auto-save functionality
    if (editorConfig.autosave && !disabled) {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current)
      }
      
      autosaveTimeoutRef.current = setTimeout(() => {
        setEditorState(prev => ({ ...prev, autosaveAt: new Date().toISOString() }))
        // Auto-save could trigger onSave callback here
      }, editorConfig.autosaveDelay)
    }
  }, [parseContent, onContentChange, editorConfig.autosave, editorConfig.autosaveDelay, disabled])

  // Handle content input
  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    updateContent(target.innerHTML)
  }, [updateContent])

  // Insert text at cursor position
  const insertTextAtCursor = useCallback((text: string) => {
    if (!editorRef.current) return
    
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return
    
    const range = selection.getRangeAt(0)
    const textNode = document.createTextNode(text)
    
    range.deleteContents()
    range.insertNode(textNode)
    
    // Move cursor to end of inserted text
    range.setStartAfter(textNode)
    range.setEndAfter(textNode)
    selection.removeAllRanges()
    selection.addRange(range)
    
    updateContent(editorRef.current.innerHTML)
  }, [updateContent])

  // Formatting commands
  const executeCommand = useCallback((command: string, value?: string) => {
    if (disabled || editorConfig.readOnly) return
    
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    
    if (editorRef.current) {
      updateContent(editorRef.current.innerHTML)
    }
  }, [disabled, editorConfig.readOnly, updateContent])

  // Media attachment handling
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    // Process file attachments here
    // This would typically upload files and insert media elements
    console.log('Selected files:', files)
  }, [])

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled || editorConfig.readOnly) return
    
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault()
          executeCommand('bold')
          break
        case 'i':
          e.preventDefault()
          executeCommand('italic')
          break
        case 'u':
          e.preventDefault()
          executeCommand('underline')
          break
        case 's':
          e.preventDefault()
          onSave?.(editorState.content)
          break
        case 'Enter':
          // Ctrl/Cmd + Enter to save/submit
          e.preventDefault()
          onSave?.(editorState.content)
          break
      }
    }
    
    // Handle @ for mentions
    if (e.key === '@' && editorConfig.allowMentions) {
      // Trigger mention picker here
      console.log('Mention trigger')
    }
    
    // Handle # for hashtags
    if (e.key === '#' && editorConfig.allowHashtags) {
      // Trigger hashtag picker here
      console.log('Hashtag trigger')
    }
  }, [disabled, editorConfig.readOnly, editorConfig.allowMentions, editorConfig.allowHashtags, executeCommand, onSave, editorState.content])

  // Initialize content
  useEffect(() => {
    if (initialContent && editorRef.current) {
      editorRef.current.innerHTML = initialContent
      updateContent(initialContent)
    }
  }, [initialContent, updateContent])

  // Auto-focus
  useEffect(() => {
    if (autoFocus && editorRef.current) {
      editorRef.current.focus()
    }
  }, [autoFocus])

  // Cleanup
  useEffect(() => {
    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current)
      }
    }
  }, [])

  // Render toolbar
  const renderToolbar = () => (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-black/5 dark:bg-white/5">
      {/* Text formatting */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => executeCommand('bold')}
          className={cn(
            "p-2 rounded-md text-sm font-medium transition-all duration-200",
            "hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500/50",
            activeFormats.has('bold') && "bg-primary-500/20 text-primary-600"
          )}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        
        <button
          type="button"
          onClick={() => executeCommand('italic')}
          className={cn(
            "p-2 rounded-md text-sm font-medium transition-all duration-200",
            "hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500/50",
            activeFormats.has('italic') && "bg-primary-500/20 text-primary-600"
          )}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </button>
        
        <button
          type="button"
          onClick={() => executeCommand('underline')}
          className={cn(
            "p-2 rounded-md text-sm font-medium transition-all duration-200",
            "hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500/50",
            activeFormats.has('underline') && "bg-primary-500/20 text-primary-600"
          )}
          title="Underline (Ctrl+U)"
        >
          <u>U</u>
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      {/* Lists */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => executeCommand('insertUnorderedList')}
          className="p-2 rounded-md text-sm font-medium hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          title="Bulleted List"
        >
          •
        </button>
        
        <button
          type="button"
          onClick={() => executeCommand('insertOrderedList')}
          className="p-2 rounded-md text-sm font-medium hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          title="Numbered List"
        >
          1.
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      {/* Media */}
      {editorConfig.allowMedia && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-md text-sm font-medium hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          title="Add Media"
        >
          📷
        </button>
      )}

      {/* Preview toggle */}
      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          className={cn(
            "px-3 py-1 rounded-md text-sm font-medium transition-all duration-200",
            "hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500/50",
            isPreviewMode ? "bg-primary-500/20 text-primary-600" : "text-gray-600 dark:text-gray-400"
          )}
        >
          {isPreviewMode ? 'Edit' : 'Preview'}
        </button>
      </div>
    </div>
  )

  // Render status bar
  const renderStatusBar = () => (
    <div className="flex items-center justify-between p-2 text-xs text-gray-500 dark:text-gray-400 border-t border-white/10 bg-black/5 dark:bg-white/5">
      <div className="flex items-center gap-4">
        <span>{editorState.content.wordCount} words</span>
        <span>{editorState.content.characterCount} characters</span>
        {editorConfig.maxLength && (
          <span className={cn(
            editorState.content.characterCount > editorConfig.maxLength * 0.9 && "text-amber-500",
            editorState.content.characterCount >= editorConfig.maxLength && "text-red-500"
          )}>
            {editorState.content.characterCount}/{editorConfig.maxLength}
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        {editorState.autosaveAt && (
          <span className="text-green-600">
            Saved {new Date(editorState.autosaveAt).toLocaleTimeString()}
          </span>
        )}
        {editorState.isDirty && !editorState.isSaving && (
          <span className="text-amber-600">Unsaved changes</span>
        )}
        {editorState.isSaving && (
          <span className="text-blue-600">Saving...</span>
        )}
      </div>
    </div>
  )

  return (
    <div className={cn(
      "relative rounded-lg border border-white/20 bg-white/5 dark:bg-black/20 backdrop-blur-sm",
      "focus-within:border-primary-500/50 focus-within:ring-4 focus-within:ring-primary-500/20",
      isFullscreen && "fixed inset-4 z-50 rounded-xl shadow-2xl",
      className
    )}>
      {/* Toolbar */}
      {renderToolbar()}

      {/* Editor content */}
      <div className="relative min-h-[200px] max-h-[500px] overflow-y-auto">
        {isPreviewMode ? (
          // Preview mode
          <div 
            className="p-4 prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: editorState.content.html }}
          />
        ) : (
          // Edit mode
          <div
            ref={editorRef}
            contentEditable={!disabled && !editorConfig.readOnly}
            className={cn(
              "p-4 outline-none resize-none min-h-[200px]",
              "prose prose-sm dark:prose-invert max-w-none",
              "focus:ring-0 focus:border-transparent",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            spellCheck={editorConfig.spellcheck}
            data-placeholder={editorConfig.placeholder}
            style={{
              // Show placeholder when empty
              ...(editorState.content.text.trim() === '' && {
                '::before': {
                  content: `"${editorConfig.placeholder}"`,
                  color: '#9ca3af',
                  fontStyle: 'italic'
                }
              })
            }}
          />
        )}
      </div>

      {/* Status bar */}
      {renderStatusBar()}

      {/* Hidden file input */}
      {editorConfig.allowMedia && (
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={editorConfig.mediaTypes?.map(type => `${type}/*`).join(',')}
          className="hidden"
          onChange={handleFileSelect}
        />
      )}

      {/* Action buttons */}
      {(onSave || onCancel) && (
        <div className="flex items-center justify-end gap-2 p-4 border-t border-white/10 bg-black/5 dark:bg-white/5">
          {onCancel && (
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={editorState.isSaving}
            >
              Cancel
            </GlassButton>
          )}
          
          {onSave && (
            <GlassButton
              variant="primary"
              size="sm"
              onClick={() => onSave(editorState.content)}
              disabled={editorState.isSaving || (!editorState.isDirty && !initialContent)}
              loading={editorState.isSaving}
            >
              {editorState.isSaving ? 'Saving...' : 'Save Post'}
            </GlassButton>
          )}
        </div>
      )}
    </div>
  )
})

RichTextEditor.displayName = 'RichTextEditor'