import { useState, useCallback } from 'react';
import { Message, ConversationState } from '../types/onboarding';

export const useOnboardingConversation = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [transcript, setTranscript] = useState('');
  const [agentResponse, setAgentResponse] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [conversationActive, setConversationActive] = useState(false);

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const startConversation = useCallback(async () => {
    try {
      setConversationActive(true);
      setIsListening(true);
      // TODO: Implement actual conversation start logic with ElevenLabs
      console.log('Starting conversation...');
    } catch (error) {
      console.error('Error starting conversation:', error);
      setConversationActive(false);
      setIsListening(false);
    }
  }, []);

  const stopConversation = useCallback(async () => {
    try {
      setIsListening(false);
      // TODO: Implement actual conversation stop logic
      console.log('Stopping conversation...');
    } catch (error) {
      console.error('Error stopping conversation:', error);
    }
  }, []);

  const endConversation = useCallback(async () => {
    try {
      setConversationActive(false);
      setIsListening(false);
      // TODO: Implement actual conversation end logic
      console.log('Ending conversation...');
    } catch (error) {
      console.error('Error ending conversation:', error);
    }
  }, []);

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
    
    // Actions
    addMessage,
    startConversation,
    stopConversation,
    endConversation,
    resetConversation,
    setTranscript,
    setAgentResponse,
    setConversationActive,
  };
};