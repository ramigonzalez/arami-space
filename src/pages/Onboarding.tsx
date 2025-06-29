import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConversation } from '@11labs/react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Mic, MicOff, Volume2, VolumeX, User, Globe, Users } from 'lucide-react';

interface UserInputs {
  name: string;
  language: string;
  gender: string;
}

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'pt', label: 'Português' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' }
];

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<'inputs' | 'conversation'>('inputs');
  const [userInputs, setUserInputs] = useState<UserInputs>({
    name: '',
    language: 'en',
    gender: 'female'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string>('');
  const [conversationId, setConversationId] = useState<string>('');

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs conversation');
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs conversation');
    },
    onMessage: (message) => {
      console.log('Received message:', message);
    },
    onError: (error) => {
      console.error('Conversation error:', error);
    }
  });

  const handleInputChange = (field: keyof UserInputs, value: string) => {
    setUserInputs(prev => ({ ...prev, [field]: value }));
  };

  const getSignedUrl = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('elevenlabs-signed-url', {
        body: {
          agent_id: 'genesis-onboarding',
          user_context: userInputs
        }
      });

      if (error) {
        throw error;
      }

      setSignedUrl(data.signed_url);
      setConversationId(data.conversation_id);
      return data.signed_url;
    } catch (error) {
      console.error('Error getting signed URL:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const startConversation = async () => {
    if (!userInputs.name.trim()) {
      alert('Please enter your name');
      return;
    }

    try {
      const url = await getSignedUrl();
      await conversation.startSession({ signedUrl: url });
      setCurrentStep('conversation');
    } catch (error) {
      console.error('Failed to start conversation:', error);
      alert('Failed to start conversation. Please try again.');
    }
  };

  const endConversation = async () => {
    await conversation.endSession();
    
    // Update user profile to mark onboarding as completed
    if (user) {
      await supabase
        .from('profiles')
        .update({ 
          onboarding_completed: true,
          full_name: userInputs.name,
          language: userInputs.language
        })
        .eq('id', user.id);
    }
    
    navigate('/dashboard');
  };

  // Render initial inputs step
  if (currentStep === 'inputs') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome to Arami</h1>
            <p className="text-gray-600">Let's personalize your experience before we begin</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's your name?
              </label>
              <Input
                type="text"
                placeholder="Enter your name"
                value={userInputs.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="w-4 h-4 inline mr-1" />
                Preferred Language
              </label>
              <select
                value={userInputs.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {LANGUAGE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Voice Preference
              </label>
              <div className="grid grid-cols-2 gap-3">
                {GENDER_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleInputChange('gender', option.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      userInputs.gender === option.value
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button
            onClick={startConversation}
            disabled={isLoading || !userInputs.name.trim()}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          >
            {isLoading ? 'Connecting...' : 'Start Voice Onboarding'}
          </Button>
        </Card>
      </div>
    );
  }

  // Render conversation step
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Mic className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Hi {userInputs.name}! 👋
          </h1>
          <p className="text-gray-600">
            I'm Genesis, your AI guide. Let's have a conversation to set up your personalized experience.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Connection Status:
            </span>
            <span className={`text-sm font-medium ${
              conversation.status === 'connected' ? 'text-green-600' : 'text-orange-600'
            }`}>
              {conversation.status === 'connected' ? 'Connected' : 'Connecting...'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Microphone:
            </span>
            <span className={`text-sm font-medium ${
              conversation.isMicrophoneEnabled ? 'text-green-600' : 'text-red-600'
            }`}>
              {conversation.isMicrophoneEnabled ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Speaking:
            </span>
            <span className={`text-sm font-medium ${
              conversation.isSpeaking ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {conversation.isSpeaking ? 'Genesis is speaking...' : 'Listening'}
            </span>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => conversation.isMicrophoneEnabled ? conversation.stopRecording() : conversation.startRecording()}
            variant={conversation.isMicrophoneEnabled ? "destructive" : "default"}
            size="lg"
            className="flex items-center space-x-2"
          >
            {conversation.isMicrophoneEnabled ? (
              <>
                <MicOff className="w-5 h-5" />
                <span>Mute</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                <span>Unmute</span>
              </>
            )}
          </Button>

          <Button
            onClick={() => conversation.isMuted ? conversation.unmute() : conversation.mute()}
            variant="outline"
            size="lg"
            className="flex items-center space-x-2"
          >
            {conversation.isMuted ? (
              <>
                <VolumeX className="w-5 h-5" />
                <span>Unmute Audio</span>
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5" />
                <span>Mute Audio</span>
              </>
            )}
          </Button>
        </div>

        <div className="text-center">
          <Button
            onClick={endConversation}
            variant="outline"
            className="text-gray-600 hover:text-gray-800"
          >
            Complete Onboarding
          </Button>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Speak naturally with Genesis. The conversation will guide you through:</p>
          <ul className="mt-2 space-y-1">
            <li>• Personality assessment</li>
            <li>• Emotional wellness goals</li>
            <li>• Ritual preferences setup</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}