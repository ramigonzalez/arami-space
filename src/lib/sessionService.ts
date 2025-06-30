import { supabase } from './supabase';

export interface SessionContext {
  userId: string;
  discType?: string;
  enneagramType?: number;
  personalityInsights?: Record<string, unknown>;
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
    key_insights?: Record<string, unknown>;
  }>;
}

export interface StartSessionResponse {
  success: boolean;
  conversationId?: string;
  replicaId?: string;
  personaId?: string;
  conversationUrl?: string;
  mentorConversationId?: string;
  dailySessionId?: string;
  personaName?: string;
  error?: string;
}

export interface EndSessionResponse {
  success: boolean;
  error?: string;
}

export class SessionService {
  static async startFaceToFaceSession(userId: string): Promise<StartSessionResponse> {
    try {
      console.log('=== SESSION SERVICE DEBUG ===');
      console.log('SessionService.startFaceToFaceSession called with userId:', userId);

      // Skip session check since we already have valid userId from authenticated user
      console.log('✅ Valid userId provided, proceeding with function call...');

      // Call the start-tavus-session edge function
      console.log('📞 Calling supabase.functions.invoke with:', {
        functionName: 'start-tavus-session',
        body: { user_id: userId }
      });

      const { data, error } = await supabase.functions.invoke('start-tavus-session', {
        body: {
          user_id: userId
        }
      });

      console.log('📞 Function invoke response:', { data, error });

      if (error) {
        console.error('❌ Error from edge function:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.status,
          statusText: error.statusText
        });
        return {
          success: false,
          error: error.message || 'Failed to start session'
        };
      }

      console.log('✅ Edge function call successful, data received:', data);
      
      return {
        success: true,
        conversationId: data.conversation_id,
        conversationUrl: data.conversation_url,
        mentorConversationId: data.mentor_conversation_id,
        dailySessionId: data.daily_session_id,
        personaName: data.persona_name
      };
    } catch (error) {
      console.error('❌ Unexpected error in SessionService:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack available');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    } finally {
      console.log('=== SESSION SERVICE DEBUG END ===');
    }
  }

  static async endSession(
    conversationId: string, 
    mentorConversationId: string, 
    dailySessionId: string, 
    userId: string
  ): Promise<EndSessionResponse> {
    try {
      console.log('Ending session:', conversationId);
      
      const { data, error } = await supabase.functions.invoke('end-tavus-session', {
        body: {
          tavus_conversation_id: conversationId,
          mentor_conversation_id: mentorConversationId,
          daily_session_id: dailySessionId,
          user_id: userId
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
      // Get user profile (not currently used but available for future context)
      await supabase
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