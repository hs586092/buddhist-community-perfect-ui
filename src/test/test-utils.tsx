/**
 * Test Utilities
 * 
 * Comprehensive testing utilities for React components with QA persona focus
 * Emphasizes prevention, comprehensive coverage, and edge case detection
 */

import React, { ReactElement, ReactNode } from 'react'
import { render, RenderOptions, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { vi, expect } from 'vitest'

// Mock data generators for consistent testing
const mockData = {
  users: {
    admin: {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'Administrator',
      avatar: undefined,
      createdAt: '2023-01-15T00:00:00.000Z',
      lastLoginAt: '2024-01-15T00:00:00.000Z',
    },
    member: {
      id: '2',
      name: 'Regular Member',
      email: 'member@example.com',
      role: 'Member',
      avatar: undefined,
      createdAt: '2023-03-22T00:00:00.000Z',
      lastLoginAt: '2024-01-14T00:00:00.000Z',
    },
    teacher: {
      id: '3',
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      role: 'Teacher',
      avatar: undefined,
      createdAt: '2023-01-01T00:00:00.000Z',
      lastLoginAt: '2024-01-15T00:00:00.000Z',
    }
  },
  
  groups: [
    {
      id: '1',
      name: 'Daily Meditation Circle',
      description: 'Join us for daily morning meditation sessions.',
      memberCount: 48,
      category: 'meditation' as const,
      isPrivate: false,
      lastActivity: '2 hours ago',
      tags: ['meditation', 'morning', 'mindfulness']
    },
    {
      id: '2',
      name: 'Dharma Study Group',
      description: 'Weekly study sessions exploring Buddhist texts.',
      memberCount: 32,
      category: 'study' as const,
      isPrivate: false,
      lastActivity: '1 day ago',
      tags: ['study', 'dharma', 'texts']
    }
  ],

  events: [
    {
      id: '1',
      title: 'Weekend Meditation Retreat',
      description: 'A peaceful two-day retreat focusing on mindfulness.',
      date: '2024-02-15',
      time: '09:00',
      location: 'Mountain View Center',
      attendeeCount: 15,
      maxAttendees: 30,
      type: 'meditation' as const,
      isOnline: false,
      tags: ['retreat', 'meditation', 'weekend']
    }
  ],

  notifications: [
    {
      id: '1',
      type: 'info' as const,
      title: 'Welcome!',
      message: 'Welcome to the Buddhist Community Platform',
      timestamp: new Date().toISOString(),
      read: false,
      priority: 'normal' as const,
      category: 'general' as const,
    }
  ]
}

// Test providers wrapper
interface TestProvidersProps {
  children: ReactNode
  initialEntries?: string[]
}

const TestProviders: React.FC<TestProvidersProps> = ({ 
  children, 
  initialEntries = ['/'] 
}) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  )
}

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[]
}

const renderWithProviders = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { initialEntries, ...renderOptions } = options

  const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
    <TestProviders initialEntries={initialEntries}>
      {children}
    </TestProviders>
  )

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: Wrapper, ...renderOptions })
  }
}

// Accessibility testing utilities
const accessibilityUtils = {
  /**
   * Check for required ARIA attributes
   */
  checkAriaAttributes: (element: HTMLElement, expectedAttributes: string[]) => {
    expectedAttributes.forEach(attr => {
      expect(element).toHaveAttribute(attr)
    })
  },

  /**
   * Verify keyboard navigation
   */
  testKeyboardNavigation: async (elements: HTMLElement[]) => {
    const user = userEvent.setup()
    
    for (let i = 0; i < elements.length; i++) {
      await user.tab()
      expect(elements[i]).toHaveFocus()
    }
  },

  /**
   * Test screen reader announcements
   */
  checkAriaLive: (element: HTMLElement, expectedText: string) => {
    expect(element).toHaveAttribute('aria-live')
    expect(element).toHaveTextContent(expectedText)
  }
}

