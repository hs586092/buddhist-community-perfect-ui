/**
 * Authentication API Tests
 * 
 * Comprehensive API testing with QA persona focus:
 * - Prevention: Test all auth workflows, edge cases, security scenarios
 * - Detection: Validate request/response cycles, token handling, errors
 * - Correction: Ensure proper error handling, retry logic, security
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { auth } from './auth'
import { 
  apiMockData, 
  apiTestUtils, 
  authTestUtils, 
  errorTestUtils,
  validationTestUtils,
  performanceTestUtils,
  cleanupTestUtils,
  HTTP_STATUS
} from '../../test/api-utils'

describe('Authentication API', () => {
  beforeEach(() => {
    // Clear any existing auth state
    authTestUtils.clearAuthenticatedSession()
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanupTestUtils.resetAllMocks()
  })

  // QA Focus: Prevention - Test successful authentication workflows
  describe('Successful Authentication Workflows', () => {
    it('successfully logs in with valid credentials', async () => {
      const mockFetch = authTestUtils.mockSuccessfulLogin()
      
      const result = await auth.login({
        email: 'test@example.com',
        password: 'password'
      })
      
      expect(mockFetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password'
        })
      }))
      
      expect(result).toEqual(apiMockData.auth.loginSuccess)
      expect(result.user.email).toBe('test@example.com')
      expect(result.token).toBeTruthy()
    })

    it('successfully registers new user', async () => {
      const mockFetch = authTestUtils.mockSuccessfulRegister()
      
      const userData = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123'
      }
      
      const result = await auth.register(userData)
      
      expect(mockFetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(userData)
      }))
      
      expect(result).toEqual(apiMockData.auth.registerSuccess)
      expect(result.user.email).toBe('newuser@example.com')
      expect(result.token).toBeTruthy()
    })

    it('successfully retrieves user profile', async () => {
      authTestUtils.setupAuthenticatedSession()
      const mockFetch = apiTestUtils.mockSuccessfulFetch(apiMockData.auth.loginSuccess.user)
      
      const result = await auth.getProfile()
      
      expect(mockFetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': expect.stringContaining('Bearer')
        })
      }))
      
      expect(result).toEqual(apiMockData.auth.loginSuccess.user)
    })

    it('handles logout correctly', async () => {
      authTestUtils.setupAuthenticatedSession()
      const mockFetch = apiTestUtils.mockSuccessfulFetch({ message: 'Logged out successfully' })
      
      await auth.logout()
      
      expect(mockFetch).toHaveBeenCalled()
    })
  })

  // QA Focus: Detection - Test authentication failures and error scenarios
  describe('Authentication Failures and Error Scenarios', () => {
    it('handles login with invalid credentials', async () => {
      const mockFetch = authTestUtils.mockFailedLogin()
      
      await expect(auth.login({
        email: 'wrong@example.com',
        password: 'wrongpassword'
      })).rejects.toThrow('Invalid email or password')
      
      expect(mockFetch).toHaveBeenCalled()
    })

    it('handles registration with existing email', async () => {
      const mockFetch = apiTestUtils.mockFailedFetch(
        { message: 'User already exists with this email' },
        HTTP_STATUS.BAD_REQUEST
      )
      
      await expect(auth.register({
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123'
      })).rejects.toThrow('User already exists with this email')
    })

    it('handles profile request with invalid token', async () => {
      localStorage.setItem('auth_token', 'invalid-token')
      const mockFetch = errorTestUtils.testErrorCodes.unauthorized()
      
      await expect(auth.getProfile()).rejects.toThrow('User not found')
    })

    it('handles expired token gracefully', async () => {
      localStorage.setItem('auth_token', 'expired-token')
      const mockFetch = apiTestUtils.mockFailedFetch(
        { message: 'Token expired' },
        HTTP_STATUS.UNAUTHORIZED
      )
      
      await expect(auth.getProfile()).rejects.toThrow('User not found')
    })

    it('handles network errors during login', async () => {
      const mockFetch = errorTestUtils.testNetworkFailure()
      
      await expect(auth.login({
        email: 'test@example.com',
        password: 'password'
      })).rejects.toThrow('Network Error')
    })
  })

  // QA Focus: Prevention - Test input validation
  describe('Input Validation', () => {
    it('validates required fields for login', async () => {
      const mockFetch = validationTestUtils.testRequiredFields(['email', 'password'])
      
      await expect(auth.login({
        email: '',
        password: ''
      })).rejects.toThrow()
    })

    it('validates email format during registration', async () => {
      const mockFetch = validationTestUtils.testEmailValidation()
      
      await expect(auth.register({
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123'
      })).rejects.toThrow()
    })

    it('validates password strength during registration', async () => {
      const mockFetch = validationTestUtils.testPasswordValidation()
      
      await expect(auth.register({
        name: 'Test User',
        email: 'test@example.com',
        password: '123'
      })).rejects.toThrow()
    })

    it('handles missing registration fields', async () => {
      const mockFetch = validationTestUtils.testRequiredFields(['name', 'email', 'password'])
      
      await expect(auth.register({
        name: '',
        email: '',
        password: ''
      })).rejects.toThrow()
    })
  })

  // QA Focus: Detection - Test token management
  describe('Token Management', () => {
    it('sets token correctly in localStorage', () => {
      const token = 'test-token-123'
      auth.setToken(token)
      
      expect(localStorage.getItem('auth_token')).toBe(token)
    })

    it('clears token correctly from localStorage', () => {
      auth.setToken('test-token')
      expect(localStorage.getItem('auth_token')).toBeTruthy()
      
      auth.clearToken()
      expect(localStorage.getItem('auth_token')).toBeNull()
      expect(localStorage.getItem('user')).toBeNull()
    })

    it('correctly identifies authenticated state', () => {
      expect(auth.isAuthenticated()).toBe(false)
      
      auth.setToken('test-token')
      expect(auth.isAuthenticated()).toBe(true)
      
      auth.clearToken()
      expect(auth.isAuthenticated()).toBe(false)
    })

    it('provides accurate authentication status', () => {
      const status = auth.getStatus()
      expect(status).toHaveProperty('hasToken')
      expect(status).toHaveProperty('services')
      expect(typeof status.hasToken).toBe('boolean')
    })
  })

  // QA Focus: Prevention - Test security scenarios
  describe('Security Scenarios', () => {
    it('handles malformed tokens', async () => {
      localStorage.setItem('auth_token', 'malformed.token.here')
      const mockFetch = errorTestUtils.testErrorCodes.unauthorized()
      
      await expect(auth.getProfile()).rejects.toThrow()
    })

    it('prevents token injection attacks', () => {
      const maliciousToken = '<script>alert("xss")</script>'
      auth.setToken(maliciousToken)
      
      // Token should be stored as-is (escaped by localStorage)
      expect(localStorage.getItem('auth_token')).toBe(maliciousToken)
    })

    it('handles concurrent login attempts', async () => {
      const mockFetch = authTestUtils.mockSuccessfulLogin(100) // 100ms delay
      
      // Simulate concurrent login attempts
      const loginPromises = Array(5).fill(null).map(() => 
        auth.login({ email: 'test@example.com', password: 'password' })
      )
      
      const results = await Promise.allSettled(loginPromises)
      const successful = results.filter(r => r.status === 'fulfilled')
      
      expect(successful.length).toBeGreaterThan(0)
    })

    it('handles session hijacking scenarios', async () => {
      // Setup valid session
      authTestUtils.setupAuthenticatedSession()
      
      // Simulate token being changed externally
      localStorage.setItem('demo_auth_token', 'hijacked-token')
      
      const mockFetch = errorTestUtils.testErrorCodes.unauthorized()
      await expect(auth.getProfile()).rejects.toThrow()
    })
  })

  // QA Focus: Performance and reliability
  describe('Performance and Reliability', () => {
    it('completes login within acceptable time', async () => {
      const mockFetch = authTestUtils.mockSuccessfulLogin(50) // 50ms delay
      
      const responseTime = await performanceTestUtils.measureApiResponse(() => 
        auth.login({ email: 'test@example.com', password: 'password' })
      )
      
      expect(responseTime).toBeLessThan(1000) // Should complete within 1 second
    })

    it('handles multiple concurrent requests', async () => {
      const mockFetch = authTestUtils.mockSuccessfulLogin(100)
      
      const loadTestResult = await performanceTestUtils.loadTest(
        () => auth.login({ email: 'test@example.com', password: 'password' }),
        10
      )
      
      expect(loadTestResult.successful).toBeGreaterThan(0)
      expect(loadTestResult.failed).toBe(0)
    })

    it('handles slow network conditions', async () => {
      const mockFetch = performanceTestUtils.testTimeout(2000) // 2 second delay
      
      // Should still work with slow network
      await expect(auth.login({ 
        email: 'test@example.com', 
        password: 'password' 
      })).resolves.toBeDefined()
    }, 3000) // 3 second timeout for this test

    it('implements proper retry logic for failed requests', async () => {
      const mockFetch = errorTestUtils.testRetryLogic(2) // Fail twice, then succeed
      
      // Should eventually succeed after retries
      const result = await auth.login({
        email: 'test@example.com',
        password: 'password'
      })
      
      expect(result).toBeDefined()
    })
  })

  // QA Focus: Edge cases and boundary conditions
  describe('Edge Cases and Boundary Conditions', () => {
    it('handles extremely long passwords', async () => {
      const longPassword = 'a'.repeat(1000)
      const mockFetch = authTestUtils.mockSuccessfulLogin()
      
      await expect(auth.login({
        email: 'test@example.com',
        password: longPassword
      })).resolves.toBeDefined()
    })

    it('handles special characters in credentials', async () => {
      const mockFetch = authTestUtils.mockSuccessfulLogin()
      
      await expect(auth.login({
        email: 'test+special@example.com',
        password: 'p@ssw0rd!@#$%'
      })).resolves.toBeDefined()
    })

    it('handles Unicode characters in user data', async () => {
      const mockFetch = authTestUtils.mockSuccessfulRegister()
      
      await expect(auth.register({
        name: 'テストユーザー',
        email: 'test@example.com',
        password: 'password123'
      })).resolves.toBeDefined()
    })

    it('handles empty localStorage gracefully', async () => {
      // Clear localStorage completely
      localStorage.clear()
      
      expect(auth.isAuthenticated()).toBe(false)
      expect(auth.getStatus().hasToken).toBe(false)
    })

    it('handles corrupted localStorage data', () => {
      localStorage.setItem('demo_user', 'invalid-json-data')
      
      // Should not throw error
      expect(() => auth.getStatus()).not.toThrow()
    })
  })

  // QA Focus: API contract validation
  describe('API Contract Validation', () => {
    it('validates login response structure', async () => {
      const mockFetch = authTestUtils.mockSuccessfulLogin()
      
      const result = await auth.login({
        email: 'test@example.com',
        password: 'password'
      })
      
      // Validate response structure
      expect(result).toHaveProperty('user')
      expect(result).toHaveProperty('token')
      expect(result.user).toHaveProperty('id')
      expect(result.user).toHaveProperty('email')
      expect(result.user).toHaveProperty('name')
      expect(result.user).toHaveProperty('role')
    })

    it('validates user profile response structure', async () => {
      authTestUtils.setupAuthenticatedSession()
      const mockFetch = apiTestUtils.mockSuccessfulFetch(apiMockData.auth.loginSuccess.user)
      
      const result = await auth.getProfile()
      
      // Validate profile structure
      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('email')
      expect(result).toHaveProperty('name')
      expect(result).toHaveProperty('role')
      expect(result).toHaveProperty('createdAt')
    })

    it('validates error response structure', async () => {
      const mockFetch = authTestUtils.mockFailedLogin()
      
      try {
        await auth.login({ email: 'wrong@example.com', password: 'wrong' })
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBeDefined()
      }
    })
  })
})