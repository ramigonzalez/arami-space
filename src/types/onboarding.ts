export type MessageType = 'user' | 'ai';

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
}

export interface PersonalityProfile {
  disc: 'D' | 'I' | 'S' | 'C';
  enneagram?: string;
  confidence: number;
}

export interface RitualPreferences {
  timing: 'morning_person' | 'evening_person';
  duration: 'quick_focused' | 'deeper_dive';
  style: 'guided_structure' | 'open_conversation';
  voice_id: 'confident_coach' | 'warm_friend' | 'gentle_guide' | 'wise_mentor';
  focus_area: 'stress_management' | 'goal_achievement' | 'relationships' | 'self_worth' | 'emotional_regulation';
}

export type Step = 'welcome' | 'emotional_discovery' | 'ritual_design' | 'voice_selection' | 'complete';

export interface OnboardingData {
  personalityProfile: PersonalityProfile | null;
  ritualPreferences: RitualPreferences | null;
  knowledgeCategories: string[];
  primaryGoals: string[];
}

export interface ConversationState {
  messages: Message[];
  transcript: string;
  agentResponse: string;
  isListening: boolean;
  conversationActive: boolean;
}