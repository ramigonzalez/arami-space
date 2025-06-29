import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { DatabaseService } from '../lib/database';
import { ProgressIndicator } from '../components/onboarding/ProgressIndicator';
import { WelcomeStep } from '../components/onboarding/WelcomeStep';
import { AIDrivenSteps } from '../components/onboarding/AIDrivenSteps';
import { CongratulationsStep } from '../components/onboarding/CongratulationsStep';
import { Language, useConversation } from '@11labs/react';

// Types for onboarding steps and data
type Step = 'welcome' | 'emotional_discovery' | 'ritual_design' | 'voice_selection' | 'complete';
type MessageType = 'user' | 'ai';

interface PersonalityProfile {
  disc: 'D' | 'I' | 'S' | 'C';
  enneagram?: string;
  confidence: number;
}

interface RitualPreferences {
  timing: 'morning_person' | 'evening_person';
  duration: 'quick_focused' | 'deeper_dive';
  style: 'guided_structure' | 'open_conversation';
  voice_id: 'confident_coach' | 'warm_friend' | 'gentle_guide' | 'wise_mentor';
  focus_area: 'stress_management' | 'goal_achievement' | 'relationships' | 'self_worth' | 'emotional_regulation';
}


interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
}

// Voice ID mapping for different languages and genders
const VOICE_ID_MAP: Record<string, Record<string, string>> = {
  en: {
    male: 'pNInz6obpgDQGcFmaJgB', // Adam - confident, clear
    female: 'EXAVITQu4vr4xnSDxMaL', // Bella - warm, friendly
  },
  es: {
    male: "AvFwmpNEfWWu5mtNDqhH",
    female: "9rvdnhrYoXoUt4igKpBw",
  },
  pt: {
    male: "x6uRgOliu4lpcrqMH3s1",
    female: "PZIBrGsMjLyYasEz50bI",
  },
  fr: {
    male: 'pNInz6obpgDQGcFmaJgB',
    female: 'EXAVITQu4vr4xnSDxMaL',
  },
};

