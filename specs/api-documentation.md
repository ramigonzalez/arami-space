# API Documentation

## Supabase Edge Functions

### 1. start-tavus-session

**Endpoint**: `POST /functions/v1/start-tavus-session`

**Description**: Initiates a new Tavus video conversation with comprehensive user context.

**Request Body**:
```typescript
{
  user_id: string;
  persona_id: string;
}
```

**Response**:
```typescript
{
  success: boolean;
  conversation_url: string;
  conversation_id: string;
  mentor_conversation_id: string;
  daily_session_id: string;
  persona_name: string;
}
```

**Process**:
1. Fetches user profile, onboarding data, ritual preferences, emotional categories, and goals
2. Builds conversational context for AI mentor
3. Creates Tavus conversation via API
4. Records session in mentor_conversations and daily_sessions tables
5. Returns conversation URL and session identifiers

**Error Handling**:
- 400: Missing required parameters
- 500: Database errors, Tavus API errors

---

### 2. end-tavus-session

**Endpoint**: `POST /functions/v1/end-tavus-session`

**Description**: Terminates a Tavus video conversation and updates session records.

**Request Body**:
```typescript
{
  tavus_conversation_id: string;
  mentor_conversation_id: string;
  daily_session_id: string;
  user_id: string;
}
```

**Response**:
```typescript
{
  success: boolean;
  duration_seconds: number;
  message: string;
}
```

**Process**:
1. Calls Tavus API to end conversation
2. Calculates session duration
3. Updates mentor_conversations table with end_time and duration
4. Updates daily_sessions table with completion data

**Error Handling**:
- 400: Missing required parameters
- 500: Database errors, Tavus API errors (continues with DB updates)

---

### 3. tavus-webhook

**Endpoint**: `POST /functions/v1/tavus-webhook`

**Description**: Processes webhooks from Tavus with post-session data.

**Request Body** (from Tavus):
```typescript
{
  conversation_id: string;
  event_type: string;
  transcript?: string;
  recording_url?: string;
  duration?: number;
  participant_count?: number;
  metadata?: any;
}
```

**Response**:
```typescript
{
  success: boolean;
  message: string;
}
```

**Supported Event Types**:
- `conversation_ended`: Updates session with final data
- `transcript_ready`: Stores conversation transcript
- `conversation_started`: Updates session status

**Process**:
1. Finds mentor conversation by tavus_conversation_id
2. Locates corresponding daily session
3. Updates session records based on event type
4. Stores transcript and metadata when available

---

## Frontend Services

### sessionService

**Location**: `src/lib/sessionService.ts`

#### Methods:

**startTavusSession(userId: string, personaId: string)**
- Calls start-tavus-session Edge Function
- Returns session data for video call initiation
- Handles errors and provides user-friendly messages

**endTavusSession(tavusConversationId, mentorConversationId, dailySessionId, userId)**
- Calls end-tavus-session Edge Function
- Returns session completion data
- Handles cleanup and error scenarios

**getUserPersonas(userId: string)**
- Fetches user's available AI mentor personas
- Includes mentor avatar data and specializations
- Filters for active personas only

**getActiveMentorAvatars()**
- Fetches all available mentor avatars
- Used for persona creation and selection
- Returns avatar metadata and premium status

---

## Database Tables Used

### mentor_conversations
- Tracks Tavus conversation lifecycle
- Links to user_personas and daily_sessions
- Stores conversation metadata and duration

### daily_sessions
- Records session completion and analytics
- Stores conversation transcripts from webhooks
- Tracks session type and status

### user_personas
- User's personalized AI mentors
- Links to mentor_avatars for visual representation
- Contains Tavus persona_id and replica_id

### mentor_avatars
- Available AI mentor templates
- Includes visual assets and descriptions
- Premium/free tier classification

---

## External APIs

### Tavus API

**Base URL**: `https://tavusapi.com/v2`

**Authentication**: Bearer token via `TAVUS_API_KEY` environment variable

**Endpoints Used**:

1. **POST /conversations** - Create new conversation
2. **POST /conversations/{id}/end** - End conversation
3. **Webhook callbacks** - Receive post-session data

**Required Environment Variables**:
- `TAVUS_API_KEY`: API key for Tavus service
- `SUPABASE_URL`: Webhook callback base URL
- `SUPABASE_SERVICE_ROLE_KEY`: Database access for Edge Functions

---

## Error Handling Patterns

### Edge Functions
- Consistent CORS headers for all responses
- Structured error responses with descriptive messages
- Graceful degradation when external APIs fail
- Comprehensive logging for debugging

### Frontend Services
- User-friendly error messages
- Retry mechanisms for transient failures
- Loading states during API calls
- Fallback UI for error scenarios

### Database Operations
- Proper RLS policy enforcement
- Transaction-like operations for data consistency
- Null checks and default values
- Foreign key constraint handling