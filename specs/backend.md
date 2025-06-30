# Backend Operations

## Supabase Edge Functions

### Face-to-Face Session Management

#### start-tavus-session
**File**: `supabase/functions/start-tavus-session/index.ts`

**Purpose**: Initiates Tavus video conversations with comprehensive user context

**Key Operations**:
1. **User Data Aggregation**:
   - Fetches user profile from `profiles` table
   - Retrieves onboarding data from `onboarding_profiles`
   - Gets ritual preferences from `ritual_preferences`
   - Collects emotional categories from `user_emotional_categories`
   - Gathers active goals from `user_goals`

2. **Context Building**:
   - Constructs conversational context string
   - Includes personality insights (DISC, Enneagram)
   - Incorporates user preferences and focus areas
   - Adds current goals and emotional priorities

3. **Tavus Integration**:
   - Creates conversation via Tavus API
   - Configures callback URL for webhooks
   - Sets conversation parameters (duration, timeouts)
   - Handles API authentication and error responses

4. **Database Recording**:
   - Creates record in `mentor_conversations` table
   - Initializes record in `daily_sessions` table
   - Links session to user and persona
   - Sets initial status and timestamps

**Error Handling**:
- Validates required parameters
- Handles missing user data gracefully
- Manages Tavus API failures
- Provides detailed error messages

---

#### end-tavus-session
**File**: `supabase/functions/end-tavus-session/index.ts`

**Purpose**: Properly terminates Tavus sessions and updates records

**Key Operations**:
1. **Session Termination**:
   - Calls Tavus API to end conversation
   - Handles API failures gracefully
   - Continues with database updates regardless

2. **Duration Calculation**:
   - Retrieves session start time
   - Calculates total duration in seconds
   - Updates both conversation and session records

3. **Database Updates**:
   - Updates `mentor_conversations` with end_time and duration
   - Updates `daily_sessions` with completion data
   - Sets status to 'completed'
   - Maintains data consistency

**Security**:
- Validates user ownership of session
- Ensures proper authentication
- Prevents unauthorized session termination

---

#### tavus-webhook
**File**: `supabase/functions/tavus-webhook/index.ts`

**Purpose**: Processes post-session data from Tavus webhooks

**Key Operations**:
1. **Event Processing**:
   - Handles multiple event types from Tavus
   - Processes conversation transcripts
   - Stores recording URLs and metadata
   - Updates session status based on events

2. **Data Storage**:
   - Updates `daily_sessions` with transcript data
   - Stores session metadata in JSONB format
   - Maintains conversation history
   - Preserves recording links

3. **Session Matching**:
   - Finds sessions by Tavus conversation ID
   - Links webhook data to correct user session
   - Handles missing or invalid session references

**Webhook Events Supported**:
- `conversation_ended`: Final session data
- `transcript_ready`: Conversation transcript
- `conversation_started`: Session initiation confirmation

---

## Database Operations

### Session Lifecycle Management

**Tables Involved**:
- `mentor_conversations`: Tavus session tracking
- `daily_sessions`: User session analytics
- `user_personas`: AI mentor selection
- `mentor_avatars`: Avatar metadata

**Data Flow**:
1. Session initiation creates records in both tracking tables
2. Active session updates status and metadata
3. Session completion calculates duration and stores results
4. Webhook processing adds transcript and final data

### User Context Aggregation

**Data Sources**:
- `profiles`: Basic user information
- `onboarding_profiles`: Personality assessment results
- `ritual_preferences`: Session preferences and timing
- `user_emotional_categories`: Focus areas and priorities
- `user_goals`: Active personal development goals

**Context Building Process**:
1. Fetch all relevant user data in parallel
2. Handle missing data gracefully with defaults
3. Construct comprehensive context string
4. Pass to Tavus for AI mentor personalization

### Security and Access Control

**Row Level Security (RLS)**:
- All user data protected by RLS policies
- Session data accessible only to session owner
- Webhook processing uses service role key
- Proper authentication required for all operations

**Data Validation**:
- Required parameter validation in all functions
- User ownership verification for session operations
- Proper error handling for invalid requests
- Sanitization of user input data

---

## External API Integration

### Tavus API Configuration

**Authentication**:
- Bearer token authentication
- API key stored in environment variables
- Secure key management in Supabase

**API Endpoints Used**:
1. **POST /conversations**: Create new video conversation
2. **POST /conversations/{id}/end**: Terminate conversation
3. **Webhook callbacks**: Receive post-session data

**Request/Response Handling**:
- Proper error handling for API failures
- Retry logic for transient failures
- Graceful degradation when API unavailable
- Comprehensive logging for debugging

### Environment Variables Required

**Supabase Configuration**:
- `SUPABASE_URL`: Database and function base URL
- `SUPABASE_SERVICE_ROLE_KEY`: Admin access for functions
- `SUPABASE_ANON_KEY`: Client-side database access

**Tavus Configuration**:
- `TAVUS_API_KEY`: Authentication for Tavus API
- Webhook URL automatically configured from Supabase URL

---

## Performance Considerations

### Database Optimization

**Indexing Strategy**:
- Indexes on frequently queried columns
- Composite indexes for complex queries
- Proper foreign key relationships
- Optimized for session lookup patterns

**Query Optimization**:
- Parallel data fetching where possible
- Selective column retrieval
- Efficient joins and relationships
- Minimal database round trips

### Function Performance

**Edge Function Optimization**:
- Minimal cold start times
- Efficient error handling
- Proper resource cleanup
- Optimized external API calls

**Caching Strategy**:
- User context caching for repeated sessions
- Mentor avatar data caching
- Efficient session state management
- Reduced database queries

---

## Monitoring and Logging

### Error Tracking

**Comprehensive Logging**:
- All function entry and exit points
- External API call results
- Database operation outcomes
- User action tracking

**Error Categories**:
- User input validation errors
- External API failures
- Database operation errors
- Authentication and authorization issues

### Performance Monitoring

**Metrics Tracked**:
- Function execution times
- Database query performance
- External API response times
- Session success/failure rates

**Alerting**:
- Failed session creation alerts
- API timeout notifications
- Database error monitoring
- User experience impact tracking