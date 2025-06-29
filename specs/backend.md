# Backend Operations

## Supabase Configuration

### Authentication
- **Email/Password**: Standard authentication with email and password
- **Magic Link**: Passwordless authentication via email
- **Phone/SMS**: Authentication using phone number and SMS verification codes

### Edge Functions

#### 1. auth-magic-link
- **Purpose**: Handle magic link authentication requests
- **Endpoint**: `/functions/v1/auth-magic-link`
- **Method**: POST
- **Input**: 
  ```json
  {
    "email": "user@example.com",
    "redirectTo": "https://app.com/auth/callback"
  }
  ```
- **Output**: 
  ```json
  {
    "message": "Magic link sent successfully",
    "email": "user@example.com"
  }
  ```
- **Features**:
  - Email validation
  - Rate limiting
  - CORS handling
  - Error handling

#### 2. auth-phone
- **Purpose**: Handle phone authentication (send OTP and verify)
- **Endpoint**: `/functions/v1/auth-phone`
- **Method**: POST
- **Input for Send OTP**: 
  ```json
  {
    "phone": "+1234567890",
    "action": "send_otp"
  }
  ```
- **Input for Verify OTP**: 
  ```json
  {
    "phone": "+1234567890",
    "action": "verify_otp",
    "token": "123456"
  }
  ```
- **Output**: 
  ```json
  {
    "message": "SMS code sent successfully",
    "phone": "+1234567890"
  }
  ```
- **Features**:
  - Phone number validation
  - SMS rate limiting
  - OTP verification
  - Session management

### Database Schema
- Complete database schema with 11 tables implemented
- User profiles in `profiles` table linked to `auth.users`
- Onboarding data in `onboarding_profiles` table
- Goals, preferences, sessions, and analytics tables
- Row Level Security (RLS) enabled on all tables
- Automatic profile creation via database triggers

### Security Features
- Row Level Security (RLS) enabled
- Rate limiting on authentication endpoints
- CORS properly configured
- Input validation and sanitization
- Secure session management

### Environment Variables
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Public anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for edge functions
- `SUPABASE_DB_URL`: Database connection string

#### 3. elevenlabs-tts
- **Purpose**: Secure proxy for ElevenLabs Text-to-Speech API
- **Endpoint**: `/functions/v1/elevenlabs-tts`
- **Method**: POST
- **Input**: 
  ```json
  {
    "text": "Text to convert to speech",
    "voice_id": "ElevenLabs voice ID",
    "model_id": "eleven_multilingual_v2",
    "voice_settings": {
      "stability": 0.5,
      "similarity_boost": 0.8,
      "style": 0.0,
      "use_speaker_boost": true
    }
  }
  ```
- **Output**: 
  ```json
  {
    "success": true,
    "audio_base64": "Base64 encoded audio data"
  }
  ```
- **Features**:
  - Secure API key handling
  - Text length validation (max 5000 characters)
  - Voice ID validation
  - Rate limiting and error handling
  - CORS support for frontend requests

### Deployment
- Edge functions automatically deployed to Supabase
- No manual deployment required
- Functions are serverless and auto-scaling

### Database Operations
- DatabaseService class provides full CRUD operations
- TypeScript interfaces for all database entities
- Comprehensive error handling and validation
- Support for user profiles, goals, sessions, streaks, and virtues
- Dashboard view for aggregated user data
- Settings management for user preferences

### Authentication Integration
- useAuth hook for centralized state management
- Automatic profile creation on user signup
- Protected routes with authentication and onboarding checks
- Session persistence and refresh capabilities
- Proper cleanup on sign out