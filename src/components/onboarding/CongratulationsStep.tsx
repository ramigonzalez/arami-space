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
    <Card variant="glass" padding="large" className="text-center">
      <div className="space-y-8">
        <div>
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Your Journey Begins!
          </h1>
          <p className="text-white/80 text-lg leading-relaxed">
            Genesis has learned about your unique personality and preferences. Here's what we discovered:
          </p>
        </div>

        {/* Summary of collected data */}
        <div className="space-y-6 text-left">
          {personalityProfile && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-accent-300" />
                Personality Profile
              </h3>
              <div className="space-y-2 text-white/80">
                <p><strong>DISC Type:</strong> {personalityProfile.disc}</p>
                {personalityProfile.enneagram && (
                  <p><strong>Enneagram:</strong> Type {personalityProfile.enneagram}</p>
                )}
                <p><strong>Confidence:</strong> {Math.round(personalityProfile.confidence * 100)}%</p>
              </div>
            </div>
          )}

          {ritualPreferences && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-accent-300" />
                Ritual Preferences
              </h3>
              <div className="space-y-2 text-white/80">
                <p><strong>Timing:</strong> {ritualPreferences.timing.replace('_', ' ')}</p>
                <p><strong>Duration:</strong> {ritualPreferences.duration.replace('_', ' ')}</p>
                <p><strong>Style:</strong> {ritualPreferences.style.replace('_', ' ')}</p>
                <p><strong>Voice:</strong> {ritualPreferences.voice_id.replace('_', ' ')}</p>
                <p><strong>Focus:</strong> {ritualPreferences.focus_area.replace('_', ' ')}</p>
              </div>
            </div>
          )}

          {knowledgeCategories.length > 0 && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-accent-300" />
                Emotional Focus Areas
              </h3>
              <div className="flex flex-wrap gap-2">
                {knowledgeCategories.map((category, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-accent-300/20 text-accent-300 rounded-full text-sm"
                  >
                    {category.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {primaryGoals.length > 0 && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <Target className="w-5 h-5 mr-2 text-accent-300" />
                Primary Goals
              </h3>
              <ul className="space-y-2 text-white/80">
                {primaryGoals.map((goal, index) => (
                  <li key={index} className="flex items-start">
                    <Sparkles className="w-4 h-4 mr-2 text-accent-300 mt-0.5 flex-shrink-0" />
                    {goal}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

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
  );
};