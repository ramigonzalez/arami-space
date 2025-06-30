import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Clock, Volume2, Target, Calendar, Bell } from 'lucide-react';
import { ritualPreferencesService, type RitualPreferencesFormData } from '../../lib/ritualPreferencesService';
import { useAuth } from '../../hooks/useAuth';

interface RitualPreferencesFormProps {
  onSave: () => void;
  onCancel: () => void;
}

export const RitualPreferencesForm: React.FC<RitualPreferencesFormProps> = ({
  onSave,
  onCancel,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<RitualPreferencesFormData>({
    timing: 'flexible',
    duration: 'quick_focused',
    style: 'guided_structure',
    voice_id: 'warm_friend',
    focus_area: '',
    session_frequency: 'daily',
    preferred_session_time: '',
    reminder_enabled: true,
  });

  useEffect(() => {
    if (user?.id) {
      loadExistingPreferences();
    }
  }, [user?.id]);

  const loadExistingPreferences = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const preferences = await ritualPreferencesService.getUserRitualPreferences(user.id);
      
      if (preferences) {
        setFormData({
          timing: preferences.timing as any,
          duration: preferences.duration as any,
          style: preferences.style as any,
          voice_id: preferences.voice_id as any,
          focus_area: preferences.focus_area,
          session_frequency: preferences.session_frequency as any,
          preferred_session_time: preferences.preferred_session_time || '',
          reminder_enabled: preferences.reminder_enabled ?? true,
        });
      }
    } catch (err) {
      setError('Failed to load existing preferences');
      console.error('Error loading preferences:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    // Validation
    if (!formData.focus_area.trim()) {
      setError('Focus area is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await ritualPreferencesService.updateRitualPreferences(user.id, formData);
      onSave();
    } catch (err) {
      setError('Failed to save preferences. Please try again.');
      console.error('Error saving preferences:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof RitualPreferencesFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  if (loading && !formData.focus_area) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <Target className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-surface-900">Ritual Preferences</h3>
          <p className="text-sm text-surface-600">Customize your daily practice</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Timing Preference */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            <Clock className="w-4 h-4 inline mr-2" />
            When do you prefer to practice?
          </label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { value: 'morning_person', label: 'Morning Person', desc: 'I prefer early sessions' },
              { value: 'evening_person', label: 'Evening Person', desc: 'I prefer evening sessions' },
              { value: 'flexible', label: 'Flexible', desc: 'Any time works for me' },
            ].map((option) => (
              <label key={option.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-surface-50">
                <input
                  type="radio"
                  name="timing"
                  value={option.value}
                  checked={formData.timing === option.value}
                  onChange={(e) => handleInputChange('timing', e.target.value)}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium text-surface-900">{option.label}</div>
                  <div className="text-sm text-surface-600">{option.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Duration Preference */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Session Duration
          </label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { value: 'quick_focused', label: 'Quick & Focused', desc: '5-10 minutes' },
              { value: 'deeper_dive', label: 'Deeper Dive', desc: '15-30 minutes' },
              { value: 'variable', label: 'Variable', desc: 'Depends on my mood' },
            ].map((option) => (
              <label key={option.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-surface-50">
                <input
                  type="radio"
                  name="duration"
                  value={option.value}
                  checked={formData.duration === option.value}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium text-surface-900">{option.label}</div>
                  <div className="text-sm text-surface-600">{option.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Style Preference */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Session Style
          </label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { value: 'guided_structure', label: 'Guided Structure', desc: 'Clear steps and guidance' },
              { value: 'open_conversation', label: 'Open Conversation', desc: 'Free-flowing dialogue' },
              { value: 'mixed', label: 'Mixed Approach', desc: 'Combination of both' },
            ].map((option) => (
              <label key={option.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-surface-50">
                <input
                  type="radio"
                  name="style"
                  value={option.value}
                  checked={formData.style === option.value}
                  onChange={(e) => handleInputChange('style', e.target.value)}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium text-surface-900">{option.label}</div>
                  <div className="text-sm text-surface-600">{option.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Voice Preference */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            <Volume2 className="w-4 h-4 inline mr-2" />
            Voice Style
          </label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { value: 'confident_coach', label: 'Confident Coach', desc: 'Motivating and direct' },
              { value: 'warm_friend', label: 'Warm Friend', desc: 'Supportive and caring' },
              { value: 'gentle_guide', label: 'Gentle Guide', desc: 'Soft and nurturing' },
              { value: 'wise_mentor', label: 'Wise Mentor', desc: 'Thoughtful and experienced' },
            ].map((option) => (
              <label key={option.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-surface-50">
                <input
                  type="radio"
                  name="voice_id"
                  value={option.value}
                  checked={formData.voice_id === option.value}
                  onChange={(e) => handleInputChange('voice_id', e.target.value)}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium text-surface-900">{option.label}</div>
                  <div className="text-sm text-surface-600">{option.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Focus Area */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Primary Focus Area
          </label>
          <Input
            value={formData.focus_area}
            onChange={(e) => handleInputChange('focus_area', e.target.value)}
            placeholder="e.g., stress management, goal achievement, relationships"
            className="w-full"
          />
        </div>

        {/* Session Frequency */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Session Frequency
          </label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { value: 'daily', label: 'Daily', desc: 'Every day' },
              { value: 'weekdays', label: 'Weekdays', desc: 'Monday to Friday' },
              { value: 'custom', label: 'Custom', desc: 'I\'ll choose when' },
            ].map((option) => (
              <label key={option.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-surface-50">
                <input
                  type="radio"
                  name="session_frequency"
                  value={option.value}
                  checked={formData.session_frequency === option.value}
                  onChange={(e) => handleInputChange('session_frequency', e.target.value)}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium text-surface-900">{option.label}</div>
                  <div className="text-sm text-surface-600">{option.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Preferred Session Time */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Preferred Session Time (Optional)
          </label>
          <Input
            type="time"
            value={formData.preferred_session_time}
            onChange={(e) => handleInputChange('preferred_session_time', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Reminder Toggle */}
        <div>
          <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-surface-50">
            <input
              type="checkbox"
              checked={formData.reminder_enabled}
              onChange={(e) => handleInputChange('reminder_enabled', e.target.checked)}
              className="rounded"
            />
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-surface-600" />
              <div>
                <div className="font-medium text-surface-900">Enable Reminders</div>
                <div className="text-sm text-surface-600">Get notified for your sessions</div>
              </div>
            </div>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </form>
    </Card>
  );
};