import React from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { User, Mic } from 'lucide-react';
import { Language } from '@11labs/react';

const LANGUAGE_OPTIONS = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

const GENDER_OPTIONS = [
  { code: 'male', name: 'Male Voice', icon: '👨' },
  { code: 'female', name: 'Female Voice', icon: '👩' },
];

interface WelcomeStepProps {
  userName: string;
  setUserName: (name: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  gender: string;
  setGender: (gender: string) => void;
  onStartVoiceJourney: () => Promise<void>;
  isLoading: boolean;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({
  userName,
  setUserName,
  language,
  setLanguage,
  gender,
  setGender,
  onStartVoiceJourney,
  isLoading,
}) => {
  return (
    <Card variant="glass" padding="medium" className="text-center">
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-bold text-white mb-3">
            Welcome to Your Journey
          </h1>
          <p className="text-white/80 text-md leading-relaxed">
            Let's discover your unique personality and create your perfect wellness ritual through a voice experience.
          </p>
        </div>

        <div className="space-y-3">
          {/* Name Input */}
          <div>
            <label className="block text-white/90 font-medium mb-2 text-left text-sm">
              What should I call you?
            </label>
            <Input
              placeholder="Enter your name"
              value={userName}
              onChange={setUserName}
              icon={User}
              className="text-center text-sm"
            />
          </div>

          {/* Language Selection */}
          <div>
            <label className="block text-white/90 font-medium mb-2 text-left text-sm">
              Preferred Language
            </label>
            <div className="grid grid-cols-2 gap-2">
              {LANGUAGE_OPTIONS.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as Language)}
                  className={`p-3 rounded-xl border transition-all duration-200 ${
                    language === lang.code
                      ? 'border-primary-400 bg-primary-600/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-white font-medium text-sm">{lang.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Gender/Voice Selection */}
          <div>
            <label className="block text-white/90 font-medium mb-2 text-left text-sm">
              Voice Preference
            </label>
            <div className="grid grid-cols-2 gap-2">
              {GENDER_OPTIONS.map((genderOption) => (
                <button
                  key={genderOption.code}
                  onClick={() => setGender(genderOption.code)}
                  className={`p-3 rounded-xl border transition-all duration-200 ${
                    gender === genderOption.code
                      ? 'border-primary-400 bg-primary-600/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{genderOption.icon}</span>
                    <span className="text-white font-medium text-sm">{genderOption.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <Button
            onClick={onStartVoiceJourney}
            disabled={isLoading || !userName.trim()}
            size="large"
            icon={Mic}
            iconPosition="left"
            className="w-full"
            >
            {isLoading ? 'Connecting to Genesis...' : 'Start Voice Onboarding'}
          </Button>
        </div>
      </div>
    </Card>
  );
};