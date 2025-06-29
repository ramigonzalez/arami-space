import { useState, useCallback } from 'react';
import { PersonalityProfile, RitualPreferences, OnboardingData } from '../types/onboarding';
import { supabase } from '../lib/supabase';

export const useOnboardingData = () => {
  const [personalityProfile, setPersonalityProfile] = useState<PersonalityProfile | null>(null);
  const [ritualPreferences, setRitualPreferences] = useState<RitualPreferences | null>(null);
  const [knowledgeCategories, setKnowledgeCategories] = useState<string[]>([]);
  const [primaryGoals, setPrimaryGoals] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const callCompleteOnboardingAPI = useCallback(async (): Promise<void> => {
    if (!personalityProfile || !ritualPreferences) {
      throw new Error('Missing required onboarding data');
    }

    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      // Save onboarding profile
      const { error: profileError } = await supabase
        .from('onboarding_profiles')
        .upsert({
          user_id: user.id,
          disc_type: personalityProfile.disc,
          enneagram_type: personalityProfile.enneagram ? parseInt(personalityProfile.enneagram) : null,
          confidence_score: personalityProfile.confidence,
          personality_insights: {
            knowledge_categories: knowledgeCategories,
            primary_goals: primaryGoals,
          },
          completed_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;

      // Save ritual preferences
      const { error: preferencesError } = await supabase
        .from('ritual_preferences')
        .upsert({
          user_id: user.id,
          timing: ritualPreferences.timing,
          duration: ritualPreferences.duration,
          style: ritualPreferences.style,
          voice_id: ritualPreferences.voice_id,
          focus_area: ritualPreferences.focus_area,
        });

      if (preferencesError) throw preferencesError;

      // Save emotional categories
      if (knowledgeCategories.length > 0) {
        const categoryData = knowledgeCategories.map((category, index) => ({
          user_id: user.id,
          category,
          priority_level: index + 1,
        }));

        const { error: categoriesError } = await supabase
          .from('user_emotional_categories')
          .upsert(categoryData);

        if (categoriesError) throw categoriesError;
      }

      // Save primary goals
      if (primaryGoals.length > 0) {
        const goalsData = primaryGoals.map(goal => ({
          user_id: user.id,
          goal_text: goal,
          goal_type: 'emotional_wellness' as const,
          source: 'onboarding' as const,
        }));

        const { error: goalsError } = await supabase
          .from('user_goals')
          .upsert(goalsData);

        if (goalsError) throw goalsError;
      }

      // Mark onboarding as completed in profiles
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id);

      if (updateError) throw updateError;

    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [personalityProfile, ritualPreferences, knowledgeCategories, primaryGoals]);

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