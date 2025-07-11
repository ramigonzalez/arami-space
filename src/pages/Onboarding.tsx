import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AIDrivenSteps } from '../components/onboarding/AIDrivenSteps';
import { CongratulationsStep } from '../components/onboarding/CongratulationsStep';
import { ProgressIndicator } from '../components/onboarding/ProgressIndicator';
import { WelcomeStep } from '../components/onboarding/WelcomeStep';
import { useAuth } from '../hooks/useAuth';
import { useOnboardingConversation } from '../hooks/useOnboardingConversation';
import { useOnboardingData } from '../hooks/useOnboardingData';
import { Language, Step } from '../types/onboarding';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Step management
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [loading, setLoading] = useState(false);

  // Welcome step data
  const [userName, setUserName] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  const [gender, setGender] = useState('female');

  // Custom hooks for data management
  const onboardingData = useOnboardingData();

  // Handle step changes from AI
  const handleStepChange = (step: string) => {
    setCurrentStep(step as Step);
  };

  // Handle onboarding completion from AI
  const handleCompleteOnboardingFromAI = () => {
    setCurrentStep('complete');
  };

  // Custom hook for conversation management
  const conversation = useOnboardingConversation({
    onPersonalityProfileUpdate: onboardingData.updatePersonalityProfile,
    onRitualPreferencesUpdate: onboardingData.updateRitualPreferences,
    onKnowledgeCategoriesUpdate: onboardingData.updateKnowledgeCategories,
    onPrimaryGoalsUpdate: onboardingData.updatePrimaryGoals,
    onStepChange: handleStepChange,
    onCompleteOnboarding: handleCompleteOnboardingFromAI,
    userName,
    language,
    gender,
  });

  // Start conversation with Genesis
  const startConversation = async () => {
    if (!userName.trim()) {
      alert('Please enter your name to continue');
      return;
    }

    try {
      setCurrentStep("emotional_discovery");
      await conversation.startConversation();
    } catch (error) {
      console.error("Failed to start conversation:", error);
      alert('Failed to start conversation. Please try again.');
    }
  };

  // Handle final onboarding completion
  const handleCompleteOnboarding = async () => {
    try {
      setLoading(true);
      await onboardingData.callCompleteOnboardingAPI(userName, language, gender, conversation.messages);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert('Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get current step info for progress indicator
  const getStepInfo = () => {
    const stepMap = {
      welcome: { number: 1, label: 'Welcome' },
      emotional_discovery: { number: 2, label: 'Discovery' },
      ritual_design: { number: 3, label: 'Design' },
      voice_selection: { number: 4, label: 'Voice' },
      complete: { number: 5, label: 'Complete' },
    };
    return stepMap[currentStep];
  };

  const stepInfo = getStepInfo();

  return (
    <div className="min-h-screen bg-arami-gradient relative overflow-hidden">
      {/* Grain texture overlay */}
      <div className="absolute inset-0 grain-texture opacity-[0.03] pointer-events-none" />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Enhanced Header with app branding and progress */}
        <header className="px-4 pt-safe-top pb-4">
          <div className="max-w-md mx-auto">
            {/* App Header */}
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-white">Arami Space</h1>
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <ProgressIndicator
              currentStep={stepInfo.number}
              totalSteps={5}
              stepLabels={['Welcome', 'Discovery', 'Design', 'Voice', 'Complete']}
              className="mb-2"
            />
          </div>
        </header>

        {/* Main content - optimized height distribution */}
        <main className="flex-1 px-4 pb-safe-bottom overflow-hidden">
          <div className="max-w-md mx-auto h-full flex flex-col">
            {/* Welcome Step */}
            {currentStep === 'welcome' && (
              <WelcomeStep
                userName={userName}
                setUserName={setUserName}
                language={language}
                setLanguage={setLanguage}
                gender={gender}
                setGender={setGender}
                onStartVoiceJourney={startConversation}
                isLoading={conversation.isLoading}
              />
            )}

            {/* AI-Driven Steps */}
            {(currentStep === 'emotional_discovery' || currentStep === 'ritual_design' || currentStep === 'voice_selection') && (
              <AIDrivenSteps
                currentStep={currentStep as 'emotional_discovery' | 'ritual_design' | 'voice_selection'}
                messages={conversation.messages}
                onEndConversation={conversation.endConversation}
                conversationActive={conversation.conversationActive}
                isLoading={conversation.isLoading}
              />
            )}

            {/* Congratulations Step */}
            {currentStep === 'complete' && (
              <CongratulationsStep
                personalityProfile={onboardingData.personalityProfile}
                ritualPreferences={onboardingData.ritualPreferences}
                knowledgeCategories={onboardingData.knowledgeCategories}
                primaryGoals={onboardingData.primaryGoals}
                onCompleteOnboarding={handleCompleteOnboarding}
                isLoading={loading || onboardingData.isLoading}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Onboarding;