import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { 
  User, 
  Edit3, 
  Save, 
  X, 
  Globe, 
  Clock, 
  Brain,
  Heart,
  Settings,
  Camera
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ProfileData {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  language: string;
  timezone: string;
  subscription_tier: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

interface OnboardingProfile {
  disc_type: string;
  enneagram_type?: number;
  confidence_score: number;
  personality_insights?: any;
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
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [onboardingProfile, setOnboardingProfile] = useState<OnboardingProfile | null>(null);
  const [ritualPreferences, setRitualPreferences] = useState<RitualPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    full_name: '',
    language: 'en',
    timezone: 'UTC'
  });

  const [preferencesData, setPreferencesData] = useState({
    timing: 'morning_person',
    duration: 'quick_focused',
    style: 'guided_structure',
    voice_id: 'warm_friend',
    focus_area: 'stress_management',
    session_frequency: 'daily',
    preferred_session_time: '',
    reminder_enabled: true
  });

  useEffect(() => {
    fetchProfileData();
  }, [user]);

  const fetchProfileData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Fetch onboarding profile
      const { data: onboardingData, error: onboardingError } = await supabase
        .from('onboarding_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (onboardingError && onboardingError.code !== 'PGRST116') {
        console.error('Error fetching onboarding profile:', onboardingError);
      }

      // Fetch ritual preferences
      const { data: preferencesData, error: preferencesError } = await supabase
        .from('ritual_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (preferencesError && preferencesError.code !== 'PGRST116') {
        console.error('Error fetching preferences:', preferencesError);
      }

      setProfile(profileData);
      setOnboardingProfile(onboardingData);
      setRitualPreferences(preferencesData);

      // Initialize form data
      if (profileData) {
        setFormData({
          full_name: profileData.full_name || '',
          language: profileData.language || 'en',
          timezone: profileData.timezone || 'UTC'
        });
      }

      // Initialize preferences data
      if (preferencesData) {
        setPreferencesData({
          timing: preferencesData.timing || 'morning_person',
          duration: preferencesData.duration || 'quick_focused',
          style: preferencesData.style || 'guided_structure',
          voice_id: preferencesData.voice_id || 'warm_friend',
          focus_area: preferencesData.focus_area || 'stress_management',
          session_frequency: preferencesData.session_frequency || 'daily',
          preferred_session_time: preferencesData.preferred_session_time || '',
          reminder_enabled: preferencesData.reminder_enabled ?? true
        });
      }

    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !profile) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          language: formData.language,
          timezone: formData.timezone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update local state
      setProfile(prev => prev ? {
        ...prev,
        full_name: formData.full_name,
        language: formData.language,
        timezone: formData.timezone,
        updated_at: new Date().toISOString()
      } : null);

      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    if (!user) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from('ritual_preferences')
        .upsert({
          user_id: user.id,
          ...preferencesData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setRitualPreferences(prev => ({
        ...preferencesData,
        updated_at: new Date().toISOString()
      } as RitualPreferences));

      setShowPreferencesModal(false);
    } catch (error) {
      console.error('Error updating preferences:', error);
      alert('Failed to update preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const formatPersonalityType = (disc: string, enneagram?: number) => {
    const discNames = {
      'D': 'Dominance',
      'I': 'Influence', 
      'S': 'Steadiness',
      'C': 'Conscientiousness'
    };
    
    let result = `DISC: ${discNames[disc as keyof typeof discNames] || disc}`;
    if (enneagram) {
      result += ` • Enneagram: Type ${enneagram}`;
    }
    return result;
  };

  const formatPreference = (key: string, value: string) => {
    return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-300"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60">Unable to load profile data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
        <Button
          variant={editMode ? "secondary" : "primary"}
          size="medium"
          icon={editMode ? X : Edit3}
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card variant="glass" padding="medium">
            <div className="flex items-center mb-6">
              <User className="w-5 h-5 mr-2 text-accent-300" />
              <h2 className="text-lg font-semibold text-white">Basic Information</h2>
            </div>

            <div className="space-y-4">
              {/* Avatar */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-primary-600/20 rounded-full flex items-center justify-center">
                  {profile.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-primary-400" />
                  )}
                </div>
                {editMode && (
                  <Button variant="secondary" size="small" icon={Camera}>
                    Change Photo
                  </Button>
                )}
              </div>

              {/* Form Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Full Name</label>
                  {editMode ? (
                    <Input
                      value={formData.full_name}
                      onChange={(value) => setFormData(prev => ({ ...prev, full_name: value }))}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-white bg-white/5 px-4 py-3 rounded-xl">{profile.full_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
                  <p className="text-white/60 bg-white/5 px-4 py-3 rounded-xl">{profile.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Language</label>
                  {editMode ? (
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="pt">Português</option>
                      <option value="fr">Français</option>
                    </select>
                  ) : (
                    <p className="text-white bg-white/5 px-4 py-3 rounded-xl">
                      {formData.language === 'en' ? 'English' : 
                       formData.language === 'es' ? 'Español' :
                       formData.language === 'pt' ? 'Português' : 'Français'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Timezone</label>
                  {editMode ? (
                    <Input
                      value={formData.timezone}
                      onChange={(value) => setFormData(prev => ({ ...prev, timezone: value }))}
                      placeholder="UTC"
                    />
                  ) : (
                    <p className="text-white bg-white/5 px-4 py-3 rounded-xl">{profile.timezone}</p>
                  )}
                </div>
              </div>

              {editMode && (
                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="primary"
                    size="medium"
                    icon={Save}
                    onClick={handleSaveProfile}
                    loading={saving}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="secondary"
                    size="medium"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Personality Profile */}
          {onboardingProfile && (
            <Card variant="glass" padding="medium">
              <div className="flex items-center mb-6">
                <Brain className="w-5 h-5 mr-2 text-accent-300" />
                <h2 className="text-lg font-semibold text-white">Personality Profile</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Assessment Results</label>
                  <p className="text-white bg-white/5 px-4 py-3 rounded-xl">
                    {formatPersonalityType(onboardingProfile.disc_type, onboardingProfile.enneagram_type)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Confidence Score</label>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary-600 to-accent-300 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(onboardingProfile.confidence_score || 0) * 100}%` }}
                      />
                    </div>
                    <span className="text-white text-sm font-medium">
                      {Math.round((onboardingProfile.confidence_score || 0) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column - Preferences & Settings */}
        <div className="space-y-6">
          {/* Ritual Preferences */}
          <Card variant="glass" padding="medium">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Heart className="w-5 h-5 mr-2 text-accent-300" />
                <h2 className="text-lg font-semibold text-white">Ritual Preferences</h2>
              </div>
              <Button
                variant="secondary"
                size="small"
                icon={Settings}
                onClick={() => setShowPreferencesModal(true)}
              >
                Edit
              </Button>
            </div>

            {ritualPreferences ? (
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-white/60">Timing:</span>
                  <span className="text-white ml-2">{formatPreference('timing', ritualPreferences.timing)}</span>
                </div>
                <div>
                  <span className="text-white/60">Duration:</span>
                  <span className="text-white ml-2">{formatPreference('duration', ritualPreferences.duration)}</span>
                </div>
                <div>
                  <span className="text-white/60">Style:</span>
                  <span className="text-white ml-2">{formatPreference('style', ritualPreferences.style)}</span>
                </div>
                <div>
                  <span className="text-white/60">Voice:</span>
                  <span className="text-white ml-2">{formatPreference('voice', ritualPreferences.voice_id)}</span>
                </div>
                <div>
                  <span className="text-white/60">Focus:</span>
                  <span className="text-white ml-2">{formatPreference('focus', ritualPreferences.focus_area)}</span>
                </div>
              </div>
            ) : (
              <p className="text-white/60 text-sm">No preferences set</p>
            )}
          </Card>

          {/* Account Information */}
          <Card variant="glass" padding="medium">
            <div className="flex items-center mb-6">
              <Globe className="w-5 h-5 mr-2 text-accent-300" />
              <h2 className="text-lg font-semibold text-white">Account Information</h2>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-white/60">Subscription:</span>
                <span className="text-white ml-2 capitalize">{profile.subscription_tier}</span>
              </div>
              <div>
                <span className="text-white/60">Member since:</span>
                <span className="text-white ml-2">
                  {new Date(profile.created_at).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-white/60">Last updated:</span>
                <span className="text-white ml-2">
                  {new Date(profile.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Preferences Modal */}
      <Modal
        isOpen={showPreferencesModal}
        onClose={() => setShowPreferencesModal(false)}
        title="Ritual Preferences"
        size="medium"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Preferred Timing</label>
            <select
              value={preferencesData.timing}
              onChange={(e) => setPreferencesData(prev => ({ ...prev, timing: e.target.value }))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
            >
              <option value="morning_person">Morning Person</option>
              <option value="evening_person">Evening Person</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Session Duration</label>
            <select
              value={preferencesData.duration}
              onChange={(e) => setPreferencesData(prev => ({ ...prev, duration: e.target.value }))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
            >
              <option value="quick_focused">Quick & Focused</option>
              <option value="deeper_dive">Deeper Dive</option>
              <option value="variable">Variable</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Conversation Style</label>
            <select
              value={preferencesData.style}
              onChange={(e) => setPreferencesData(prev => ({ ...prev, style: e.target.value }))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
            >
              <option value="guided_structure">Guided Structure</option>
              <option value="open_conversation">Open Conversation</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Voice Preference</label>
            <select
              value={preferencesData.voice_id}
              onChange={(e) => setPreferencesData(prev => ({ ...prev, voice_id: e.target.value }))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
            >
              <option value="confident_coach">Confident Coach</option>
              <option value="warm_friend">Warm Friend</option>
              <option value="gentle_guide">Gentle Guide</option>
              <option value="wise_mentor">Wise Mentor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Focus Area</label>
            <select
              value={preferencesData.focus_area}
              onChange={(e) => setPreferencesData(prev => ({ ...prev, focus_area: e.target.value }))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
            >
              <option value="stress_management">Stress Management</option>
              <option value="goal_achievement">Goal Achievement</option>
              <option value="relationships">Relationships</option>
              <option value="self_worth">Self Worth</option>
              <option value="emotional_regulation">Emotional Regulation</option>
              <option value="work_life_balance">Work Life Balance</option>
              <option value="personal_growth">Personal Growth</option>
              <option value="mindfulness">Mindfulness</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Session Frequency</label>
            <select
              value={preferencesData.session_frequency}
              onChange={(e) => setPreferencesData(prev => ({ ...prev, session_frequency: e.target.value }))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
            >
              <option value="daily">Daily</option>
              <option value="weekdays">Weekdays Only</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="reminders"
              checked={preferencesData.reminder_enabled}
              onChange={(e) => setPreferencesData(prev => ({ ...prev, reminder_enabled: e.target.checked }))}
              className="w-4 h-4 text-primary-600 bg-white/10 border-white/20 rounded focus:ring-primary-400"
            />
            <label htmlFor="reminders" className="text-sm text-white/80">
              Enable session reminders
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="primary"
              size="medium"
              onClick={handleSavePreferences}
              loading={saving}
            >
              Save Preferences
            </Button>
            <Button
              variant="secondary"
              size="medium"
              onClick={() => setShowPreferencesModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};