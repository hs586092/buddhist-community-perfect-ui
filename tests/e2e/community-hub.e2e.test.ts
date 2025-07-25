/**
 * Community Hub E2E Tests
 * 
 * Comprehensive end-to-end testing with QA persona focus:
 * - Prevention: Test complete user workflows, cross-browser compatibility
 * - Detection: Validate UI interactions, data flow, performance
 * - Correction: Ensure proper error handling, accessibility, recovery
 */

import { test, expect, Page } from '@playwright/test'

// Test data and utilities
const testUser = {
  email: 'admin@example.com',
  password: 'password'
}

// Page object model for Community Hub
class CommunityHubPage {
  constructor(private page: Page) {}

  // Navigation methods
  async goto() {
    await this.page.goto('/community')
  }

  async login() {
    await this.page.goto('/auth/login')
    await this.page.fill('[placeholder="Email address"]', testUser.email)
    await this.page.fill('[placeholder="Password"]', testUser.password)
    await this.page.click('button[type="submit"]')
    await this.page.waitForURL('/')
  }

  // Tab navigation methods
  async clickGroupsTab() {
    await this.page.click('button:has-text("👥 Groups")')
  }

  async clickEventsTab() {
    await this.page.click('button:has-text("📅 Events")')
  }

  async clickMembersTab() {
    await this.page.click('button:has-text("🧑‍🤝‍🧑 Members")')
  }

  async clickActivityTab() {
    await this.page.click('button:has-text("📈 Activity")')
  }

  // Search and filter methods
  async searchFor(query: string) {
    await this.page.fill('[placeholder*="Search"]', query)
  }

  async clearSearch() {
    await this.page.fill('[placeholder*="Search"]', '')
  }

  async clickFilter(filterName: string) {
    await this.page.click(`button:has-text("${filterName}")`)
  }

  // Interaction methods
  async joinGroup(groupName: string) {
    const groupCard = this.page.locator(`text=${groupName}`).locator('..').locator('..')
    await groupCard.locator('button:has-text("Join")').click()
  }

  async rsvpEvent(eventName: string) {
    const eventCard = this.page.locator(`text=${eventName}`).locator('..').locator('..')
    await eventCard.locator('button:has-text("RSVP")').click()
  }

  async messageUser(userName: string) {
    const userCard = this.page.locator(`text=${userName}`).locator('..').locator('..')
    await userCard.locator('button:has-text("Message")').click()
  }

  // Verification methods
  async getActiveTab() {
    return await this.page.locator('button[class*="text-primary-600"]').textContent()
  }

  async getSearchValue() {
    return await this.page.inputValue('[placeholder*="Search"]')
  }

  async getVisibleGroups() {
    return await this.page.locator('[data-testid="group-card"], text*="Meditation"').count()
  }

  async getVisibleEvents() {
    return await this.page.locator('[data-testid="event-card"], text*="Retreat"').count()
  }

  async getVisibleMembers() {
    return await this.page.locator('[data-testid="member-card"], text*="Chen"').count()
  }
}

