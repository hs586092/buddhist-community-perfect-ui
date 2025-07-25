# Buddhist Community Design System

A comprehensive glassmorphism design system with dark mode support and accessibility compliance for modern web applications.

## 🎨 Overview

This design system provides a cohesive visual language built around glassmorphism effects, modern typography, and accessibility-first principles. It supports both light and dark themes with seamless transitions and comprehensive component library.

### Key Features

- **Glassmorphism UI**: Modern glass effects with backdrop blur and transparency
- **Dark Mode Support**: System preference detection with manual override
- **Accessibility First**: WCAG 2.1 AA compliant components
- **Responsive Design**: Mobile-first approach with fluid typography
- **Modern CSS**: CSS custom properties and logical properties
- **TypeScript Ready**: Full TypeScript support with proper typing

## 🏗️ Architecture

### Design Tokens Structure

```
src/styles/design-system.css    # Core design system
src/components/ui/              # Glass components
src/hooks/useTheme.ts          # Theme management
src/components/examples/       # Usage examples
```

### Color System

#### Primary Palette (Blue)
- **Use Case**: Primary actions, links, focus states
- **Shades**: 50-950 (10 levels)
- **Accessibility**: All combinations meet WCAG AA standards

#### Secondary Palette (Amber)
- **Use Case**: Secondary actions, highlights, warnings
- **Shades**: 50-950 (10 levels)
- **Semantic**: Warning states, attention grabbing

