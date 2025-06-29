import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { DatabaseService } from '../lib/database';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { CheckCircle, ArrowRight, User, Settings, Target } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
}

export default function Onboarding() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Arami Space',
      description: 'Your personal journey to emotional wellness begins here.',
      icon: <User className="w-6 h-6" />,
      completed: false,
    },
    {
      id: 'personality',
      title: 'Personality Assessment',
      description: 'Help us understand your unique personality type.',
      icon: <Settings className="w-6 h-6" />,
      completed: false,
    },
    {
      id: 'goals',
      title: 'Set Your Goals',
      description: 'Define what you want to achieve on your wellness journey.',
      icon: <Target className="w-6 h-6" />,
      completed: false,
    },
  ];

  const handleCompleteOnboarding = async () => {
    if (!user) return;

    setLoading(true);
    try {
      console.log('Completing onboarding for user:', user.id);
      
      // Update the profile to mark onboarding as completed
      const updateResponse = await DatabaseService.updateProfile(user.id, {
        onboarding_completed: true,
      });

      if (updateResponse.success) {
        console.log('Onboarding marked as completed');
        
        // Refresh the profile to get the updated data
        await refreshProfile();
        
        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        console.error('Failed to complete onboarding:', updateResponse.error);
        // Handle error - maybe show a toast notification
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCompleteOnboarding();
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${
                  index < steps.length - 1 ? 'flex-1' : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    index <= currentStep
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      index < currentStep ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        {/* Current Step Content */}
        <Card className="p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-indigo-600">
                {currentStepData.icon}
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {currentStepData.title}
            </h1>
            <p className="text-lg text-gray-600">
              {currentStepData.description}
            </p>
          </div>

          {/* Step-specific content */}
          <div className="mb-8">
            {currentStep === 0 && (
              <div className="space-y-4">
                <p className="text-gray-700">
                  Arami Space is your personal AI mentor designed to help you develop emotional intelligence,
                  build meaningful habits, and achieve your wellness goals.
                </p>
                <p className="text-gray-700">
                  Let's get started by learning more about you and setting up your personalized experience.
                </p>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <p className="text-gray-700">
                  We'll conduct a brief personality assessment to understand your communication style,
                  preferences, and how you best receive guidance.
                </p>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-indigo-800 text-sm">
                    This assessment will help us customize your AI mentor's approach to match your personality type.
                  </p>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <p className="text-gray-700">
                  Finally, let's set some initial goals for your wellness journey. You can always adjust
                  these later as you grow and evolve.
                </p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-800 text-sm">
                    Your goals will help guide your daily rituals and conversations with your AI mentor.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <Button
            onClick={handleNextStep}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Setting up...
              </div>
            ) : currentStep === steps.length - 1 ? (
              <div className="flex items-center">
                Complete Setup
                <CheckCircle className="ml-2 w-4 h-4" />
              </div>
            ) : (
              <div className="flex items-center">
                Continue
                <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            )}
          </Button>
        </Card>

        {/* Skip Option */}
        {currentStep < steps.length - 1 && (
          <div className="text-center mt-6">
            <button
              onClick={handleCompleteOnboarding}
              disabled={loading}
              className="text-gray-500 hover:text-gray-700 text-sm underline"
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}