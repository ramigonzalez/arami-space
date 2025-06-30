# Arami Changelog

All notable changes to the Arami project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2025-01-25 - **MAJOR MILESTONE**

### Fixed

- **CRITICAL**: Authentication redirect issues preventing users from accessing the app after successful sign-in
  - Users no longer get stuck on auth page after email/password authentication
  - Phone verification now properly redirects to appropriate page
  - Magic link authentication now works with proper redirection
  - Fixed "Redirecting!" messages that never actually performed navigation

### Added

- **Auth Component Enhancement**: Proper redirect logic after successful authentication
  - Integrated useAuth hook and useNavigate in Auth.tsx
  - Automatic navigation to appropriate page based on onboarding completion status
  - Loading state handling during authentication process
- **Smart Routing System**: Intelligent catch-all route handling
  - Created SmartRedirect component that considers authentication and onboarding status
  - Prevents redirect loops and provides appropriate fallbacks
  - Handles loading states during authentication initialization

### Improved

- **ProtectedRoute Logic**: Enhanced routing logic for better user flow
  - Added explicit checks for dashboard/onboarding access based on completion status
  - Prevents users from accessing wrong pages based on their onboarding state
  - Better error handling and loading state management
- **User Experience**: Seamless authentication flow across all methods
  - Email sign-in → Automatic redirect to /onboarding or /dashboard
  - Phone verification → Automatic redirect to /onboarding or /dashboard
  - Magic link → Automatic redirect to /onboarding or /dashboard
  - Eliminated user confusion and friction in authentication process

### Technical

- **Routing Architecture**: Improved React Router implementation with proper state management
- **Authentication State**: Better integration between auth state and navigation logic
- **Error Prevention**: Eliminated potential redirect loops and navigation race conditions

## [0.3.2] - 2024-06-28

### Changed

- Refactored authentication and onboarding flow for new users to prevent navigation loops and improve reliability.

### Fixed

- Removed duplicate navigation and navigation loops in Auth.tsx that caused excessive reloads for new users.

### Improved

- useAuth now avoids simultaneous profile fetches and provides a more accurate loading state.
- Added debounce to post-login navigation to prevent rapid redirects.
- Simplified routing logic in AppRouter for a more predictable user experience.

## [0.3.1] - 2025-01-25

### Fixed

- **CongratulationsStep Layout**: Fixed button visibility and scrolling issues
  - Button now always visible without scrolling, positioned inside the rounded glass container
  - Implemented proper internal scrolling for content area using `flex-1 overflow-y-auto`
  - Enhanced visual hierarchy with compact spacing and better information display
  - Improved mobile-friendly layout with proper flex structure (header, scrollable content, fixed button)
  - Better space utilization with smaller text and icons for improved information density

### Improved

- **Onboarding UX**: Enhanced final step user experience with better layout control
- **Mobile Optimization**: Better content organization for mobile viewport constraints
- **Visual Design**: More compact and readable information display in congratulations step

## [0.3.0] - 2025-01-25

### Removed

- **PWA Features**: Removed Progressive Web App functionality from project scope
  - Removed offline capability requirements
  - Removed app-like navigation constraints
  - Removed home screen installation features
  - Simplified to responsive web application approach

### Changed

- **Product Requirements Document**: Updated PRD to reflect web-first approach instead of PWA
- **Technical Architecture**: Simplified frontend stack without PWA constraints
- **Project Scope**: Focused on responsive web design with mobile-first principles

### Technical

- **Architecture Simplification**: Removed PWA-specific technical requirements
- **Documentation Updates**: Updated all project documentation to reflect scope change

## [0.2.0] - 2025-01-25

### Added

- **Mobile-First Design System**: Comprehensive design system documentation with iPhone 14 Pro optimization
- **Fixed-Box Layout Architecture**: Implementation of containers with internal scrolling to prevent layout shifts
- **Enhanced Conversation Interface**: Improved message bubble layout and alignment for better user experience
- **Responsive Message Layout**: User and AI messages now have proper alignment and spacing
- **Safe Area Support**: Added support for iPhone notch, dynamic island, and home indicator considerations

### Changed

- **ConversationInterface Component**:
  - Switched from fixed height (h-96) to flexible height (flex-1) for better container utilization
  - Improved message bubble alignment with proper flex layouts
  - Enhanced user message alignment (right-aligned) vs AI messages (left-aligned)
  - Added proper text wrapping with `break-words` for long messages
  - Reduced maximum message width from 80% to 75% for better readability
- **Design System Documentation**: Updated with mobile-first principles and fixed-box layout guidelines
- **Project Plan**: Updated to reflect completed design system work and current UI/UX improvements

### Improved

- **Mobile User Experience**: Better touch targets and spacing for mobile devices
- **Visual Hierarchy**: Clearer distinction between user and AI messages
- **Scrolling Behavior**: Smoother internal scrolling within fixed containers
- **Typography**: Enhanced readability with proper line heights and text wrapping

### Technical

- **Layout Architecture**: Implemented fixed-box principle across conversation interface
- **CSS Optimization**: Better use of Flexbox for responsive message layouts
- **Component Structure**: Improved component organization and prop handling

## [0.1.0] - 2025-01-20

### Added

- **Project Foundation**: Initial Vite + React + TypeScript setup
- **Authentication System**: Supabase integration with email/password authentication
- **Database Schema**: Comprehensive schema for user profiles, onboarding, and wellness tracking
- **Landing Page**: Complete landing page with hero, features, testimonials, and CTA sections
- **Core UI Components**: Button, Card, Input, Modal, Badge components with Arami styling
- **Onboarding Flow**: Multi-step onboarding with ElevenLabs voice integration
- **Voice Interaction**: AI-driven personality discovery through voice conversations
- **Protected Routes**: Authentication-based route protection
- **Dashboard Structure**: Basic dashboard layout and navigation

### Technical

- **Supabase Setup**: Database, authentication, and edge functions configuration
- **ElevenLabs Integration**: Voice conversation API integration
- **Row Level Security**: Comprehensive RLS policies for data protection
- **TypeScript Configuration**: Strict typing and best practices implementation
- **Tailwind CSS**: Custom design system with Arami branding
- **Mobile Optimization**: Responsive design with mobile-first approach

### Database

- **User Management**: Profiles, onboarding data, and preferences tables
- **Wellness Tracking**: Goals, sessions, virtues, and streaks tables
- **Communication**: Contacts, calls, and messaging infrastructure
- **AI Integration**: Conversation history and mentor avatar management

---

## Version Numbering

- **Major (X.0.0)**: Breaking changes, major feature releases
- **Minor (0.X.0)**: New features, significant improvements
- **Patch (0.0.X)**: Bug fixes, minor improvements

## Categories

- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements
- **Technical**: Technical improvements, refactoring
- **Database**: Database schema changes
- **Improved**: Performance or UX improvements
