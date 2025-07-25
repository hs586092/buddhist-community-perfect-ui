# Glass Design System - Quick Start Guide

A modern glassmorphism design system with dark mode support and accessibility compliance.

## 🚀 Quick Implementation

### 1. Import Components

```tsx
import { 
  GlassCard, 
  GlassButton, 
  GlassInput,
  GlassModal,
  GlassNavigation,
  ThemeToggle,
  useTheme 
} from './components/ui';
```

### 2. Setup Theme

```tsx
function App() {
  const { theme } = useTheme();
  
  return (
    <div data-theme={theme}>
      {/* Your app content */}
    </div>
  );
}
```

### 3. Basic Usage

```tsx
function MyComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <GlassCard className="max-w-md mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4 gradient-text">
          Welcome
        </h1>
        <GlassInput 
          label="Email" 
          type="email" 
          placeholder="your@email.com" 
        />
        <GlassButton variant="primary" className="w-full mt-4">
          Get Started
        </GlassButton>
      </GlassCard>
    </div>
  );
}
```

## 🎨 Component Gallery

### GlassCard Variants
```tsx
<GlassCard variant="light">Light glass effect</GlassCard>
<GlassCard variant="medium">Medium glass effect</GlassCard>  
<GlassCard variant="strong">Strong glass effect</GlassCard>
```

### Button Variants
```tsx
<GlassButton variant="primary">Primary</GlassButton>
<GlassButton variant="glass">Glass</GlassButton>
<GlassButton variant="secondary">Secondary</GlassButton>
<GlassButton variant="ghost">Ghost</GlassButton>
```

### Input Features
```tsx
<GlassInput 
  label="Username"
  error="Username is required"
  leftIcon={<UserIcon />}
  helperText="3-20 characters"
  required
/>
```

### Theme Toggle Options
```tsx
<ThemeToggle variant="icon" />
<ThemeToggle variant="switch" showLabel />
<ThemeToggle variant="dropdown" />
```

## 🎯 Key Features

✅ **Glassmorphism Effects** - Modern glass aesthetics with backdrop blur  
✅ **Dark Mode Support** - Automatic system detection + manual override  
✅ **Accessibility First** - WCAG 2.1 AA compliant with screen reader support  
✅ **Responsive Design** - Mobile-first with fluid typography  
✅ **TypeScript Ready** - Full type safety and IntelliSense  
✅ **Performance Optimized** - CSS custom properties and efficient animations  

## 🌙 Theme System

### Auto Theme Detection
```tsx
const { theme, setTheme, toggleTheme, isDark } = useTheme();

// Cycle through: light → dark → system
toggleTheme();

// Set specific theme
setTheme('dark');
```

### CSS Custom Properties
The system uses CSS custom properties for efficient theming:

```css
:root {
  --text-primary: var(--color-neutral-900);
  --bg-primary: var(--color-neutral-0);
}

[data-theme="dark"] {
  --text-primary: var(--color-neutral-50);
  --bg-primary: var(--color-neutral-900);
}
```

## ♿ Accessibility Features

- **Keyboard Navigation**: Full keyboard support with logical tab order
- **Screen Readers**: ARIA labels, descriptions, and live regions
- **High Contrast**: Supports high contrast mode preferences  
- **Reduced Motion**: Respects prefers-reduced-motion setting
- **Focus Management**: Visible focus indicators and focus trapping
- **Color Contrast**: WCAG AA compliant color combinations

## 📱 Responsive Utilities

```css
/* Breakpoints */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */  
lg: 1024px  /* Laptop */
xl: 1280px  /* Desktop */
2xl: 1536px /* Large screens */
```

## 🎨 Color Palette

### Primary (Blue)
- 50-950 scale with semantic meaning
- Used for: Primary actions, links, focus states

### Secondary (Amber)  
- 50-950 scale for secondary actions
- Used for: Warnings, highlights, secondary CTAs

### Semantic Colors
- **Success**: Green (#10b981)
- **Warning**: Amber (#f59e0b)  
- **Error**: Red (#ef4444)
- **Info**: Blue (#0ea5e9)

### Glassmorphism Tokens
```css
--glass-bg-light: rgba(255, 255, 255, 0.1);
--glass-bg-medium: rgba(255, 255, 255, 0.15);
--glass-bg-strong: rgba(255, 255, 255, 0.25);
--glass-blur: blur(20px);
--glass-backdrop: blur(20px) saturate(180%);
```

## 🔧 Customization

### Override Design Tokens
```css
:root {
  --color-primary-500: #your-brand-color;
  --font-primary: 'Your Font', sans-serif;  
  --glass-blur: blur(15px);
  --radius-base: 0.5rem;
}
```

### Extend Components
```tsx
<GlassButton 
  className="bg-gradient-to-r from-purple-500 to-pink-500"
  variant="primary"
>
  Custom Styled Button  
</GlassButton>
```

## 🧪 Testing

### Accessibility Testing
```bash
npm run test:a11y      # Automated accessibility tests
npm run audit:a11y     # Lighthouse accessibility audit
```

### Manual Testing Checklist
- [ ] Keyboard navigation works for all interactive elements
- [ ] Screen reader announcements are clear and helpful
- [ ] High contrast mode displays properly  
- [ ] All text has sufficient color contrast (4.5:1 minimum)
- [ ] Animation respects reduced motion preferences
- [ ] Focus indicators are visible and clear

## 🔗 File Structure

```
src/
├── styles/
│   └── design-system.css     # Core design tokens & styles
├── components/ui/
│   ├── GlassCard.tsx        # Card component
│   ├── GlassButton.tsx      # Button variants  
│   ├── GlassInput.tsx       # Form inputs
│   ├── GlassModal.tsx       # Modal dialogs
│   ├── GlassNavigation.tsx  # Navigation bar
│   ├── ThemeToggle.tsx      # Theme switcher
│   └── index.ts             # Component exports
├── hooks/
│   ├── useTheme.ts          # Theme management
│   └── index.ts             # Hook exports
└── components/examples/
    └── DesignSystemShowcase.tsx # Usage examples
```

## 📖 Full Documentation

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for comprehensive documentation including:
- Complete component API reference
- Advanced customization patterns  
- Performance optimization tips
- Accessibility testing guidelines
- Contributing guidelines

---

Built with ❤️ for modern web applications requiring beautiful, accessible UI components.