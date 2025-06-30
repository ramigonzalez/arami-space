import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { 
  Award, 
  Star, 
  Calendar, 
  TrendingUp, 
  Crown, 
  Sparkles,
  Heart,
  Brain,
  Shield,
  Compass,
  Flame,
  Gem,
  Clock
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Virtue {
  id: string;
  virtue_name: string;
  virtue_description?: string;
  virtue_icon?: string;
  times_earned: number;
  first_earned_at: string;
  last_earned_at: string;
}

interface VirtueStats {
  total_virtues: number;
  total_earned: number;
  most_recent: string;
  streak_count: number;
}

const VIRTUE_ICONS: Record<string, React.ComponentType<any>> = {
  'Patience': Clock,
  'Courage': Shield,
  'Wisdom': Brain,
  'Compassion': Heart,
  'Clarity': Sparkles,
  'Strength': Flame,
  'Balance': Compass,
  'Grace': Star,
  'Resilience': Shield,
  'Mindfulness': Brain,
  'Gratitude': Heart,
  'Focus': Gem,
  'Kindness': Heart,
  'Determination': Flame,
  'Serenity': Sparkles,
  'default': Award
};

const VIRTUE_COLORS: Record<string, string> = {
  'Patience': 'from-blue-400 to-blue-600',
  'Courage': 'from-red-400 to-red-600',
  'Wisdom': 'from-purple-400 to-purple-600',
  'Compassion': 'from-pink-400 to-pink-600',
  'Clarity': 'from-cyan-400 to-cyan-600',
  'Strength': 'from-orange-400 to-orange-600',
  'Balance': 'from-green-400 to-green-600',
  'Grace': 'from-yellow-400 to-yellow-600',
  'Resilience': 'from-indigo-400 to-indigo-600',
  'Mindfulness': 'from-teal-400 to-teal-600',
  'Gratitude': 'from-rose-400 to-rose-600',
  'Focus': 'from-violet-400 to-violet-600',
  'Kindness': 'from-emerald-400 to-emerald-600',
  'Determination': 'from-amber-400 to-amber-600',
  'Serenity': 'from-sky-400 to-sky-600',
  'default': 'from-gray-400 to-gray-600'
};

export const Virtues: React.FC = () => {
  const { user } = useAuth();
  const [virtues, setVirtues] = useState<Virtue[]>([]);
  const [stats, setStats] = useState<VirtueStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVirtue, setSelectedVirtue] = useState<Virtue | null>(null);

  useEffect(() => {
    fetchVirtues();
    fetchStats();
  }, [user]);

  const fetchVirtues = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('virtue_collection')
        .select('*')
        .eq('user_id', user.id)
        .order('last_earned_at', { ascending: false });

      if (error) throw error;
      setVirtues(data || []);
    } catch (error) {
      console.error('Error fetching virtues:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!user) return;

    try {
      const { data: virtuesData, error } = await supabase
        .from('virtue_collection')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const totalVirtues = virtuesData?.length || 0;
      const totalEarned = virtuesData?.reduce((sum, v) => sum + v.times_earned, 0) || 0;
      const mostRecent = virtuesData?.length > 0 
        ? virtuesData.sort((a, b) => new Date(b.last_earned_at).getTime() - new Date(a.last_earned_at).getTime())[0].virtue_name
        : 'None yet';

      // Calculate streak (simplified - consecutive days with virtue earned)
      const { data: sessionsData } = await supabase
        .from('daily_sessions')
        .select('virtue_earned, session_date')
        .eq('user_id', user.id)
        .not('virtue_earned', 'is', null)
        .order('session_date', { ascending: false })
        .limit(30);

      let streakCount = 0;
      if (sessionsData && sessionsData.length > 0) {
        const today = new Date().toISOString().split('T')[0];
        let currentDate = today;
        
        for (const session of sessionsData) {
          if (session.session_date === currentDate) {
            streakCount++;
            const date = new Date(currentDate);
            date.setDate(date.getDate() - 1);
            currentDate = date.toISOString().split('T')[0];
          } else {
            break;
          }
        }
      }

      setStats({
        total_virtues: totalVirtues,
        total_earned: totalEarned,
        most_recent: mostRecent,
        streak_count: streakCount
      });

    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getVirtueIcon = (virtueName: string) => {
    const IconComponent = VIRTUE_ICONS[virtueName] || VIRTUE_ICONS.default;
    return IconComponent;
  };

  const getVirtueColor = (virtueName: string) => {
    return VIRTUE_COLORS[virtueName] || VIRTUE_COLORS.default;
  };

  const getRarityLevel = (timesEarned: number) => {
    if (timesEarned >= 10) return { level: 'Legendary', color: 'text-yellow-400', icon: Crown };
    if (timesEarned >= 5) return { level: 'Epic', color: 'text-purple-400', icon: Gem };
    if (timesEarned >= 3) return { level: 'Rare', color: 'text-blue-400', icon: Star };
    return { level: 'Common', color: 'text-gray-400', icon: Award };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-300"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Virtue Collection</h1>
        <p className="text-white/60">
          Discover and collect virtues through your daily practice
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card variant="glass" padding="small">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stats.total_virtues}</div>
              <div className="text-xs text-white/60">Unique Virtues</div>
            </div>
          </Card>

          <Card variant="glass" padding="small">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stats.total_earned}</div>
              <div className="text-xs text-white/60">Total Earned</div>
            </div>
          </Card>

          <Card variant="glass" padding="small">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stats.streak_count}</div>
              <div className="text-xs text-white/60">Day Streak</div>
            </div>
          </Card>

          <Card variant="glass" padding="small">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-lg font-bold text-white truncate">{stats.most_recent}</div>
              <div className="text-xs text-white/60">Most Recent</div>
            </div>
          </Card>
        </div>
      )}

      {/* Virtues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {virtues.length === 0 ? (
          <div className="col-span-full">
            <Card variant="glass" padding="large">
              <div className="text-center">
                <Award className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No virtues yet</h3>
                <p className="text-white/60">
                  Complete your daily sessions to start earning virtues and building your collection
                </p>
              </div>
            </Card>
          </div>
        ) : (
          virtues.map((virtue) => {
            const IconComponent = getVirtueIcon(virtue.virtue_name);
            const colorClass = getVirtueColor(virtue.virtue_name);
            const rarity = getRarityLevel(virtue.times_earned);
            const RarityIcon = rarity.icon;

            return (
              <Card 
                key={virtue.id} 
                variant="glass" 
                padding="medium"
                className="cursor-pointer hover:scale-105 transition-transform duration-200"
                onClick={() => setSelectedVirtue(virtue)}
              >
                <div className="text-center">
                  {/* Virtue Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${colorClass} rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Virtue Name */}
                  <h3 className="text-lg font-semibold text-white mb-2">{virtue.virtue_name}</h3>

                  {/* Rarity Badge */}
                  <div className="flex items-center justify-center space-x-1 mb-3">
                    <RarityIcon className={`w-4 h-4 ${rarity.color}`} />
                    <span className={`text-sm font-medium ${rarity.color}`}>
                      {rarity.level}
                    </span>
                  </div>

                  {/* Times Earned */}
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <Badge variant="virtue" size="small">
                      {virtue.times_earned}
                    </Badge>
                    <span className="text-white/60 text-sm">
                      {virtue.times_earned === 1 ? 'time' : 'times'}
                    </span>
                  </div>

                  {/* Last Earned */}
                  <div className="flex items-center justify-center space-x-1 text-white/60 text-xs">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(virtue.last_earned_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Description Preview */}
                  {virtue.virtue_description && (
                    <p className="text-white/70 text-sm mt-2 line-clamp-2">
                      {virtue.virtue_description}
                    </p>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Virtue Detail Modal */}
      {selectedVirtue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface-800 rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
            <div className="p-6">
              {/* Close Button */}
              <button
                onClick={() => setSelectedVirtue(null)}
                className="absolute top-4 right-4 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                ×
              </button>

              <div className="text-center">
                {/* Large Virtue Icon */}
                <div className={`w-24 h-24 bg-gradient-to-br ${getVirtueColor(selectedVirtue.virtue_name)} rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl`}>
                  {React.createElement(getVirtueIcon(selectedVirtue.virtue_name), {
                    className: "w-12 h-12 text-white"
                  })}
                </div>

                {/* Virtue Name */}
                <h2 className="text-2xl font-bold text-white mb-2">{selectedVirtue.virtue_name}</h2>

                {/* Rarity */}
                <div className="flex items-center justify-center space-x-2 mb-4">
                  {React.createElement(getRarityLevel(selectedVirtue.times_earned).icon, {
                    className: `w-5 h-5 ${getRarityLevel(selectedVirtue.times_earned).color}`
                  })}
                  <span className={`font-medium ${getRarityLevel(selectedVirtue.times_earned).color}`}>
                    {getRarityLevel(selectedVirtue.times_earned).level}
                  </span>
                </div>

                {/* Description */}
                {selectedVirtue.virtue_description && (
                  <p className="text-white/80 mb-6 leading-relaxed">
                    {selectedVirtue.virtue_description}
                  </p>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-2xl font-bold text-white">{selectedVirtue.times_earned}</div>
                    <div className="text-white/60 text-sm">Times Earned</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-lg font-bold text-white">
                      {Math.floor((new Date().getTime() - new Date(selectedVirtue.first_earned_at).getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-white/60 text-sm">Days Ago</div>
                  </div>
                </div>

                {/* Dates */}
                <div className="space-y-2 text-sm text-white/60">
                  <div className="flex items-center justify-between">
                    <span>First earned:</span>
                    <span>{new Date(selectedVirtue.first_earned_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Last earned:</span>
                    <span>{new Date(selectedVirtue.last_earned_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};