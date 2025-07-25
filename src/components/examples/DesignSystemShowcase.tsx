import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
import { GlassInput } from '../ui/GlassInput';
import { GlassModal } from '../ui/GlassModal';
import { GlassNavigation } from '../ui/GlassNavigation';
import { ThemeToggle } from '../ui/ThemeToggle';

/**
 * DesignSystemShowcase Component
 * 
 * A comprehensive showcase of the glassmorphism design system components.
 * Demonstrates all variants, states, and accessibility features.
 * 
 * Features:
 * - Interactive component demonstrations
 * - All glass component variants
 * - Accessibility testing interface
 * - Theme switching capabilities
 * - Responsive design examples
 * - Real-world usage patterns
 */
export const DesignSystemShowcase: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('components');
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');

  const navItems = [
    { label: 'Home', href: '#home', active: true },
    { label: 'Community', href: '#community', badge: '12' },
    { label: 'Events', href: '#events' },
    { label: 'Resources', href: '#resources' },
    { label: 'About', href: '#about' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.length > 0 && value.length < 3) {
      setInputError('Minimum 3 characters required');
    } else {
      setInputError('');
    }
  };

  const Logo = () => (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
        BC
      </div>
      <span className="font-bold text-lg">Buddhist Community</span>
    </div>
  );

  const NavActions = () => (
    <div className="flex items-center gap-2">
      <ThemeToggle size="sm" />
      <GlassButton size="sm" variant="primary">
        Join
      </GlassButton>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <GlassNavigation
        items={navItems}
        logo={<Logo />}
        actions={<NavActions />}
      />

      {/* Main Content */}
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
              Design System Showcase
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A comprehensive glassmorphism design system with dark mode support and accessibility compliance.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <GlassCard className="p-1" variant="light">
              <div className="flex gap-1">
                {['components', 'colors', 'typography'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                      activeTab === tab
                        ? 'bg-white/50 dark:bg-white/10 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/20'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Components Tab */}
          {activeTab === 'components' && (
            <div className="grid gap-8">
              {/* Cards Section */}
              <section>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Glass Cards</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <GlassCard variant="light" className="p-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Light Glass</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Subtle glassmorphism effect with light background blur and transparency.
                    </p>
                  </GlassCard>
                  
                  <GlassCard variant="medium" className="p-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Medium Glass</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Balanced glassmorphism with medium blur intensity and backdrop effects.
                    </p>
                  </GlassCard>
                  
                  <GlassCard variant="strong" className="p-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Strong Glass</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Bold glassmorphism effect with strong blur and pronounced glass appearance.
                    </p>
                  </GlassCard>
                </div>
              </section>

              {/* Buttons Section */}
              <section>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Glass Buttons</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Primary</h3>
                    <div className="space-y-2">
                      <GlassButton variant="primary" size="sm">Small Primary</GlassButton>
                      <GlassButton variant="primary" size="md">Medium Primary</GlassButton>
                      <GlassButton variant="primary" size="lg">Large Primary</GlassButton>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Glass</h3>
                    <div className="space-y-2">
                      <GlassButton variant="glass" size="sm">Small Glass</GlassButton>
                      <GlassButton variant="glass" size="md">Medium Glass</GlassButton>
                      <GlassButton variant="glass" size="lg">Large Glass</GlassButton>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Secondary</h3>
                    <div className="space-y-2">
                      <GlassButton variant="secondary" size="sm">Small Secondary</GlassButton>
                      <GlassButton variant="secondary" size="md">Medium Secondary</GlassButton>
                      <GlassButton variant="secondary" size="lg">Large Secondary</GlassButton>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">States</h3>
                    <div className="space-y-2">
                      <GlassButton variant="primary" loading>Loading</GlassButton>
                      <GlassButton variant="glass" disabled>Disabled</GlassButton>
                      <GlassButton variant="secondary" leftIcon={<span>→</span>}>With Icon</GlassButton>
                    </div>
                  </div>
                </div>
              </section>

              {/* Inputs Section */}
              <section>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Glass Inputs</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <GlassInput
                      label="Username"
                      placeholder="Enter your username"
                      value={inputValue}
                      onChange={handleInputChange}
                      error={inputError}
                      required
                    />
                    
                    <GlassInput
                      label="Email Address"
                      type="email"
                      placeholder="your@email.com"
                      helperText="We'll never share your email with anyone else."
                    />
                    
                    <GlassInput
                      label="Password"
                      type="password"
                      placeholder="Enter your password"
                      variant="filled"
                    />
                  </div>
                  
                  <div className="space-y-6">
                    <GlassInput
                      label="Search"
                      placeholder="Search communities..."
                      leftIcon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      }
                    />
                    
                    <GlassInput
                      label="Amount"
                      type="number"
                      placeholder="0.00"
                      rightIcon={<span className="text-gray-500">$</span>}
                      variant="outline"
                    />
                    
                    <GlassInput
                      label="Disabled Input"
                      value="This is disabled"
                      disabled
                    />
                  </div>
                </div>
              </section>

              {/* Interactive Components */}
              <section>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Interactive Components</h2>
                <div className="space-y-6">
                  {/* Modal Demo */}
                  <GlassCard className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Glass Modal</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Click the button below to open a glassmorphism modal with proper focus management and accessibility.
                    </p>
                    <GlassButton onClick={() => setIsModalOpen(true)}>
                      Open Modal
                    </GlassButton>
                  </GlassCard>

                  {/* Theme Toggle Demo */}
                  <GlassCard className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Theme Toggle</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Try different theme toggle variants:
                    </p>
                    <div className="flex flex-wrap gap-4 items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Icon:</span>
                        <ThemeToggle variant="icon" size="md" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Switch:</span>
                        <ThemeToggle variant="switch" showLabel />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Dropdown:</span>
                        <ThemeToggle variant="dropdown" />
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </section>
            </div>
          )}

          {/* Colors Tab */}
          {activeTab === 'colors' && (
            <section>
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Color Palette</h2>
              <div className="grid gap-8">
                {/* Primary Colors */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Primary Colors</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-2">
                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                      <div key={shade} className="text-center">
                        <div 
                          className={`h-16 w-full rounded-lg mb-2 border border-gray-200 dark:border-gray-700`}
                          style={{ backgroundColor: `var(--color-primary-${shade})` }}
                        />
                        <span className="text-xs text-gray-600 dark:text-gray-400">{shade}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Semantic Colors */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Semantic Colors</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['success', 'warning', 'error', 'info'].map((type) => (
                      <div key={type}>
                        <h4 className="text-sm font-medium mb-2 capitalize text-gray-900 dark:text-white">{type}</h4>
                        <div className="grid grid-cols-3 gap-1">
                          {[50, 500, 700].map((shade) => (
                            <div key={shade} className="text-center">
                              <div 
                                className="h-12 w-full rounded-md border border-gray-200 dark:border-gray-700"
                                style={{ backgroundColor: `var(--color-${type}-${shade})` }}
                              />
                              <span className="text-xs text-gray-500 mt-1">{shade}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Typography Tab */}
          {activeTab === 'typography' && (
            <section>
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Typography Scale</h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Font Sizes</h3>
                  <div className="space-y-4">
                    {[
                      ['6xl', 'Heading 1'],
                      ['5xl', 'Heading 2'],
                      ['4xl', 'Heading 3'],
                      ['3xl', 'Heading 4'],
                      ['2xl', 'Heading 5'],
                      ['xl', 'Heading 6'],
                      ['lg', 'Large Text'],
                      ['base', 'Body Text'],
                      ['sm', 'Small Text'],
                      ['xs', 'Caption Text']
                    ].map(([size, label]) => (
                      <div key={size} className="flex items-baseline gap-4">
                        <span className="w-16 text-xs text-gray-500 dark:text-gray-400 font-mono">
                          {size}
                        </span>
                        <span 
                          className={`text-${size} text-gray-900 dark:text-white`}
                          style={{ fontSize: `var(--font-size-${size})` }}
                        >
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Font Weights</h3>
                  <div className="space-y-2">
                    {[
                      ['light', '300'],
                      ['normal', '400'],
                      ['medium', '500'],
                      ['semibold', '600'],
                      ['bold', '700'],
                      ['extrabold', '800'],
                      ['black', '900']
                    ].map(([weight, value]) => (
                      <div key={weight} className="flex items-center gap-4">
                        <span className="w-20 text-xs text-gray-500 dark:text-gray-400 font-mono">
                          {weight}
                        </span>
                        <span 
                          className="text-lg text-gray-900 dark:text-white"
                          style={{ fontWeight: value }}
                        >
                          The quick brown fox jumps over the lazy dog
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Modal */}
      <GlassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Glass Modal Example"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            This is a glassmorphism modal with proper accessibility features:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <li>Focus management and keyboard navigation</li>
            <li>Screen reader compatibility</li>
            <li>Backdrop blur effects</li>
            <li>Smooth animations</li>
            <li>Customizable sizes and styling</li>
          </ul>
          <div className="flex gap-3 mt-6">
            <GlassButton variant="primary" onClick={() => setIsModalOpen(false)}>
              Confirm
            </GlassButton>
            <GlassButton variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </GlassButton>
          </div>
        </div>
      </GlassModal>
    </div>
  );
};

DesignSystemShowcase.displayName = 'DesignSystemShowcase';