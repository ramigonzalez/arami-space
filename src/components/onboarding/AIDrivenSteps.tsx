import React from 'react';
import { Card } from '../ui/Card';
import { ConversationInterface } from './ConversationInterface';
import { Brain, Settings, Volume2, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Message, Step } from '../../types/onboarding';

interface AIDrivenStepsProps {
  currentStep: 'emotional_discovery' | 'ritual_design' | 'voice_selection';
  messages: Message[];
  onEndConversation?: () => Promise<void>;
  conversationActive?: boolean;
  isLoading?: boolean;
}

export const AIDrivenSteps: React.FC<AIDrivenStepsProps> = ({
  currentStep,
  messages,
  onEndConversation,
  conversationActive = false,
  isLoading = false,
}) => {
  const getStepInfo = () => {
    switch (currentStep) {
      case 'emotional_discovery':
        return {
          icon: Brain,
          title: 'Emotional Discovery',
          description: 'Understanding your personality and emotional patterns',
        };
      case 'ritual_design':
        return {
          icon: Settings,
          title: 'Ritual Design',
          description: 'Creating your personalized daily wellness ritual',
        };
      case 'voice_selection':
        return {
          icon: Volume2,
          title: 'Voice Selection',
          description: 'Choosing your perfect AI companion voice',
        };
      default:
        return {
          icon: Brain,
          title: 'Discovery',
          description: 'Learning about your preferences',
        };
    }
  };

  const stepInfo = getStepInfo();
  const IconComponent = stepInfo.icon;

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Step Info Card with Integrated Animation */}
      <Card variant="glass" padding="medium" className="text-center flex-shrink-0">
        <div className="space-y-6">
          {/* Breathing Animation with Icon */}
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#846fda] via-[#6556b9] to-[#ba9be6] shadow-2xl animate-breath-glow-advanced flex items-center justify-center">
              <IconComponent className="w-8 h-8 text-white" />
            </div>
          </div>
          
          {/* Step Information */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">{stepInfo.title}</h2>
            <p className="text-white/70">{stepInfo.description}</p>
          </div>

          {/* End Conversation Button */}
          {/* {conversationActive && onEndConversation && ( */}
          {true && (
            <div className="">
              <Button
                variant="ghost"
                size="small"
                onClick={onEndConversation}
                disabled={isLoading}
                className="border border-white/20 text-white hover:bg-white/10"
              >
                <X className="w-4 h-4 mr-2" />
                {isLoading ? 'Ending...' : 'End Conversation'}
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Conversation Interface - now with fixed height */}
      <Card variant="glass" padding="medium" className="flex-shrink-0">
        <ConversationInterface messages={messages} />
      </Card>

    </div>
  );
};