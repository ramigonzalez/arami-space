# Arami Design System - Premium Emotional AI

## Brand Philosophy
Arami is a premium emotional AI wellness platform that provides a safe, sophisticated space for personal growth and reflection. Our design language embodies tranquility, depth, and emotional intelligence through carefully crafted dark aesthetics.

## Design Principles

### 1. Emotional Depth
- Designs should evoke safety, introspection, and premium care
- Use depth and subtle gradients to create sanctuary-like experiences
- Every interaction should feel ritualistic and meaningful

### 2. Sophisticated Minimalism  
- Premium simplicity over flashy complexity
- Breathing room and thoughtful spacing
- Quality over quantity in every design decision

### 3. Accessible Luxury
- High contrast for accessibility while maintaining premium feel
- Inclusive design that doesn't sacrifice sophistication
- Dark theme that reduces eye strain during emotional sessions

## Color System

### Core Brand Palette

#### Deep Backgrounds
- **Surface 900**: `#0E062A` - Primary app background, deepest sanctuary space
- **Surface 800**: `#130C3C` - Card backgrounds, elevated content areas  
- **Surface 700**: `#1C1433` - Hover states, interactive backgrounds
- **Surface 600**: `#23143E` - Border accents, subtle dividers

#### Primary Actions & Energy
- **Primary 600**: `#6556B9` - Main CTAs, active states, brand moments
- **Primary 500**: `#7C6FCC` - Hover states for primary actions
- **Primary 400**: `#846FDA` - Focus rings, gentle highlights
- **Primary 300**: `#9D93E3` - Disabled states, subtle accents

#### Ethereal Accents
- **Accent 300**: `#BA9BE6` - Glyph highlights, magical moments
- **Accent 200**: `#C8B4EA` - Gentle borders, soft emphasis  
- **Accent 100**: `#D6C9EE` - Background tints, ultra-subtle highlights

#### Text & Content
- **Neutral 0**: `#F5EFE8` - Primary text on dark, warm white
- **Neutral 100**: `rgba(245, 239, 232, 0.9)` - Secondary text, labels
- **Neutral 200**: `rgba(245, 239, 232, 0.7)` - Tertiary text, captions
- **Neutral 300**: `rgba(245, 239, 232, 0.5)` - Placeholder text, disabled content
- **Neutral 400**: `rgba(245, 239, 232, 0.3)` - Subtle borders, dividers

### Gradient Definitions

#### Background Gradients
```css
/* Primary app background */
--gradient-sanctuary: radial-gradient(circle at 50% 45%, #23143e 0%, #1c1433 40%, #130c3c 70%, #0e062a 100%);

/* Card elevated surfaces */
--gradient-elevation: linear-gradient(135deg, rgba(19, 12, 60, 0.8) 0%, rgba(23, 20, 62, 0.6) 100%);

/* Primary action buttons */
--gradient-primary: linear-gradient(135deg, #846fda 0%, #6556b9 100%);

/* Accent highlights */
--gradient-accent: linear-gradient(135deg, #ba9be6 0%, #9d93e3 100%);
```

### State Colors

#### Success (Growth & Achievement)
- **Success 600**: `#10B981` - Success actions, positive feedback
- **Success 100**: `rgba(16, 185, 129, 0.1)` - Success background tint

#### Warning (Gentle Guidance)  
- **Warning 600**: `#F59E0B` - Gentle warnings, guidance moments
- **Warning 100**: `rgba(245, 158, 11, 0.1)` - Warning background tint

#### Error (Compassionate Feedback)
- **Error 600**: `#EF4444` - Error states, important feedback
- **Error 100**: `rgba(239, 68, 68, 0.1)` - Error background tint

#### Info (Insights & Learning)
- **Info 600**: `#3B82F6` - Information, learning moments  
- **Info 100**: `rgba(59, 130, 246, 0.1)` - Info background tint

## Typography

### Font Families
- **Primary**: Inter (sophisticated, highly legible sans-serif)
- **Display**: Inter with increased letter-spacing for emotional impact
- **Fallback**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

### Font Scale & Usage

