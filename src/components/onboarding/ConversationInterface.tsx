import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { User, Bot } from 'lucide-react';
import { Message } from '../../types/onboarding';
import { testMessages } from '../../data/onboardingMessages';

interface ConversationInterfaceProps {
  messages: Message[];
  isTest: boolean;
}

export const ConversationInterface: React.FC<ConversationInterfaceProps> = ({ messages, isTest }) => {
  // Use test messages if no real messages are provided
  const displayMessages = !isTest ? messages : testMessages;

  return (
    <div className="flex flex-col space-y-4 h-96">
      {/* Messages container - fixed height with internal scroll */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {displayMessages.length ? (
          <div className="text-center">
            <h3 className="text-white text-md font-semibold mb-2">Live chat with Genesis</h3>
          </div>
        ) : (<></>)
       }
        {displayMessages.length === 0 ? (
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
          [...displayMessages].reverse().map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
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
    <div className={`
      flex items-start space-x-4 
      ${isUser ? 'flex-row-reverse space-x-reverse justify-start' : 'flex-row justify-start'}
    `}>
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
          flex-1 max-w-[75%]
          ${isUser ? 'border-primary-400/30' : 'border-accent-300/30'}
        `}
      >
        <p className="text-white/90 text-sm leading-relaxed break-words p-0">
          {message.content}
        </p>
        <div className="mt-2 text-xs text-white/50">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </Card>
    </div>
  );
};