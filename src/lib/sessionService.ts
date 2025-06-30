import { supabase } from './supabase';
import { Database } from './database';

export interface SessionContext {
  userId: string;
  discType?: string;
  enneagramType?: number;
  personalityInsights?: any;
  goals?: Array<{
    goal_text: string;
    goal_type: string;
    smart_goal?: string;
  }>;
  emotionalCategories?: Array<{
    category: string;
    priority_level: number;
  }>;
  ritualPreferences?: {
    timing: string;
    duration: string;
    style: string;
    voice_id: string;
    focus_area: string;
  };
  recentSessions?: Array<{
    session_type: string;
    virtue_earned?: string;
    key_insights?: any;
  }>;
}

export interface StartSessionResponse {
  success: boolean;
  conversationId?: string;
  replicaId?: string;
  personaId?: string;
  conversationUrl?: string;
  error?: string;
}

export interface EndSessionResponse {
  success: boolean;
  error?: string;
}

export class SessionService {
  static async startFaceToFaceSession(userId: string): Promise<StartSessionResponse> {
    try {
      console.log('Starting face-to-face session for user:', userId);

      // Call the start-tavus-session edge function
      const { data, error } = await supabase.functions.invoke('start-tavus-session', {
        body: {
          user_id:userId
        }
      });

      if (error) {
        console.error('Error starting Tavus session:', error);
        return {
          success: false,
          error: error.message || 'Failed to start session'
        };
      }

      console.log('Tavus session started successfully:', data);
      
      return {
        success: true,
        conversationId: data.conversationId,
        replicaId: data.replicaId,
        personaId: data.personaId,
        conversationUrl: data.conversationUrl
      };
    } catch (error) {
      console.error('Unexpected error starting session:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  static async endSession(conversationId: string): Promise<EndSessionResponse> {
    try {
      console.log('Ending session:', conversationId);
      
      const { data, error } = await supabase.functions.invoke('end-tavus-session', {
        body: {
          conversationId
        }
      });

      if (error) {
        console.error('Error ending session:', error);
        return {
          success: false,
          error: error.message || 'Failed to end session'
        };
      }

      console.log('Session ended successfully:', data);
      
      return {
        success: true
      };
    } catch (error) {
      console.error('Unexpected error ending session:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private static async gatherUserContext(userId: string): Promise<SessionContext> {
    try {
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // Get onboarding profile
      const { data: onboarding } = await supabase
        .from('onboarding_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Get user goals
      const { data: goals } = await supabase
        .from('user_goals')
        .select('goal_text, goal_type, smart_goal')
        .eq('user_id', userId)
        .eq('status', 'active')
        .limit(5);

      // Get emotional categories
      const { data: emotionalCategories } = await supabase
        .from('user_emotional_categories')
        .select('category, priority_level')
        .eq('user_id', userId)
        .order('priority_level', { ascending: false })
        .limit(3);

      // Get ritual preferences
      const { data: ritualPreferences } = await supabase
        .from('ritual_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Get recent sessions for context
      const { data: recentSessions } = await supabase
        .from('daily_sessions')
        .select('session_type, virtue_earned, key_insights')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(3);

      return {
        userId,
        discType: onboarding?.disc_type,
        enneagramType: onboarding?.enneagram_type,
        personalityInsights: onboarding?.personality_insights,
        goals: goals || [],
        emotionalCategories: emotionalCategories || [],
        ritualPreferences: ritualPreferences || undefined,
        recentSessions: recentSessions || []
      };
    } catch (error) {
      console.error('Error gathering user context:', error);
      return { userId };
    }
  }
}