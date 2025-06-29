# Changelog
## [0.5.0] - 2025-01-27
## [0.3.0] - Voice-First Onboarding Implementation

### Added
- **ElevenLabs Signed URL Edge Function**: New Supabase Edge Function (`elevenlabs-signed-url`) that generates secure WebSocket URLs for conversational AI
- **Voice-First Onboarding Experience**: Complete redesign of onboarding flow using ElevenLabs Conversational AI
- **Initial User Inputs**: Welcome screen collecting user name, preferred language, and gender for voice personalization
- **@11labs/react Integration**: Added ElevenLabs React library for seamless voice conversation management
- **Real-time Voice Interface**: Interactive conversation controls with microphone and audio management

### Changed
- **Onboarding.tsx**: Complete rewrite to support voice-first experience with two-step flow (inputs → conversation)
- **Package Dependencies**: Added @11labs/react for conversational AI functionality

### Technical Details
- Secure signed URL generation prevents API key exposure on client-side
- Personalized AI prompts using user context (name, language, gender)
- Real-time WebSocket connection for voice conversations
- Conversation state management with connection status indicators

### Security
- Server-side API key management through Supabase Edge Functions
- Time-limited signed URLs for enhanced security
- Proper CORS handling for cross-origin requests


### Security Enhancement
- **ElevenLabs API Integration via Supabase Edge Function**
  - Created `elevenlabs-tts` Edge Function for secure API key handling
  - Removed direct ElevenLabs client dependency from frontend
  - API key now stored securely as Supabase Edge Function secret
  - Frontend calls secure proxy instead of direct ElevenLabs API
  - Added comprehensive error handling and validation
  - Supports all voice configurations with customizable settings

### Added
- **Phase 3: Genesis Onboarding System - Foundation**
  - ElevenLabs integration with voice generation and playback
  - VoiceService class for speech synthesis and audio management
  - Voice configuration mapping for 4 distinct AI personalities
  - useVoiceRecording hook with real-time audio level monitoring
  - ProgressIndicator component with step visualization
  - ConversationInterface with message bubbles and typing indicators
  - VoiceControls with audio level visualization and recording states
  - VoiceSelector with voice preview and selection functionality
  - Multi-step onboarding flow (Welcome → Conversation → Voice Selection → Completion)

### Changed
- **Onboarding.tsx**: Complete redesign with 4-step interactive flow
- **package.json**: Added @11labs/client dependency for voice integration

### Technical
- Audio context management for cross-browser compatibility
- MediaRecorder integration with real-time audio analysis
- Voice preview system with play/pause controls
- Mobile-optimized voice interaction components
- Simulated speech-to-text processing (ready for real STT integration)

## [0.4.0] - 2025-01-27

### Added
- **Complete Database Schema Implementation**
  - Created comprehensive SQL migration with all required tables
  - Implemented Row Level Security (RLS) policies for data protection
  - Added proper indexes for performance optimization
  - Created database triggers for automatic profile creation

- **Database Service Layer**
  - TypeScript interfaces for all database entities
  - DatabaseService class with full CRUD operations
  - Comprehensive error handling and response types
  - Support for profiles, goals, sessions, streaks, and virtues

- **Authentication State Management**
  - useAuth hook for centralized authentication state
  - Automatic profile loading and management
  - Session persistence and refresh capabilities
  - Sign out functionality with proper cleanup

- **Protected Route System**
  - ProtectedRoute component with authentication checks
  - Onboarding completion verification
  - Automatic redirects based on user state
  - Loading states during authentication initialization

- **Enhanced User Experience**
  - Dashboard integration with real user data
  - Automatic profile creation on user signup
  - Proper loading states throughout the application
  - Sign out functionality in dashboard header

### Changed
- **App.tsx**: Added authentication state management and protected routes
- **Auth.tsx**: Enhanced with proper redirects after successful authentication
- **Dashboard.tsx**: Integrated with real user data and database service
- **AuthService**: Added automatic profile creation on signup

### Technical
- Complete database schema with 11 tables and proper relationships
- Row Level Security policies ensuring users only access their own data
- TypeScript types for all database entities and operations
- Comprehensive error handling across all database operations
- Authentication state management with React hooks

## [0.3.0] - 2025-01-27

### Added
- **Enhanced Authentication Flow**
  - Authentication method selection (email vs phone)
  - Country code selection for phone numbers with flag indicators
  - Separate magic link and SMS code authentication options
  - Phone number verification flow with 6-digit code input
  - Toggle between sign in and sign up modes

- **Supabase Edge Functions**
  - `auth-magic-link`: Handle magic link authentication requests
  - `auth-phone`: Handle phone OTP sending and verification
  - Proper CORS handling and error management
  - Rate limiting and input validation

- **Authentication Service Layer**
  - `AuthService` class with methods for all authentication types
  - Email/password authentication
  - Magic link authentication via edge function
  - Phone OTP sending and verification
  - Session management and user state handling

### Changed
- **Auth.tsx**: Complete redesign with method selection and improved UX
- **Backend documentation**: Updated with edge function specifications
- **Memory management**: Updated current and next task tracking

### Technical
- Added TypeScript interfaces for authentication requests/responses
- Implemented proper error handling across authentication flows
- Added loading states for all authentication actions
- Enhanced form validation and user feedback

## [0.2.0] - 2025-01-26

### Added
- Landing page with hero, features, testimonials, CTA sections
- Basic authentication page structure
- Dashboard and onboarding page layouts
- UI components library (Button, Input, Card, Badge, Modal)
- Project documentation structure
- Domain setup configuration

### Changed
- Initial project setup and configuration
- Tailwind CSS integration and styling system

## [0.1.0] - 2025-01-25

### Added
- Initial project creation
- Vite + React + TypeScript setup
- Basic project structure and configuration