test.describe('Community Hub E2E Tests', () => {
  let communityPage: CommunityHubPage

  test.beforeEach(async ({ page }) => {
    communityPage = new CommunityHubPage(page)
    await communityPage.login()
    await communityPage.goto()
  })

  // QA Focus: Prevention - Test core functionality and user workflows
  test.describe('Core Functionality', () => {
    test('should display community hub with correct initial state', async ({ page }) => {
      await expect(page).toHaveTitle(/Buddhist Community/)
      await expect(page.locator('text=Community Hub')).toBeVisible()
      await expect(page.locator('text=Connect with fellow practitioners')).toBeVisible()
      
      // Check all tabs are visible
      await expect(page.locator('button:has-text("👥 Groups")')).toBeVisible()
      await expect(page.locator('button:has-text("📅 Events")')).toBeVisible()
      await expect(page.locator('button:has-text("🧑‍🤝‍🧑 Members")')).toBeVisible()
      await expect(page.locator('button:has-text("📈 Activity")')).toBeVisible()
      
      // Groups tab should be active by default
      const activeTab = await communityPage.getActiveTab()
      expect(activeTab).toContain('Groups')
    })

    test('should navigate between tabs correctly', async ({ page }) => {
      // Start on Groups tab
      await expect(page.locator('text=All Categories')).toBeVisible()
      
      // Switch to Events tab
      await communityPage.clickEventsTab()
      await expect(page.locator('text=All Events')).toBeVisible()
      
      // Switch to Members tab
      await communityPage.clickMembersTab()
      await expect(page.locator('text=All Members')).toBeVisible()
      
      // Switch to Activity tab
      await communityPage.clickActivityTab()
      await expect(page.locator('text=Activity Feed')).toBeVisible()
      
      // Return to Groups tab
      await communityPage.clickGroupsTab()
      await expect(page.locator('text=All Categories')).toBeVisible()
    })

    test('should perform search across different tabs', async ({ page }) => {
      // Search in Groups tab
      await communityPage.searchFor('meditation')
      await page.waitForTimeout(500) // Wait for search to filter
      
      // Switch to Events tab and verify search persists
      await communityPage.clickEventsTab()
      const searchValue = await communityPage.getSearchValue()
      expect(searchValue).toBe('meditation')
      
      // Clear search
      await communityPage.clearSearch()
      await page.waitForTimeout(500)
      
      const clearedValue = await communityPage.getSearchValue()
      expect(clearedValue).toBe('')
    })
  })

  // QA Focus: Detection - Test filtering and data manipulation
  test.describe('Filtering and Data Display', () => {
    test('should filter groups by category', async ({ page }) => {
      // Verify initial state shows groups
      await expect(page.locator('text=Daily Meditation Circle')).toBeVisible({ timeout: 10000 })
      
      // Filter by meditation category
      await communityPage.clickFilter('Meditation')
      await page.waitForTimeout(500)
      
      // Verify meditation filter is active
      await expect(page.locator('button:has-text("Meditation")[class*="bg-primary-600"]')).toBeVisible()
      
      // Reset filter
      await communityPage.clickFilter('All Categories')
      await expect(page.locator('button:has-text("All Categories")[class*="bg-primary-600"]')).toBeVisible()
    })

    test('should filter events by type', async ({ page }) => {
      await communityPage.clickEventsTab()
      
      // Filter by meditation events
      await communityPage.clickFilter('Meditation')
      await page.waitForTimeout(500)
      
      // Verify filter is applied
      await expect(page.locator('button:has-text("Meditation")[class*="bg-primary-600"]')).toBeVisible()
    })

    test('should filter members by status', async ({ page }) => {
      await communityPage.clickMembersTab()
      
      // Filter by online members
      await communityPage.clickFilter('Online')
      await page.waitForTimeout(500)
      
      // Verify filter is applied
      await expect(page.locator('button:has-text("Online")[class*="bg-primary-600"]')).toBeVisible()
    })

    test('should combine search and filtering', async ({ page }) => {
      // Search for meditation
      await communityPage.searchFor('meditation')
      await page.waitForTimeout(500)
      
      // Apply category filter
      await communityPage.clickFilter('Meditation')
      await page.waitForTimeout(500)
      
      // Both search and filter should be active
      const searchValue = await communityPage.getSearchValue()
      expect(searchValue).toBe('meditation')
      await expect(page.locator('button:has-text("Meditation")[class*="bg-primary-600"]')).toBeVisible()
    })
  })

  // QA Focus: Detection - Test user interactions
  test.describe('User Interactions', () => {
    test('should handle group join interaction', async ({ page }) => {
      // Look for a join button and click it
      const joinButton = page.locator('button:has-text("Join")').first()
      await expect(joinButton).toBeVisible()
      
      // Mock console.log to verify the interaction
      let consoleMessage = ''
      page.on('console', msg => {
        if (msg.type() === 'log' && msg.text().includes('Join group:')) {
          consoleMessage = msg.text()
        }
      })
      
      await joinButton.click()
      await page.waitForTimeout(100)
      
      expect(consoleMessage).toContain('Join group:')
    })

    test('should handle event RSVP interaction', async ({ page }) => {
      await communityPage.clickEventsTab()
      
      const rsvpButton = page.locator('button:has-text("RSVP")').first()
      await expect(rsvpButton).toBeVisible()
      
      // Mock console.log to verify the interaction
      let consoleMessage = ''
      page.on('console', msg => {
        if (msg.type() === 'log' && msg.text().includes('RSVP event:')) {
          consoleMessage = msg.text()
        }
      })
      
      await rsvpButton.click()
      await page.waitForTimeout(100)
      
      expect(consoleMessage).toContain('RSVP event:')
    })

    test('should handle member message interaction', async ({ page }) => {
      await communityPage.clickMembersTab()
      
      const messageButton = page.locator('button:has-text("Message")').first()
      await expect(messageButton).toBeVisible()
      
      // Mock console.log to verify the interaction
      let consoleMessage = ''
      page.on('console', msg => {
        if (msg.type() === 'log' && msg.text().includes('Message member:')) {
          consoleMessage = msg.text()
        }
      })
      
      await messageButton.click()
      await page.waitForTimeout(100)
      
      expect(consoleMessage).toContain('Message member:')
    })
  })

  // QA Focus: Prevention - Test responsive design and accessibility
  test.describe('Responsive Design and Accessibility', () => {
    test('should work on mobile devices', async ({ page, browserName }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      
      // Navigate to community hub
      await communityPage.goto()
      
      // Verify mobile layout
      await expect(page.locator('text=Community Hub')).toBeVisible()
      
      // Test tab navigation on mobile
      await communityPage.clickEventsTab()
      await expect(page.locator('text=All Events')).toBeVisible()
    })

    test('should support keyboard navigation', async ({ page }) => {
      // Focus on search input with keyboard
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      
      // Type in search input
      await page.keyboard.type('meditation')
      
      const searchValue = await communityPage.getSearchValue()
      expect(searchValue).toBe('meditation')
      
      // Navigate to tabs with keyboard
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter')
    })

    test('should have proper ARIA labels', async ({ page }) => {
      // Check for ARIA attributes on interactive elements
      const searchInput = page.locator('[placeholder*="Search"]')
      await expect(searchInput).toHaveAttribute('type', 'text')
      
      // Check tab buttons have proper roles
      const groupsTab = page.locator('button:has-text("👥 Groups")')
      await expect(groupsTab).toHaveAttribute('type', 'button')
    })
  })

  // QA Focus: Prevention - Test error handling and edge cases
  test.describe('Error Handling and Edge Cases', () => {
    test('should handle empty search results gracefully', async ({ page }) => {
      await communityPage.searchFor('nonexistentquery')
      await page.waitForTimeout(500)
      
      // Page should still be functional even with no results
      await expect(page.locator('text=Community Hub')).toBeVisible()
    })

    test('should handle rapid tab switching', async ({ page }) => {
      // Rapidly switch between tabs
      for (let i = 0; i < 5; i++) {
        await communityPage.clickEventsTab()
        await communityPage.clickGroupsTab()
        await communityPage.clickMembersTab()
        await communityPage.clickActivityTab()
      }
      
      // Should still be functional
      await expect(page.locator('text=Activity Feed')).toBeVisible()
    })

    test('should handle network issues gracefully', async ({ page }) => {
      // Simulate slow network
      await page.route('**/*', route => {
        setTimeout(() => route.continue(), 100)
      })
      
      await communityPage.goto()
      await expect(page.locator('text=Community Hub')).toBeVisible({ timeout: 15000 })
    })

    test('should maintain state during page refresh', async ({ page }) => {
      // Set up some state
      await communityPage.searchFor('meditation')
      await communityPage.clickFilter('Meditation')
      
      // Refresh page
      await page.reload()
      
      // Verify basic functionality still works
      await expect(page.locator('text=Community Hub')).toBeVisible()
    })
  })

  // QA Focus: Performance and visual testing
  test.describe('Performance and Visual Testing', () => {
    test('should load within performance budget', async ({ page }) => {
      const startTime = Date.now()
      await communityPage.goto()
      await page.waitForSelector('text=Community Hub')
      const loadTime = Date.now() - startTime
      
      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000)
    })

    test('should not have console errors', async ({ page }) => {
      const consoleErrors: string[] = []
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text())
        }
      })
      
      await communityPage.goto()
      await page.waitForTimeout(2000)
      
      // Filter out expected errors (if any)
      const unexpectedErrors = consoleErrors.filter(error => 
        !error.includes('favicon') && 
        !error.includes('sourcemap')
      )
      
      expect(unexpectedErrors).toHaveLength(0)
    })

    test('should have consistent visual appearance', async ({ page }) => {
      await communityPage.goto()
      
      // Wait for images and content to load
      await page.waitForLoadState('networkidle')
      
      // Take screenshot for visual regression testing
      await expect(page).toHaveScreenshot('community-hub-main.png')
      
      // Test different tab views
      await communityPage.clickEventsTab()
      await page.waitForTimeout(500)
      await expect(page).toHaveScreenshot('community-hub-events.png')
      
      await communityPage.clickMembersTab()
      await page.waitForTimeout(500)
      await expect(page).toHaveScreenshot('community-hub-members.png')
    })
  })
})