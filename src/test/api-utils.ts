/**
 * API Testing Utilities
 * 
 * Comprehensive API testing utilities with QA persona focus:
 * - Prevention: Validate API contracts, data structures, error scenarios  
 * - Detection: Test request/response cycles, authentication, authorization
 * - Correction: Ensure proper error handling, retry logic, fallbacks
 */

import { vi } from 'vitest'

// Mock data generators for consistent API testing
export const apiMockData = {
  // Authentication responses
  auth: {
    loginSuccess: {
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'Member',
        avatar: undefined,
        createdAt: '2023-01-15T00:00:00.000Z',
        lastLoginAt: new Date().toISOString(),
      },
      token: 'mock-jwt-token-12345'
    },
    loginError: {
      message: 'Invalid credentials',
      code: 'INVALID_CREDENTIALS'
    },
    registerSuccess: {
      user: {
        id: '2',
        name: 'New User',
        email: 'newuser@example.com',
        role: 'Member',
        createdAt: new Date().toISOString(),
      },
      token: 'mock-jwt-token-67890'
    }
  },

  // Community data responses
  community: {
    groups: [
      {
        id: '1',
        name: 'Test Meditation Group',
        description: 'A test meditation group for API testing',
        memberCount: 25,
        category: 'meditation',
        isPrivate: false,
        lastActivity: '1 hour ago',
        tags: ['test', 'meditation', 'api']
      },
      {
        id: '2',
        name: 'Test Study Group',
        description: 'A test study group for API testing',
        memberCount: 15,
        category: 'study',
        isPrivate: true,
        lastActivity: '2 hours ago',
        tags: ['test', 'study', 'dharma']
      }
    ],
    events: [
      {
        id: '1',
        title: 'Test Meditation Session',
        description: 'A test meditation session for API testing',
        date: '2024-02-15',
        time: '09:00',
        location: 'Test Center',
        attendeeCount: 10,
        maxAttendees: 20,
        type: 'meditation',
        isOnline: false,
        tags: ['test', 'meditation']
      }
    ],
    members: [
      {
        id: '1',
        name: 'Test Member 1',
        role: 'member',
        joinDate: '2023-01-15',
        lastSeen: '1 hour ago',
        contributions: 15,
        specialties: ['meditation'],
        isOnline: true
      },
      {
        id: '2',
        name: 'Test Teacher',
        role: 'teacher',
        joinDate: '2023-01-01',
        lastSeen: '30 minutes ago',
        contributions: 45,
        specialties: ['dharma', 'meditation'],
        isOnline: true
      }
    ]
  },

  // Chat and messaging responses
  chat: {
    messages: [
      {
        id: '1',
        type: 'text',
        content: 'Test message content',
        author: {
          id: '1',
          name: 'Test User',
          avatar: undefined,
          role: 'member',
          isOnline: true
        },
        timestamp: new Date().toISOString(),
        reactions: [],
        attachments: [],
        room: 'general'
      }
    ],
    rooms: [
      {
        id: 'general',
        name: 'General Discussion',
        description: 'General community discussion',
        memberCount: 150,
        isPrivate: false,
        lastActivity: new Date().toISOString()
      }
    ]
  },

  // Notification responses
  notifications: [
    {
      id: '1',
      type: 'info',
      title: 'Test Notification',
      message: 'This is a test notification for API testing',
      timestamp: new Date().toISOString(),
      read: false,
      priority: 'normal',
      category: 'general'
    },
    {
      id: '2',
      type: 'success',
      title: 'Welcome!',
      message: 'Welcome to the Buddhist Community Platform',
      timestamp: new Date().toISOString(),
      read: true,
      priority: 'high',
      category: 'system'
    }
  ],

  // Error responses
  errors: {
    unauthorized: {
      message: 'Unauthorized access',
      code: 'UNAUTHORIZED',
      timestamp: new Date().toISOString()
    },
    forbidden: {
      message: 'Forbidden action',
      code: 'FORBIDDEN',
      timestamp: new Date().toISOString()
    },
    notFound: {
      message: 'Resource not found',
      code: 'NOT_FOUND',
      timestamp: new Date().toISOString()
    },
    validationError: {
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      errors: {
        email: 'Invalid email format',
        password: 'Password must be at least 6 characters'
      },
      timestamp: new Date().toISOString()
    },
    serverError: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
      timestamp: new Date().toISOString()
    }
  }
}

// HTTP status codes for testing
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const

// Mock API response builder
export const createMockResponse = <T>(
  data: T,
  status: number = HTTP_STATUS.OK,
  delay: number = 0
): Promise<Response> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const response = new Response(JSON.stringify(data), {
        status,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      resolve(response)
    }, delay)
  })
}

