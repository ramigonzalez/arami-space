# 📊 **Arami Database Schemas Documentation**

**Version**: 1.0  
**Last Updated**: January 2025  
**Database**: Supabase PostgreSQL with Row Level Security

---

## **1. Schema Overview**

### **1.1 Database Design Principles**
- **User-Centric**: All data tied to authenticated users
- **Privacy-First**: Row Level Security on all tables
- **Mobile-Optimized**: Efficient queries for mobile clients
- **Scalable**: Designed for growth and performance
- **Audit-Ready**: Timestamps and change tracking

### **1.2 Naming Conventions**
- **Tables**: snake_case (e.g., `user_goals`)
- **Columns**: snake_case (e.g., `created_at`)
- **Indexes**: `idx_table_column` format
- **Constraints**: `chk_table_column` for checks
- **Foreign Keys**: `fk_table_reference` format

---

## **2. Core Tables**

### **2.1 Users Table**

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  name TEXT,
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'pt', 'es', 'fr')),
  onboarding_completed BOOLEAN DEFAULT false,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_onboarding ON users(onboarding_completed);

-- RLS Policy
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own data" 
ON users FOR ALL USING (auth.uid() = id);

-- Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
BEFORE UPDATE ON users 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**Purpose**: Core user information and authentication integration  
**Relationships**: Parent to all user-specific tables  
**Key Features**: Multi-language support, onboarding tracking, timezone handling

---

### **2.2 Onboarding Profiles Table**

```sql
CREATE TABLE onboarding_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  disc_type TEXT NOT NULL CHECK (disc_type IN ('D', 'I', 'S', 'C')),
  enneagram_type INTEGER CHECK (enneagram_type BETWEEN 1 AND 9),
  confidence_score DECIMAL(3,2) CHECK (confidence_score BETWEEN 0.70 AND 1.00),
  personality_insights JSONB,
  assessment_transcript TEXT,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Indexes
CREATE INDEX idx_onboarding_profiles_user_id ON onboarding_profiles(user_id);
CREATE INDEX idx_onboarding_profiles_disc ON onboarding_profiles(disc_type);
CREATE INDEX idx_onboarding_profiles_enneagram ON onboarding_profiles(enneagram_type);

-- RLS Policy
ALTER TABLE onboarding_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own onboarding" 
ON onboarding_profiles FOR ALL USING (auth.uid() = user_id);
```

**Purpose**: Store personality assessment results from Genesis onboarding  
**Key Fields**:
- `disc_type`: Primary personality type (Dominance, Influence, Steadiness, Conscientiousness)
- `enneagram_type`: Optional Enneagram type (1-9)
- `confidence_score`: AI confidence in assessment (0.7-1.0)
- `personality_insights`: Additional insights in JSON format

---

### **2.3 User Emotional Categories Table**

```sql
CREATE TABLE user_emotional_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN (
    'stress_management',
    'goal_achievement', 
    'relationships',
    'self_worth',
    'emotional_regulation',
    'work_life_balance',
    'personal_growth',
    'mindfulness'
  )),
  priority_level INTEGER DEFAULT 1 CHECK (priority_level BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_emotional_categories_user_id ON user_emotional_categories(user_id);
CREATE INDEX idx_user_emotional_categories_category ON user_emotional_categories(category);
CREATE UNIQUE INDEX idx_user_category_unique ON user_emotional_categories(user_id, category);

-- RLS Policy
ALTER TABLE user_emotional_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own categories" 
ON user_emotional_categories FOR ALL USING (auth.uid() = user_id);
```

**Purpose**: Track user's primary emotional focus areas identified during onboarding  
**Key Features**: Priority levels, unique categories per user, extensible category list

---

### **2.4 User Goals Table**

