import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WelcomeStep } from '../components/onboarding/WelcomeStep';
import { AIDrivenSteps } from '../components/onboarding/AIDrivenSteps';
import { CongratulationsStep } from '../components/onboarding/CongratulationsStep';
import { VoiceControls } from '../components/onboarding/VoiceControls';
import { ProgressIndicator } from '../components/onboarding/ProgressIndicator';
import { useOnboardingConversation } from '../hooks/useOnboardingConversation';
import { useOnboardingData } from '../hooks/useOnboardingData';
import { Step } from '../types/onboarding';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  
  // Step management
  const [currentStep, setCurrentStep] = useState<Step>('emotional_discovery');
  const [loading, setLoading] = useState(false);

  // Custom hooks for conversation and data management
  const conversation = useOnboardingConversation();
  const onboardingData = useOnboardingData();

  // Handle step navigation
  const handleNextStep = () => {
    const steps: Step[] = ['welcome', 'emotional_discovery', 'ritual_design', 'voice_selection', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleCompleteOnboarding = async () => {
    try {
      setLoading(true);
      await onboardingData.callCompleteOnboardingAPI();
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // TODO: Show error message to user
    } finally {
      setLoading(false);
    }
  };

  const handleStartConversation = async () => {
    try {
      await conversation.startConversation();
    } catch (error) {
      console.error('Error starting conversation:', error);
      // TODO: Show error message to user
    }
  };

  const handleStopConversation = async () => {
    try {
      await conversation.stopConversation();
    } catch (error) {
      console.error('Error stopping conversation:', error);
      // TODO: Show error message to user
    }
  };

  const handleEndConversation = async () => {
    try {
      setLoading(true);
      await conversation.endConversation();
      handleNextStep();
    } catch (error) {
      console.error('Error ending conversation:', error);
      // TODO: Show error message to user
    } finally {
      setLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <WelcomeStep
            onNext={handleNextStep}
            isLoading={loading}
          />
        );

      case 'emotional_discovery':
      case 'ritual_design':
      case 'voice_selection':
        return (
          <AIDrivenSteps
            currentStep={currentStep}
            messages={conversation.messages}
            onEndConversation={handleEndConversation}
            conversationActive={conversation.conversationActive}
            isLoading={loading}
          />
        );

      case 'complete':
        return (
          <CongratulationsStep
            personalityProfile={onboardingData.personalityProfile}
            ritualPreferences={onboardingData.ritualPreferences}
            knowledgeCategories={onboardingData.knowledgeCategories}
            primaryGoals={onboardingData.primaryGoals}
            onCompleteOnboarding={handleCompleteOnboarding}
            isLoading={onboardingData.isLoading}
          />
        );

      default:
        return null;
    }
  };

  const shouldShowVoiceControls = ['emotional_discovery', 'ritual_design', 'voice_selection'].includes(currentStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-[#846fda] to-[#ba9be6] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-white text-xl font-semibold">Arami</span>
          </div>
        </div>
        
        <ProgressIndicator currentStep={currentStep} />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-6 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden">
          {renderCurrentStep()}
        </div>

        {/* Voice Controls */}
        {shouldShowVoiceControls && (
          <div className="flex-shrink-0 mt-6">
            <VoiceControls
              onStartTalking={handleStartConversation}
              onStopTalking={handleStopConversation}
              isActive={conversation.isListening}
              transcript={conversation.transcript}
              agentResponse={conversation.agentResponse}
            />
          </div>
        )}
      </div>
    </div>
  );
};