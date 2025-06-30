import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SessionTypeSelector } from '../components/session/SessionTypeSelector';
import { sessionService } from '../lib/sessionService';
import { useAuth } from '../hooks/useAuth';
import { 
  Calendar,
  Clock,
  TrendingUp,
  Award,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const Sessions: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for success/error messages from navigation state
  const stateMessage = location.state?.message;
  const stateType = location.state?.type;

  const handleSessionStart = async (sessionType: string, personaId?: string) => {
    if (!user?.id) {
      setError('Please log in to start a session');
      return;
    }

    try {
      setIsStartingSession(true);
      setError(null);

      if (sessionType === 'face_to_face' && personaId) {
        // Start Tavus session
        const sessionData = await sessionService.startTavusSession(user.id, personaId);
        
        // Navigate to video call page with session data
        navigate('/face-to-face-session', {
          state: {
            conversationUrl: sessionData.conversation_url,
            conversationId: sessionData.conversation_id,
            mentorConversationId: sessionData.mentor_conversation_id,
            dailySessionId: sessionData.daily_session_id,
            personaName: sessionData.persona_name,
          }
        });
      } else {
        // Handle other session types (not implemented yet)
        setError(`${sessionType} sessions are coming soon!`);
      }
    } catch (err) {
      console.error('Error starting session:', err);
      setError(err instanceof Error ? err.message : 'Failed to start session');
    } finally {
      setIsStartingSession(false);
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-surface-900 mb-2">Daily Sessions</h1>
        <p className="text-surface-600">Connect with your AI mentor for guidance and growth</p>
      </div>

      {/* State Messages */}
      {stateMessage && (
        <div className={`p-4 rounded-lg border ${
          stateType === 'success' 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <div className="flex items-center gap-2">
            {stateType === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <p className="font-medium">{stateMessage}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Calendar className="w-5 h-5 text-primary-600" />
          </div>
          <p className="text-2xl font-bold text-surface-900">7</p>
          <p className="text-sm text-surface-600">Day Streak</p>
        </Card>

        <Card className="p-4 text-center">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Clock className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-surface-900">45</p>
          <p className="text-sm text-surface-600">Total Hours</p>
        </Card>

        <Card className="p-4 text-center">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-surface-900">89%</p>
          <p className="text-sm text-surface-600">Growth Score</p>
        </Card>

        <Card className="p-4 text-center">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Award className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-surface-900">12</p>
          <p className="text-sm text-surface-600">Virtues Earned</p>
        </Card>
      </div>

      {/* Session Type Selector */}
      <Card className="p-6">
        <SessionTypeSelector 
          onSessionStart={handleSessionStart}
          isLoading={isStartingSession}
        />
      </Card>

      {/* Recent Sessions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Recent Sessions</h3>
        <div className="space-y-3">
          {[
            {
              date: 'Today, 9:30 AM',
              type: 'Face-to-Face',
              duration: '18 min',
              virtue: 'Patience',
              status: 'completed'
            },
            {
              date: 'Yesterday, 8:15 AM',
              type: 'Spoken Presence',
              duration: '12 min',
              virtue: 'Gratitude',
              status: 'completed'
            },
            {
              date: '2 days ago, 7:45 AM',
              type: 'Silent Reflection',
              duration: '8 min',
              virtue: 'Mindfulness',
              status: 'completed'
            }
          ].map((session, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-surface-50 rounded-lg">
              <div>
                <p className="font-medium text-surface-900">{session.type}</p>
                <p className="text-sm text-surface-600">{session.date} • {session.duration}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-primary-600">+{session.virtue}</p>
                <p className="text-xs text-surface-500 capitalize">{session.status}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Loading Overlay */}
      {isStartingSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="font-medium text-surface-900">Starting your session...</p>
            <p className="text-sm text-surface-600">This may take a moment</p>
          </Card>
        </div>
      )}
    </div>
  );
};