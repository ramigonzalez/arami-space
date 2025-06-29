/*
  # Initial Arami Database Schema

  1. New Tables
    - `profiles` - User profile information linked to auth.users
    - `onboarding_profiles` - Personality assessment results from Genesis
    - `user_emotional_categories` - User's emotional focus areas
    - `user_goals` - User goals from onboarding and sessions
    - `ritual_preferences` - User's daily ritual preferences
    - `daily_sessions` - Session tracking and analytics
    - `user_streaks` - Engagement streak tracking
    - `virtue_collection` - Gamification virtue system
    - `app_settings` - User preferences and settings

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Proper foreign key constraints and data validation

  3. Indexes
    - Performance indexes on frequently queried columns
    - Composite indexes for complex queries
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'pt', 'es', 'fr')),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'paid')),
  onboarding_completed BOOLEAN DEFAULT false,
  timezone TEXT DEFAULT 'UTC'
);

-- Indexes for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding ON profiles(onboarding_completed);

-- RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read all profiles" 
ON profiles FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- Trigger for profiles updated_at
CREATE OR REPLACE TRIGGER update_profiles_updated_at 
BEFORE UPDATE ON public.profiles 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Onboarding profiles table
CREATE TABLE IF NOT EXISTS onboarding_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  disc_type TEXT NOT NULL CHECK (disc_type IN ('D', 'I', 'S', 'C')),
  enneagram_type INTEGER CHECK (enneagram_type BETWEEN 1 AND 9),
  confidence_score DECIMAL(3,2) CHECK (confidence_score BETWEEN 0.70 AND 1.00),
  personality_insights JSONB,
  assessment_transcript TEXT,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Indexes for onboarding_profiles
CREATE INDEX IF NOT EXISTS idx_onboarding_profiles_user_id ON onboarding_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_profiles_disc ON onboarding_profiles(disc_type);

-- RLS for onboarding_profiles
ALTER TABLE onboarding_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own onboarding" 
ON onboarding_profiles FOR ALL 
TO authenticated 
USING (auth.uid() = user_id);

-- User emotional categories table
CREATE TABLE IF NOT EXISTS user_emotional_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
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

-- Indexes for user_emotional_categories
CREATE INDEX IF NOT EXISTS idx_user_emotional_categories_user_id ON user_emotional_categories(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_category_unique ON user_emotional_categories(user_id, category);

-- RLS for user_emotional_categories
ALTER TABLE user_emotional_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own categories" 
ON user_emotional_categories FOR ALL 
TO authenticated 
USING (auth.uid() = user_id);

-- User goals table
CREATE TABLE IF NOT EXISTS user_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  goal_text TEXT NOT NULL,
  goal_type TEXT DEFAULT 'emotional_wellness' CHECK (goal_type IN (
    'emotional_wellness',
    'personal_growth',
    'relationships',
    'career',
    'health',
    'mindfulness'
  )),
  smart_goal TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'archived')),
  target_date DATE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
  source TEXT DEFAULT 'onboarding' CHECK (source IN ('onboarding', 'session_suggestion', 'user_created')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for user_goals
CREATE INDEX IF NOT EXISTS idx_user_goals_user_id ON user_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_status ON user_goals(status);
CREATE INDEX IF NOT EXISTS idx_active_goals ON user_goals(user_id) WHERE status = 'active';

-- RLS for user_goals
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own goals" 
ON user_goals FOR ALL 
TO authenticated 
USING (auth.uid() = user_id);

-- Trigger for user_goals updated_at
CREATE OR REPLACE TRIGGER update_user_goals_updated_at 
BEFORE UPDATE ON public.user_goals 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Ritual preferences table
CREATE TABLE IF NOT EXISTS ritual_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
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
  elevenlabs_voice_id TEXT,
  session_frequency TEXT DEFAULT 'daily' CHECK (session_frequency IN ('daily', 'weekdays', 'custom')),
  preferred_session_time TIME,
  reminder_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Indexes for ritual_preferences
CREATE INDEX IF NOT EXISTS idx_ritual_preferences_user_id ON ritual_preferences(user_id);

-- RLS for ritual_preferences
ALTER TABLE ritual_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own preferences" 
ON ritual_preferences FOR ALL 
TO authenticated 
USING (auth.uid() = user_id);

-- Trigger for ritual_preferences updated_at
CREATE OR REPLACE TRIGGER update_ritual_preferences_updated_at 
BEFORE UPDATE ON public.ritual_preferences 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Daily sessions table
CREATE TABLE IF NOT EXISTS daily_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
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
  emotional_snapshot JSONB,
  key_insights JSONB,
  suggested_goals JSONB,
  conversation_transcript TEXT,
  session_metadata JSONB,
  session_date DATE DEFAULT CURRENT_DATE,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for daily_sessions
CREATE INDEX IF NOT EXISTS idx_daily_sessions_user_id ON daily_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_sessions_date ON daily_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_daily_sessions_created_at ON daily_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_daily_sessions_user_created ON daily_sessions(user_id, created_at);

-- RLS for daily_sessions
ALTER TABLE daily_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own sessions" 
ON daily_sessions FOR ALL 
TO authenticated 
USING (auth.uid() = user_id);

-- User streaks table
CREATE TABLE IF NOT EXISTS user_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  streak_type TEXT NOT NULL CHECK (streak_type IN ('daily_session', 'weekly_goal', 'monthly_virtue')),
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  streak_start_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, streak_type)
);

-- Indexes for user_streaks
CREATE INDEX IF NOT EXISTS idx_user_streaks_user_id ON user_streaks(user_id);

-- RLS for user_streaks
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own streaks" 
ON user_streaks FOR ALL 
TO authenticated 
USING (auth.uid() = user_id);

-- Virtue collection table
CREATE TABLE IF NOT EXISTS virtue_collection (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  virtue_name TEXT NOT NULL,
  virtue_description TEXT,
  virtue_icon TEXT,
  earned_from_session_id UUID REFERENCES daily_sessions(id),
  times_earned INTEGER DEFAULT 1,
  first_earned_at TIMESTAMPTZ DEFAULT NOW(),
  last_earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, virtue_name)
);

-- Indexes for virtue_collection
CREATE INDEX IF NOT EXISTS idx_virtue_collection_user_id ON virtue_collection(user_id);

-- RLS for virtue_collection
ALTER TABLE virtue_collection ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own virtues" 
ON virtue_collection FOR ALL 
TO authenticated 
USING (auth.uid() = user_id);

-- App settings table
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  setting_key TEXT NOT NULL,
  setting_value JSONB NOT NULL,
  setting_type TEXT DEFAULT 'user' CHECK (setting_type IN ('user', 'system', 'feature_flag')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, setting_key)
);

-- Indexes for app_settings
CREATE INDEX IF NOT EXISTS idx_app_settings_user_id ON app_settings(user_id);

-- RLS for app_settings
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own settings" 
ON app_settings FOR ALL 
TO authenticated 
USING (auth.uid() = user_id);

-- Create user dashboard view
CREATE OR REPLACE VIEW user_dashboard AS
SELECT 
  p.id,
  p.full_name,
  p.language,
  p.onboarding_completed,
  op.disc_type,
  op.enneagram_type,
  rp.timing,
  rp.voice_id,
  COALESCE(us.current_streak, 0) as daily_streak,
  COUNT(DISTINCT vc.virtue_name) as total_virtues,
  COUNT(DISTINCT ds.id) FILTER (WHERE ds.session_date >= CURRENT_DATE - INTERVAL '7 days') as sessions_this_week,
  COUNT(DISTINCT ug.id) FILTER (WHERE ug.status = 'active') as active_goals
FROM profiles p
LEFT JOIN onboarding_profiles op ON p.id = op.user_id
LEFT JOIN ritual_preferences rp ON p.id = rp.user_id
LEFT JOIN user_streaks us ON p.id = us.user_id AND us.streak_type = 'daily_session'
LEFT JOIN virtue_collection vc ON p.id = vc.user_id
LEFT JOIN daily_sessions ds ON p.id = ds.user_id
LEFT JOIN user_goals ug ON p.id = ug.user_id
GROUP BY p.id, p.full_name, p.language, p.onboarding_completed, op.disc_type, op.enneagram_type, 
         rp.timing, rp.voice_id, us.current_streak;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  
  -- Initialize daily session streak
  INSERT INTO public.user_streaks (user_id, streak_type, current_streak, longest_streak)
  VALUES (NEW.id, 'daily_session', 0, 0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();