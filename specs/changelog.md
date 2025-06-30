# Changelog

All notable changes to the Arami project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.1] - 2025-01-30

### Fixed

- **CRITICAL**: Dashboard refresh redirect bug resolved
  - Fixed issue where logged users who completed onboarding were redirected to /onboarding when refreshing /dashboard
  - Enhanced ProtectedRoute logic to wait for profile data before making onboarding completion decisions
  - Prevents race condition where null profile was interpreted as incomplete onboarding
  - Users can now refresh dashboard without incorrect redirects

### Improved

- **Onboarding Page Header**: Enhanced header design and branding
  - Added "Arami Space" title and user avatar to onboarding page header
  - Improved visual consistency across the application
  - Maintained progress indicator while adding proper app branding
  - Better user experience throughout onboarding flow

### Technical

- **ProtectedRoute Enhancement**: Improved authentication and routing logic
  - Added conditional logic to wait for profile data or timeout before redirect decisions
  - Better handling of loading states during profile fetching
  - Prevents premature routing decisions based on incomplete data

## [0.5.0] - 2025-01-30 - **MAJOR MILESTONE**
## [Phase 5] - 2025-01-28 - Face-to-Face Session Implementation

### Added
- **Backend Edge Functions**:
  - `supabase/functions/start-tavus-session/index.ts` - Initiates Tavus video conversations with comprehensive user context
  - `supabase/functions/end-tavus-session/index.ts` - Properly terminates sessions and updates database records
  - `supabase/functions/tavus-webhook/index.ts` - Processes post-session data and transcripts from Tavus

- **Complete Dashboard System**: Full-featured dashboard implementation

  - User profile management with personal information editing
  - Goals system with CRUD operations and progress tracking
  - Sessions management with history and analytics
  - Virtue collection system with rarity-based gamification
  - Comprehensive statistics and progress visualization

- **Navigation System**: Mobile-first bottom navigation

  - Dashboard, Profile, Goals, Sessions, and Virtues pages
  - Responsive design optimized for mobile devices
  - Proper route integration and state management

- **Profile Management**: Comprehensive user profile interface

  - Personal information editing with validation
  - Personality profile display from onboarding data
  - Ritual preferences management with modal interface
  - Account settings and subscription information

- **Goals System**: Full goal management functionality

  - Goal creation, editing, and deletion
  - Progress tracking with visual indicators
  - Status management (active, completed, paused, archived)
  - Goal categorization and SMART goal support
  - Statistics dashboard with filtering and search

- **Sessions Interface**: Session tracking and management

  - Session history with detailed information
  - Session statistics and completion tracking
  - Session type filtering and status management
  - Detailed session modals with insights

- **Virtue Collection**: Gamified virtue tracking system
  - Virtue collection with rarity system
  - Visual virtue display with color-coded gradients
  - Virtue statistics and earning history
  - Streak tracking and achievement display
- **Frontend Services**:
  - `src/lib/sessionService.ts` - Comprehensive service for managing Tavus sessions and mentor personas
  - Enhanced session management with proper error handling and type safety

- **UI Components**:
  - `src/components/session/VideoCallUI.tsx` - Professional video call interface matching provided screenshots
  - `src/components/session/SessionTypeSelector.tsx` - Session type and mentor selection interface
  - Mobile-responsive design with proper call controls and user avatar display

- **Component Architecture**: Modular and reusable components
  - Enhanced UI component library
  - Proper TypeScript integration
  - Modal management and state handling
  - Form validation and error handling
- **Pages**:
  - `src/pages/FaceToFaceSessionPage.tsx` - Dedicated page for managing active video sessions
  - Updated `src/pages/Sessions.tsx` - Enhanced with session initiation flow and recent session history
  - Updated `src/App.tsx` - Added routing for face-to-face sessions

### Enhanced
- **User Context Integration**: Comprehensive user data (onboarding, preferences, goals, emotional categories) passed to Tavus AI
- **Session Lifecycle Management**: Complete flow from initiation to completion with proper database updates
- **Error Handling**: Robust error handling throughout session flow with user-friendly messages
- **Loading States**: Proper loading indicators during session start, active call, and termination

### Technical Implementation
- **Tavus API Integration**: Complete integration with conversation creation, management, and webhook processing
- **Database Updates**: Proper tracking in mentor_conversations and daily_sessions tables
- **State Management**: Clean session state management with navigation between components
- **Security**: Proper authentication and user data access controls

### Database Schema
- Utilized existing mentor_conversations and daily_sessions tables
- Leveraged user_personas table for mentor selection
- Proper RLS policies for secure user data access

### Next Steps
- Configure Tavus API keys in environment variables
- Test complete flow with actual Tavus API
- Implement remaining session types (spoken presence, silent reflection, written clarity)
- Add post-session analytics and insights

## [Phase 4] - 2025-01-28 - Ritual Preferences Update

### Enhanced
- **Ritual Preferences Form**: Complete form with all preference options
- **Profile Integration**: Display preferences in user profile
- **Service Layer**: Robust service for managing ritual preferences
- **Validation**: Proper form validation and error handling

- **CRITICAL**: Complete email confirmation redirect flow fix (Final Resolution)
  - **Part 3**: Updated Supabase email template configuration
    - Changed email template from `{{ .SiteURL }}` to `{{ .RedirectTo }}`
    - Email confirmation links now properly formatted with callback parameters
    - Fixed malformed URLs that were ending with just "#"
  - **Multi-tab handling**: Added detection for already-authenticated users
    - AuthCallback now detects when user is already authenticated in another tab
    - Provides appropriate redirect without unnecessary auth state changes
    - Prevents conflicts when clicking email links with existing sessions

### Improved

- **Email Confirmation Flow**: Complete end-to-end reliability
  - New users: signup → email confirmation → callback → onboarding (seamless)
  - Existing users: proper dashboard redirects based on onboarding status
  - Multi-tab scenarios: intelligent handling of already-authenticated states
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
## [Phase 3] - 2025-01-28 - Profile Management

### Added
- **Profile Page**: Comprehensive user profile with personality insights
- **Onboarding Display**: Show DISC and Enneagram results
- **Account Settings**: Basic account management functionality

## [Phase 2] - 2025-01-28 - Authentication & Onboarding

### Added
- **Authentication System**: Complete auth flow with Supabase
- **Onboarding Process**: AI-driven personality assessment
- **Database Schema**: Comprehensive schema for user data

## [Phase 1] - 2025-01-28 - Project Foundation

### Added
- **Project Setup**: Vite + React + TypeScript + Tailwind CSS
- **Design System**: Arami design system implementation
- **Landing Page**: Professional landing page with features
- **Navigation**: App layout and navigation structure