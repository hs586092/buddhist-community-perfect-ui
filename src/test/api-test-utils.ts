/**
 * API Testing Utilities
 * 
 * Utilities for testing API functionality with proper TypeScript support
 */

import { vi } from 'vitest'

// API testing utilities
export const apiUtils = {
  /**
   * Mock API responses
   */
  mockApiResponse: <T>(data: T, delay = 0): Promise<T> => {
    return new Promise<T>((resolve) => {
      setTimeout(() => resolve(data), delay)
    })
  },

  /**
   * Mock API error
   */
  mockApiError: (message = 'API Error', delay = 0): Promise<never> => {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error(message)), delay)
    })
  },

  /**
   * Mock fetch function
   */
  mockFetch: (response: unknown, ok = true, status = 200): typeof global.fetch => {
    return vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok,
        status,
        json: () => Promise.resolve(response),
        text: () => Promise.resolve(JSON.stringify(response))
      })
    ) as typeof global.fetch
  },

  /**
   * Create mock user data
   */
  createMockUser: (overrides = {}) => ({
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'User',
    createdAt: '2023-01-01T00:00:00.000Z',
    ...overrides
  }),

  /**
   * Create mock auth response
   */
  createMockAuthResponse: (overrides = {}) => ({
    user: apiUtils.createMockUser(),
    token: 'mock-jwt-token',
    expiresIn: 3600,
    ...overrides
  })
}

// Note: vi is imported at the top for use in this file