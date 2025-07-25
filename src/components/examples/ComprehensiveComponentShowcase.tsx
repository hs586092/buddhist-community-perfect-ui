import React, { useState } from 'react';
import {
  GlassButton,
  GlassCard,
  GlassInput,
  GlassTextarea,
  GlassSelect,
  GlassForm,
  GlassModal,
  GlassNavigation,
  ThemeToggle,
  createValidationRules,
} from '../ui';

/**
 * Comprehensive Component Showcase
 * 
 * Interactive demonstration of all implemented glassmorphism components with various
 * configurations, states, and use cases. This showcase serves as both documentation
 * and testing interface for the component library.
 * 
 * Features:
 * - Live component demonstrations with interactive controls
 * - Multiple state examples (loading, error, success, disabled)
 * - Responsive design showcase across different screen sizes
 * - Dark mode compatibility testing
 * - Accessibility feature demonstrations
 * - Real-world usage examples
 */
export const ComprehensiveComponentShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState('buttons');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [loadingStates, setLoadingStates] = useState({
    button: false,
    form: false,
    input: false,
  });

  // Sample data
  const selectOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3', disabled: true },
    { value: 'group1-item1', label: 'Group 1 Item 1', group: 'Group 1' },
    { value: 'group1-item2', label: 'Group 1 Item 2', group: 'Group 1' },
    { value: 'group2-item1', label: 'Group 2 Item 1', group: 'Group 2' },
  ];

  const navItems = [
    { label: 'Home', href: '/', icon: '🏠', active: true },
    { label: 'About', href: '/about', icon: '📖' },
    { 
      label: 'Services', 
      icon: '⚙️',
      children: [
        { label: 'Web Development', href: '/services/web' },
        { label: 'Mobile Apps', href: '/services/mobile' },
        { label: 'Consulting', href: '/services/consulting' },
      ]
    },
    { label: 'Contact', href: '/contact', icon: '📧', badge: '2' },
  ];

  const validationRules = createValidationRules();
  const formValidationRules = {
    name: { ...validationRules.required(), ...validationRules.minLength(2) },
    email: { ...validationRules.required(), ...validationRules.email() },
    message: { ...validationRules.required(), ...validationRules.minLength(10) },
  };

  const toggleLoading = (component: string) => {
    setLoadingStates(prev => ({ ...prev, [component]: !prev[component as keyof typeof prev] }));
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, [component]: false }));
    }, 2000);
  };

  const tabs = [
    { id: 'buttons', label: 'Buttons', icon: '🔘' },
    { id: 'cards', label: 'Cards', icon: '🃏' },
    { id: 'forms', label: 'Forms', icon: '📝' },
    { id: 'navigation', label: 'Navigation', icon: '🧭' },
    { id: 'modals', label: 'Modals', icon: '🪟' },
  ];

  const renderButtons = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Button Variants</h3>
        <div className="flex flex-wrap gap-4">
          <GlassButton variant="primary">Primary</GlassButton>
          <GlassButton variant="secondary">Secondary</GlassButton>
          <GlassButton variant="ghost">Ghost</GlassButton>
          <GlassButton variant="glass">Glass</GlassButton>
          <GlassButton variant="destructive">Destructive</GlassButton>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Button Sizes</h3>
        <div className="flex flex-wrap items-end gap-4">
          <GlassButton size="xs">Extra Small</GlassButton>
          <GlassButton size="sm">Small</GlassButton>
          <GlassButton size="md">Medium</GlassButton>
          <GlassButton size="lg">Large</GlassButton>
          <GlassButton size="xl">Extra Large</GlassButton>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Button States</h3>
        <div className="flex flex-wrap gap-4">
          <GlassButton 
            loading={loadingStates.button}
            onClick={() => toggleLoading('button')}
            leftIcon="🚀"
          >
            {loadingStates.button ? 'Processing...' : 'Click to Load'}
          </GlassButton>
          <GlassButton disabled>Disabled</GlassButton>
          <GlassButton fullWidth className="md:max-w-xs">
            Full Width
          </GlassButton>
          <GlassButton rounded rightIcon="→">
            Rounded with Icon
          </GlassButton>
        </div>
      </div>
    </div>
  );

  const renderCards = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Card Variants</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard variant="light" padding="md">
            <h4 className="font-medium mb-2">Light Glass</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Subtle glass effect for minimalist designs.
            </p>
          </GlassCard>
          
          <GlassCard variant="medium" padding="md" hover>
            <h4 className="font-medium mb-2">Medium Glass</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Balanced glass effect with hover animations.
            </p>
          </GlassCard>
          
          <GlassCard variant="strong" padding="md" interactive onClick={() => console.log('Card clicked')}>
            <h4 className="font-medium mb-2">Strong Glass</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Bold glass effect, interactive and clickable.
            </p>
          </GlassCard>
          
          <GlassCard variant="minimal" padding="md" bordered shadow="lg">
            <h4 className="font-medium mb-2">Minimal</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Clean minimal design with custom shadow.
            </p>
          </GlassCard>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Card with Header and Footer</h3>
        <GlassCard
          variant="medium"
          padding="md"
          header={
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">User Profile</h4>
              <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full">
                Active
              </span>
            </div>
          }
          footer={
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Last updated: 2 hours ago</span>
              <GlassButton size="sm">Edit Profile</GlassButton>
            </div>
          }
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                JD
              </div>
              <div>
                <h5 className="font-medium">John Doe</h5>
                <p className="text-sm text-gray-500">john.doe@example.com</p>
              </div>
            </div>
            <p className="text-sm">
              Full-stack developer with 5+ years of experience in React, Node.js, and modern web technologies.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );

  const renderForms = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Input Variants</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassInput 
            label="Glass Input"
            variant="glass"
            placeholder="Enter text..."
            helperText="This is a glass variant input"
          />
          <GlassInput 
            label="Filled Input"
            variant="filled"
            placeholder="Enter text..."
            rightIcon="🔍"
          />
          <GlassInput 
            label="Outline Input"
            variant="outline"
            placeholder="Enter text..."
            leftIcon="📧"
          />
          <GlassInput 
            label="Minimal Input"
            variant="minimal"
            placeholder="Enter text..."
            clearable
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Input States</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassInput 
            label="Success State"
            placeholder="Valid input..."
            success
            value="valid@example.com"
            helperText="Email address is valid"
          />
          <GlassInput 
            label="Error State"
            placeholder="Enter email..."
            error="Please enter a valid email address"
            value="invalid-email"
          />
          <GlassInput 
            label="Loading State"
            placeholder="Checking availability..."
            loading={loadingStates.input}
            onFocus={() => toggleLoading('input')}
          />
          <GlassInput 
            label="Disabled State"
            placeholder="Cannot edit..."
            disabled
            value="Disabled input"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Textarea and Select</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassTextarea
            label="Message"
            placeholder="Enter your message..."
            maxLength={200}
            showCount
            autoResize
            helperText="Share your thoughts with us"
          />
          <GlassSelect
            label="Select Option"
            placeholder="Choose an option..."
            options={selectOptions}
            clearable
            helperText="Select from grouped options"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Complete Form</h3>
        <GlassForm
          variant="glass"
          spacing="comfortable"
          initialValues={{ name: '', email: '', message: '' }}
          validationRules={formValidationRules}
          onSubmit={async (values) => {
            console.log('Form submitted:', values);
            toggleLoading('form');
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassInput
              name="name"
              label="Full Name"
              placeholder="Enter your name..."
              required
            />
            <GlassInput
              name="email"
              label="Email Address"
              type="email"
              placeholder="your.email@example.com"
              leftIcon="📧"
              required
            />
          </div>
          
          <GlassTextarea
            name="message"
            label="Message"
            placeholder="Tell us about your project..."
            maxLength={500}
            showCount
            required
          />
          
          <div className="flex justify-end gap-4">
            <GlassButton type="button" variant="ghost">
              Cancel
            </GlassButton>
            <GlassButton 
              type="submit" 
              variant="primary"
              loading={loadingStates.form}
            >
              Send Message
            </GlassButton>
          </div>
        </GlassForm>
      </div>
    </div>
  );

  const renderNavigation = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Navigation Variants</h3>
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium mb-2">Fixed Navigation</h4>
            <div className="relative border rounded-lg overflow-hidden" style={{ height: '200px' }}>
              <GlassNavigation
                items={navItems}
                logo={<span className="text-xl font-bold">🏛️ Logo</span>}
                actions={<ThemeToggle variant="icon" size="sm" />}
                variant="fixed"
                height="sm"
              />
              <div className="pt-14 p-4 h-full overflow-y-auto bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
                <p className="text-sm">Content scrolls behind fixed navigation...</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-md font-medium mb-2">Static Navigation</h4>
            <GlassNavigation
              items={navItems.slice(0, 3)} // Fewer items for demo
              logo={<span className="text-lg font-bold">📱 App</span>}
              variant="static"
              blur="lg"
              shadow="lg"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderModals = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Modal Examples</h3>
        <div className="flex flex-wrap gap-4">
          <GlassButton onClick={() => setModalOpen(true)}>
            Open Modal
          </GlassButton>
          <GlassModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Welcome to Glass Design"
            subtitle="Experience the beauty of glassmorphism"
            size="md"
            variant="medium"
            footer={
              <div className="flex justify-end gap-3">
                <GlassButton 
                  variant="ghost" 
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </GlassButton>
                <GlassButton 
                  variant="primary"
                  onClick={() => setModalOpen(false)}
                >
                  Get Started
                </GlassButton>
              </div>
            }
          >
            <div className="space-y-4">
              <p>
                This modal demonstrates the glassmorphism design system with backdrop blur,
                accessibility features, and smooth animations.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/10 rounded-lg">
                  <div className="text-2xl mb-2">✨</div>
                  <h4 className="font-medium">Beautiful</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Modern glass effects
                  </p>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-lg">
                  <div className="text-2xl mb-2">♿</div>
                  <h4 className="font-medium">Accessible</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    WCAG 2.1 AA compliant
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Try using keyboard navigation (Tab, Enter, Escape) to experience 
                the accessibility features.
              </p>
            </div>
          </GlassModal>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                🎨 Glass Components Showcase
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Interactive demonstration of the glassmorphism component library
              </p>
            </div>
            <ThemeToggle variant="icon" size="md" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-white/20 text-blue-600 dark:text-blue-400 shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/10'
                  }
                `}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <GlassCard variant="light" padding="lg" className="min-h-[600px]">
          {activeTab === 'buttons' && renderButtons()}
          {activeTab === 'cards' && renderCards()}
          {activeTab === 'forms' && renderForms()}
          {activeTab === 'navigation' && renderNavigation()}
          {activeTab === 'modals' && renderModals()}
        </GlassCard>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Built with ❤️ using React, TypeScript, and Tailwind CSS
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            All components are accessibility-first and dark mode compatible
          </p>
        </div>
      </div>
    </div>
  );
};