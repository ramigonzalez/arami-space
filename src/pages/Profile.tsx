import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { RitualPreferencesForm } from '../components/profile/RitualPreferencesForm';
import { 
  User, 
  Settings, 
  Clock, 
  Target, 
  Calendar,
  Bell,
  Camera,
  Edit3,
  Volume2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ritualPreferencesService } from '../lib/ritualPreferencesService';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  language: string;
  subscription_tier: string;
  onboarding_completed: boolean;
  timezone: string;
  created_at: string;
}

interface OnboardingProfile {
  disc_type: string;
  enneagram_type?: number;
  confidence_score?: number;
  personality_insights?: any;
  completed_at: string;
}

interface RitualPreferences {
  timing: string;
  duration: string;
  style: string;
  voice_id: string;
  focus_area: string;
  session_frequency: string;
  preferred_session_time?: string;
  reminder_enabled: boolean;
}

export const Profile: React.FC = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [onboardingProfile, setOnboardingProfile] = useState<OnboardingProfile | null>(null);
  const [ritualPreferences, setRitualPreferences] = useState<RitualPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRitualPreferences, setShowRitualPreferences] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Load user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Load onboarding profile
      const { data: onboardingData, error: onboardingError } = await supabase
        .from('onboarding_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (onboardingError && onboardingError.code !== 'PGRST116') {
        console.error('Error loading onboarding profile:', onboardingError);
      } else if (onboardingData) {
        setOnboardingProfile(onboardingData);
      }

      // Load ritual preferences
      const preferences = await ritualPreferencesService.getUserRitualPreferences(user.id);
      setRitualPreferences(preferences);

    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRitualPreferencesSave = () => {
    setShowRitualPreferences(false);
    loadProfileData(); // Reload to get updated preferences
  };

  const formatDiscType = (discType: string) => {
    const types = {
      'D': 'Dominant',
      'I': 'Influential', 
      'S': 'Steady',
      'C': 'Conscientious'
    };
    return types[discType as keyof typeof types] || discType;
  };

  const formatVoiceId = (voiceId: string) => {
    const voices = {
      'confident_coach': 'Confident Coach',
      'warm_friend': 'Warm Friend',
      'gentle_guide': 'Gentle Guide',
      'wise_mentor': 'Wise Mentor'
    };
    return voices[voiceId as keyof typeof voices] || voiceId;
  };

  const formatTiming = (timing: string) => {
    const timings = {
      'morning_person': 'Morning Person',
      'evening_person': 'Evening Person',
      'flexible': 'Flexible'
    };
    return timings[timing as keyof typeof timings] || timing;
  };

  const formatDuration = (duration: string) => {
    const durations = {
      'quick_focused': 'Quick & Focused',
      'deeper_dive': 'Deeper Dive',
      'variable': 'Variable'
    };
    return durations[duration as keyof typeof durations] || duration;
  };

  const formatSessionFrequency = (frequency: string) => {
    const frequencies = {
      'daily': 'Daily',
      'weekdays': 'Weekdays',
      'custom': 'Custom'
    };
    return frequencies[frequency as keyof typeof frequencies] || frequency;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-surface-200 rounded-lg mb-4"></div>
          <div className="h-24 bg-surface-200 rounded-lg mb-4"></div>
          <div className="h-24 bg-surface-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-surface-600">Failed to load profile data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              {profile.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white border-2 border-surface-200 rounded-full flex items-center justify-center hover:bg-surface-50 transition-colors">
              <Camera className="w-3 h-3 text-surface-600" />
            </button>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-surface-900">{profile.full_name}</h1>
              <button className="p-1 hover:bg-surface-100 rounded">
                <Edit3 className="w-4 h-4 text-surface-500" />
              </button>
            </div>
            <p className="text-surface-600 text-sm mb-2">{profile.email}</p>
            <div className="flex gap-2">
              <Badge variant={profile.subscription_tier === 'paid' ? 'primary' : 'secondary'}>
                {profile.subscription_tier === 'paid' ? 'Premium' : 'Free'}
              </Badge>
              {profile.onboarding_completed && (
                <Badge variant="success">Onboarded</Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Personality Profile */}
      {onboardingProfile && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-surface-900">Personality Profile</h3>
              <p className="text-sm text-surface-600">Your unique personality insights</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-surface-50 rounded-lg">
              <p className="text-sm text-surface-600 mb-1">DISC Type</p>
              <p className="font-semibold text-surface-900">
                {formatDiscType(onboardingProfile.disc_type)}
              </p>
            </div>
            {onboardingProfile.enneagram_type && (
              <div className="p-3 bg-surface-50 rounded-lg">
                <p className="text-sm text-surface-600 mb-1">Enneagram</p>
                <p className="font-semibold text-surface-900">
                  Type {onboardingProfile.enneagram_type}
                </p>
              </div>
            )}
            {onboardingProfile.confidence_score && (
              <div className="p-3 bg-surface-50 rounded-lg col-span-2">
                <p className="text-sm text-surface-600 mb-1">Confidence Score</p>
                <p className="font-semibold text-surface-900">
                  {Math.round(onboardingProfile.confidence_score * 100)}%
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Ritual Preferences */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-surface-900">Ritual Preferences</h3>
              <p className="text-sm text-surface-600">Your daily practice settings</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRitualPreferences(true)}
          >
            Edit
          </Button>
        </div>

        {ritualPreferences ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-lg">
              <Clock className="w-4 h-4 text-surface-600" />
              <div>
                <p className="text-sm font-medium text-surface-900">Timing</p>
                <p className="text-sm text-surface-600">{formatTiming(ritualPreferences.timing)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-lg">
              <Target className="w-4 h-4 text-surface-600" />
              <div>
                <p className="text-sm font-medium text-surface-900">Duration</p>
                <p className="text-sm text-surface-600">{formatDuration(ritualPreferences.duration)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-lg">
              <Volume2 className="w-4 h-4 text-surface-600" />
              <div>
                <p className="text-sm font-medium text-surface-900">Voice Style</p>
                <p className="text-sm text-surface-600">{formatVoiceId(ritualPreferences.voice_id)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-lg">
              <Calendar className="w-4 h-4 text-surface-600" />
              <div>
                <p className="text-sm font-medium text-surface-900">Frequency</p>
                <p className="text-sm text-surface-600">{formatSessionFrequency(ritualPreferences.session_frequency)}</p>
              </div>
            </div>

            {ritualPreferences.focus_area && (
              <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-lg">
                <Target className="w-4 h-4 text-surface-600" />
                <div>
                  <p className="text-sm font-medium text-surface-900">Focus Area</p>
                  <p className="text-sm text-surface-600">{ritualPreferences.focus_area}</p>
                </div>
              </div>
            )}

            {ritualPreferences.preferred_session_time && (
              <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-lg">
                <Clock className="w-4 h-4 text-surface-600" />
                <div>
                  <p className="text-sm font-medium text-surface-900">Preferred Time</p>
                  <p className="text-sm text-surface-600">{ritualPreferences.preferred_session_time}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-lg">
              <Bell className="w-4 h-4 text-surface-600" />
              <div>
                <p className="text-sm font-medium text-surface-900">Reminders</p>
                <p className="text-sm text-surface-600">
                  {ritualPreferences.reminder_enabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-surface-600 mb-4">No ritual preferences set</p>
            <Button onClick={() => setShowRitualPreferences(true)}>
              Set Preferences
            </Button>
          </div>
        )}
      </Card>

      {/* Account Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-surface-100 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-surface-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-surface-900">Account Settings</h3>
            <p className="text-sm text-surface-600">Manage your account</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-surface-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-surface-900">Language</p>
              <p className="text-sm text-surface-600">{profile.language.toUpperCase()}</p>
            </div>
            <Button variant="outline" size="sm">Edit</Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-surface-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-surface-900">Timezone</p>
              <p className="text-sm text-surface-600">{profile.timezone}</p>
            </div>
            <Button variant="outline" size="sm">Edit</Button>
          </div>

          <div className="pt-4 border-t border-surface-200">
            <Button 
              variant="outline" 
              onClick={signOut}
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </Card>

      {/* Ritual Preferences Modal */}
      <Modal
        isOpen={showRitualPreferences}
        onClose={() => setShowRitualPreferences(false)}
        title="Ritual Preferences"
      >
        <RitualPreferencesForm
          onSave={handleRitualPreferencesSave}
          onCancel={() => setShowRitualPreferences(false)}
        />
      </Modal>
    </div>
  );
};