```sql
CREATE TABLE user_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  goal_text TEXT NOT NULL,
  goal_type TEXT DEFAULT 'emotional_wellness' CHECK (goal_type IN (
    'emotional_wellness',
    'personal_growth',
    'relationships',
    'career',
    'health',
    'mindfulness'
  )),
  smart_goal TEXT, -- SMART formatted version
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'archived')),
  target_date DATE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
  source TEXT DEFAULT 'onboarding' CHECK (source IN ('onboarding', 'session_suggestion', 'user_created')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_goals_user_id ON user_goals(user_id);
CREATE INDEX idx_user_goals_status ON user_goals(status);
CREATE INDEX idx_user_goals_type ON user_goals(goal_type);
CREATE INDEX idx_active_goals ON user_goals(user_id) WHERE status = 'active';

-- RLS Policy
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own goals" 
ON user_goals FOR ALL USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_user_goals_updated_at 
BEFORE UPDATE ON user_goals 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**Purpose**: Store and track user goals from onboarding and session suggestions  
**Key Features**: SMART goal formatting, progress tracking, multiple sources, status management

---

### **2.5 Ritual Preferences Table**

```sql
CREATE TABLE ritual_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  timing TEXT NOT NULL CHECK (timing IN ('morning_person', 'evening_person', 'flexible')),
  duration TEXT NOT NULL CHECK (duration IN ('quick_focused', 'deeper_dive', 'variable')),
  style TEXT NOT NULL CHECK (style IN ('guided_structure', 'open_conversation', 'mixed')),
  voice_id TEXT NOT NULL CHECK (voice_id IN (
    'confident_coach',
    'warm_friend', 
    'gentle_guide',
    'wise_mentor'
  )),
  focus_area TEXT NOT NULL,
  elevenlabs_voice_id TEXT, -- Actual ElevenLabs voice ID
  session_frequency TEXT DEFAULT 'daily' CHECK (session_frequency IN ('daily', 'weekdays', 'custom')),
  preferred_session_time TIME,
  reminder_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Indexes
CREATE INDEX idx_ritual_preferences_user_id ON ritual_preferences(user_id);
CREATE INDEX idx_ritual_preferences_timing ON ritual_preferences(timing);
CREATE INDEX idx_ritual_preferences_voice ON ritual_preferences(voice_id);

-- RLS Policy
ALTER TABLE ritual_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own preferences" 
ON ritual_preferences FOR ALL USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_ritual_preferences_updated_at 
BEFORE UPDATE ON ritual_preferences 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**Purpose**: Store user's personalized ritual preferences from onboarding  
**Key Features**: Voice mapping, scheduling preferences, reminder settings

---

## **3. Session Management Tables**

### **3.1 Daily Sessions Table**

```sql
CREATE TABLE daily_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL CHECK (session_type IN (
    'face_to_face',
    'spoken_presence', 
    'silent_reflection',
    'written_clarity'
  )),
  session_status TEXT DEFAULT 'completed' CHECK (session_status IN (
    'started',
    'in_progress',
    'completed',
    'interrupted',
    'failed'
  )),
  duration_seconds INTEGER,
  virtue_earned TEXT,
  emotional_snapshot JSONB, -- Array of emotion objects
  key_insights JSONB, -- Array of insight strings
  suggested_goals JSONB, -- Array of goal suggestion objects
  conversation_transcript TEXT,
  session_metadata JSONB, -- Additional session data
  session_date DATE DEFAULT CURRENT_DATE,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_daily_sessions_user_id ON daily_sessions(user_id);
CREATE INDEX idx_daily_sessions_date ON daily_sessions(session_date);
CREATE INDEX idx_daily_sessions_type ON daily_sessions(session_type);
CREATE INDEX idx_daily_sessions_status ON daily_sessions(session_status);
CREATE INDEX idx_recent_sessions ON daily_sessions(user_id, created_at) 
WHERE created_at >= NOW() - INTERVAL '30 days';

-- RLS Policy
ALTER TABLE daily_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own sessions" 
ON daily_sessions FOR ALL USING (auth.uid() = user_id);
```

**Purpose**: Track all user ritual sessions with detailed analytics  
**Key Features**: Multiple session types, rich metadata, performance tracking

**JSONB Field Structures**:

```typescript
// emotional_snapshot structure
interface EmotionalSnapshot {
  emotion: string;
  intensity: number; // 1-5
  color: string; // UI color code
  confidence: number; // AI confidence 0-1
}

// key_insights structure
interface KeyInsight {
  insight: string;
  category: string;
  importance: number; // 1-5
}

// suggested_goals structure
interface SuggestedGoal {
  category: string;
  description: string;
  smart_goal: string;
  timeframe: string;
  priority: number; // 1-5
}

// session_metadata structure
interface SessionMetadata {
  ai_agent_version: string;
  voice_quality_score?: number;
  user_engagement_score?: number;
  technical_issues?: string[];
  external_conversation_id?: string;
}
```