export const Onboarding: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();

  // Step management
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [loading, setLoading] = useState(false);
  const [conversationActive, setConversationActive] = useState(false);

  // Welcome step data
  const [userName, setUserName] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  const [gender, setGender] = useState('female');

  // AI collected data
  const [personalityProfile, setPersonalityProfile] = useState<PersonalityProfile | null>(null);
  const [ritualPreferences, setRitualPreferences] = useState<RitualPreferences | null>(null);
  const [knowledgeCategories, setKnowledgeCategories] = useState<string[]>([]);
  const [primaryGoals, setPrimaryGoals] = useState<string[]>([]);

  // Conversation state
  const [messages, setMessages] = useState<Message[]>([]);

  // Get signed URL for ElevenLabs conversation
  const getSignedUrl = async (): Promise<string> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-signed-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get signed URL');
      }

      const data = await response.json();
      return data.signed_url;
    } catch (error) {
      console.error('Error getting signed URL:', error);
      throw error;
    }
  };

  // Initialize conversation hook
  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to Genesis");
      setConversationActive(true);
      addMessage('ai', "Hello! I'm Genesis, your AI guide. I'm here to help you discover your unique personality and set up your perfect wellness journey.");
    },
    onDisconnect: () => {
      console.log("Disconnected from Genesis");
      setConversationActive(false);
    },
    onMessage: (props: { message: string; source: string }) => {
      console.log("Message:", props.message, "Source:", props.source);
      addMessage(props.source as MessageType, props.message);
    },
    onError: (message: string) => {
      console.error("Conversation Error:", message);
      addMessage('ai', "I'm sorry, I encountered an issue. Let me try to help you in a different way.");
    },
  });

  // Request microphone permission on component mount
  useEffect(() => {
    const requestMic = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (error) {
        console.error('Microphone permission denied:', error);
      }
    };
    requestMic();
  }, []);

  // Helper function to add messages
  const addMessage = (type: MessageType, content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Start conversation with Genesis
  const startConversation = useCallback(async () => {
    if (!userName.trim()) {
      alert('Please enter your name to continue');
      return;
    }

    try {
      setLoading(true);
      
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Request signed URL
      const signedUrl = await getSignedUrl();

      // Select the correct voiceId from the map
      const voiceId = VOICE_ID_MAP[language]?.[gender] || VOICE_ID_MAP["en"]["female"];

      console.log("voiceId", voiceId);
      console.log("language", language);
      console.log("gender", gender);

      setCurrentStep("emotional_discovery");

      // Start the conversation with Genesis
      await conversation.startSession({
        overrides: { 
          agent: { language }, 
          tts: { voiceId } 
        },
        signedUrl,
        dynamicVariables: {
          user_name: userName,
        },
        clientTools: {
          set_personality_profile: ({ disc, enneagram, confidence }: {
            disc: 'D' | 'I' | 'S' | 'C',
            enneagram?: string,
            confidence: number
          }): string => {
            console.log("*** setPersonalityProfile ***", JSON.stringify({ disc, enneagram, confidence }));
            setPersonalityProfile({ disc, enneagram, confidence });
            return "Personality Profile Set Done";
          },
          set_ritual_preferences: ({ timing, duration, style, voice_id, focus_area }: {
            timing: 'morning_person' | 'evening_person',
            duration: 'quick_focused' | 'deeper_dive', 
            style: 'guided_structure' | 'open_conversation',
            voice_id: 'confident_coach' | 'warm_friend' | 'gentle_guide' | 'wise_mentor',
            focus_area: 'stress_management' | 'goal_achievement' | 'relationships' | 'self_worth' | 'emotional_regulation'
          }): string => {
            console.log("*** setRitualPreferences ***", JSON.stringify({ timing, duration, style, voice_id, focus_area }));
            setRitualPreferences({ timing, duration, style, voice_id, focus_area });
            return "Ritual Preferences Set Done";
          },
          tag_knowledge_category: ({ categories }: { categories: string[] }): string => {
            console.log("*** tagKnowledgeCategory ***", JSON.stringify(categories));
            setKnowledgeCategories(categories);
            return "Knowledge Category Tag Done";
          },
          set_primary_goals: ({ goals }: { goals: string[] }): string => {
            console.log("*** setPrimaryGoals ***", JSON.stringify(goals));
            setPrimaryGoals(goals);
            return "Primary Goals Set Done";
          },
          complete_onboarding: async (): Promise<string> => {
            setCurrentStep('complete');
            console.log("*** complete_onboarding ***");
            return 'Onboarding data saved successfully. Agent can now provide closing message before session ends.';
          },
          set_ui_step: ({ step }: { step: string }): string => {
            setCurrentStep(step as Step);
            console.log("***** set_ui_step ****", step);
            return `Navigated to ${step}`;
          },
        }
      });
      
      console.log("Conversation started successfully");
    } catch (error) {
      console.error("Failed to start conversation:", error);
      alert('Failed to start conversation. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [conversation, userName, language, gender]);

  // End conversation handler
  const endConversation = useCallback(async () => {
    try {
      setLoading(true);
      await conversation.endSession();
      setConversationActive(false);
      setCurrentStep('complete');
    } catch (error) {
      console.error("Failed to end conversation:", error);
      setConversationActive(false);
      setCurrentStep('complete');
    } finally {
      setLoading(false);
    }
  }, [conversation]);

  // Save all onboarding data and complete the process
  const handleCompleteOnboarding = async () => {
    if (!user) return;

    setLoading(true);
    try {
      debugger
      console.log('Completing onboarding for user:', user.id);

      // Save personality profile
      if (personalityProfile) {
        const profileResponse = await DatabaseService.createOnboardingProfile({
          user_id: user.id,
          disc_type: personalityProfile.disc,
          enneagram_type: personalityProfile.enneagram ? parseInt(personalityProfile.enneagram) : undefined,
          confidence_score: personalityProfile.confidence,
          personality_insights: {},
          assessment_transcript: messages.map(m => `${m.type}: ${m.content}`).join('\n'),
        });

        if (!profileResponse.success) {
          console.error('Failed to save personality profile:', profileResponse.error);
        }
      }

      // Save ritual preferences
      if (ritualPreferences) {
        const preferencesResponse = await DatabaseService.createRitualPreferences({
          user_id: user.id,
          timing: ritualPreferences.timing,
          duration: ritualPreferences.duration,
          style: ritualPreferences.style,
          voice_id: ritualPreferences.voice_id,
          focus_area: ritualPreferences.focus_area,
          elevenlabs_voice_id: VOICE_ID_MAP[language]?.[gender] || VOICE_ID_MAP["en"]["female"],
        });

        if (!preferencesResponse.success) {
          console.error('Failed to save ritual preferences:', preferencesResponse.error);
        }
      }

      // Save emotional categories
      for (const category of knowledgeCategories) {
        await DatabaseService.createEmotionalCategory({
          user_id: user.id,
          category: category as any,
          priority_level: 1,
        });
      }

      // Save primary goals
      for (const goal of primaryGoals) {
        await DatabaseService.createGoal({
          user_id: user.id,
          goal_text: goal,
          goal_type: 'emotional_wellness',
          source: 'onboarding',
        });
      }

      // Update profile to mark onboarding as completed
      const updateResponse = await DatabaseService.updateProfile(user.id, {
        onboarding_completed: true,
        full_name: userName,
        language: language as any,
      });

      if (updateResponse.success) {
        console.log('Onboarding marked as completed');
        
        // Refresh the profile to get the updated data
        await refreshProfile();
        
        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        console.error('Failed to complete onboarding:', updateResponse.error);
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get current step info for progress indicator
  const getStepInfo = () => {
    const stepMap = {
      welcome: { number: 1, label: 'Welcome' },
      emotional_discovery: { number: 2, label: 'Discovery' },
      ritual_design: { number: 3, label: 'Design' },
      voice_selection: { number: 4, label: 'Voice' },
      complete: { number: 5, label: 'Complete' },
    };
    return stepMap[currentStep];
  };

  const stepInfo = getStepInfo();

  return (
    <div className="min-h-screen bg-arami-gradient relative overflow-hidden">
      {/* Grain texture overlay */}
      <div className="absolute inset-0 grain-texture opacity-[0.03] pointer-events-none" />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header with progress */}
        <header className="px-4 pt-safe-top">
          <div className="max-w-2xl mx-auto">
            <ProgressIndicator
              currentStep={stepInfo.number}
              totalSteps={5}
              stepLabels={['Welcome', 'Discovery', 'Design', 'Voice', 'Complete']}
              className="mb-6"
            />
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 px-4 pb-safe-bottom">
          <div className="max-w-2xl mx-auto mr-2 ml-2">
            {/* Welcome Step */}
            {currentStep === 'welcome' && (
              <WelcomeStep
                userName={userName}
                setUserName={setUserName}
                language={language}
                setLanguage={setLanguage}
                gender={gender}
                setGender={setGender}
                onStartVoiceJourney={startConversation}
                isLoading={loading}
              />
            )}

            {/* AI-Driven Steps */}
            {(currentStep === 'emotional_discovery' || currentStep === 'ritual_design' || currentStep === 'voice_selection') && (
              <AIDrivenSteps
                currentStep={currentStep as 'emotional_discovery' | 'ritual_design' | 'voice_selection'}
                messages={messages}
                onEndConversation={endConversation}
                conversationActive={conversationActive}
                isLoading={loading}
              />
            )}

            {/* Congratulations Step */}
            {currentStep === 'complete' && (
              <CongratulationsStep
                personalityProfile={personalityProfile}
                ritualPreferences={ritualPreferences}
                knowledgeCategories={knowledgeCategories}
                primaryGoals={primaryGoals}
                onCompleteOnboarding={handleCompleteOnboarding}
                isLoading={loading}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Onboarding;