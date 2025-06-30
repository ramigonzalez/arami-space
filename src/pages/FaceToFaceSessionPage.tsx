import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { SessionService } from '../lib/sessionService';

interface SessionState {
  conversationId: string;
  replicaId: string;
  personaId: string;
  conversationUrl: string;
}

export const FaceToFaceSessionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sessionState, setSessionState] = useState<SessionState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  useEffect(() => {
    // Get session data from navigation state
    const state = location.state as SessionState;
    
    if (!state || !state.conversationId) {
      setError('No session data found. Please start a new session.');
      setIsLoading(false);
      return;
    }

    setSessionState(state);
    setIsLoading(false);
  }, [location.state]);

  const handleEndSession = async () => {
    if (!sessionState) return;

    setIsEnding(true);
    try {
      const result = await SessionService.endSession(sessionState.conversationId);
      
      if (result.success) {
        // Navigate back to sessions page or dashboard
        navigate('/sessions', { 
          state: { 
            message: 'Session ended successfully' 
          }
        });
      } else {
        setError(result.error || 'Failed to end session');
      }
    } catch (error) {
      console.error('Error ending session:', error);
      setError('Failed to end session properly');
    } finally {
      setIsEnding(false);
    }
  };

  const handleGoBack = () => {
    if (sessionState) {
      // If session is active, ask for confirmation
      if (window.confirm('Are you sure you want to leave? This will end your current session.')) {
        handleEndSession();
      }
    } else {
      navigate('/sessions');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Preparing your session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6 mb-6">
            <p className="text-white text-lg mb-4">{error}</p>
            <Button
              onClick={() => navigate('/sessions')}
              className="bg-white text-gray-900 hover:bg-gray-100"
            >
              Back to Sessions
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between">
        <button
          onClick={handleGoBack}
          className="p-2 rounded-full bg-black/20 text-white hover:bg-black/30 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <h1 className="text-white text-xl font-semibold">
          Face-to-Face with Arami
        </h1>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-full bg-black/20 text-white hover:bg-black/30 transition-colors"
          >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
          <button className="p-2 rounded-full bg-black/20 text-white hover:bg-black/30 transition-colors">
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute top-16 left-4 right-4 z-10">
        <div className="h-1 bg-white/20 rounded-full">
          <div className="h-full bg-white rounded-full w-1/4 transition-all duration-1000"></div>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 flex items-center justify-center p-4 pt-24">
        {sessionState?.conversationUrl ? (
          <div className="w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              src={sessionState.conversationUrl}
              className="w-full h-full"
              allow="camera; microphone; fullscreen"
              title="Arami AI Mentor Session"
            />
          </div>
        ) : (
          <div className="w-full max-w-4xl aspect-video bg-black/50 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-white text-2xl font-bold">AI</span>
              </div>
              <p className="text-white text-lg">Connecting to your mentor...</p>
            </div>
          </div>
        )}
      </div>

      {/* User Video (Picture-in-Picture) */}
      <div className="absolute bottom-24 right-6 w-32 h-24 bg-black/50 rounded-lg overflow-hidden border-2 border-white/20">
        <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
          <span className="text-white text-xs">You</span>
        </div>
      </div>

      {/* Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="flex items-center justify-center space-x-6">
          <button className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
          
          <button className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
            </svg>
          </button>
          
          <button
            onClick={handleEndSession}
            disabled={isEnding}
            className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {isEnding ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.7l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.1-.7-.28-.79-.73-1.68-1.36-2.66-1.85-.33-.16-.56-.51-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
              </svg>
            )}
          </button>
          
          <button className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </button>
          
          <button className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};