---

### **3.2 Session Analytics Table**

```sql
CREATE TABLE session_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES daily_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(10,4),
  metric_unit TEXT,
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, metric_name)
);

-- Indexes
CREATE INDEX idx_session_analytics_session_id ON session_analytics(session_id);
CREATE INDEX idx_session_analytics_user_id ON session_analytics(user_id);
CREATE INDEX idx_session_analytics_metric ON session_analytics(metric_name);

-- RLS Policy
ALTER TABLE session_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own analytics" 
ON session_analytics FOR ALL USING (auth.uid() = user_id);
```

**Purpose**: Store detailed analytics metrics for each session  
**Common Metrics**: engagement_score, voice_clarity, response_time, completion_rate

---

## **4. Assessment Tables**

### **4.1 Enneagram Assessments Table**

```sql
CREATE TABLE enneagram_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  enneagram_type INTEGER NOT NULL CHECK (enneagram_type BETWEEN 1 AND 9),
  wing_type INTEGER CHECK (wing_type BETWEEN 1 AND 9),
  confidence_score DECIMAL(3,2) CHECK (confidence_score BETWEEN 0.50 AND 1.00),
  type_scores JSONB, -- Scores for all 9 types
  conversation_transcript TEXT,
  assessment_duration_seconds INTEGER,
  assessment_version TEXT DEFAULT '1.0',
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_enneagram_assessments_user_id ON enneagram_assessments(user_id);
CREATE INDEX idx_enneagram_assessments_type ON enneagram_assessments(enneagram_type);

-- RLS Policy
ALTER TABLE enneagram_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own assessments" 
ON enneagram_assessments FOR ALL USING (auth.uid() = user_id);
```

**Purpose**: Store detailed Enneagram assessment results  
**Key Features**: Wing types, confidence scoring, version tracking

---

## **5. Tracking & Analytics Tables**

### **5.1 User Streaks Table**

```sql
CREATE TABLE user_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  streak_type TEXT NOT NULL CHECK (streak_type IN ('daily_session', 'weekly_goal', 'monthly_virtue')),
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  streak_start_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, streak_type)
);

-- Indexes
CREATE INDEX idx_user_streaks_user_id ON user_streaks(user_id);
CREATE INDEX idx_user_streaks_type ON user_streaks(streak_type);

-- RLS Policy
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own streaks" 
ON user_streaks FOR ALL USING (auth.uid() = user_id);
```

**Purpose**: Track user engagement streaks and milestones

---

### **5.2 Virtue Collection Table**

```sql
CREATE TABLE virtue_collection (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  virtue_name TEXT NOT NULL,
  virtue_description TEXT,
  virtue_icon TEXT,
  earned_from_session_id UUID REFERENCES daily_sessions(id),
  times_earned INTEGER DEFAULT 1,
  first_earned_at TIMESTAMPTZ DEFAULT NOW(),
  last_earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, virtue_name)
);

-- Indexes
CREATE INDEX idx_virtue_collection_user_id ON virtue_collection(user_id);
CREATE INDEX idx_virtue_collection_virtue ON virtue_collection(virtue_name);

-- RLS Policy
ALTER TABLE virtue_collection ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own virtues" 
ON virtue_collection FOR ALL USING (auth.uid() = user_id);
```

**Purpose**: Track virtues earned through sessions for gamification

---

## **6. System Tables**

### **6.1 App Settings Table**

```sql
CREATE TABLE app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  setting_key TEXT NOT NULL,
  setting_value JSONB NOT NULL,
  setting_type TEXT DEFAULT 'user' CHECK (setting_type IN ('user', 'system', 'feature_flag')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, setting_key)
);

-- Indexes
CREATE INDEX idx_app_settings_user_id ON app_settings(user_id);
CREATE INDEX idx_app_settings_key ON app_settings(setting_key);

-- RLS Policy
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own settings" 
ON app_settings FOR ALL USING (auth.uid() = user_id);
```

