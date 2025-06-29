# API Documentation

## Authentication Endpoints

### Magic Link Authentication

#### POST /functions/v1/auth-magic-link

Send a magic link to the user's email for passwordless authentication.

**Request Body:**
```json
{
  "email": "user@example.com",
  "redirectTo": "https://yourapp.com/auth/callback"
}
```

**Response (Success - 200):**
```json
{
  "message": "Magic link sent successfully",
  "email": "user@example.com"
}
```

**Response (Error - 400):**
```json
{
  "error": "Valid email is required"
}
```

**Response (Error - 500):**
```json
{
  "error": "Failed to send magic link"
}
```

### Phone Authentication

#### POST /functions/v1/auth-phone

Handle phone number authentication including OTP sending and verification.

**Send OTP Request:**
```json
{
  "phone": "+1234567890",
  "action": "send_otp"
}
```

**Send OTP Response (Success - 200):**
```json
{
  "message": "SMS code sent successfully",
  "phone": "+1234567890"
}
```

**Verify OTP Request:**
```json
{
  "phone": "+1234567890",
  "action": "verify_otp",
  "token": "123456"
}
```

**Verify OTP Response (Success - 200):**
```json
{
  "message": "Phone verified successfully",
  "user": {
    "id": "user-uuid",
    "phone": "+1234567890",
    "email": null
  },
  "session": {
    "access_token": "jwt-token",
    "refresh_token": "refresh-token",
    "expires_in": 3600
  }
}
```

**Error Responses:**
```json
{
  "error": "Valid phone number with country code is required"
}
```

```json
{
  "error": "Invalid verification code"
}
```

## Frontend Authentication Service

### AuthService Class Methods

#### Email/Password Authentication

```typescript
// Sign up with email and password
AuthService.signUpWithEmail(email: string, password: string): Promise<AuthResponse>

// Sign in with email and password
AuthService.signInWithEmail(email: string, password: string): Promise<AuthResponse>
```

#### Magic Link Authentication

```typescript
// Send magic link to email
AuthService.sendMagicLink(email: string): Promise<AuthResponse>
```

#### Phone Authentication

```typescript
// Send OTP to phone number
AuthService.sendPhoneOTP(phone: string): Promise<AuthResponse>

// Verify OTP code
AuthService.verifyPhoneOTP(phone: string, token: string): Promise<AuthResponse>
```

#### General Methods

```typescript
// Sign out current user
AuthService.signOut(): Promise<AuthResponse>

// Get current authenticated user
AuthService.getCurrentUser(): Promise<AuthResponse>

// Listen to authentication state changes
AuthService.onAuthStateChange(callback: (event: string, session: any) => void)
```

### AuthResponse Interface

```typescript
interface AuthResponse {
  success: boolean;
  error?: string;
  data?: any;
}
```

## Error Handling

All authentication endpoints return consistent error responses:

- **400 Bad Request**: Invalid input data or missing required fields
- **405 Method Not Allowed**: Incorrect HTTP method used
- **500 Internal Server Error**: Server-side processing errors

## Rate Limiting

- Magic link requests: Limited to prevent email spam
- SMS OTP requests: Limited to prevent SMS abuse
- Verification attempts: Limited to prevent brute force attacks

## Security Features

- CORS properly configured for cross-origin requests
- Input validation and sanitization
- Phone number format validation (must include country code)
- Email format validation
- Secure session management through Supabase Auth
- Row Level Security (RLS) enabled on all user data

## Edge Functions

### elevenlabs-signed-url

**Purpose**: Generates secure signed WebSocket URLs for ElevenLabs Conversational AI

**Endpoint**: `POST /functions/v1/elevenlabs-signed-url`

**Request Body**:
```json
{
  "agent_id": "genesis-onboarding",
  "user_context": {
    "name": "string",
    "language": "string", 
    "gender": "string"
  }
}
```

**Response**:
```json
{
  "signed_url": "wss://...",
  "conversation_id": "string",
  "expires_at": "timestamp"
}
```

**Security**: 
- Requires ELEVENLABS_API_KEY environment variable
- Returns time-limited signed URLs
- Validates user authentication

**Usage**: Called from onboarding flow to establish voice conversations with personalized context

## ElevenLabs Text-to-Speech Integration

### POST /functions/v1/elevenlabs-tts

Secure proxy for ElevenLabs Text-to-Speech API that handles API key authentication server-side.

**Request Body:**
```json
{
  "text": "Hello, welcome to your emotional intelligence journey!",
  "voice_id": "pNInz6obpgDQGcFmaJgB",
  "model_id": "eleven_multilingual_v2",
  "voice_settings": {
    "stability": 0.5,
    "similarity_boost": 0.8,
    "style": 0.0,
    "use_speaker_boost": true
  }
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "audio_base64": "UklGRiQAAABXQVZFZm10IBAAAAABAAEA..."
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "error": "Text and voice_id are required"
}
```

**Response (Error - 503):**
```json
{
  "success": false,
  "error": "ElevenLabs service not configured"
}
```

**Voice IDs Available:**
- `pNInz6obpgDQGcFmaJgB` - Confident Coach (Adam)
- `EXAVITQu4vr4xnSDxMaL` - Warm Friend (Bella)
- `ThT5KcBeYPX3keUQqHPh` - Gentle Guide (Dorothy)
- `onwK4e9ZLuTAKqWW03F9` - Wise Mentor (Daniel)

**Rate Limiting:**
- Inherits ElevenLabs API rate limits
- Text length limited to 5000 characters per request

**Security Features:**
- API key stored securely as Supabase Edge Function secret
- CORS properly configured for cross-origin requests
- Input validation and sanitization
- Error handling with appropriate HTTP status codes

## Environment Variables

Required environment variables for the application:

- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous/public key

Edge functions automatically have access to:
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for admin operations
- `SUPABASE_ANON_KEY`: Anonymous key for client operations
- `SUPABASE_DB_URL`: Direct database connection string