#### Headings (Emotional Hierarchy)
- **Heading 1**: `text-3xl font-semibold` (30px) - Page titles, profound moments
- **Heading 2**: `text-2xl font-semibold` (24px) - Section headers, reflection topics  
- **Heading 3**: `text-xl font-medium` (20px) - Subsections, guidance topics
- **Heading 4**: `text-lg font-medium` (18px) - Card titles, small sections

#### Body Text (Breathing & Comfort)
- **Body Large**: `text-lg leading-relaxed` (18px/1.625) - Important content, emotional text
- **Body**: `text-base leading-relaxed` (16px/1.625) - Default body text
- **Body Small**: `text-sm leading-relaxed` (14px/1.625) - Supporting text, captions

#### UI Text (Functional Clarity)
- **Label**: `text-sm font-medium` (14px) - Form labels, button text
- **Caption**: `text-xs font-medium` (12px) - Metadata, timestamps
- **Micro**: `text-xs` (12px) - Fine print, technical details

### Typography Principles
- **Letter Spacing**: Add `tracking-wide` (0.025em) to headings for breathing room
- **Line Height**: Use `leading-relaxed` (1.625) as default for comfortable reading
- **Contrast**: Ensure 4.5:1 minimum contrast ratio against dark backgrounds

## Spacing & Layout

### Spacing Scale (Rhythm of Calm)
Based on 8px increments for harmonic proportions:

- **0.5**: `2px` - Micro adjustments
- **1**: `4px` - Minimal spacing  
- **2**: `8px` - Small gaps
- **3**: `12px` - Comfortable spacing
- **4**: `16px` - Standard spacing
- **5**: `20px` - Generous spacing
- **6**: `24px` - Section spacing
- **8**: `32px` - Large section breaks
- **10**: `40px` - Page-level spacing
- **12**: `48px` - Major section divisions
- **16**: `64px` - Page margins

### Component Spacing
- **Card Padding**: `p-8` (32px) - Breathing room for content
- **Modal Padding**: `p-10` (40px) - Extra space for focus
- **Button Padding**: `py-4 px-6` (16px/24px) - Comfortable touch targets
- **Input Padding**: `py-3 px-4` (12px/16px) - Balanced field size
- **Form Gaps**: `gap-6` (24px) - Comfortable form rhythm

## Shadows & Elevation

### Shadow System (Floating in Space)
```css
/* Subtle elevation for cards */
--shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);

/* Modal and important overlays */
--shadow-modal: 0 25px 50px -12px rgba(0, 0, 0, 0.5);

/* Floating action buttons */
--shadow-floating: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3);

/* Inset glow for premium feel */
--shadow-inset: inset 0 1px 0 rgba(255,255,255,0.1);
```

### Border Radius (Soft Sanctuary)
- **Small**: `rounded-lg` (8px) - Buttons, small elements
- **Medium**: `rounded-xl` (12px) - Cards, inputs  
- **Large**: `rounded-2xl` (16px) - Major containers
- **Premium**: `rounded-3xl` (24px) - Hero elements, special cards

## Glassmorphism & Premium Effects

### Glass Elements
```css
/* Premium card background */
.glass-card {
  background: rgba(19, 12, 60, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(186, 155, 230, 0.2);
}

/* Subtle texture overlay */
.grain-texture {
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(255,255,255,0.03) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(255,255,255,0.02) 0%, transparent 50%);
}
```

## Component Patterns

### Buttons (Actions with Intent)

#### Primary CTA (Life-Changing Moments)
```css
.btn-primary {
  background: linear-gradient(135deg, #846fda 0%, #6556b9 100%);
  color: #F5EFE8;
  font-weight: 600;
  padding: 16px 24px;
  border-radius: 12px;
  transition: all 200ms ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
}

.btn-primary:hover {
  transform: scale(1.02);
  filter: brightness(110%);
  box-shadow: 0 6px 8px -1px rgba(0, 0, 0, 0.4);
}
```

#### Secondary (Supportive Actions)
```css
.btn-secondary {
  background: transparent;
  border: 1px solid rgba(186, 155, 230, 0.4);
  color: #BA9BE6;
  font-weight: 500;
  padding: 16px 24px;
  border-radius: 12px;
  transition: all 200ms ease;
}

.btn-secondary:hover {
  background: rgba(186, 155, 230, 0.1);
  border-color: rgba(186, 155, 230, 0.6);
}
```

