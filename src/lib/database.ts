import { supabase } from './supabase';
import type { 
  Profile, 
  OnboardingProfile, 
  UserGoal, 
  RitualPreferences, 
  DailySession, 
  UserStreak, 
  VirtueCollection,
  UserDashboard 
} from './supabase';

export interface DatabaseResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export class DatabaseService {
  // Profile Management
  static async createProfile(profileData: Partial<Profile>): Promise<DatabaseResponse<Profile>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to create profile' };
    }
  }

  static async getProfile(userId: string): Promise<DatabaseResponse<Profile>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to get profile' };
    }
  }

  static async updateProfile(userId: string, updates: Partial<Profile>): Promise<DatabaseResponse<Profile>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to update profile' };
    }
  }

  // Onboarding Management
  static async createOnboardingProfile(onboardingData: Partial<OnboardingProfile>): Promise<DatabaseResponse<OnboardingProfile>> {
    try {
      const { data, error } = await supabase
        .from('onboarding_profiles')
        .insert(onboardingData)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to create onboarding profile' };
    }
  }

  static async getOnboardingProfile(userId: string): Promise<DatabaseResponse<OnboardingProfile>> {
    try {
      const { data, error } = await supabase
        .from('onboarding_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to get onboarding profile' };
    }
  }

  // Goals Management
  static async createGoal(goalData: Partial<UserGoal>): Promise<DatabaseResponse<UserGoal>> {
    try {
      const { data, error } = await supabase
        .from('user_goals')
        .insert(goalData)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to create goal' };
    }
  }

  static async getUserGoals(userId: string, status?: string): Promise<DatabaseResponse<UserGoal[]>> {
    try {
      let query = supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to get goals' };
    }
  }

  // Ritual Preferences Management
  static async createRitualPreferences(preferencesData: Partial<RitualPreferences>): Promise<DatabaseResponse<RitualPreferences>> {
    try {
      const { data, error } = await supabase
        .from('ritual_preferences')
        .insert(preferencesData)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to create ritual preferences' };
    }
  }

  static async getRitualPreferences(userId: string): Promise<DatabaseResponse<RitualPreferences>> {
    try {
      const { data, error } = await supabase
        .from('ritual_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to get ritual preferences' };
    }
  }

  // Session Management
  static async createSession(sessionData: Partial<DailySession>): Promise<DatabaseResponse<DailySession>> {
    try {
      const { data, error } = await supabase
        .from('daily_sessions')
        .insert(sessionData)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to create session' };
    }
  }

  static async getUserSessions(userId: string, limit: number = 10): Promise<DatabaseResponse<DailySession[]>> {
    try {
      const { data, error } = await supabase
        .from('daily_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to get sessions' };
    }
  }

  // Streak Management
  static async getUserStreak(userId: string, streakType: string): Promise<DatabaseResponse<UserStreak>> {
    try {
      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', userId)
        .eq('streak_type', streakType)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to get streak' };
    }
  }

  static async updateStreak(userId: string, streakType: string, updates: Partial<UserStreak>): Promise<DatabaseResponse<UserStreak>> {
    try {
      const { data, error } = await supabase
        .from('user_streaks')
        .update(updates)
        .eq('user_id', userId)
        .eq('streak_type', streakType)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to update streak' };
    }
  }

  // Virtue Collection Management
  static async getUserVirtues(userId: string): Promise<DatabaseResponse<VirtueCollection[]>> {
    try {
      const { data, error } = await supabase
        .from('virtue_collection')
        .select('*')
        .eq('user_id', userId)
        .order('first_earned_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to get virtues' };
    }
  }

  static async addVirtue(virtueData: Partial<VirtueCollection>): Promise<DatabaseResponse<VirtueCollection>> {
    try {
      const { data, error } = await supabase
        .from('virtue_collection')
        .upsert(virtueData, { 
          onConflict: 'user_id,virtue_name',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to add virtue' };
    }
  }

  // Dashboard Data
  static async getUserDashboard(userId: string): Promise<DatabaseResponse<UserDashboard>> {
    try {
      const { data, error } = await supabase
        .from('user_dashboard')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to get dashboard data' };
    }
  }

  // Settings Management
  static async getUserSetting(userId: string, settingKey: string): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('setting_value')
        .eq('user_id', userId)
        .eq('setting_key', settingKey)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data.setting_value };
    } catch (error) {
      return { success: false, error: 'Failed to get setting' };
    }
  }

  static async updateUserSetting(userId: string, settingKey: string, settingValue: any): Promise<DatabaseResponse<any>> {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .upsert({
          user_id: userId,
          setting_key: settingKey,
          setting_value: settingValue
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to update setting' };
    }
  }
}