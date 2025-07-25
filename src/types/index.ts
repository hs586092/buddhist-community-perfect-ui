import type { ReactNode } from 'react'

// Global type definitions
export interface BaseProps {
  className?: string
  children?: ReactNode
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
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