### Input Fields (Safe Expression)
```css
.input-field {
  background: rgba(14, 6, 42, 0.6);
  border: 1px solid rgba(186, 155, 230, 0.3);
  color: #F5EFE8;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 16px;
  transition: all 200ms ease;
  backdrop-filter: blur(10px);
}

.input-field:focus {
  outline: none;
  border-color: #846FDA;
  box-shadow: 0 0 0 3px rgba(132, 111, 218, 0.2);
  background: rgba(14, 6, 42, 0.8);
}

.input-field::placeholder {
  color: rgba(245, 239, 232, 0.5);
}
```

### Cards (Sacred Containers)
```css
.card-premium {
  background: rgba(19, 12, 60, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(186, 155, 230, 0.2);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255,255,255,0.1);
}
```

## Animation & Interaction

### Micro-Interactions (Mindful Responses)
```css
/* Breathing animation for primary CTAs */
@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.btn-breathing {
  animation: breathe 3s ease-in-out infinite;
}

/* Gentle fade-in for content */
.fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Transition Standards
- **Fast interactions**: `150ms ease` - Button hovers, simple state changes
- **Standard transitions**: `200ms ease` - Form interactions, card hovers  
- **Slow reveals**: `400ms ease-out` - Content appearing, modal opens
- **Breathing moments**: `3s ease-in-out` - Subtle life in static elements

## Accessibility Standards

### Contrast Requirements
- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text**: Minimum 3:1 contrast ratio  
- **Interactive elements**: Minimum 3:1 contrast ratio
- **Focus indicators**: High contrast outlines with 3px minimum thickness

### Keyboard Navigation
- Clear focus indicators on all interactive elements
- Logical tab order through forms and interfaces
- Escape key functionality for modals and overlays

### Screen Reader Support
- Semantic HTML structure
- ARIA labels for complex interactions
- Alt text for meaningful images
- Live regions for dynamic content updates

## Implementation Guidelines

### CSS Custom Properties Setup
```css
:root {
  /* Colors */
  --color-surface-900: #0E062A;
  --color-surface-800: #130C3C;
  --color-surface-700: #1C1433;
  --color-primary-600: #6556B9;
  --color-primary-400: #846FDA;
  --color-accent-300: #BA9BE6;
  --color-neutral-0: #F5EFE8;
  
  /* Gradients */
  --gradient-sanctuary: radial-gradient(circle at 50% 45%, #23143e 0%, #1c1433 40%, #130c3c 70%, #0e062a 100%);
  --gradient-primary: linear-gradient(135deg, #846fda 0%, #6556b9 100%);
  
  /* Shadows */
  --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
  --shadow-modal: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
```

### Tailwind CSS Configuration
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        surface: {
          900: '#0E062A',
          800: '#130C3C',
          700: '#1C1433',
          600: '#23143E'
        },
        primary: {
          600: '#6556B9',
          500: '#7C6FCC',
          400: '#846FDA',
          300: '#9D93E3'
        },
        accent: {
          300: '#BA9BE6',
          200: '#C8B4EA',
          100: '#D6C9EE'
        },
        neutral: {
          0: '#F5EFE8'
        }
      },
      backgroundImage: {
        'sanctuary': 'radial-gradient(circle at 50% 45%, #23143e 0%, #1c1433 40%, #130c3c 70%, #0e062a 100%)',
        'primary-gradient': 'linear-gradient(135deg, #846fda 0%, #6556b9 100%)'
      }
    }
  }
}
```

## Usage Examples

### Auth Page Implementation
```jsx
<div className="min-h-screen bg-sanctuary">
  <div className="card-premium max-w-md mx-auto">
    <h1 className="text-3xl font-semibold text-neutral-0 tracking-wide mb-2">
      Welcome Back
    </h1>
    <p className="text-base text-neutral-200 leading-relaxed mb-8">
      Return to your inner sanctuary
    </p>
    
    <form className="space-y-6">
      <input 
        className="input-field w-full" 
        placeholder="Your email"
      />
      <button className="btn-primary w-full btn-breathing">
        Enter Your Space
      </button>
    </form>
  </div>
</div>
```

This design system embodies Arami's mission: creating a premium, accessible sanctuary for emotional growth through sophisticated dark aesthetics and mindful interactions.