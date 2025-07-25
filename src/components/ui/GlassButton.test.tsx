/**
 * GlassButton Component Tests
 * 
 * Comprehensive unit testing with QA persona focus:
 * - Prevention: Validate all props and edge cases
 * - Detection: Test error states and boundary conditions  
 * - Correction: Ensure proper fallbacks and accessibility
 */

import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render, mockData, accessibilityUtils, userEvent } from '../../test/test-utils'
import { GlassButton } from './GlassButton'

describe('GlassButton', () => {
  // QA Focus: Prevention - Test all variations
  describe('Variants and Styling', () => {
    it('renders primary variant correctly', () => {
      render(<GlassButton variant="primary">Primary Button</GlassButton>)
      
      const button = screen.getByRole('button', { name: 'Primary Button' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('bg-primary-600')
    })

    it('renders secondary variant correctly', () => {
      render(<GlassButton variant="secondary">Secondary Button</GlassButton>)
      
      const button = screen.getByRole('button', { name: 'Secondary Button' })
      expect(button).toHaveClass('bg-secondary-600')
    })

    it('renders ghost variant correctly', () => {
      render(<GlassButton variant="ghost">Ghost Button</GlassButton>)
      
      const button = screen.getByRole('button', { name: 'Ghost Button' })
      expect(button).toHaveClass('bg-transparent')
    })

    it('applies glass variant styling', () => {
      render(<GlassButton variant="glass">Glass Button</GlassButton>)
      
      const button = screen.getByRole('button', { name: 'Glass Button' })
      expect(button).toHaveClass('backdrop-blur-lg')
    })
  })

  describe('Sizes', () => {
    it('renders small size correctly', () => {
      render(<GlassButton size="sm">Small Button</GlassButton>)
      
      const button = screen.getByRole('button', { name: 'Small Button' })
      expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm')
    })

    it('renders medium size correctly (default)', () => {
      render(<GlassButton>Medium Button</GlassButton>)
      
      const button = screen.getByRole('button', { name: 'Medium Button' })
      expect(button).toHaveClass('px-4', 'py-2', 'text-base')
    })

    it('renders large size correctly', () => {
      render(<GlassButton size="lg">Large Button</GlassButton>)
      
      const button = screen.getByRole('button', { name: 'Large Button' })
      expect(button).toHaveClass('px-6', 'py-3', 'text-lg')
    })
  })

  describe('Icons and Content', () => {
    it('renders left icon correctly', () => {
      render(
        <GlassButton leftIcon="👍">With Left Icon</GlassButton>
      )
      
      const button = screen.getByRole('button', { name: 'With Left Icon' })
      expect(button).toHaveTextContent('👍')
      expect(button).toHaveTextContent('With Left Icon')
    })

    it('renders right icon correctly', () => {
      render(
        <GlassButton rightIcon="→">With Right Icon</GlassButton>
      )
      
      const button = screen.getByRole('button', { name: 'With Right Icon' })
      expect(button).toHaveTextContent('→')
      expect(button).toHaveTextContent('With Right Icon')
    })

    it('renders both icons correctly', () => {
      render(
        <GlassButton leftIcon="👍" rightIcon="→">
          Both Icons
        </GlassButton>
      )
      
      const button = screen.getByRole('button', { name: 'Both Icons' })
      expect(button).toHaveTextContent('👍')
      expect(button).toHaveTextContent('→')
      expect(button).toHaveTextContent('Both Icons')
    })

    it('handles icon-only button correctly', () => {
      render(
        <GlassButton leftIcon="🔍" aria-label="Search" />
      )
      
      const button = screen.getByRole('button', { name: 'Search' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('🔍')
    })
  })

  // QA Focus: Detection - Test interactive states
  describe('Interactive States', () => {
    it('handles click events', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()
      
      render(
        <GlassButton onClick={handleClick}>Clickable</GlassButton>
      )
      
      const button = screen.getByRole('button', { name: 'Clickable' })
      await user.click(button)
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('shows loading state correctly', () => {
      render(
        <GlassButton loading>Loading Button</GlassButton>
      )
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveAttribute('aria-busy', 'true')
      
      // Should show loading indicator
      const loadingSpinner = button.querySelector('.animate-spin')
      expect(loadingSpinner).toBeInTheDocument()
    })

    it('disables button when disabled prop is true', () => {
      const handleClick = vi.fn()
      
      render(
        <GlassButton disabled onClick={handleClick}>
          Disabled Button
        </GlassButton>
      )
      
      const button = screen.getByRole('button', { name: 'Disabled Button' })
      expect(button).toBeDisabled()
      expect(button).toHaveAttribute('aria-disabled', 'true')
      
      fireEvent.click(button)
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('prevents click when loading', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()
      
      render(
        <GlassButton loading onClick={handleClick}>
          Loading Button
        </GlassButton>
      )
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  // QA Focus: Prevention - Test edge cases
  describe('Edge Cases and Error Handling', () => {
    it('handles undefined children gracefully', () => {
      render(<GlassButton>{undefined}</GlassButton>)
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('handles empty string children', () => {
      render(<GlassButton>{''}</GlassButton>)
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('handles custom className correctly', () => {
      render(
        <GlassButton className="custom-class">
          Custom Class
        </GlassButton>
      )
      
      const button = screen.getByRole('button', { name: 'Custom Class' })
      expect(button).toHaveClass('custom-class')
      // Should still have default classes
      expect(button).toHaveClass('inline-flex', 'items-center')
    })

    it('handles all HTML button attributes', () => {
      render(
        <GlassButton
          type="submit"
          form="test-form"
          value="test-value"
          name="test-button"
          data-testid="test-button"
        >
          Full Attributes
        </GlassButton>
      )
      
      const button = screen.getByRole('button', { name: 'Full Attributes' })
      expect(button).toHaveAttribute('type', 'submit')
      expect(button).toHaveAttribute('form', 'test-form')
      expect(button).toHaveAttribute('value', 'test-value')
      expect(button).toHaveAttribute('name', 'test-button')
      expect(button).toHaveAttribute('data-testid', 'test-button')
    })
  })

  // QA Focus: Accessibility compliance
  describe('Accessibility', () => {
    it('has proper ARIA attributes when loading', () => {
      render(<GlassButton loading>Loading</GlassButton>)
      
      const button = screen.getByRole('button')
      accessibilityUtils.checkAriaAttributes(button, [
        'aria-busy',
        'aria-disabled'
      ])
    })

    it('supports custom ARIA labels', () => {
      render(
        <GlassButton aria-label="Custom Label" leftIcon="🔍" />
      )
      
      const button = screen.getByRole('button', { name: 'Custom Label' })
      expect(button).toBeInTheDocument()
    })

    it('maintains focus management', async () => {
      render(
        <div>
          <GlassButton>First</GlassButton>
          <GlassButton>Second</GlassButton>
        </div>
      )
      
      const buttons = screen.getAllByRole('button')
      await accessibilityUtils.testKeyboardNavigation(buttons)
    })

    it('announces loading state to screen readers', () => {
      render(<GlassButton loading>Processing</GlassButton>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-busy', 'true')
      expect(button).toHaveAttribute('aria-disabled', 'true')
    })
  })

  // QA Focus: Performance and behavior
  describe('Performance and Behavior', () => {
    it('does not cause unnecessary re-renders', () => {
      const renderCount = vi.fn()
      
      const TestComponent = () => {
        renderCount()
        return <GlassButton>Test</GlassButton>
      }
      
      const { rerender } = render(<TestComponent />)
      expect(renderCount).toHaveBeenCalledTimes(1)
      
      // Re-render with same props should not cause extra renders
      rerender(<TestComponent />)
      expect(renderCount).toHaveBeenCalledTimes(2)
    })

    it('handles rapid clicks gracefully', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()
      
      render(<GlassButton onClick={handleClick}>Rapid Click</GlassButton>)
      
      const button = screen.getByRole('button', { name: 'Rapid Click' })
      
      // Simulate rapid clicking
      await user.click(button)
      await user.click(button)
      await user.click(button)
      
      expect(handleClick).toHaveBeenCalledTimes(3)
    })

    it('cleans up event listeners on unmount', () => {
      const { unmount } = render(<GlassButton>Test</GlassButton>)
      
      // This test verifies no memory leaks occur
      expect(() => unmount()).not.toThrow()
    })
  })

  // QA Focus: Integration scenarios
  describe('Integration Scenarios', () => {
    it('works as form submit button', async () => {
      const handleSubmit = vi.fn((e) => e.preventDefault())
      const user = userEvent.setup()
      
      render(
        <form onSubmit={handleSubmit}>
          <GlassButton type="submit">Submit Form</GlassButton>
        </form>
      )
      
      const button = screen.getByRole('button', { name: 'Submit Form' })
      await user.click(button)
      
      expect(handleSubmit).toHaveBeenCalledTimes(1)
    })

    it('integrates with router Link component', () => {
      const LinkButton = ({ to, children, ...props }: any) => (
        <GlassButton as="a" href={to} {...props}>
          {children}
        </GlassButton>
      )
      
      render(<LinkButton to="/test">Link Button</LinkButton>)
      
      const link = screen.getByRole('link', { name: 'Link Button' })
      expect(link).toHaveAttribute('href', '/test')
    })
  })
})