// Mock error response builder
export const createMockErrorResponse = (
  error: any,
  status: number = HTTP_STATUS.BAD_REQUEST,
  delay: number = 0
): Promise<Response> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const response = new Response(JSON.stringify(error), {
        status,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      resolve(response)
    }, delay)
  })
}

// API endpoint testing utilities
export const apiTestUtils = {
  /**
   * Mock fetch for API testing
   */
  mockFetch: (mockImplementation: (url: string, options?: RequestInit) => Promise<Response>) => {
    global.fetch = vi.fn().mockImplementation(mockImplementation)
    return global.fetch as ReturnType<typeof vi.fn>
  },

  /**
   * Create a mock fetch that returns success responses
   */
  mockSuccessfulFetch: (responseData: any, delay: number = 0) => {
    return apiTestUtils.mockFetch(() => createMockResponse(responseData, HTTP_STATUS.OK, delay))
  },

  /**
   * Create a mock fetch that returns error responses
   */
  mockFailedFetch: (error: any, status: number = HTTP_STATUS.BAD_REQUEST, delay: number = 0) => {
    return apiTestUtils.mockFetch(() => createMockErrorResponse(error, status, delay))
  },

  /**
   * Create a mock fetch that fails with network error
   */
  mockNetworkError: () => {
    return apiTestUtils.mockFetch(() => Promise.reject(new Error('Network Error')))
  },

  /**
   * Restore original fetch
   */
  restoreFetch: () => {
    vi.restoreAllMocks()
  }
}

// Authentication testing utilities
export const authTestUtils = {
  /**
   * Mock successful login
   */
  mockSuccessfulLogin: (delay: number = 100) => {
    return apiTestUtils.mockSuccessfulFetch(apiMockData.auth.loginSuccess, delay)
  },

  /**
   * Mock failed login
   */
  mockFailedLogin: (delay: number = 100) => {
    return apiTestUtils.mockFailedFetch(apiMockData.auth.loginError, HTTP_STATUS.UNAUTHORIZED, delay)
  },

  /**
   * Mock successful registration
   */
  mockSuccessfulRegister: (delay: number = 100) => {
    return apiTestUtils.mockSuccessfulFetch(apiMockData.auth.registerSuccess, delay)
  },

  /**
   * Setup authenticated user session
   */
  setupAuthenticatedSession: () => {
    localStorage.setItem('demo_auth_token', 'mock-token-123')
    localStorage.setItem('demo_user', JSON.stringify(apiMockData.auth.loginSuccess.user))
  },

  /**
   * Clear authenticated session
   */
  clearAuthenticatedSession: () => {
    localStorage.removeItem('demo_auth_token')
    localStorage.removeItem('demo_user')
  }
}

// Community API testing utilities
export const communityTestUtils = {
  /**
   * Mock groups API response
   */
  mockGroupsApi: (delay: number = 100) => {
    return apiTestUtils.mockSuccessfulFetch(apiMockData.community.groups, delay)
  },

  /**
   * Mock events API response
   */
  mockEventsApi: (delay: number = 100) => {
    return apiTestUtils.mockSuccessfulFetch(apiMockData.community.events, delay)
  },

  /**
   * Mock members API response
   */
  mockMembersApi: (delay: number = 100) => {
    return apiTestUtils.mockSuccessfulFetch(apiMockData.community.members, delay)
  },

  /**
   * Mock join group API
   */
  mockJoinGroup: (success: boolean = true, delay: number = 100) => {
    if (success) {
      return apiTestUtils.mockSuccessfulFetch({ message: 'Successfully joined group' }, delay)
    } else {
      return apiTestUtils.mockFailedFetch(
        { message: 'Failed to join group' },
        HTTP_STATUS.BAD_REQUEST,
        delay
      )
    }
  },

  /**
   * Mock RSVP event API
   */
  mockRsvpEvent: (success: boolean = true, delay: number = 100) => {
    if (success) {
      return apiTestUtils.mockSuccessfulFetch({ message: 'RSVP successful' }, delay)
    } else {
      return apiTestUtils.mockFailedFetch(
        { message: 'RSVP failed' },
        HTTP_STATUS.BAD_REQUEST,
        delay
      )
    }
  }
}

// Chat API testing utilities
export const chatTestUtils = {
  /**
   * Mock chat messages API
   */
  mockMessagesApi: (delay: number = 100) => {
    return apiTestUtils.mockSuccessfulFetch(apiMockData.chat.messages, delay)
  },

  /**
   * Mock send message API
   */
  mockSendMessage: (success: boolean = true, delay: number = 100) => {
    if (success) {
      const newMessage = {
        ...apiMockData.chat.messages[0],
        id: Date.now().toString(),
        content: 'New test message',
        timestamp: new Date().toISOString()
      }
      return apiTestUtils.mockSuccessfulFetch(newMessage, delay)
    } else {
      return apiTestUtils.mockFailedFetch(
        { message: 'Failed to send message' },
        HTTP_STATUS.BAD_REQUEST,
        delay
      )
    }
  },

  /**
   * Mock WebSocket connection for chat
   */
  mockWebSocketConnection: () => {
    const mockSocket = {
      readyState: WebSocket.OPEN,
      send: vi.fn(),
      close: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }
    return mockSocket
  }
}

