import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { WelcomeStep } from '../components/onboarding/WelcomeStep';
import { AIDrivenSteps } from '../components/onboarding/AIDrivenSteps';
import { CongratulationsStep } from '../components/onboarding/CongratulationsStep';
import { ProgressIndicator } from '../components/onboarding/ProgressIndicator';
import { Button } from '../components/ui/Button';
import { LogOut } from 'lucide-react';

type Step = 'welcome' | 'emotional_discovery' | 'ritual_design' | 'voice_selection' | 'complete';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface PersonalityProfile {
  disc: 'D' | 'I' | 'S' | 'C';
  enneagram?: string;
  confidence: number;
}

interface RitualPreferences {
  timing: 'morning_person' | 'evening_person';
  duration: 'quick_focused' | 'deeper_dive';
  style: 'guided_structure' | 'open_conversation';
  voice_id: 'confident_coach' | 'warm_friend' | 'gentle_guide' | 'wise_mentor';
  focus_area: 'stress_management' | 'goal_achievement' | 'relationships' | 'self_worth' | 'emotional_regulation';
}

export const Onboarding: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Step management
  const [currentStep, setCurrentStep] = useState<Step>('emotional_discovery');
  const [loading, setLoading] = useState(false);
  const [conversationActive, setConversationActive] = useState(false);

  // Form data
  const [welcomeData, setWelcomeData] = useState({
    name: '',
    language: 'en' as 'en' | 'es' | 'pt' | 'fr',
    gender: 'prefer_not_to_say' as 'male' | 'female' | 'non_binary' | 'prefer_not_to_say',
  });

  // AI conversation data
  const [messages, setMessages] = useState<Message[]>([]);
  const [personalityProfile, setPersonalityProfile] = useState<PersonalityProfile | null>(null);
  const [ritualPreferences, setRitualPreferences] = useState<RitualPreferences | null>(null);
  const [knowledgeCategories, setKnowledgeCategories] = useState<string[]>([]);
  const [primaryGoals, setPrimaryGoals] = useState<string[]>([]);

  // Test data for development
  useEffect(() => {
    // Set test data for development
    setPersonalityProfile({
      disc: 'I',
      enneagram: '7',
      confidence: 0.85
    });
    setRitualPreferences({
      timing: 'morning_person',
      duration: 'deeper_dive',
      style: 'guided_structure',
      voice_id: 'warm_friend',
      focus_area: 'emotional_regulation'
    });
    setKnowledgeCategories(['stress_management', 'emotional_regulation', 'personal_growth']);
    setPrimaryGoals([
      'Develop better emotional awareness',
      'Create consistent daily wellness habits',
      'Improve stress management techniques'
    ]);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleWelcomeComplete = (data: typeof welcomeData) => {
    setWelcomeData(data);
    setCurrentStep('emotional_discovery');
  };

  // End conversation handler
  const endConversation = useCallback(async () => {
    try {
      setLoading(true);
      await conversation.endSession();
      setConversationActive(false);
      setCurrentStep('complete');
    } catch (error) {
      console.error("Failed to end conversation:", error);
      setConversationActive(false);
      setCurrentStep('complete');
    } finally {
      setLoading(false);
    }
  }, [conversation]);


  const handleCompleteOnboarding = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Save all onboarding data to database
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: welcomeData.name,
          language: welcomeData.language,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Save personality profile
      if (personalityProfile) {
        const { error: personalityError } = await supabase
          .from('onboarding_profiles')
          .insert({
            user_id: user.id,
            disc_type: personalityProfile.disc,
            enneagram_type: personalityProfile.enneagram ? parseInt(personalityProfile.enneagram) : null,
            confidence_score: personalityProfile.confidence,
            personality_insights: {
              categories: knowledgeCategories,
              goals: primaryGoals,
            },
            completed_at: new Date().toISOString(),
          });

        if (personalityError) throw personalityError;
      }

      // Save ritual preferences
      if (ritualPreferences) {
        const { error: ritualError } = await supabase
          .from('ritual_preferences')
          .insert({
            user_id: user.id,
            timing: ritualPreferences.timing,
            duration: ritualPreferences.duration,
            style: ritualPreferences.style,
            voice_id: ritualPreferences.voice_id,
            focus_area: ritualPreferences.focus_area,
          });

        if (ritualError) throw ritualError;
      }

      // Save emotional categories
      if (knowledgeCategories.length > 0) {
        const categoryInserts = knowledgeCategories.map((category, index) => ({
          user_id: user.id,
          category,
          priority_level: index + 1,
        }));

        const { error: categoriesError } = await supabase
          .from('user_emotional_categories')
          .insert(categoryInserts);

        if (categoriesError) throw categoriesError;
      }

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStepNumber = (step: Step): number => {
    const stepMap = {
      welcome: 1,
      emotional_discovery: 2,
      ritual_design: 3,
      voice_selection: 4,
      complete: 5,
    };
    return stepMap[step];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Fixed Header */}
      <header className="flex-shrink-0 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-bold text-white">Arami</h1>
          {user?.email && (
            <span className="text-sm text-white/70">• {user.email}</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="small"
          onClick={handleSignOut}
          className="text-white/80 hover:text-white hover:bg-white/10"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </header>

      {/* Progress Indicator */}
      {currentStep !== 'welcome' && (
        <div className="flex-shrink-0 px-4 pb-4">
          <ProgressIndicator
            currentStep={getStepNumber(currentStep)}
            totalSteps={5}
            stepLabels={['Welcome', 'Discovery', 'Design', 'Voice', 'Complete']}
          />
        </div>
      )}

      {/* Main Content Area - Fixed height with internal scrolling */}
      <main className="flex-1 px-4 pb-4 overflow-hidden">
        <div className="h-full flex flex-col">
          {currentStep === 'welcome' && (
            <WelcomeStep
              onComplete={handleWelcomeComplete}
              isLoading={loading}
            />
          )}

          {(currentStep === 'emotional_discovery' || 
            currentStep === 'ritual_design' || 
            currentStep === 'voice_selection') && (
            <AIDrivenSteps
              currentStep={currentStep}
              messages={messages}
              onEndConversation={endConversation}
              conversationActive={conversationActive}
              isLoading={loading}
            />
          )}

          {currentStep === 'complete' && (
            <CongratulationsStep
              personalityProfile={personalityProfile}
              ritualPreferences={ritualPreferences}
              knowledgeCategories={knowledgeCategories}
              primaryGoals={primaryGoals}
              onCompleteOnboarding={handleCompleteOnboarding}
              isLoading={loading}
            />
          )}
        </div>
      </main>
    </div>
  );
};