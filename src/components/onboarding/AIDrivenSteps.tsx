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
  isListening: boolean;
  currentTranscript: string;
  isAiSpeaking: boolean;
  audioLevel: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export const AIDrivenSteps: React.FC<AIDrivenStepsProps> = ({
  currentStep,
  messages,
  isListening,
  currentTranscript,
  isAiSpeaking,
  audioLevel,
  onStartRecording,
  onStopRecording,
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
    <div className="space-y-6">
      {/* Step Info Card */}
      <Card variant="glass" padding="medium" className="text-center">
        <div className="flex items-center justify-center space-x-4">
          <IconComponent className="w-8 h-8 text-accent-300" />
          <div>
            <h2 className="text-xl font-semibold text-white">{stepInfo.title}</h2>
            <p className="text-white/70">{stepInfo.description}</p>
          </div>
        </div>
      </Card>

      {/* Breathing Animation */}
      <div className="my-10 flex items-center justify-center">
        <div className="w-48 h-48 rounded-full bg-gradient-to-br from-[#846fda] via-[#6556b9] to-[#ba9be6] shadow-2xl animate-breath-glow-advanced flex items-center justify-center" />
      </div>

      {/* Conversation Interface */}
      <Card variant="glass" padding="medium">
        <ConversationInterface
          messages={messages}
          isListening={isListening}
          currentTranscript={currentTranscript}
          isAiSpeaking={isAiSpeaking}
        />
      </Card>

      {/* Voice Controls */}
      <div className="flex justify-center">
        <VoiceControls
          isRecording={isListening}
          isProcessing={isAiSpeaking}
          audioLevel={audioLevel}
          onStartRecording={onStartRecording}
          onStopRecording={onStopRecording}
        />
      </div>
    </div>
  );
};