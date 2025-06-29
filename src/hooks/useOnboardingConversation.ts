import { useState, useCallback, useEffect } from 'react';
import { useConversation } from '@11labs/react';
import { Message, MessageType, PersonalityProfile, RitualPreferences } from '../types/onboarding';

const VOICE_ID_MAP = {
  en: {
    female: "pNInz6obpgDQGcFmaJgB", // Adam
    male: "EXAVITQu4vr4xnSDxMaL"   // Bella
  },
  es: {
    female: "VR6AewLTigWG4xSOukaG", // Antoni
    male: "onwK4e9ZLuTAKqWW03F9"   // Arnold
  },
  pt: {
    female: "pqHfZKP75CvOlQylNhV4", // Bill
    male: "IKne3meq5aSn9XLyUdCD"   // Brian
  },
  fr: {
    female: "XB0fDUnXU5powFXDhCwa", // Callum
    male: "piTKgcLEGmPE4e6mEKli"   // Charlie
  }
};

interface UseOnboardingConversationProps {
  onPersonalityProfileUpdate: (profile: PersonalityProfile) => void;
  onRitualPreferencesUpdate: (preferences: RitualPreferences) => void;
  onKnowledgeCategoriesUpdate: (categories: string[]) => void;
  onPrimaryGoalsUpdate: (goals: string[]) => void;
  onStepChange: (step: string) => void;
  onCompleteOnboarding: () => void;
  userName: string;
  language: string;
  gender: string;
}

export const useOnboardingConversation = ({
  onPersonalityProfileUpdate,
  onRitualPreferencesUpdate,
  onKnowledgeCategoriesUpdate,
  onPrimaryGoalsUpdate,
  onStepChange,
  onCompleteOnboarding,
  userName,
  language,
  gender,
}: UseOnboardingConversationProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [transcript, setTranscript] = useState('');
  const [agentResponse, setAgentResponse] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [conversationActive, setConversationActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
  const addMessage = useCallback((type: MessageType, content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  // Start conversation with Genesis
  const startConversation = useCallback(async () => {
    if (!userName.trim()) {
      alert('Please enter your name to continue');
      return;
    }

    try {
      setIsLoading(true);
      
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Request signed URL
      const signedUrl = await getSignedUrl();

      // Select the correct voiceId from the map
      const voiceId = VOICE_ID_MAP[language as keyof typeof VOICE_ID_MAP]?.[gender as keyof typeof VOICE_ID_MAP['en']] || VOICE_ID_MAP["en"]["female"];

      console.log("voiceId", voiceId);
      console.log("language", language);
      console.log("gender", gender);

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
            onPersonalityProfileUpdate({ disc, enneagram, confidence });
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
            onRitualPreferencesUpdate({ timing, duration, style, voice_id, focus_area });
            return "Ritual Preferences Set Done";
          },
          tag_knowledge_category: ({ categories }: { categories: string[] }): string => {
            console.log("*** tagKnowledgeCategory ***", JSON.stringify(categories));
            onKnowledgeCategoriesUpdate(categories);
            return "Knowledge Category Tag Done";
          },
          set_primary_goals: ({ goals }: { goals: string[] }): string => {
            console.log("*** setPrimaryGoals ***", JSON.stringify(goals));
            onPrimaryGoalsUpdate(goals);
            return "Primary Goals Set Done";
          },
          complete_onboarding: async (): Promise<string> => {
            onCompleteOnboarding();
            console.log("*** complete_onboarding ***");
            return 'Onboarding data saved successfully. Agent can now provide closing message before session ends.';
          },
          set_ui_step: ({ step }: { step: string }): string => {
            onStepChange(step);
            console.log("***** set_ui_step ****", step);
            return `Navigated to ${step}`;
          },
        }
      });
      
      console.log("Conversation started successfully");
      setIsListening(true);
    } catch (error) {
      console.error("Failed to start conversation:", error);
      alert('Failed to start conversation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [conversation, userName, language, gender, onPersonalityProfileUpdate, onRitualPreferencesUpdate, onKnowledgeCategoriesUpdate, onPrimaryGoalsUpdate, onStepChange, onCompleteOnboarding]);

  const stopConversation = useCallback(async () => {
    try {
      setIsListening(false);
      // The conversation continues but stops listening
    } catch (error) {
      console.error('Error stopping conversation:', error);
    }
  }, []);

  const endConversation = useCallback(async () => {
    try {
      setIsLoading(true);
      await conversation.endSession();
      setConversationActive(false);
      setIsListening(false);
    } catch (error) {
      console.error("Failed to end conversation:", error);
      setConversationActive(false);
      setIsListening(false);
    } finally {
      setIsLoading(false);
    }
  }, [conversation]);

  const resetConversation = useCallback(() => {
    setMessages([]);
    setTranscript('');
    setAgentResponse('');
    setIsListening(false);
    setConversationActive(false);
  }, []);

  return {
    // State
    messages,
    transcript,
    agentResponse,
    isListening,
    conversationActive,
    isLoading,
    
    // Actions
    addMessage,
    startConversation,
    stopConversation,
    endConversation,
    setTranscript,
    setAgentResponse,
    setConversationActive,
  };
};