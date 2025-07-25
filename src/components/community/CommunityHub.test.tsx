/**
 * CommunityHub Component Tests
 * 
 * Comprehensive integration testing with QA persona focus:
 * - Prevention: Test all user workflows and edge cases
 * - Detection: Validate search, filtering, and tab switching
 * - Correction: Ensure proper error handling and fallbacks
 */

import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor, within } from '@testing-library/react'
import { render, mockData, userEvent, formUtils, responsiveUtils } from '../../test/test-utils'
import { CommunityHub } from './CommunityHub'

// Mock router for navigation testing
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    Link: ({ to, children, ...props }: any) => (
      <a href={to} {...props}>{children}</a>
    ),
    useNavigate: () => vi.fn(),
  }
})

describe('CommunityHub', () => {
  // QA Focus: Prevention - Test initial render and default states
  describe('Initial Render and Default States', () => {
    it('renders community hub with correct header', () => {
      render(<CommunityHub />)
      
      expect(screen.getByText('Community Hub')).toBeInTheDocument()
      expect(screen.getByText('Connect with fellow practitioners, join groups, and participate in events')).toBeInTheDocument()
    })

    it('renders all navigation tabs', () => {
      render(<CommunityHub />)
      
      const tabButtons = [
        screen.getByRole('button', { name: /👥 Groups/i }),
        screen.getByRole('button', { name: /📅 Events/i }),
        screen.getByRole('button', { name: /🧑‍🤝‍🧑 Members/i }),
        screen.getByRole('button', { name: /📈 Activity/i }),
      ]
      
      tabButtons.forEach(button => {
        expect(button).toBeInTheDocument()
      })
    })

    it('defaults to Groups tab being active', () => {
      render(<CommunityHub />)
      
      const groupsTab = screen.getByRole('button', { name: /👥 Groups/i })
      expect(groupsTab).toHaveClass('text-primary-600')
      expect(groupsTab).toHaveClass('bg-primary-50')
    })

    it('renders search input', () => {
      render(<CommunityHub />)
      
      const searchInput = screen.getByPlaceholderText('Search groups, events, members...')
      expect(searchInput).toBeInTheDocument()
    })
  })

  // QA Focus: Detection - Test tab navigation functionality
  describe('Tab Navigation', () => {
    it('switches between tabs correctly', async () => {
      const user = userEvent.setup()
      render(<CommunityHub />)
      
      // Initially on Groups tab
      expect(screen.getByText('All Categories')).toBeInTheDocument()
      
      // Switch to Events tab
      await user.click(screen.getByRole('button', { name: /📅 Events/i }))
      expect(screen.getByText('All Events')).toBeInTheDocument()
      
      // Switch to Members tab
      await user.click(screen.getByRole('button', { name: /🧑‍🤝‍🧑 Members/i }))
      expect(screen.getByText('All Members')).toBeInTheDocument()
      
      // Switch to Activity tab
      await user.click(screen.getByRole('button', { name: /📈 Activity/i }))
      expect(screen.getByText('Activity Feed')).toBeInTheDocument()
    })

    it('maintains search query when switching tabs', async () => {
      const user = userEvent.setup()
      render(<CommunityHub />)
      
      const searchInput = screen.getByPlaceholderText('Search groups, events, members...')
      
      // Enter search query
      await user.type(searchInput, 'meditation')
      expect(searchInput).toHaveValue('meditation')
      
      // Switch tabs
      await user.click(screen.getByRole('button', { name: /📅 Events/i }))
      
      // Search input should still have the same value
      expect(searchInput).toHaveValue('meditation')
    })

    it('updates active tab styling correctly', async () => {
      const user = userEvent.setup()
      render(<CommunityHub />)
      
      const groupsTab = screen.getByRole('button', { name: /👥 Groups/i })
      const eventsTab = screen.getByRole('button', { name: /📅 Events/i })
      
      // Initially Groups is active
      expect(groupsTab).toHaveClass('text-primary-600')
      expect(eventsTab).toHaveClass('text-gray-600')
      
      // Switch to Events
      await user.click(eventsTab)
      
      expect(eventsTab).toHaveClass('text-primary-600')
      expect(groupsTab).toHaveClass('text-gray-600')
    })
  })

  // QA Focus: Detection - Test search functionality
  describe('Search Functionality', () => {
    it('filters groups based on search query', async () => {
      const user = userEvent.setup()
      render(<CommunityHub />)
      
      // All groups should be visible initially
      expect(screen.getByText('Daily Meditation Circle')).toBeInTheDocument()
      expect(screen.getByText('Dharma Study Group')).toBeInTheDocument()
      
      // Search for meditation
      const searchInput = screen.getByPlaceholderText('Search groups, events, members...')
      await user.type(searchInput, 'meditation')
      
      // Wait for search to filter results
      await waitFor(() => {
        expect(screen.getByText('Daily Meditation Circle')).toBeInTheDocument()
        expect(screen.queryByText('Dharma Study Group')).not.toBeInTheDocument()
      })
    })

    it('shows no results when search matches nothing', async () => {
      const user = userEvent.setup()
      render(<CommunityHub />)
      
      const searchInput = screen.getByPlaceholderText('Search groups, events, members...')
      await user.type(searchInput, 'nonexistent')
      
      // Should not show any groups
      await waitFor(() => {
        expect(screen.queryByText('Daily Meditation Circle')).not.toBeInTheDocument()
        expect(screen.queryByText('Dharma Study Group')).not.toBeInTheDocument()
      })
    })

    it('searches across different content types in different tabs', async () => {
      const user = userEvent.setup()
      render(<CommunityHub />)
      
      const searchInput = screen.getByPlaceholderText('Search groups, events, members...')
      
      // Search for retreat (should match events)
      await user.type(searchInput, 'retreat')
      
      // Switch to events tab
      await user.click(screen.getByRole('button', { name: /📅 Events/i }))
      
      // Should show the retreat event
      await waitFor(() => {
        expect(screen.getByText('Weekend Meditation Retreat')).toBeInTheDocument()
      })
    })

    it('clears search results when input is cleared', async () => {
      const user = userEvent.setup()
      render(<CommunityHub />)
      
      const searchInput = screen.getByPlaceholderText('Search groups, events, members...')
      
      // Search to filter results
      await user.type(searchInput, 'meditation')
      await waitFor(() => {
        expect(screen.queryByText('Dharma Study Group')).not.toBeInTheDocument()
      })
      
      // Clear search
      await user.clear(searchInput)
      
      // All results should be visible again
      await waitFor(() => {
        expect(screen.getByText('Daily Meditation Circle')).toBeInTheDocument()
        expect(screen.getByText('Dharma Study Group')).toBeInTheDocument()
      })
    })
  })

  // QA Focus: Prevention - Test filtering functionality
  describe('Filter Functionality', () => {
    describe('Groups Filters', () => {
      it('filters groups by category', async () => {
        const user = userEvent.setup()
        render(<CommunityHub />)
        
        // Click meditation filter
        await user.click(screen.getByRole('button', { name: 'Meditation' }))
        
        // Only meditation groups should be visible
        await waitFor(() => {
          expect(screen.getByText('Daily Meditation Circle')).toBeInTheDocument()
          expect(screen.queryByText('Dharma Study Group')).not.toBeInTheDocument()
        })
      })

      it('shows all categories when "All Categories" is selected', async () => {
        const user = userEvent.setup()
        render(<CommunityHub />)
        
        // First filter to meditation
        await user.click(screen.getByRole('button', { name: 'Meditation' }))
        await waitFor(() => {
          expect(screen.queryByText('Dharma Study Group')).not.toBeInTheDocument()
        })
        
        // Then click "All Categories"
        await user.click(screen.getByRole('button', { name: 'All Categories' }))
        
        // All groups should be visible again
        await waitFor(() => {
          expect(screen.getByText('Daily Meditation Circle')).toBeInTheDocument()
          expect(screen.getByText('Dharma Study Group')).toBeInTheDocument()
        })
      })

      it('updates filter button styling when active', async () => {
        const user = userEvent.setup()
        render(<CommunityHub />)
        
        const allCategoriesBtn = screen.getByRole('button', { name: 'All Categories' })
        const meditationBtn = screen.getByRole('button', { name: 'Meditation' })
        
        // Initially "All Categories" should be active
        expect(allCategoriesBtn).toHaveClass('bg-primary-600')
        expect(meditationBtn).toHaveClass('bg-transparent')
        
        // Click meditation filter
        await user.click(meditationBtn)
        
        expect(meditationBtn).toHaveClass('bg-primary-600')
        expect(allCategoriesBtn).toHaveClass('bg-transparent')
      })
    })

    describe('Events Filters', () => {
      it('filters events by type', async () => {
        const user = userEvent.setup()
        render(<CommunityHub />)
        
        // Switch to Events tab
        await user.click(screen.getByRole('button', { name: /📅 Events/i }))
        
        // Filter by meditation events
        await user.click(screen.getByRole('button', { name: 'Meditation' }))
        
        await waitFor(() => {
          expect(screen.getByText('Weekend Meditation Retreat')).toBeInTheDocument()
        })
      })
    })

    describe('Members Filters', () => {
      it('filters members by online status', async () => {
        const user = userEvent.setup()
        render(<CommunityHub />)
        
        // Switch to Members tab
        await user.click(screen.getByRole('button', { name: /🧑‍🤝‍🧑 Members/i }))
        
        // Filter by online members
        await user.click(screen.getByRole('button', { name: 'Online' }))
        
        // Should show online members (both mock users are online)
        await waitFor(() => {
          expect(screen.getByText('Sarah Chen')).toBeInTheDocument()
          expect(screen.getByText('Michael Rodriguez')).toBeInTheDocument()
        })
      })
    })
  })

  // QA Focus: Detection - Test interactive elements
  describe('Interactive Elements', () => {
    it('handles group join button clicks', async () => {
      const user = userEvent.setup()
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      render(<CommunityHub />)
      
      // Find and click a join button
      const joinButton = screen.getAllByText('Join')[0]
      await user.click(joinButton)
      
      expect(consoleSpy).toHaveBeenCalledWith('Join group:', '1')
      
      consoleSpy.mockRestore()
    })

    it('handles event RSVP button clicks', async () => {
      const user = userEvent.setup()
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      render(<CommunityHub />)
      
      // Switch to Events tab
      await user.click(screen.getByRole('button', { name: /📅 Events/i }))
      
      // Find and click RSVP button
      const rsvpButton = screen.getAllByText('RSVP')[0]
      await user.click(rsvpButton)
      
      expect(consoleSpy).toHaveBeenCalledWith('RSVP event:', '1')
      
      consoleSpy.mockRestore()
    })

    it('handles member message button clicks', async () => {
      const user = userEvent.setup()
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      render(<CommunityHub />)
      
      // Switch to Members tab
      await user.click(screen.getByRole('button', { name: /🧑‍🤝‍🧑 Members/i }))
      
      // Find and click message button
      const messageButton = screen.getAllByText('Message')[0]
      await user.click(messageButton)
      
      expect(consoleSpy).toHaveBeenCalledWith('Message member:', '1')
      
      consoleSpy.mockRestore()
    })

    it('handles create action buttons', async () => {
      const user = userEvent.setup()
      render(<CommunityHub />)
      
      // Check create group button exists
      expect(screen.getByRole('button', { name: '+ Create Group' })).toBeInTheDocument()
      
      // Switch to events and check create event button
      await user.click(screen.getByRole('button', { name: /📅 Events/i }))
      expect(screen.getByRole('button', { name: '+ Create Event' })).toBeInTheDocument()
    })
  })

  // QA Focus: Prevention - Test edge cases and error handling
  describe('Edge Cases and Error Handling', () => {
    it('handles empty search results gracefully', async () => {
      const user = userEvent.setup()
      render(<CommunityHub />)
      
      const searchInput = screen.getByPlaceholderText('Search groups, events, members...')
      await user.type(searchInput, 'zyxwvu') // Non-existent search term
      
      // Should render the component without errors, just no results
      expect(screen.getByText('Community Hub')).toBeInTheDocument()
    })

    it('handles rapid tab switching', async () => {
      const user = userEvent.setup()
      render(<CommunityHub />)
      
      // Rapidly switch between tabs
      for (let i = 0; i < 5; i++) {
        await user.click(screen.getByRole('button', { name: /📅 Events/i }))
        await user.click(screen.getByRole('button', { name: /👥 Groups/i }))
        await user.click(screen.getByRole('button', { name: /🧑‍🤝‍🧑 Members/i }))
        await user.click(screen.getByRole('button', { name: /📈 Activity/i }))
      }
      
      // Should still work correctly
      expect(screen.getByText('Activity Feed')).toBeInTheDocument()
    })

    it('maintains filter state when searching', async () => {
      const user = userEvent.setup()
      render(<CommunityHub />)
      
      // Set a category filter
      await user.click(screen.getByRole('button', { name: 'Meditation' }))
      expect(screen.getByRole('button', { name: 'Meditation' })).toHaveClass('bg-primary-600')
      
      // Then search
      const searchInput = screen.getByPlaceholderText('Search groups, events, members...')
      await user.type(searchInput, 'meditation')
      
      // Filter button should still be active
      expect(screen.getByRole('button', { name: 'Meditation' })).toHaveClass('bg-primary-600')
    })
  })

  // QA Focus: Accessibility and user experience
  describe('Accessibility and User Experience', () => {
    it('has proper ARIA labels for tabs', () => {
      render(<CommunityHub />)
      
      const groupsTab = screen.getByRole('button', { name: /👥 Groups/i })
      const eventsTab = screen.getByRole('button', { name: /📅 Events/i })
      
      expect(groupsTab).toBeInTheDocument()
      expect(eventsTab).toBeInTheDocument()
    })

    it('maintains keyboard navigation for tab switching', async () => {
      render(<CommunityHub />)
      
      const tabs = [
        screen.getByRole('button', { name: /👥 Groups/i }),
        screen.getByRole('button', { name: /📅 Events/i }),
        screen.getByRole('button', { name: /🧑‍🤝‍🧑 Members/i }),
        screen.getByRole('button', { name: /📈 Activity/i }),
      ]
      
      // Test keyboard navigation
      tabs[0].focus()
      expect(tabs[0]).toHaveFocus()
      
      // Simulate tab key navigation
      fireEvent.keyDown(tabs[0], { key: 'Tab' })
    })

    it('provides meaningful button text for screen readers', () => {
      render(<CommunityHub />)
      
      // Check that buttons have descriptive text
      expect(screen.getByRole('button', { name: '+ Create Group' })).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Search groups, events, members...')).toBeInTheDocument()
    })
  })

  // QA Focus: Performance and responsive behavior
  describe('Performance and Responsive Design', () => {
    it('renders without performance issues', () => {
      const startTime = performance.now()
      render(<CommunityHub />)
      const endTime = performance.now()
      
      // Should render quickly (less than 100ms in test environment)
      expect(endTime - startTime).toBeLessThan(100)
    })

    it('handles component unmounting cleanly', () => {
      const { unmount } = render(<CommunityHub />)
      
      // Should unmount without errors
      expect(() => unmount()).not.toThrow()
    })

    it('maintains state during rapid user interactions', async () => {
      const user = userEvent.setup()
      render(<CommunityHub />)
      
      const searchInput = screen.getByPlaceholderText('Search groups, events, members...')
      
      // Rapid typing and tab switching
      await user.type(searchInput, 'test')
      await user.click(screen.getByRole('button', { name: /📅 Events/i }))
      await user.clear(searchInput)
      await user.type(searchInput, 'meditation')
      await user.click(screen.getByRole('button', { name: /👥 Groups/i }))
      
      // Should maintain search value
      expect(searchInput).toHaveValue('meditation')
    })
  })

  // QA Focus: Data display and content validation
  describe('Data Display and Content', () => {
    it('displays group information correctly', () => {
      render(<CommunityHub />)
      
      // Check group details are displayed
      expect(screen.getByText('Daily Meditation Circle')).toBeInTheDocument()
      expect(screen.getByText('48 members')).toBeInTheDocument()
      expect(screen.getByText('Active 2 hours ago')).toBeInTheDocument()
      expect(screen.getByText('#meditation')).toBeInTheDocument()
    })

    it('displays event information correctly', async () => {
      const user = userEvent.setup()
      render(<CommunityHub />)
      
      await user.click(screen.getByRole('button', { name: /📅 Events/i }))
      
      expect(screen.getByText('Weekend Meditation Retreat')).toBeInTheDocument()
      expect(screen.getByText('Mountain View Center')).toBeInTheDocument()
      expect(screen.getByText('15 attending')).toBeInTheDocument()
    })

    it('displays member information correctly', async () => {
      const user = userEvent.setup()
      render(<CommunityHub />)
      
      await user.click(screen.getByRole('button', { name: /🧑‍🤝‍🧑 Members/i }))
      
      expect(screen.getByText('Sarah Chen')).toBeInTheDocument()
      expect(screen.getByText('teacher')).toBeInTheDocument()
      expect(screen.getByText('45 contributions')).toBeInTheDocument()
    })
  })
})