**Purpose**: Store user preferences and app configuration

---

## **7. Views and Functions**

### **7.1 User Dashboard View**

```sql
CREATE VIEW user_dashboard AS
SELECT 
  u.id,
  u.name,
  u.preferred_language,
  op.disc_type,
  op.enneagram_type,
  rp.timing,
  rp.voice_id,
  COALESCE(us.current_streak, 0) as daily_streak,
  COUNT(DISTINCT vc.virtue_name) as total_virtues,
  COUNT(DISTINCT ds.id) FILTER (WHERE ds.session_date >= CURRENT_DATE - INTERVAL '7 days') as sessions_this_week,
  COUNT(DISTINCT ug.id) FILTER (WHERE ug.status = 'active') as active_goals
FROM users u
LEFT JOIN onboarding_profiles op ON u.id = op.user_id
LEFT JOIN ritual_preferences rp ON u.id = rp.user_id
LEFT JOIN user_streaks us ON u.id = us.user_id AND us.streak_type = 'daily_session'
LEFT JOIN virtue_collection vc ON u.id = vc.user_id
LEFT JOIN daily_sessions ds ON u.id = ds.user_id
LEFT JOIN user_goals ug ON u.id = ug.user_id
GROUP BY u.id, u.name, u.preferred_language, op.disc_type, op.enneagram_type, 
         rp.timing, rp.voice_id, us.current_streak;
```

### **7.2 Session Summary Function**

```sql
CREATE OR REPLACE FUNCTION get_session_summary(user_uuid UUID, days_back INTEGER DEFAULT 30)
RETURNS TABLE (
  total_sessions INTEGER,
  avg_duration_minutes DECIMAL,
  most_common_virtue TEXT,
  dominant_emotions TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_sessions,
    ROUND(AVG(duration_seconds) / 60.0, 1) as avg_duration_minutes,
    MODE() WITHIN GROUP (ORDER BY virtue_earned) as most_common_virtue,
    ARRAY_AGG(DISTINCT jsonb_array_elements_text(emotional_snapshot -> 'emotion')) as dominant_emotions
  FROM daily_sessions
  WHERE user_id = user_uuid 
    AND session_date >= CURRENT_DATE - INTERVAL '1 day' * days_back
    AND session_status = 'completed';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## **8. Migration Scripts**

### **8.1 Initial Schema Migration**

```sql
-- Migration: 001_initial_schema.sql
-- Description: Create initial Arami database schema

BEGIN;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create users table
-- [Include all table creation scripts from above]

-- Create indexes
-- [Include all index creation scripts from above]

-- Enable RLS and create policies
-- [Include all RLS scripts from above]

-- Create views and functions
-- [Include all view and function scripts from above]

COMMIT;
```

### **8.2 Data Seeding Script**

```sql
-- Seed script for development/testing
INSERT INTO users (id, email, name, onboarding_completed) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'test@arami.ai', 'Test User', true);

INSERT INTO onboarding_profiles (user_id, disc_type, confidence_score) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'I', 0.85);

INSERT INTO ritual_preferences (user_id, timing, duration, style, voice_id, focus_area) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'morning_person', 'quick_focused', 'guided_structure', 'warm_friend', 'stress_management');
```

---

## **9. Performance Considerations**

### **9.1 Query Optimization**
- Indexes on frequently queried columns
- Partial indexes for filtered queries
- Composite indexes for multi-column queries
- Regular VACUUM and ANALYZE operations

### **9.2 Data Archival Strategy**
```sql
-- Archive old sessions (older than 2 years)
CREATE TABLE daily_sessions_archive (LIKE daily_sessions INCLUDING ALL);

-- Move old data
INSERT INTO daily_sessions_archive 
SELECT * FROM daily_sessions 
WHERE created_at < NOW() - INTERVAL '2 years';

DELETE FROM daily_sessions 
WHERE created_at < NOW() - INTERVAL '2 years';
```

### **9.3 Monitoring Queries**
```sql
-- Monitor table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Monitor slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

This comprehensive schema documentation provides the foundation for Arami's data architecture with scalability, performance, and security in mind! 📊