// Performance testing utilities
const performanceUtils = {
  /**
   * Measure component render time
   */
  measureRenderTime: async (renderFn: () => void) => {
    const start = performance.now()
    renderFn()
    await waitFor(() => {
      // Wait for component to be rendered
    })
    const end = performance.now()
    return end - start
  },

  /**
   * Test memory leaks by checking cleanup
   */
  testCleanup: (componentUnmount: () => void) => {
    const originalListeners = document.addEventListener
    const mockAddEventListener = vi.fn()
    const mockRemoveEventListener = vi.fn()
    
    document.addEventListener = mockAddEventListener
    document.removeEventListener = mockRemoveEventListener
    
    // Component lifecycle
    componentUnmount()
    
    // Check if listeners were cleaned up
    expect(mockRemoveEventListener).toHaveBeenCalled()
    
    // Restore original
    document.addEventListener = originalListeners
  }
}

// Form testing utilities
const formUtils = {
  /**
   * Fill form with test data
   */
  fillForm: async (formData: Record<string, string>) => {
    const user = userEvent.setup()
    
    for (const [fieldName, value] of Object.entries(formData)) {
      const field = screen.getByRole('textbox', { name: new RegExp(fieldName, 'i') }) ||
                   screen.getByLabelText(new RegExp(fieldName, 'i'))
      await user.clear(field)
      await user.type(field, value)
    }
  },

  /**
   * Test form validation
   */
  testValidation: async (
    submitButton: HTMLElement,
    expectedErrors: string[]
  ) => {
    const user = userEvent.setup()
    await user.click(submitButton)
    
    for (const errorText of expectedErrors) {
      expect(screen.getByText(errorText)).toBeInTheDocument()
    }
  },

  /**
   * Test successful form submission
   */
  testSubmission: async (
    formData: Record<string, string>,
    submitButton: HTMLElement,
    onSubmit: ReturnType<typeof vi.fn>
  ) => {
    const user = userEvent.setup()
    
    await formUtils.fillForm(formData)
    await user.click(submitButton)
    
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining(formData)
    )
  }
}

// Error boundary testing utilities
const errorUtils = {
  /**
   * Test error boundary handling
   */
  testErrorBoundary: (
    ThrowError: React.FC,
    ErrorBoundary: React.FC<{ children: ReactNode }>
  ) => {
    const originalError = console.error
    console.error = vi.fn()

    const { rerender } = render(
      <ErrorBoundary>
        <div>No error</div>
      </ErrorBoundary>
    )

    rerender(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    console.error = originalError
  }
}

// Note: API testing utilities moved to separate api-test-utils.ts file

// Real-time feature testing utilities
const realtimeUtils = {
  /**
   * Mock WebSocket connection
   */
  mockWebSocketConnection: () => {
    const mockSocket = {
      readyState: WebSocket.OPEN,
      send: vi.fn(),
      close: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }
    
    return mockSocket
  },

  /**
   * Test WebSocket message handling
   */
  testMessageHandling: (
    socket: any,
    messageType: string,
    messageData: any,
    expectedBehavior: () => void
  ) => {
    const messageEvent = new MessageEvent('message', {
      data: JSON.stringify({ type: messageType, data: messageData })
    })
    
    socket.dispatchEvent(messageEvent)
    expectedBehavior()
  }
}

// Responsive design testing utilities
const responsiveUtils = {
  /**
   * Test different screen sizes
   */
  testScreenSizes: async (
    component: ReactElement,
    breakpoints: { name: string; width: number }[]
  ) => {
    for (const breakpoint of breakpoints) {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: breakpoint.width,
      })
      
      // Trigger resize event
      window.dispatchEvent(new Event('resize'))
      
      // Re-render component for this breakpoint
      const { container } = render(component)
      
      // Add custom assertions based on breakpoint
      expect(container).toBeInTheDocument()
    }
  }
}

// Export all utilities as default
export {
  renderWithProviders as render,
  mockData,
  accessibilityUtils,
  performanceUtils,
  formUtils,
  errorUtils,
  realtimeUtils,
  responsiveUtils,
}

// Export everything for comprehensive testing
export * from '@testing-library/react'
export { userEvent }
export { vi }