import React from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { CheckCircle, ArrowRight, Brain, Settings, Heart, Target, Sparkles } from 'lucide-react';
import { PersonalityProfile, RitualPreferences } from '../../types/onboarding';

interface CongratulationsStepProps {
  personalityProfile: PersonalityProfile | null;
  ritualPreferences: RitualPreferences | null;
  knowledgeCategories: string[];
  primaryGoals: string[];
  onCompleteOnboarding: () => Promise<void>;
  isLoading: boolean;
}

export const CongratulationsStep: React.FC<CongratulationsStepProps> = ({
  personalityProfile,
  ritualPreferences,
  knowledgeCategories,
  primaryGoals,
  onCompleteOnboarding,
  isLoading,
}) => {
  return (
    <div className="h-full flex flex-col">
      <Card variant="glass" padding="medium" className="flex-1 flex flex-col">
        {/* Header - Fixed at top */}
        <div className="flex-shrink-0 text-center mb-2">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-xl font-bold text-white">
            Your Journey Begins!
          </h1>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-6">
          {personalityProfile && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-3 flex items-center text-sm">
                <Brain className="w-4 h-4 mr-2 text-accent-300" />
                Personality Profile
              </h3>
              <div className="space-y-2 text-white/80 text-sm">
                <div className="flex justify-between">
                  <span>DISC Type:</span>
                  <span className="font-medium">{personalityProfile.disc}</span>
                </div>
                {personalityProfile.enneagram && (
                  <div className="flex justify-between">
                    <span>Enneagram:</span>
                    <span className="font-medium">Type {personalityProfile.enneagram}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Confidence:</span>
                  <span className="font-medium">{Math.round(personalityProfile.confidence * 100)}%</span>
                </div>
              </div>
            </div>
          )}

          {ritualPreferences && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-3 flex items-center text-sm">
                <Settings className="w-4 h-4 mr-2 text-accent-300" />
                Ritual Preferences
              </h3>
              <div className="space-y-2 text-white/80 text-sm">
                <div className="flex justify-between">
                  <span>Timing:</span>
                  <span className="font-medium capitalize">{ritualPreferences.timing.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium capitalize">{ritualPreferences.duration.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Style:</span>
                  <span className="font-medium capitalize">{ritualPreferences.style.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Voice:</span>
                  <span className="font-medium capitalize">{ritualPreferences.voice_id.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Focus:</span>
                  <span className="font-medium capitalize">{ritualPreferences.focus_area.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          )}

          {knowledgeCategories.length > 0 && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-3 flex items-center text-sm">
                <Heart className="w-4 h-4 mr-2 text-accent-300" />
                Emotional Focus Areas
              </h3>
              <div className="flex flex-wrap gap-2">
                {knowledgeCategories.map((category, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-accent-300/20 text-accent-300 rounded-full text-xs"
                  >
                    {category.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {primaryGoals.length > 0 && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-3 flex items-center text-sm">
                <Target className="w-4 h-4 mr-2 text-accent-300" />
                Primary Goals
              </h3>
              <ul className="space-y-2 text-white/80 text-sm">
                {primaryGoals.map((goal, index) => (
                  <li key={index} className="flex items-start">
                    <Sparkles className="w-3 h-3 mr-2 text-accent-300 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Button - Fixed at bottom */}
        <div className="flex-shrink-0">
          <Button
            onClick={onCompleteOnboarding}
            disabled={isLoading}
            size="large"
            icon={ArrowRight}
            iconPosition="right"
            className="w-full"
          >
            {isLoading ? 'Setting up your sanctuary...' : 'Enter Your Sanctuary'}
          </Button>
        </div>
      </Card>
    </div>
  );
};