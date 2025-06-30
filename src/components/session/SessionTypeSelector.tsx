import { FileText, Headphones, Mic, Video } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { SessionService } from '../../lib/sessionService';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface SessionType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  available: boolean;
}

const sessionTypes: SessionType[] = [
  {
    id: 'face_to_face',
    title: 'Face-to-Face',
    description: 'Interactive video conversation with your AI mentor',
    icon: <Video className="w-6 h-6" />,
    duration: '10-15 min',
    available: true
  },
  {
    id: 'spoken_presence',
    title: 'Spoken Presence',
    description: 'Voice-only conversation for deeper focus',
    icon: <Mic className="w-6 h-6" />,
    duration: '8-12 min',
    available: false
  },
  {
    id: 'silent_reflection',
    title: 'Silent Reflection',
    description: 'Guided meditation and mindfulness practice',
    icon: <Headphones className="w-6 h-6" />,
    duration: '5-10 min',
    available: false
  },
  {
    id: 'written_clarity',
    title: 'Written Clarity',
    description: 'Text-based journaling and reflection',
    icon: <FileText className="w-6 h-6" />,
    duration: '10-20 min',
    available: false
  }
];

export const SessionTypeSelector: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('face_to_face');
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartSession = async () => {
    console.log('=== SESSION START DEBUG ===');
    console.log('1. Handle start session called');
    console.log('2. User object:', user);
    console.log('3. User ID:', user?.id);
    console.log('4. Selected type:', selectedType);
    
    if (!user) {
      console.log('❌ No user found');
      setError('Please log in to start a session');
      return;
    }

    if (selectedType !== 'face_to_face') {
      console.log('❌ Invalid session type selected');
      setError('Only Face-to-Face sessions are currently available');
      return;
    }

    setIsStarting(true);
    setError(null);

    try {
      console.log('5. About to call SessionService.startFaceToFaceSession...');
      console.log('6. Current auth state:', { 
        hasUser: !!user, 
        userId: user.id,
        hasSession: !!user.id // Check if we have session data
      });

      // Skip redundant getSession call - we already have valid user from useAuth
      console.log('7. Skipping getSession call - using existing user object');
      console.log('8. User has valid session:', !!user?.id);
      console.log('9. User email:', user?.email);

      console.log('10. About to call SessionService function...');
      console.log('11. SessionService object:', SessionService);
      console.log('12. startFaceToFaceSession method:', SessionService.startFaceToFaceSession);

      let result;
      try {
        console.log('13. Calling SessionService.startFaceToFaceSession...');
        result = await SessionService.startFaceToFaceSession(user.id);
        console.log('14. SessionService call completed with result:', result);
      } catch (serviceError) {
        console.error('❌ Error in SessionService call:', serviceError);
        const error = serviceError as Error;
        console.error('ServiceError details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        throw serviceError; // Re-throw to be caught by outer try-catch
      }
      
      if (result.success && result.conversationId) {
        console.log('✅ Session started successfully, navigating to session page');
        // Navigate to the face-to-face session page with session data
        navigate('/session/face-to-face', {
          state: {
            conversationId: result.conversationId,
            conversationUrl: result.conversationUrl,
            mentorConversationId: result.mentorConversationId,
            dailySessionId: result.dailySessionId,
            personaName: result.personaName
          }
        });
      } else {
        console.log('❌ Session start failed:', result.error);
        setError(result.error || 'Failed to start session');
      }
    } catch (error) {
      console.error('❌ Unexpected error starting session:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsStarting(false);
      console.log('=== SESSION START DEBUG END ===');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Session Type
        </h1>
        <p className="text-lg text-gray-600">
          Select how you'd like to connect with your AI mentor today
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {sessionTypes.map((type) => (
          <Card
            key={type.id}
            className={`p-6 cursor-pointer transition-all duration-200 ${
              selectedType === type.id
                ? 'ring-2 ring-indigo-500 bg-indigo-50'
                : 'hover:shadow-lg'
            } ${
              !type.available
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
            onClick={() => type.available && setSelectedType(type.id)}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${
                selectedType === type.id
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {type.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {type.title}
                  </h3>
                  {!type.available && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                      Coming Soon
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-3">
                  {type.description}
                </p>
                <div className="text-sm text-gray-500">
                  Duration: {type.duration}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="text-center">
        <Button
          onClick={handleStartSession}
          disabled={isStarting || !sessionTypes.find(t => t.id === selectedType)?.available}
          className="px-8 py-3 text-lg"
        >
          {isStarting ? 'Starting Session...' : 'Begin Session'}
        </Button>
      </div>

      {selectedType && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">
            What to expect:
          </h4>
          <ul className="text-blue-800 text-sm space-y-1">
            {selectedType === 'face_to_face' && (
              <>
                <li>• Interactive video conversation with your AI mentor</li>
                <li>• Personalized guidance based on your profile and goals</li>
                <li>• Real-time emotional support and insights</li>
                <li>• Session summary and virtue rewards</li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};