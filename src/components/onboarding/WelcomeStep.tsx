import React from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { User, Mic, Globe, Volume2 } from 'lucide-react';

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
  language: string;
  setLanguage: (lang: string) => void;
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
    <Card variant="glass" padding="large" className="text-center">
      <div className="space-y-8">
        <div>
          <div className="w-20 h-20 bg-primary-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Welcome to Your Journey
          </h1>
          <p className="text-white/80 text-lg leading-relaxed">
            I'm Genesis, your AI guide. Let's discover your unique personality and create your perfect wellness ritual.
          </p>
        </div>

        <div className="space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-white/90 font-medium mb-3 text-left">
              What should I call you?
            </label>
            <Input
              placeholder="Enter your name"
              value={userName}
              onChange={setUserName}
              icon={User}
              className="text-center"
            />
          </div>

          {/* Language Selection */}
          <div>
            <label className="block text-white/90 font-medium mb-3 text-left">
              Preferred Language
            </label>
            <div className="grid grid-cols-2 gap-3">
              {LANGUAGE_OPTIONS.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    language === lang.code
                      ? 'border-primary-400 bg-primary-600/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="text-white font-medium">{lang.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Gender/Voice Selection */}
          <div>
            <label className="block text-white/90 font-medium mb-3 text-left">
              Voice Preference
            </label>
            <div className="grid grid-cols-2 gap-3">
              {GENDER_OPTIONS.map((genderOption) => (
                <button
                  key={genderOption.code}
                  onClick={() => setGender(genderOption.code)}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    gender === genderOption.code
                      ? 'border-primary-400 bg-primary-600/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{genderOption.icon}</span>
                    <span className="text-white font-medium">{genderOption.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button
          onClick={onStartVoiceJourney}
          disabled={isLoading || !userName.trim()}
          size="large"
          icon={Mic}
          iconPosition="left"
          className="w-full"
        >
          {isLoading ? 'Connecting to Genesis...' : 'Start Voice Journey'}
        </Button>
      </div>
    </Card>
  );
};