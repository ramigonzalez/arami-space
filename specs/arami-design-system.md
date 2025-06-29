# Arami Design System

## Overview
Arami's design system emphasizes emotional wellness through thoughtful, calming interfaces that promote mindfulness and personal growth. The system prioritizes accessibility, emotional resonance, and user-centered design principles.

## Mobile-First Design

### Primary Target Device
- **iPhone 14 Pro optimization**: All UI components and layouts are designed and implemented with iPhone 14 Pro dimensions as the primary target (393×852 points)
- **Safe area considerations**: Account for notch, dynamic island, and home indicator in layout calculations
- **Touch-friendly interactions**: Minimum 44pt touch targets, appropriate spacing for thumb navigation

### Responsive Strategy
- **Mobile-first approach**: Start with mobile design and progressively enhance for larger screens
- **Breakpoint strategy**: 
  - Mobile: 320px - 768px (primary focus)
  - Tablet: 768px - 1024px (secondary)
  - Desktop: 1024px+ (tertiary)
- **Content prioritization**: Essential content and actions visible on mobile without horizontal scrolling

### Mobile UX Principles
- **One-handed operation**: Primary actions accessible within thumb reach
- **Gesture-friendly**: Support swipe, tap, and long-press interactions where appropriate
- **Performance-conscious**: Optimize for mobile network conditions and battery life

## Layout and Scrolling Architecture

### Fixed-Box Principle
- **Container stability**: Use fixed-height containers for predictable layout behavior
- **Internal scrolling**: Content exceeding container dimensions should scroll internally, not expand the container
- **Visual consistency**: Maintain consistent visual structure across different content volumes

### Scrolling Guidelines
- **Avoid global page scroll**: Prefer fixed layouts with internal scrollable areas
- **Scroll indicators**: Provide clear visual cues when content is scrollable
- **Smooth scrolling**: Implement momentum scrolling and appropriate scroll physics
- **Scroll boundaries**: Define clear start/end points for scrollable content

### Implementation Examples
```tsx
// Fixed container with internal scroll
<div className="h-96 overflow-y-auto">
  {/* Scrollable content */}
</div>

// Full-height container that adapts to parent
<div className="flex-1 overflow-y-auto">
  {/* Dynamic height with internal scroll */}
</div>
```

## Color Palette

### Primary Colors
- **Arami Purple**: `#846fda` - Primary brand color, used for key actions and highlights
- **Deep Purple**: `#6556b9` - Secondary brand color, used for depth and contrast
- **Lavender**: `#ba9be6` - Accent color, used for gentle highlights and secondary elements

### Neutral Colors
- **Pure White**: `#ffffff` - Primary text on dark backgrounds, card backgrounds
- **Soft White**: `rgba(255, 255, 255, 0.9)` - Secondary text, subtle elements
- **Muted White**: `rgba(255, 255, 255, 0.7)` - Tertiary text, placeholders
- **Whisper White**: `rgba(255, 255, 255, 0.1)` - Subtle borders, dividers

### Semantic Colors
- **Success**: `#10b981` - Positive actions, completed states
- **Warning**: `#f59e0b` - Caution, pending states
- **Error**: `#ef4444` - Errors, destructive actions
- **Info**: `#3b82f6` - Information, neutral actions

## Typography

### Font Family
- **Primary**: Inter - Clean, readable, modern sans-serif
- **Fallback**: system-ui, -apple-system, sans-serif

### Font Weights
- **Light**: 300 - Subtle text, large headings
- **Regular**: 400 - Body text, standard content
- **Medium**: 500 - Emphasized text, subheadings
- **Semibold**: 600 - Important headings, key information
- **Bold**: 700 - Primary headings, strong emphasis

### Type Scale (Mobile-Optimized)
- **Display**: 2rem (32px) - Hero headings, major page titles
- **Heading 1**: 1.5rem (24px) - Primary section headings
- **Heading 2**: 1.25rem (20px) - Secondary headings
- **Heading 3**: 1.125rem (18px) - Tertiary headings
- **Body Large**: 1rem (16px) - Primary body text
- **Body**: 0.875rem (14px) - Secondary body text
- **Caption**: 0.75rem (12px) - Small text, metadata

