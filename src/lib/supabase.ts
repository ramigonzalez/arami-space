import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('Missing VITE_SUPABASE_URL environment variable');
  console.error('Please create a .env file with your Supabase project URL');
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_ANON_KEY environment variable');
  console.error('Please create a .env file with your Supabase anon key');
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

console.log('[Supabase] Initializing client with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// TypeScript interfaces for database entities
export interface UserEmotionalCategory {
  id: string;
  user_id: string;
  category: 'stress_management' | 'goal_achievement' | 'relationships' | 'self_worth' | 'emotional_regulation' | 'work_life_balance' | 'personal_growth' | 'mindfulness';
  priority_level: number;
  created_at: string;
}

// Test the connection and log the result
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('[Supabase] Connection test failed:', error);
  } else {
    console.log('[Supabase] Connection test successful. Session:', data.session ? 'Found existing session' : 'No existing session');
  }
}).catch((error) => {
  console.error('[Supabase] Connection test error:', error);
});