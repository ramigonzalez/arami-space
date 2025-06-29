import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { User, Bot } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ConversationInterfaceProps {
  messages: Message[];
  isListening: boolean;
  currentTranscript: string;
  isAiSpeaking: boolean;
}

export const ConversationInterface: React.FC<ConversationInterfaceProps> = ({
  messages,
  isListening,
  currentTranscript,
  isAiSpeaking,
}) => {
  return (
    <div className="flex-1 flex flex-col space-y-4 max-h-96 overflow-hidden">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Badge size="medium" />
            </div>
            <h3 className="text-white font-semibold mb-2">Meet Genesis</h3>
            <p className="text-white/70 text-sm">
              Your AI companion is ready to discover your unique personality
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}

        {/* Current transcript preview */}
        {isListening && currentTranscript && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <Card variant="glass" padding="small" className="flex-1 border-primary-400/30">
              <p className="text-white/90 text-sm italic">
                {currentTranscript}
                <span className="animate-pulse">|</span>
              </p>
            </Card>
          </div>
        )}

        {/* AI speaking indicator */}
        {isAiSpeaking && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-accent-300 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <Card variant="glass" padding="small" className="flex-1">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-accent-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-accent-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-accent-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-white/70 text-sm">Genesis is speaking...</span>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.type === 'user';
  
  return (
    <div className={`flex items-start space-x-3 ${isUser ? 'flex-row' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
        ${isUser ? 'bg-primary-600' : 'bg-accent-300'}
      `}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Message content */}
      <Card 
        variant="glass" 
        padding="small" 
        className={`
          flex-1 max-w-[80%]
          ${isUser ? 'border-primary-400/30' : 'border-accent-300/30'}
        `}
      >
        <p className="text-white/90 text-sm leading-relaxed">
          {message.content}
        </p>
        <div className="mt-2 text-xs text-white/50">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </Card>
    </div>
  );
};