import { supabase } from './supabase';

export interface TavusSessionResponse {
  success: boolean;
  conversation_url: string;
  conversation_id: string;
  mentor_conversation_id: string;
  daily_session_id: string;
  persona_name: string;
}

export interface EndSessionResponse {
  success: boolean;
  duration_seconds: number;
  message: string;
}

export const sessionService = {
  async startTavusSession(userId: string, personaId: string): Promise<TavusSessionResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('start-tavus-session', {
        body: {
          user_id: userId,
          persona_id: personaId,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to start session');
      }

      return data;
    } catch (error) {
      console.error('Error starting Tavus session:', error);
      throw new Error('Failed to start video session. Please try again.');
    }
  },

  async endTavusSession(
    tavusConversationId: string,
    mentorConversationId: string,
    dailySessionId: string,
    userId: string
  ): Promise<EndSessionResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('end-tavus-session', {
        body: {
          tavus_conversation_id: tavusConversationId,
          mentor_conversation_id: mentorConversationId,
          daily_session_id: dailySessionId,
          user_id: userId,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to end session');
      }

      return data;
    } catch (error) {
      console.error('Error ending Tavus session:', error);
      throw new Error('Failed to end video session. Please try again.');
    }
  },

  async getUserPersonas(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_personas')
        .select(`
          id,
          name,
          specialization,
          is_active,
          replica_id,
          mentor_avatars (
            name,
            description,
            thumbnail_url,
            is_premium
          )
        `)
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching user personas:', error);
      throw new Error('Failed to load available mentors');
    }
  },

  async getActiveMentorAvatars() {
    try {
      const { data, error } = await supabase
        .from('mentor_avatars')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching mentor avatars:', error);
      throw new Error('Failed to load mentor avatars');
    }
  },
};