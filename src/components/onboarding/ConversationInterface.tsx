import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { User, Bot } from 'lucide-react';

type MessageType = 'user' | 'ai';

interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
}

interface ConversationInterfaceProps {
  messages: Message[];
}

const testMessages: Message[] = [
  { id: '1', type: 'ai' as MessageType, content: "slkdfjsdkljdfs lksdfjsdlkjfsdkljf lksdfjlksdjlsdjkf lkjsdflkdfjslfksdj", timestamp: new Date() },
  { id: '2', type: 'user' as MessageType, content: "zcxzcx zxczxczxc czxzcx zxcczx", timestamp: new Date() },
  { id: '3', type: 'ai' as MessageType, content: "zcxzcx zxczxczxc czxzcx zxcczx", timestamp: new Date() },
  { id: '4', type: 'user' as MessageType, content: "zcxzcx zxczxczxc czxzcx zxcczx", timestamp: new Date() },
  { id: '5', type: 'ai' as MessageType, content: "zcxzcx zxczxczxc czxzcx zxcczx", timestamp: new Date() },
  { id: '6', type: 'user' as MessageType, content: "zcxzcx zxczxczxc czxzcx zxcczx", timestamp: new Date() },
  { id: '7', type: 'ai' as MessageType, content: "zcxzcx zxczxczxc czxzcx zxcczx", timestamp: new Date() },
  { id: '8', type: 'user' as MessageType, content: "zcxzcx zxczxczxc czxzcx zxcczx", timestamp: new Date() },
  { id: '9', type: 'ai' as MessageType, content: "zcxzcx zxczxczxc czxzcx zxcczx", timestamp: new Date() },
  { id: '10', type: 'user' as MessageType, content: "zcxzcx zxczxczxc czxzcx zxcczx", timestamp: new Date() },
  { id: '11', type: 'ai' as MessageType, content: "THIS MESSAGE MUST BE SHOWED FIRST", timestamp: new Date() }
]
export const ConversationInterface: React.FC<ConversationInterfaceProps> = ({ messages }) => {
  return (
    <div className="flex flex-col space-y-4 h-full">
      {/* Messages container */}
      <div className="h-96 overflow-y-auto space-y-4 pr-2">
        <div className="text-center">
          <h3 className="text-white text-lg font-semibold mb-5">Live chat with Genesis</h3>
        </div>
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
          [...messages].reverse().map((message) => (
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