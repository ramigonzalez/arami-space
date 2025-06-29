import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { WelcomeStep } from '../components/onboarding/WelcomeStep';
import { AIDrivenSteps } from '../components/onboarding/AIDrivenSteps';
import { CongratulationsStep } from '../components/onboarding/CongratulationsStep';
import { ProgressIndicator } from '../components/onboarding/ProgressIndicator';
import { VoiceControls } from '../components/onboarding/VoiceControls';
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

  // Welcome step data
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('en');
  const [gender, setGender] = useState<'male' | 'female' | 'non-binary'>('male');

  // AI conversation data
  const [messages, setMessages] = useState<Message[]>([]);
  const [personalityProfile, setPersonalityProfile] = useState<PersonalityProfile | null>(null);
  const [ritualPreferences, setRitualPreferences] = useState<RitualPreferences | null>(null);
  const [knowledgeCategories, setKnowledgeCategories] = useState<string[]>([]);
  const [primaryGoals, setPrimaryGoals] = useState<string[]>([]);

  // Test data for development
  useEffect(() => {
    // Simulate some test data for the congratulations step
    setPersonalityProfile({
      disc: 'I',
      enneagram: '7',
      confidence: 0.85
    });
    setRitualPreferences({
      timing: 'morning_person',
      duration: 'quick_focused',
      style: 'guided_structure',
      voice_id: 'warm_friend',
      focus_area: 'emotional_regulation'
    });
    setKnowledgeCategories(['stress_management', 'emotional_regulation', 'personal_growth']);
    setPrimaryGoals([
      'Develop better emotional awareness',
      'Create consistent morning routine',
      'Improve stress management skills'
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

  const handleWelcomeComplete = (data: { name: string; language: string; gender: 'male' | 'female' | 'non-binary' }) => {
    setName(data.name);
    setLanguage(data.language);
    setGender(data.gender);
    setCurrentStep('emotional_discovery');
  };

  const handleEndConversation = async () => {
    setLoading(true);
    try {
      // Simulate API call to end conversation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setConversationActive(false);
      
      // Move to next step based on current step
      if (currentStep === 'emotional_discovery') {
        setCurrentStep('ritual_design');
      } else if (currentStep === 'ritual_design') {
        setCurrentStep('voice_selection');
      } else if (currentStep === 'voice_selection') {
        setCurrentStep('complete');
      }
    } catch (error) {
      console.error('Error ending conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOnboarding = async () => {
    setLoading(true);
    try {
      // Simulate API call to save onboarding data
      await new Promise(resolve => setTimeout(resolve, 2000));
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
      complete: 5
    };
    return stepMap[step];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex flex-col">
      {/* Header - Fixed */}
      <header className="flex-shrink-0 p-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-white">Arami</h1>
          {user?.email && (
            <span className="text-white/70 text-sm">{user.email}</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="small"
          onClick={handleSignOut}
          className="text-white/70 hover:text-white"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </header>

      {/* Progress Indicator - Fixed */}
      <div className="flex-shrink-0 px-6 pb-6">
        <ProgressIndicator 
          currentStep={getStepNumber(currentStep)} 
          totalSteps={5} 
        />
      </div>

      {/* Main Content - Scrollable */}
      <main className="flex-1 overflow-y-auto px-6 pb-6">
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
            onEndConversation={handleEndConversation}
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
      </main>

      {/* Voice Controls - Fixed (only show for AI steps) */}
      {(currentStep === 'emotional_discovery' || 
        currentStep === 'ritual_design' || 
        currentStep === 'voice_selection') && (
        <footer className="flex-shrink-0 p-6">
          <VoiceControls
            onStartRecording={() => setConversationActive(true)}
            onStopRecording={() => setConversationActive(false)}
            isRecording={conversationActive}
            disabled={loading}
          />
        </footer>
      )}
    </div>
  );
};