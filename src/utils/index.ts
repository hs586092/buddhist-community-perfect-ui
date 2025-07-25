export { cn, cva } from './cn'

/**
 * Delays execution for specified milliseconds
 */
export const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Formats a date to a localized string
 */
export const formatDate = (date: Date | string, locale = 'en-US'): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

/**
 * Formats a number as currency
 */
export const formatCurrency = (amount: number, currency = 'USD', locale = 'en-US'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Capitalizes the first letter of a string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Truncates text to specified length with ellipsis
 */
export const truncate = (text: string, length: number): string => {
  if (text.length <= length) {
    return text
  }
  return `${text.slice(0, length).trim()}...`
}

/**
 * Debounces a function call
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttles a function call
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Generates a random string of specified length
 */
export const generateId = (length = 8): string => {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length)
}

/**
 * Checks if a value is empty (null, undefined, empty string, empty array, empty object)
 */
export const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) {
    return true
  }
  if (typeof value === 'string') {
    return value.trim().length === 0
  }
  if (Array.isArray(value)) {
    return value.length === 0
  }
  if (typeof value === 'object') {
    return Object.keys(value).length === 0
  }
  return false
}

/**
 * Deep clones an object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T
  }
  if (typeof obj === 'object') {
    const clonedObj = {} as { [key: string]: any }
    Object.keys(obj).forEach(key => {
      clonedObj[key] = deepClone((obj as { [key: string]: any })[key])
    })
    return clonedObj as T
  }
  return obj
}