#### Semantic Colors
- **Success**: Green (#10b981) - Confirmations, success states
- **Warning**: Amber (#f59e0b) - Cautions, non-critical alerts  
- **Error**: Red (#ef4444) - Errors, destructive actions
- **Info**: Blue (#0ea5e9) - Information, neutral alerts

#### Neutral Grays
- **Light Mode**: Clean whites and light grays
- **Dark Mode**: Rich dark grays with proper contrast
- **Usage**: Text, borders, backgrounds, surfaces

### Typography Scale

#### Font Families
- **Primary**: Inter (body text, UI elements)
- **Display**: Space Grotesk (headings, hero text)
- **Mono**: Fira Code (code, technical content)

#### Fluid Typography
- **Responsive**: Scales smoothly across screen sizes
- **Performance**: Uses clamp() for optimal rendering
- **Hierarchy**: Clear visual hierarchy with 10 size levels

```css
--font-size-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
--font-size-6xl: clamp(3.75rem, 3rem + 3.75vw, 5rem);
```

### Spacing System

#### 8pt Grid System
- **Base Unit**: 8px for consistent spacing
- **Scale**: 0.25rem to 24rem (comprehensive scale)
- **Usage**: Margins, padding, gaps, positioning

#### Responsive Spacing
- **Container**: Fluid containers with breakpoint-specific padding
- **Breakpoints**: Mobile-first responsive design
- **Grid**: CSS Grid and Flexbox layouts

## 🧩 Components

### GlassCard
Modern glassmorphism card with multiple variants and hover effects.

**Variants:**
- `light`: Subtle glass effect
- `medium`: Balanced transparency  
- `strong`: Bold glass appearance

**Features:**
- Hover animations with transform
- Interactive states with proper focus
- Accessibility with ARIA attributes
- Polymorphic component support

```tsx
<GlassCard variant="medium" hover interactive>
  <h3>Card Title</h3>
  <p>Card content with glassmorphism effect</p>
</GlassCard>
```

### GlassButton
Comprehensive button component with loading states and icons.

**Variants:**
- `primary`: Solid gradient background
- `secondary`: Light background with border
- `ghost`: Transparent with hover effects
- `glass`: Glassmorphism styling

**Features:**
- Loading states with spinner animation
- Icon support (left/right positioning)
- Size variants (sm, md, lg, xl)
- Full keyboard accessibility

```tsx
<GlassButton 
  variant="primary" 
  size="lg"
  loading={isLoading}
  leftIcon={<IconComponent />}
>
  Submit Form
</GlassButton>
```

### GlassInput
Advanced input field with floating labels and validation.

**Features:**
- Floating label animation
- Error and helper text states
- Icon support (left/right)
- Multiple visual variants
- Screen reader support

```tsx
<GlassInput
  label="Email Address"
  type="email"
  error={errors.email}
  helperText="We'll never share your email"
  leftIcon={<MailIcon />}
  required
/>
```

### GlassModal
Fully accessible modal with focus management.

**Features:**
- Portal rendering for proper stacking
- Focus trap with keyboard navigation
- Customizable sizes (sm, md, lg, xl, full)
- Backdrop blur with glassmorphism
- Screen reader announcements

```tsx
<GlassModal
  isOpen={isModalOpen}
  onClose={handleClose}
  title="Modal Title"
  size="md"
>
  <p>Modal content with accessibility features</p>
</GlassModal>
```

### GlassNavigation
Responsive navigation with mobile menu and accessibility.

**Features:**
- Fixed glass navigation bar
- Responsive mobile menu with animations
- Badge support for notifications
- Icon integration
- Keyboard navigation support

```tsx
<GlassNavigation
  items={navigationItems}
  logo={<Logo />}
  actions={<ThemeToggle />}
  onItemClick={handleNavigation}
/>
```

### ThemeToggle
Comprehensive theme switcher with multiple variants.

**Variants:**
- `icon`: Animated icon button
- `switch`: Toggle switch interface
- `dropdown`: Select dropdown

**Features:**
- System preference detection
- Smooth theme transitions
- Screen reader announcements
- Persistent theme storage

```tsx
<ThemeToggle 
  variant="icon" 
  size="md" 
  showLabel 
/>
```

## 🌙 Theme System

### Theme Management

#### useTheme Hook
Comprehensive theme management with system preference detection.

```tsx
const { theme, setTheme, toggleTheme, isDark, isSystem } = useTheme();
```

**Features:**
- Light, dark, and system modes
- Persistent localStorage storage
- System preference detection
- Automatic DOM updates
- Screen reader announcements

#### CSS Custom Properties
Dynamic theming using CSS custom properties for performance.

```css
:root {
  --bg-primary: var(--color-neutral-0);
  --text-primary: var(--color-neutral-900);
}

[data-theme="dark"] {
  --bg-primary: var(--color-neutral-900);
  --text-primary: var(--color-neutral-50);
}
```

### Dark Mode Implementation

#### Automatic Detection
- Respects system preference by default
- Manual override capability
- Smooth transitions between themes

#### Component Adaptation
- All components support both themes
- Proper contrast ratios maintained
- Glass effects adapt to theme context

## ♿ Accessibility

### WCAG 2.1 AA Compliance

#### Color Contrast
- All text/background combinations meet AA standards
- High contrast mode support
- Color-blind friendly palette

#### Keyboard Navigation
- Full keyboard accessibility for all components
- Logical tab order and focus management
- Visual focus indicators

#### Screen Reader Support
- Proper ARIA labels and descriptions
- Live regions for dynamic updates
- Semantic HTML structure

#### Reduced Motion
- Respects prefers-reduced-motion preference
- Graceful animation degradation
- Optional motion controls

### Testing Guidelines

#### Automated Testing
```bash
# Run accessibility tests
npm run test:a11y

# Lighthouse accessibility audit
npm run audit:a11y
```

#### Manual Testing
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Keyboard-only navigation
- High contrast mode verification
- Color blindness simulation

## 📱 Responsive Design

### Breakpoints
- **sm**: 640px (small devices)
- **md**: 768px (tablets)  
- **lg**: 1024px (laptops)
- **xl**: 1280px (desktops)
- **2xl**: 1536px (large screens)

### Mobile-First Approach
- Base styles target mobile devices
- Progressive enhancement for larger screens
- Touch-friendly interaction targets

### Fluid Typography
- Uses clamp() for smooth scaling
- Maintains readability across devices
- Optimized line lengths and spacing

## 🚀 Performance

### Optimization Strategies

#### CSS Performance
- CSS custom properties for dynamic theming
- Efficient selector strategies
- Minimal CSS specificity conflicts

#### Loading Performance
- Critical CSS inlining
- Font display optimization
- Reduced layout shifts

#### Runtime Performance
- Efficient theme switching
- Optimized animations
- Reduced reflows and repaints

### Bundle Size
- Tree-shakeable component imports
- Minimal dependencies
- Optimized build configuration

## 🛠️ Usage

### Installation & Setup

1. **Import Design System**
```tsx
// Import design system CSS
import './styles/design-system.css';

// Import components
import { GlassCard, GlassButton, useTheme } from './components/ui';
```

2. **Configure Theme**
```tsx
function App() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div data-theme={theme}>
      <YourApp />
    </div>
  );
}
```

3. **Use Components**
```tsx
function MyComponent() {
  return (
    <GlassCard variant="medium" className="p-6">
      <h2>Welcome</h2>
      <p>This card uses the glass design system</p>
      <GlassButton variant="primary">
        Get Started
      </GlassButton>
    </GlassCard>
  );
}
```

### Best Practices

#### Component Usage
- Use semantic HTML elements
- Provide proper ARIA labels
- Test keyboard navigation
- Verify color contrast

#### Theme Integration
- Respect system preferences
- Provide manual override options
- Test both light and dark modes
- Ensure smooth transitions

#### Performance
- Import only needed components
- Use CSS custom properties for theming
- Optimize animations for 60fps
- Test on various devices

### Customization

#### CSS Custom Properties
Override design tokens in your CSS:

```css
:root {
  --color-primary-500: #your-brand-color;
  --font-primary: 'Your Font', sans-serif;
  --glass-blur: blur(15px);
}
```

#### Component Variants
Extend components with additional variants:

```tsx
// Add custom variant to existing component
<GlassButton 
  variant="custom" 
  className="bg-gradient-to-r from-purple-500 to-pink-500"
>
  Custom Button
</GlassButton>
```

## 📚 Examples

### Complete Example
See `src/components/examples/DesignSystemShowcase.tsx` for comprehensive usage examples including:

- All component variants and states
- Theme switching demonstration
- Responsive design patterns
- Accessibility features showcase
- Interactive component testing

### Quick Start Template
```tsx
import React from 'react';
import { 
  GlassCard, 
  GlassButton, 
  GlassNavigation, 
  ThemeToggle,
  useTheme 
} from './components/ui';

export function QuickStartApp() {
  const { theme } = useTheme();
  
  return (
    <div data-theme={theme} className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <GlassNavigation 
        items={[
          { label: 'Home', href: '#', active: true },
          { label: 'About', href: '#' }
        ]}
        actions={<ThemeToggle />}
      />
      
      <main className="pt-20 p-8">
        <GlassCard className="max-w-md mx-auto p-8 text-center">
          <h1 className="text-2xl font-bold mb-4 gradient-text">
            Welcome to Glass Design
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            A modern glassmorphism design system with accessibility and dark mode.
          </p>
          <GlassButton variant="primary" size="lg">
            Get Started
          </GlassButton>
        </GlassCard>
      </main>
    </div>
  );
}
```

## 🤝 Contributing

### Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Type checking
npm run type-check

# Lint code
npm run lint
```

### Design Token Updates
- Update `src/styles/design-system.css` for new tokens
- Test across all components and themes
- Verify accessibility compliance
- Update documentation

### Component Development
- Follow existing patterns and conventions
- Include TypeScript interfaces
- Add proper accessibility attributes
- Test with keyboard and screen readers
- Document usage examples

---

Built with ❤️ for the Buddhist Community Platform