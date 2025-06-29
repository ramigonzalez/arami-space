import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { DatabaseService } from '../lib/database';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Home, Calendar, Target, Settings, Play, TrendingUp, LogOut } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const [dashboardData, setDashboardData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      try {
        const result = await DatabaseService.getUserDashboard(user.id);
        if (result.success) {
          setDashboardData(result.data);
        }
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const handleSignOut = async () => {
    const result = await signOut();
    if (!result.success) {
      console.error('Sign out error:', result.error);
    }
  };

  const streak = 7;
  const virtues = ['Clarity', 'Courage', 'Compassion'];
  const recentInsights = [
    'You show strong leadership qualities when discussing team challenges',
    'Your communication style reflects high emotional intelligence',
    'Setting boundaries seems to be an area of growth for you'
  ];

  if (loading) {
    return <Layout><div className="min-h-screen flex items-center justify-center">
      <div className="text-white">Loading your dashboard...</div>
    </div></Layout>;
  }

  return (
    <Layout>
      <div className="min-h-screen pb-safe-bottom">
        {/* Header */}
        <header className="px-4 pt-safe-top pb-4 bg-gradient-to-r from-primary-600 to-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">
                Good morning, {profile?.full_name?.split(' ')[0] || 'there'}
              </h1>
              <p className="text-white/80 text-sm">Ready for today's ritual?</p>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={handleSignOut} className="p-2 text-white/60 hover:text-white transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">{dashboardData?.daily_streak || 0}</span>
              </div>
              <Badge size="medium" />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 px-4 py-6 space-y-6">
          {/* Daily ritual card */}
          <Card variant="glass" className="text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary-600/20 rounded-full flex items-center justify-center mx-auto">
                <Play className="w-8 h-8 text-primary-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">Today's Session</h2>
                <p className="text-white/70 text-sm mb-4">
                  Your personalized 5-minute emotional check-in
                </p>
              </div>
              <Button 
                size="large"
                icon={Play}
                iconPosition="left"
                className="w-full"
                onClick={() => alert('Session will be implemented in Phase 3')}
              >
                Start Your Ritual
              </Button>
            </div>
          </Card>

          {/* Progress section */}
          <div className="grid grid-cols-2 gap-4">
            <Card variant="glass">
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">Streak</h3>
                <p className="text-2xl font-bold text-green-400">{dashboardData?.daily_streak || 0} days</p>
              </div>
            </Card>
            <Card variant="glass">
              <div className="text-center">
                <Badge size="small" variant="virtue" className="mx-auto mb-2" />
                <h3 className="font-semibold text-white">Virtues</h3>
                <p className="text-2xl font-bold text-accent-300">{dashboardData?.total_virtues || 0}</p>
              </div>
            </Card>
          </div>

          {/* Recent insights */}
          <Card variant="glass">
            <h3 className="font-semibold text-white mb-4">Recent Insights</h3>
            <div className="space-y-3">
              {recentInsights.map((insight, i) => (
                <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-white/90 text-sm leading-relaxed">
                    {insight}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Virtue collection */}
          <Card variant="glass">
            <h3 className="font-semibold text-white mb-4">Virtue Collection</h3>
            <div className="flex flex-wrap gap-3">
              {virtues.map((virtue, i) => (
                <div key={i} className="flex items-center space-x-2 px-3 py-2 bg-white/5 rounded-full border border-white/10">
                  <Badge size="small" variant="virtue" />
                  <span className="text-white/90 text-sm">{virtue}</span>
                </div>
              ))}
            </div>
          </Card>
        </main>

        {/* Bottom navigation */}
        <nav className="px-4 py-3 bg-white/5 border-t border-white/10">
          <div className="flex justify-around">
            <TabButton icon={Home} label="Home" active />
            <TabButton icon={Calendar} label="History" />
            <TabButton icon={Target} label="Goals" />
            <TabButton icon={Settings} label="Settings" />
          </div>
        </nav>
      </div>
    </Layout>
  );
};

interface TabButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({ icon: Icon, label, active = false }) => {
  return (
    <button className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
      active ? 'text-primary-400' : 'text-white/60 hover:text-white'
    }`}>
      <Icon className="w-6 h-6" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};