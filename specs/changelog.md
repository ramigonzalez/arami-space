# Arami Changelog

All notable changes to the Arami project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.0] - 2025-01-30 - **MAJOR MILESTONE**

### Added

- **MAJOR**: Complete Phase 4 - Core Dashboard Features implementation
  - **User Profile Management**: Comprehensive profile interface with personal information editing, personality profile display, and ritual preferences management
  - **Goals System**: Full CRUD goal management with progress tracking, status management, SMART goal formatting, and comprehensive statistics
  - **Sessions Management**: Complete session tracking with history, analytics, detailed session views, and virtue earning display
  - **Virtue Collection System**: Gamified virtue tracking with rarity levels, visual icons, statistics, and detailed virtue information
  - **Navigation System**: Mobile-first bottom navigation with conditional header display
  - **Layout Enhancements**: Updated layout system with proper mobile optimization and safe area handling

### Technical

- **New Pages**: Profile, Goals, Sessions, Virtues pages with full functionality
- **Navigation Component**: Bottom navigation bar for mobile-optimized experience
- **Database Integration**: Full Supabase CRUD operations for all new features
- **State Management**: Comprehensive form handling and real-time data updates
- **UI Components**: Enhanced modals, forms, and interactive elements
- **Route Integration**: Updated App.tsx with all new routes and protected route handling

### Improved

- **User Experience**: Complete dashboard functionality for user management and progress tracking
- **Mobile Optimization**: All new features designed mobile-first with touch-friendly interactions
- **Data Visualization**: Progress bars, statistics cards, and visual feedback throughout
- **Error Handling**: Comprehensive error handling and loading states across all features
- **Performance**: Optimized database queries and efficient state management

### Features

- **Profile Management**: Edit personal information, view personality assessment, manage ritual preferences
- **Goal Tracking**: Create, edit, delete goals with progress tracking and status management
- **Session History**: View session history with detailed analytics and emotional insights
- **Virtue Collection**: Collect and view virtues with rarity system and earning statistics
- **Progress Analytics**: Comprehensive statistics and progress visualization across all features

## [0.4.4] - 2025-01-30

### Fixed

- **CRITICAL**: Complete email confirmation redirect flow
  - **Email Template Fix**: Updated Supabase email template to use `{{ .RedirectTo }}` instead of `{{ .SiteURL }}`
  - **Result**: Email confirmation links now properly redirect to `/auth/callback` instead of malformed `/#` URLs
  - **Multi-tab Support**: AuthCallback now handles users already authenticated in other tabs
  - **Smart Redirects**: Complete flow from email confirmation → callback → onboarding/dashboard based on user status

### Improved

- **New User Experience**: Seamless email confirmation flow from signup to onboarding
- **Authentication Reliability**: Robust handling of edge cases and multi-tab scenarios
- **Email Links**: Properly formatted confirmation URLs with correct callback parameters

### Technical

- **Email Template Configuration**: Updated to use `{{ .RedirectTo }}` for dynamic redirect URLs
- **AuthCallback Enhancement**: Added already-authenticated user detection and smart redirects
- **Authentication Flow**: Complete end-to-end fix for email signup → confirmation → onboarding

## [0.4.3] - 2025-01-30

### Changed

- **Landing Page**: Removed header elements for cleaner presentation
  - Removed "Arami Space" header bar from landing page
  - Removed Bolt.new badge from landing page
  - Header now only appears for authenticated users (dashboard, onboarding)
  - Cleaner, more focused landing page experience

### Technical

- **Layout Component**: Made header conditional based on user authentication status
- **Landing Page**: Simplified component by removing header-related elements

## [0.4.2] - 2025-01-30

### Fixed

- **CRITICAL**: New user confirmation redirect issue (Complete Fix)
  - **Part 1**: Fixed AuthCallback component hardcoding redirect to /dashboard for all confirmed users
  - **Part 2**: Fixed email signup missing emailRedirectTo configuration
    - Added `emailRedirectTo: /auth/callback` to signUpWithEmail function
    - Email confirmation links now properly redirect to callback route instead of root URL
    - Ensures new users go through proper smart redirect logic based on onboarding status
  - New users now properly redirect to /onboarding after email confirmation
  - Existing users continue to redirect to /dashboard as expected
  - Integrated useAuth hook for proper onboarding status checking
  - Added proper state management to wait for auth initialization before redirecting

### Improved

- **New User Experience**: Seamless flow from email confirmation to onboarding
- **Authentication Flow**: Better handling of post-confirmation redirects based on user state
- **Smart Redirects**: Consistent redirect logic across all authentication entry points
- **Configuration Consistency**: All auth methods now use same callback URL pattern

### Technical

- **AuthCallback Enhancement**: Added useAuth integration and conditional redirect logic
- **State Management**: Proper handling of auth initialization timing in callback flow
- **Auth Configuration**: Added missing emailRedirectTo option in email signup

## [0.4.1] - 2025-01-30

### Fixed

- **CRITICAL**: Navigation bug for users who haven't completed onboarding
  - Fixed race condition in useAuth hook where SIGNED_IN events were ignored during initialization
  - Added retry logic for profile fetching to handle database trigger timing delays
  - Added timeout handling in ProtectedRoute for profile loading scenarios
  - Users now properly navigate to onboarding page after successful sign-in
  - Eliminated cases where authenticated users would be stuck without navigation
- **CRITICAL**: Infinite loading spinner when accessing /onboarding without active session
  - Fixed async retry logic in fetchProfile function that was causing auth state to never initialize
  - Added automatic stale session cleanup when user doesn't exist in database
  - Added 10-second safety timeout to ensure auth state is always initialized
  - Fixed cases where invalid/expired sessions would cause infinite loading states

### Improved

- **Authentication Flow**: Enhanced reliability of auth state management
  - Better error handling and retry mechanisms for profile data fetching
  - Improved debugging logs throughout the authentication flow
  - More robust handling of edge cases in auth state transitions
  - Proper async/await handling in profile fetch retries
- **User Experience**: Smoother onboarding flow with better loading states
  - Added proper loading indicators during profile data retrieval
  - Reduced user confusion during authentication process
  - Added development debug component for troubleshooting auth issues
- **Error Resilience**: Better handling of database inconsistencies
  - Automatic cleanup of stale sessions when user data is missing
  - Graceful fallbacks when profile fetch fails permanently

### Technical

- **Auth State Management**: Removed problematic initialized check in onAuthStateChange handler
- **Profile Loading**: Added 3-second timeout with retry logic for profile fetching
- **Error Resilience**: Better handling of temporary database connection issues
- **Async Flow**: Fixed Promise handling in retry mechanisms to prevent state management issues
- **Safety Mechanisms**: Added multiple timeout safeguards to prevent infinite loading states

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