import {
    Award,
    Brain,
    Calendar,
    Clock,
    Flame,
    Heart,
    MessageCircle,
    Play,
    Settings,
    Sparkles,
    Target,
    TrendingUp
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

interface DashboardData {
  full_name: string;
  language: string;
  onboarding_completed: boolean;
  disc_type: string | null;
  enneagram_type: number | null;
  timing: string | null;
  voice_id: string | null;
  daily_streak: number;
  total_virtues: number;
  sessions_this_week: number;
  active_goals: number;
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('user_dashboard')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching dashboard data:', error);
          return;
        }

        setDashboardData(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-300"></div>
        </div>
    );
  }

  if (!dashboardData) {
    return (
        <div className="text-center py-12">
          <p className="text-white/60">Unable to load dashboard data</p>
        </div>
    );
  }

  const getPersonalityDisplay = () => {
    const parts = [];
    if (dashboardData.disc_type) {
      parts.push(`DISC: ${dashboardData.disc_type}`);
    }
    if (dashboardData.enneagram_type) {
      parts.push(`Enneagram: ${dashboardData.enneagram_type}`);
    }
    return parts.join(' • ') || 'Not assessed';
  };

  const getTimingDisplay = () => {
    if (!dashboardData.timing) return 'Not set';
    return dashboardData.timing.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getVoiceDisplay = () => {
    if (!dashboardData.voice_id) return 'Not set';
    return dashboardData.voice_id.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Welcome back, {dashboardData.full_name}
        </h1>
        <p className="text-white/60">
          Continue your journey of growth and self-discovery
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card variant="glass" padding="small">
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Flame className="w-6 h-6 text-orange-400" />
            </div>
            <div className="text-2xl font-bold text-white">{dashboardData.daily_streak}</div>
            <div className="text-xs text-white/60">Day Streak</div>
          </div>
        </Card>

        <Card variant="glass" padding="small">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Award className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white">{dashboardData.total_virtues}</div>
            <div className="text-xs text-white/60">Virtues</div>
          </div>
        </Card>

        <Card variant="glass" padding="small">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">{dashboardData.sessions_this_week}</div>
            <div className="text-xs text-white/60">This Week</div>
          </div>
        </Card>

        <Card variant="glass" padding="small">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Target className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white">{dashboardData.active_goals}</div>
            <div className="text-xs text-white/60">Active Goals</div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Session */}
          <Card variant="glass" padding="medium">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-accent-300" />
                Today's Session
              </h2>
              <Badge variant="accent" size="small">Ready</Badge>
            </div>
            <p className="text-white/70 mb-4 text-sm">
              Start your daily check-in with Genesis. Reflect on your goals and receive personalized guidance.
            </p>
            <Button size="medium" icon={Play} className="w-full sm:w-auto">
              Begin Session
            </Button>
          </Card>

          {/* Recent Activity */}
          <Card variant="glass" padding="medium">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-accent-300" />
              Recent Activity
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                    <Award className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">Earned "Patience" virtue</div>
                    <div className="text-white/60 text-xs">2 hours ago</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                    <Target className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">Completed morning session</div>
                    <div className="text-white/60 text-xs">Yesterday</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center mr-3">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">Set new personal goal</div>
                    <div className="text-white/60 text-xs">2 days ago</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Profile Summary */}
          <Card variant="glass" padding="medium">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-accent-300" />
              Your Profile
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-white/60 mb-1">Personality</div>
                <div className="text-white">{getPersonalityDisplay()}</div>
              </div>
              <div>
                <div className="text-white/60 mb-1">Preferred Timing</div>
                <div className="text-white">{getTimingDisplay()}</div>
              </div>
              <div>
                <div className="text-white/60 mb-1">Voice Preference</div>
                <div className="text-white">{getVoiceDisplay()}</div>
              </div>
            </div>
            <Button variant="outline" size="small" icon={Settings} className="w-full mt-4">
              Update Preferences
            </Button>
          </Card>

          {/* Quick Actions */}
          <Card variant="glass" padding="medium">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-accent-300" />
              Quick Actions
            </h2>
            <div className="space-y-2">
              <Button variant="outline" size="small" className="w-full justify-start">
                <Target className="w-4 h-4 mr-2" />
                View Goals
              </Button>
              <Button variant="outline" size="small" className="w-full justify-start">
                <Award className="w-4 h-4 mr-2" />
                Virtue Collection
              </Button>
              <Button variant="outline" size="small" className="w-full justify-start">
                <Clock className="w-4 h-4 mr-2" />
                Session History
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};