### Line Heights
- **Headings**: 1.2 - Tight spacing for impact
- **Body Text**: 1.5 - Comfortable reading
- **UI Text**: 1.4 - Balanced for interface elements

## Spacing System

### Base Unit: 4px
All spacing follows a 4px grid system for consistency and alignment.

### Spacing Scale
- **xs**: 4px - Minimal spacing, tight elements
- **sm**: 8px - Small spacing, related elements
- **md**: 16px - Medium spacing, section separation
- **lg**: 24px - Large spacing, major sections
- **xl**: 32px - Extra large spacing, page sections
- **2xl**: 48px - Maximum spacing, major separations

### Mobile Spacing Considerations
- **Touch targets**: Minimum 44px (11 units) for interactive elements
- **Content margins**: 16px (4 units) minimum from screen edges
- **Section spacing**: 24px (6 units) between major content blocks

## Component Guidelines

### Cards
- **Glass effect**: Semi-transparent backgrounds with blur
- **Rounded corners**: 12px border radius for modern feel
- **Subtle shadows**: Soft shadows for depth without harshness
- **Padding**: Consistent internal spacing (16px, 24px, 32px options)

### Buttons
- **Primary**: Solid purple background, white text
- **Secondary**: Transparent background, purple border
- **Ghost**: Transparent background, no border
- **Sizes**: Small (32px), Medium (40px), Large (48px) heights

### Forms
- **Input fields**: Rounded corners, subtle borders, focus states
- **Labels**: Clear hierarchy, proper spacing
- **Validation**: Inline feedback, clear error states
- **Mobile optimization**: Large touch targets, appropriate keyboards

## Animation and Interactions

### Animation Principles
- **Purposeful**: Animations should guide user attention and provide feedback
- **Subtle**: Gentle transitions that don't distract from content
- **Performance**: 60fps animations, hardware acceleration when possible
- **Accessibility**: Respect reduced motion preferences

### Transition Timing
- **Fast**: 150ms - Hover states, small changes
- **Medium**: 300ms - Page transitions, modal appearances
- **Slow**: 500ms - Complex animations, state changes

### Easing Functions
- **ease-out**: Default for most transitions
- **ease-in-out**: For reversible animations
- **spring**: For playful, organic movements

## Accessibility

### Color Contrast
- **Text on backgrounds**: Minimum 4.5:1 ratio for normal text
- **Large text**: Minimum 3:1 ratio for 18px+ text
- **Interactive elements**: Clear visual distinction from non-interactive content

### Focus Management
- **Visible focus indicators**: Clear outline or background change
- **Logical tab order**: Sequential navigation through interactive elements
- **Skip links**: Allow keyboard users to bypass repetitive content

### Screen Reader Support
- **Semantic HTML**: Proper heading hierarchy, landmark elements
- **ARIA labels**: Descriptive labels for complex interactions
- **Live regions**: Announce dynamic content changes

## Implementation Notes

### CSS Custom Properties
Use CSS custom properties for consistent theming:
```css
:root {
  --color-primary: #846fda;
  --color-primary-dark: #6556b9;
  --color-accent: #ba9be6;
  --spacing-unit: 4px;
  --border-radius: 12px;
}
```

### Tailwind Configuration
Extend Tailwind with custom colors and spacing:
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#846fda',
          600: '#6556b9',
        },
        accent: {
          300: '#ba9be6',
        }
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      }
    }
  }
}
```

### Component Structure
Follow consistent patterns for component organization:
- Props interface definition
- Component implementation
- Default props and exports
- Proper TypeScript typing

This design system ensures consistent, accessible, and emotionally resonant interfaces that support Arami's mission of personal wellness and growth, with a strong focus on mobile-first design and predictable layout behavior through fixed containers and internal scrolling.