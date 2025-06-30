import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { VideoCallUI } from '../components/session/VideoCallUI';
import { sessionService } from '../lib/sessionService';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AlertCircle } from 'lucide-react';

interface SessionData {
  conversationUrl: string;
  conversationId: string;
  mentorConversationId: string;
  dailySessionId: string;
  personaName: string;
}

export const FaceToFaceSessionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEndingSession, setIsEndingSession] = useState(false);

  useEffect(() => {
    // Get session data from navigation state
    const stateData = location.state as SessionData;
    
    if (!stateData || !stateData.conversationUrl) {
      setError('Invalid session data. Please start a new session.');
      setIsLoading(false);
      return;
    }

    setSessionData(stateData);
    setIsLoading(false);
  }, [location.state]);

  const handleEndCall = async () => {
    if (!sessionData || !user?.id || isEndingSession) return;

    try {
      setIsEndingSession(true);
      
      await sessionService.endTavusSession(
        sessionData.conversationId,
        sessionData.mentorConversationId,
        sessionData.dailySessionId,
        user.id
      );

      // Navigate back to sessions page with success message
      navigate('/sessions', { 
        state: { 
          message: 'Session completed successfully!',
          type: 'success'
        }
      });
    } catch (error) {
      console.error('Error ending session:', error);
      setError('Failed to end session properly. Please try again.');
      setIsEndingSession(false);
    }
  };

  const handleBack = () => {
    if (sessionData && !isEndingSession) {
      // If there's an active session, confirm before leaving
      const confirmLeave = window.confirm(
        'Are you sure you want to leave? This will end your current session.'
      );
      
      if (confirmLeave) {
        handleEndCall();
      }
    } else {
      navigate('/sessions');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-900 to-primary-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4 mx-auto"></div>
          <p>Loading session...</p>
        </div>
      </div>
    );
  }

  if (error || !sessionData) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-surface-900 mb-2">Session Error</h2>
          <p className="text-surface-600 mb-4">
            {error || 'Unable to load session data.'}
          </p>
          <Button onClick={() => navigate('/sessions')} className="w-full">
            Return to Sessions
          </Button>
        </Card>
      </div>
    );
  }

  if (isEndingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-900 to-primary-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4 mx-auto"></div>
          <p>Ending session...</p>
        </div>
      </div>
    );
  }

  return (
    <VideoCallUI
      conversationUrl={sessionData.conversationUrl}
      personaName={sessionData.personaName}
      userAvatar={user?.user_metadata?.avatar_url}
      userName={user?.user_metadata?.full_name || user?.email || 'User'}
      onEndCall={handleEndCall}
      onBack={handleBack}
      isLoading={false}
    />
  );
};