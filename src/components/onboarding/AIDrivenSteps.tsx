import React from 'react';
import { Card } from '../ui/Card';
import { ConversationInterface } from './ConversationInterface';
import { VoiceControls } from './VoiceControls';
import { Brain, Settings, Volume2 } from 'lucide-react';

type Step = 'emotional_discovery' | 'ritual_design' | 'voice_selection';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AIDrivenStepsProps {
  currentStep: Step;
  messages: Message[];
}

export const AIDrivenSteps: React.FC<AIDrivenStepsProps> = ({
  currentStep,
  messages,
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
      <Card variant="glass" padding="large" className="text-center flex-shrink-0">
        <div className="space-y-6">
          {/* Breathing Animation with Icon */}
          <div className="flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#846fda] via-[#6556b9] to-[#ba9be6] shadow-2xl animate-breath-glow-advanced flex items-center justify-center">
              <IconComponent className="w-8 h-8 text-white" />
            </div>
          </div>
          
          {/* Step Information */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">{stepInfo.title}</h2>
            <p className="text-white/70">{stepInfo.description}</p>
          </div>
        </div>
      </Card>

      {/* Conversation Interface */}
      <Card variant="glass" padding="medium" className="flex-1 overflow-hidden">
        <ConversationInterface messages={messages} />
      </Card>

    </div>
  );
};