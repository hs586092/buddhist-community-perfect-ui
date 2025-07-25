/**
 * Test Setup Configuration
 * 
 * Global test setup and utilities for comprehensive React component testing
 * QA Persona focus: Prevention > Detection > Correction
 */

import '@testing-library/jest-dom'
import { vi, afterEach } from 'vitest'

// Mock ResizeObserver for components that use it
global.ResizeObserver = class ResizeObserver {
  constructor(_cb: ResizeObserverCallback) {
    // Mock implementation
  }
  observe() {
    // Mock implementation
  }
  unobserve() {
    // Mock implementation
  }
  disconnect() {
    // Mock implementation
  }
}

// Mock IntersectionObserver for components that use it
const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
})
window.IntersectionObserver = mockIntersectionObserver
global.IntersectionObserver = mockIntersectionObserver

// Mock matchMedia for responsive design tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock window.scrollTo for scroll behavior tests
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
})

// Mock localStorage with comprehensive API
const localStorageMock = {
  getItem: vi.fn((key: string) => null),
  setItem: vi.fn((key: string, value: string) => {}),
  removeItem: vi.fn((key: string) => {}),
  clear: vi.fn(() => {}),
  length: 0,
  key: vi.fn((index: number) => null),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

// Mock sessionStorage with comprehensive API
const sessionStorageMock = {
  getItem: vi.fn((key: string) => null),
  setItem: vi.fn((key: string, value: string) => {}),
  removeItem: vi.fn((key: string) => {}),
  clear: vi.fn(() => {}),
  length: 0,
  key: vi.fn((index: number) => null),
}
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true,
})

// Mock WebSocket for real-time features testing
global.WebSocket = class MockWebSocket extends EventTarget implements WebSocket {
  url: string
  readyState: number = WebSocket.CONNECTING
  binaryType: BinaryType = 'blob'
  bufferedAmount: number = 0
  extensions: string = ''
  protocol: string = ''
  
  // Event handlers
  onclose: ((this: WebSocket, ev: CloseEvent) => any) | null = null
  onerror: ((this: WebSocket, ev: Event) => any) | null = null
  onmessage: ((this: WebSocket, ev: MessageEvent) => any) | null = null
  onopen: ((this: WebSocket, ev: Event) => any) | null = null
  
  // Constants
  static readonly CLOSED = 3
  static readonly CLOSING = 2
  static readonly CONNECTING = 0
  static readonly OPEN = 1
  
  readonly CLOSED = 3
  readonly CLOSING = 2
  readonly CONNECTING = 0
  readonly OPEN = 1
  
  constructor(url: string | URL, protocols?: string | string[]) {
    super()
    this.url = url
  }
  
  close(code?: number, reason?: string): void {
    this.readyState = WebSocket.CLOSED
  }
  
  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
    // Mock send implementation
  }
  
  // Remove duplicate static constants as they're already defined above
}

// Mock Notification API for notification testing
global.Notification = class MockNotification extends EventTarget implements Notification {
  title: string
  body: string = ''
  data: any = null
  dir: NotificationDirection = 'auto'
  icon: string = ''
  image: string = ''
  lang: string = ''
  renotify: boolean = false
  requireInteraction: boolean = false
  silent: boolean = false
  tag: string = ''
  timestamp: EpochTimeStamp = Date.now()
  vibrate: readonly number[] = []
  badge: string = ''
  actions: readonly any[] = []
  
  onclick: ((this: Notification, ev: Event) => any) | null = null
  onclose: ((this: Notification, ev: Event) => any) | null = null
  onerror: ((this: Notification, ev: Event) => any) | null = null
  onshow: ((this: Notification, ev: Event) => any) | null = null
  
  static permission: NotificationPermission = 'default'
  static maxActions: number = 2
  
  constructor(title: string, options?: NotificationOptions) {
    super()
    this.title = title
    this.body = options?.body || ''
    this.icon = options?.icon || ''
  }
  
  close(): void {}
  
  static requestPermission = vi.fn().mockResolvedValue('granted' as NotificationPermission)
}

// Mock crypto for ID generation and security testing
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: vi.fn(() => '123e4567-e89b-12d3-a456-426614174000'),
    getRandomValues: vi.fn((arr: any) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256)
      }
      return arr
    }),
  },
  writable: true,
})

// Mock performance API for performance testing
Object.defineProperty(global, 'performance', {
  value: {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    clearMarks: vi.fn(),
    clearMeasures: vi.fn(),
    getEntriesByName: vi.fn(() => []),
    getEntriesByType: vi.fn(() => []),
  },
  writable: true,
})

// Mock console methods for testing console output
const originalConsole = { ...console }
global.console = {
  ...originalConsole,
  warn: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
}

// Clean up after each test to prevent test pollution
afterEach(() => {
  vi.clearAllMocks()
  localStorageMock.clear()
  sessionStorageMock.clear()
  
  // Reset console to original state for clean test output
  global.console = originalConsole
  
  // Clear any timers
  vi.clearAllTimers()
})

// Global test utilities available in all test files
;(global as any).testUtils = {
  localStorageMock,
  sessionStorageMock,
  mockWebSocket: global.WebSocket,
  mockNotification: global.Notification,
}