// Notification API testing utilities
export const notificationTestUtils = {
  /**
   * Mock notifications API
   */
  mockNotificationsApi: (delay: number = 100) => {
    return apiTestUtils.mockSuccessfulFetch(apiMockData.notifications, delay)
  },

  /**
   * Mock mark notification read API
   */
  mockMarkAsRead: (success: boolean = true, delay: number = 100) => {
    if (success) {
      return apiTestUtils.mockSuccessfulFetch({ message: 'Marked as read' }, delay)
    } else {
      return apiTestUtils.mockFailedFetch(
        { message: 'Failed to mark as read' },
        HTTP_STATUS.BAD_REQUEST,
        delay
      )
    }
  }
}

// Validation testing utilities
export const validationTestUtils = {
  /**
   * Test required field validation
   */
  testRequiredFields: (fields: string[]) => {
    const errors: Record<string, string> = {}
    fields.forEach(field => {
      errors[field] = `${field} is required`
    })
    return apiTestUtils.mockFailedFetch(
      { ...apiMockData.errors.validationError, errors },
      HTTP_STATUS.UNPROCESSABLE_ENTITY
    )
  },

  /**
   * Test email format validation
   */
  testEmailValidation: () => {
    return apiTestUtils.mockFailedFetch(
      {
        ...apiMockData.errors.validationError,
        errors: { email: 'Invalid email format' }
      },
      HTTP_STATUS.UNPROCESSABLE_ENTITY
    )
  },

  /**
   * Test password strength validation
   */
  testPasswordValidation: () => {
    return apiTestUtils.mockFailedFetch(
      {
        ...apiMockData.errors.validationError,
        errors: { password: 'Password must be at least 6 characters' }
      },
      HTTP_STATUS.UNPROCESSABLE_ENTITY
    )
  }
}

// Performance testing utilities
export const performanceTestUtils = {
  /**
   * Test API response times
   */
  measureApiResponse: async (apiCall: () => Promise<any>) => {
    const start = performance.now()
    await apiCall()
    const end = performance.now()
    return end - start
  },

  /**
   * Test API under load
   */
  loadTest: async (apiCall: () => Promise<any>, concurrency: number = 10) => {
    const promises = Array(concurrency).fill(null).map(() => apiCall())
    const results = await Promise.allSettled(promises)
    
    return {
      successful: results.filter(r => r.status === 'fulfilled').length,
      failed: results.filter(r => r.status === 'rejected').length,
      total: results.length
    }
  },

  /**
   * Test timeout handling
   */
  testTimeout: (delay: number = 5000) => {
    return apiTestUtils.mockFetch(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(createMockResponse({ message: 'Slow response' }))
        }, delay)
      })
    })
  }
}

// Error handling testing utilities  
export const errorTestUtils = {
  /**
   * Test different HTTP error codes
   */
  testErrorCodes: {
    badRequest: () => apiTestUtils.mockFailedFetch(apiMockData.errors.validationError, HTTP_STATUS.BAD_REQUEST),
    unauthorized: () => apiTestUtils.mockFailedFetch(apiMockData.errors.unauthorized, HTTP_STATUS.UNAUTHORIZED),
    forbidden: () => apiTestUtils.mockFailedFetch(apiMockData.errors.forbidden, HTTP_STATUS.FORBIDDEN),
    notFound: () => apiTestUtils.mockFailedFetch(apiMockData.errors.notFound, HTTP_STATUS.NOT_FOUND),
    serverError: () => apiTestUtils.mockFailedFetch(apiMockData.errors.serverError, HTTP_STATUS.INTERNAL_SERVER_ERROR)
  },

  /**
   * Test retry logic
   */
  testRetryLogic: (failureCount: number = 2) => {
    let attempts = 0
    return apiTestUtils.mockFetch(() => {
      attempts++
      if (attempts <= failureCount) {
        return createMockErrorResponse(apiMockData.errors.serverError, HTTP_STATUS.INTERNAL_SERVER_ERROR)
      }
      return createMockResponse({ message: 'Success after retries' })
    })
  },

  /**
   * Test network failures
   */
  testNetworkFailure: () => {
    return apiTestUtils.mockNetworkError()
  }
}

// Cleanup utilities
export const cleanupTestUtils = {
  /**
   * Reset all API mocks
   */
  resetAllMocks: () => {
    vi.clearAllMocks()
    apiTestUtils.restoreFetch()
    authTestUtils.clearAuthenticatedSession()
  }
}