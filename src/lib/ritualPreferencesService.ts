import { supabase } from './supabase';
import type { Database } from './database';

type RitualPreferences = Database['public']['Tables']['ritual_preferences']['Row'];
type RitualPreferencesInsert = Database['public']['Tables']['ritual_preferences']['Insert'];
type RitualPreferencesUpdate = Database['public']['Tables']['ritual_preferences']['Update'];

export interface RitualPreferencesFormData {
  timing: 'morning_person' | 'evening_person' | 'flexible';
  duration: 'quick_focused' | 'deeper_dive' | 'variable';
  style: 'guided_structure' | 'open_conversation' | 'mixed';
  voice_id: 'confident_coach' | 'warm_friend' | 'gentle_guide' | 'wise_mentor';
  focus_area: string;
  session_frequency: 'daily' | 'weekdays' | 'custom';
  preferred_session_time?: string;
  reminder_enabled: boolean;
}

export const ritualPreferencesService = {
  async getUserRitualPreferences(userId: string): Promise<RitualPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('ritual_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching ritual preferences:', error);
      throw new Error('Failed to fetch ritual preferences');
    }
  },

  async updateRitualPreferences(
    userId: string, 
    preferences: RitualPreferencesFormData
  ): Promise<RitualPreferences> {
    try {
      // Check if preferences exist
      const existing = await this.getUserRitualPreferences(userId);
      
      const preferenceData = {
        user_id: userId,
        timing: preferences.timing,
        duration: preferences.duration,
        style: preferences.style,
        voice_id: preferences.voice_id,
        focus_area: preferences.focus_area,
        session_frequency: preferences.session_frequency,
        preferred_session_time: preferences.preferred_session_time || null,
        reminder_enabled: preferences.reminder_enabled,
        updated_at: new Date().toISOString(),
      };

      if (existing) {
        // Update existing preferences
        const { data, error } = await supabase
          .from('ritual_preferences')
          .update(preferenceData)
          .eq('user_id', userId)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new preferences
        const { data, error } = await supabase
          .from('ritual_preferences')
          .insert({
            ...preferenceData,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('Error updating ritual preferences:', error);
      throw new Error('Failed to update ritual preferences');
    }
  },
};