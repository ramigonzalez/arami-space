import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './useAuth';
import { PersonalityProfile, RitualPreferences, OnboardingData } from '../types/onboarding';
import { DatabaseService } from '../lib/database';

const VOICE_ID_MAP = {
  en: {
    female: "pNInz6obpgDQGcFmaJgB", // Adam
    male: "EXAVITQu4vr4xnSDxMaL"   // Bella
  },
  es: {
    female: "VR6AewLTigWG4xSOukaG", // Antoni
    male: "onwK4e9ZLuTAKqWW03F9"   // Arnold
  },
  pt: {
    female: "pqHfZKP75CvOlQylNhV4", // Bill
    male: "IKne3meq5aSn9XLyUdCD"   // Brian
  },
  fr: {
    female: "XB0fDUnXU5powFXDhCwa", // Callum
    male: "piTKgcLEGmPE4e6mEKli"   // Charlie
  }
};

export const useOnboardingData = () => {
  const { user, refreshProfile } = useAuth();
  
  const [personalityProfile, setPersonalityProfile] = useState<PersonalityProfile | null>(null);
  const [ritualPreferences, setRitualPreferences] = useState<RitualPreferences | null>(null);
  const [knowledgeCategories, setKnowledgeCategories] = useState<string[]>([]);
  const [primaryGoals, setPrimaryGoals] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Test data initialization (for development)
  useEffect(() => {
    /////// TEST PURPOSE - do not remove yet ///////
    setPersonalityProfile(JSON.parse('{"disc":"C","confidence":0.8}'));
    setRitualPreferences(JSON.parse('{"timing":"morning_person","duration":"quick_focused","style":"guided_structure","voice_id":"wise_mentor","focus_area":"goal_achievement"}'));
    setKnowledgeCategories(JSON.parse('["goal_achievement","stress_management"]'));
    setPrimaryGoals(JSON.parse('["procastinar menos en mi dia a dia"]'));
    ////////////////////////////////////////////
  }, []);

  const updatePersonalityProfile = useCallback((profile: PersonalityProfile) => {
    setPersonalityProfile(profile);
  }, []);

  const updateRitualPreferences = useCallback((preferences: RitualPreferences) => {
    setRitualPreferences(preferences);
  }, []);

  const updateKnowledgeCategories = useCallback((categories: string[]) => {
    setKnowledgeCategories(categories);
  }, []);

  const updatePrimaryGoals = useCallback((goals: string[]) => {
    setPrimaryGoals(goals);
  }, []);

  const callCompleteOnboardingAPI = useCallback(async (userName: string, language: string, gender: string, messages: any[]): Promise<void> => {
    if (!user) return;

    setIsLoading(true);
    try {
      console.log('Completing onboarding for user:', user.id);

      // Save personality profile
      if (personalityProfile) {
        const profileResponse = await DatabaseService.createOnboardingProfile({
          user_id: user.id,
          disc_type: personalityProfile.disc,
          enneagram_type: personalityProfile.enneagram ? parseInt(personalityProfile.enneagram) : undefined,
          confidence_score: personalityProfile.confidence,
          personality_insights: {},
          assessment_transcript: messages.map(m => `${m.type}: ${m.content}`).join('\n'),
        });

        if (!profileResponse.success) {
          console.error('Failed to save personality profile:', profileResponse.error);
        }
      }

      // Save ritual preferences
      if (ritualPreferences) {
        const preferencesResponse = await DatabaseService.createRitualPreferences({
          user_id: user.id,
          timing: ritualPreferences.timing,
          duration: ritualPreferences.duration,
          style: ritualPreferences.style,
          voice_id: ritualPreferences.voice_id,
          focus_area: ritualPreferences.focus_area,
          elevenlabs_voice_id: VOICE_ID_MAP[language as keyof typeof VOICE_ID_MAP]?.[gender as keyof typeof VOICE_ID_MAP['en']] || VOICE_ID_MAP["en"]["female"],
        });

        if (!preferencesResponse.success) {
          console.error('Failed to save ritual preferences:', preferencesResponse.error);
        }
      }

      // Save emotional categories
      for (const category of knowledgeCategories) {
        await DatabaseService.createEmotionalCategory({
          user_id: user.id,
          category: category as any,
          priority_level: 1,
        });
      }

      // Save primary goals
      for (const goal of primaryGoals) {
        await DatabaseService.createGoal({
          user_id: user.id,
          goal_text: goal,
          goal_type: 'emotional_wellness',
          source: 'onboarding',
        });
      }

      // Update profile to mark onboarding as completed
      const updateResponse = await DatabaseService.updateProfile(user.id, {
        onboarding_completed: true,
        full_name: userName,
        language: language as any,
      });

      if (updateResponse.success) {
        console.log('Onboarding marked as completed');
        
        // Refresh the profile to get the updated data
        await refreshProfile();
      } else {
        console.error('Failed to complete onboarding:', updateResponse.error);
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user, personalityProfile, ritualPreferences, knowledgeCategories, primaryGoals, refreshProfile]);

  const resetOnboardingData = useCallback(() => {
    setPersonalityProfile(null);
    setRitualPreferences(null);
    setKnowledgeCategories([]);
    setPrimaryGoals([]);
  }, []);

  return {
    // State
    personalityProfile,
    ritualPreferences,
    knowledgeCategories,
    primaryGoals,
    isLoading,
    
    // Actions
    updatePersonalityProfile,
    updateRitualPreferences,
    updateKnowledgeCategories,
    updatePrimaryGoals,
    callCompleteOnboardingAPI,
    resetOnboardingData,
  };
};