import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Video, 
  Mic, 
  PenTool, 
  Heart, 
  Clock,
  Star,
  ChevronRight,
  User
} from 'lucide-react';
import { sessionService } from '../../lib/sessionService';
import { useAuth } from '../../hooks/useAuth';

interface SessionType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  isPremium: boolean;
  isAvailable: boolean;
}

interface Persona {
  id: string;
  name: string;
  specialization: string;
  is_active: boolean;
  replica_id: string;
  mentor_avatars: {
    name: string;
    description: string;
    thumbnail_url: string;
    is_premium: boolean;
  };
}

interface SessionTypeSelectorProps {
  onSessionStart: (sessionType: string, personaId?: string) => void;
  isLoading?: boolean;
}

export const SessionTypeSelector: React.FC<SessionTypeSelectorProps> = ({
  onSessionStart,
  isLoading = false,
}) => {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loadingPersonas, setLoadingPersonas] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sessionTypes: SessionType[] = [
    {
      id: 'face_to_face',
      name: 'Face-to-Face',
      description: 'Video conversation with your AI mentor',
      icon: <Video className="w-6 h-6" />,
      duration: '15-30 min',
      isPremium: false,
      isAvailable: true,
    },
    {
      id: 'spoken_presence',
      name: 'Spoken Presence',
      description: 'Audio-only conversation for deeper focus',
      icon: <Mic className="w-6 h-6" />,
      duration: '10-20 min',
      isPremium: false,
      isAvailable: false, // Not implemented yet
    },
    {
      id: 'silent_reflection',
      name: 'Silent Reflection',
      description: 'Guided meditation and mindfulness',
      icon: <Heart className="w-6 h-6" />,
      duration: '5-15 min',
      isPremium: false,
      isAvailable: false, // Not implemented yet
    },
    {
      id: 'written_clarity',
      name: 'Written Clarity',
      description: 'Text-based journaling and insights',
      icon: <PenTool className="w-6 h-6" />,
      duration: '10-25 min',
      isPremium: true,
      isAvailable: false, // Not implemented yet
    },
  ];

  useEffect(() => {
    if (selectedType === 'face_to_face' && user?.id) {
      loadPersonas();
    }
  }, [selectedType, user?.id]);

  const loadPersonas = async () => {
    if (!user?.id) return;

    try {
      setLoadingPersonas(true);
      setError(null);
      const userPersonas = await sessionService.getUserPersonas(user.id);
      setPersonas(userPersonas);
    } catch (err) {
      setError('Failed to load available mentors');
      console.error('Error loading personas:', err);
    } finally {
      setLoadingPersonas(false);
    }
  };

  const handleTypeSelect = (typeId: string) => {
    const sessionType = sessionTypes.find(t => t.id === typeId);
    
    if (!sessionType?.isAvailable) {
      return;
    }

    if (typeId === 'face_to_face') {
      setSelectedType(typeId);
    } else {
      // For other session types, start immediately
      onSessionStart(typeId);
    }
  };

  const handlePersonaSelect = (personaId: string) => {
    onSessionStart('face_to_face', personaId);
  };

  const handleBack = () => {
    setSelectedType(null);
    setError(null);
  };

  if (selectedType === 'face_to_face') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleBack}>
            ← Back
          </Button>
          <div>
            <h3 className="text-lg font-semibold text-surface-900">Choose Your Mentor</h3>
            <p className="text-sm text-surface-600">Select an AI mentor for your face-to-face session</p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {loadingPersonas ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-surface-600">Loading mentors...</p>
          </div>
        ) : personas.length === 0 ? (
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-6 h-6 text-surface-600" />
            </div>
            <h4 className="font-semibold text-surface-900 mb-2">No Mentors Available</h4>
            <p className="text-surface-600 mb-4">
              You don't have any AI mentors set up yet. Complete your onboarding to get personalized mentors.
            </p>
            <Button variant="outline" onClick={handleBack}>
              Go Back
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {personas.map((persona) => (
              <Card 
                key={persona.id} 
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handlePersonaSelect(persona.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-100">
                    {persona.mentor_avatars.thumbnail_url ? (
                      <img 
                        src={persona.mentor_avatars.thumbnail_url} 
                        alt={persona.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {persona.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-surface-900">{persona.name}</h4>
                      {persona.mentor_avatars.is_premium && (
                        <Badge variant="primary" size="sm">
                          <Star className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-surface-600 mb-1">
                      {persona.mentor_avatars.description}
                    </p>
                    <p className="text-xs text-surface-500 capitalize">
                      Specialization: {persona.specialization.replace('_', ' ')}
                    </p>
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-surface-400" />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-surface-900 mb-2">Choose Your Session Type</h3>
        <p className="text-surface-600">Select how you'd like to connect with your AI mentor today</p>
      </div>

      <div className="grid gap-4">
        {sessionTypes.map((sessionType) => (
          <Card 
            key={sessionType.id}
            className={`p-4 transition-all cursor-pointer ${
              sessionType.isAvailable 
                ? 'hover:shadow-md hover:border-primary-200' 
                : 'opacity-60 cursor-not-allowed'
            } ${isLoading ? 'pointer-events-none' : ''}`}
            onClick={() => handleTypeSelect(sessionType.id)}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                sessionType.isAvailable 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'bg-surface-100 text-surface-400'
              }`}>
                {sessionType.icon}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-surface-900">{sessionType.name}</h4>
                  {sessionType.isPremium && (
                    <Badge variant="primary" size="sm">
                      <Star className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                  {!sessionType.isAvailable && (
                    <Badge variant="secondary" size="sm">
                      Coming Soon
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-surface-600 mb-2">{sessionType.description}</p>
                <div className="flex items-center gap-1 text-xs text-surface-500">
                  <Clock className="w-3 h-3" />
                  {sessionType.duration}
                </div>
              </div>
              
              {sessionType.isAvailable && (
                <ChevronRight className="w-5 h-5 text-surface-400" />
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};