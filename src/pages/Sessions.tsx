import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { 
  Play, 
  Calendar, 
  Clock, 
  Award, 
  Heart, 
  Brain, 
  MessageCircle,
  TrendingUp,
  Filter,
  Eye,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DailySession {
  id: string;
  session_type: 'face_to_face' | 'spoken_presence' | 'silent_reflection' | 'written_clarity';
  session_status: 'started' | 'in_progress' | 'completed' | 'interrupted' | 'failed';
  duration_seconds?: number;
  virtue_earned?: string;
  emotional_snapshot?: Array<{
    emotion: string;
    intensity: number;
    color: string;
  }>;
  key_insights?: string[];
  suggested_goals?: Array<{
    category: string;
    description: string;
    smart_goal: string;
    timeframe: string;
  }>;
  session_date: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

interface SessionStats {
  total_sessions: number;
  avg_duration_minutes: number;
  most_common_virtue: string;
  completion_rate: number;
  this_week: number;
  this_month: number;
}

export const Sessions: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<DailySession[]>([]);
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<DailySession | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'this_week' | 'this_month'>('all');
  const [sessionTypeFilter, setSessionTypeFilter] = useState<string>('all');

  useEffect(() => {
    fetchSessions();
    fetchStats();
  }, [user]);

  const fetchSessions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('daily_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!user) return;

    try {
      // Get basic stats
      const { data: sessionsData, error } = await supabase
        .from('daily_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('session_status', 'completed');

      if (error) throw error;

      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const totalSessions = sessionsData?.length || 0;
      const avgDuration = totalSessions > 0 
        ? Math.round((sessionsData?.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) || 0) / totalSessions / 60)
        : 0;

      const virtues = sessionsData?.map(s => s.virtue_earned).filter(Boolean) || [];
      const virtueCount = virtues.reduce((acc, virtue) => {
        acc[virtue] = (acc[virtue] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const mostCommonVirtue = Object.keys(virtueCount).reduce((a, b) => 
        virtueCount[a] > virtueCount[b] ? a : b, ''
      );

      const thisWeek = sessionsData?.filter(s => 
        new Date(s.created_at) >= weekAgo
      ).length || 0;

      const thisMonth = sessionsData?.filter(s => 
        new Date(s.created_at) >= monthAgo
      ).length || 0;

      // Get total sessions including incomplete ones for completion rate
      const { data: allSessions } = await supabase
        .from('daily_sessions')
        .select('session_status')
        .eq('user_id', user.id);

      const completionRate = allSessions?.length 
        ? Math.round((totalSessions / allSessions.length) * 100)
        : 0;

      setStats({
        total_sessions: totalSessions,
        avg_duration_minutes: avgDuration,
        most_common_virtue: mostCommonVirtue || 'None yet',
        completion_rate: completionRate,
        this_week: thisWeek,
        this_month: thisMonth
      });

    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const startNewSession = async () => {
    if (!user) return;

    try {
      // For now, we'll create a placeholder session
      // In a real implementation, this would integrate with the actual session system
      const { data, error } = await supabase
        .from('daily_sessions')
        .insert({
          user_id: user.id,
          session_type: 'face_to_face',
          session_status: 'started',
          session_date: new Date().toISOString().split('T')[0],
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Redirect to session interface (placeholder for now)
      alert('Session started! This would redirect to the session interface.');
      fetchSessions();
    } catch (error) {
      console.error('Error starting session:', error);
      alert('Failed to start session. Please try again.');
    }
  };

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'face_to_face': return <MessageCircle className="w-4 h-4" />;
      case 'spoken_presence': return <Heart className="w-4 h-4" />;
      case 'silent_reflection': return <Brain className="w-4 h-4" />;
      case 'written_clarity': return <Sparkles className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getSessionTypeLabel = (type: string) => {
    switch (type) {
      case 'face_to_face': return 'Face to Face';
      case 'spoken_presence': return 'Spoken Presence';
      case 'silent_reflection': return 'Silent Reflection';
      case 'written_clarity': return 'Written Clarity';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'in_progress': return 'bg-blue-500/20 text-blue-400';
      case 'interrupted': return 'bg-yellow-500/20 text-yellow-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const filteredSessions = sessions.filter(session => {
    // Date filter
    const now = new Date();
    const sessionDate = new Date(session.created_at);
    
    switch (filter) {
      case 'completed':
        if (session.session_status !== 'completed') return false;
        break;
      case 'this_week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (sessionDate < weekAgo) return false;
        break;
      case 'this_month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (sessionDate < monthAgo) return false;
        break;
    }

    // Type filter
    if (sessionTypeFilter !== 'all' && session.session_type !== sessionTypeFilter) {
      return false;
    }

    return true;
  });

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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Daily Sessions</h1>
        <Button
          variant="primary"
          size="medium"
          icon={Play}
          onClick={startNewSession}
        >
          Start Session
        </Button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card variant="glass" padding="small">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stats.total_sessions}</div>
              <div className="text-xs text-white/60">Total Sessions</div>
            </div>
          </Card>

          <Card variant="glass" padding="small">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stats.avg_duration_minutes}m</div>
              <div className="text-xs text-white/60">Avg Duration</div>
            </div>
          </Card>

          <Card variant="glass" padding="small">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stats.completion_rate}%</div>
              <div className="text-xs text-white/60">Completion Rate</div>
            </div>
          </Card>

          <Card variant="glass" padding="small">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-orange-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stats.this_week}</div>
              <div className="text-xs text-white/60">This Week</div>
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="flex space-x-2">
          {(['all', 'completed', 'this_week', 'this_month'] as const).map((filterOption) => (
            <Button
              key={filterOption}
              variant={filter === filterOption ? "primary" : "secondary"}
              size="small"
              onClick={() => setFilter(filterOption)}
            >
              {filterOption.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Button>
          ))}
        </div>
        
        <select
          value={sessionTypeFilter}
          onChange={(e) => setSessionTypeFilter(e.target.value)}
          className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
        >
          <option value="all">All Types</option>
          <option value="face_to_face">Face to Face</option>
          <option value="spoken_presence">Spoken Presence</option>
          <option value="silent_reflection">Silent Reflection</option>
          <option value="written_clarity">Written Clarity</option>
        </select>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <Card variant="glass" padding="large">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No sessions found</h3>
              <p className="text-white/60 mb-4">
                {filter === 'all' 
                  ? "Start your first session to begin your journey"
                  : `No sessions found for the selected filter`
                }
              </p>
              {filter === 'all' && (
                <Button
                  variant="primary"
                  size="medium"
                  icon={Play}
                  onClick={startNewSession}
                >
                  Start Your First Session
                </Button>
              )}
            </div>
          </Card>
        ) : (
          filteredSessions.map((session) => (
            <Card key={session.id} variant="glass" padding="medium">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="w-10 h-10 bg-primary-600/20 rounded-full flex items-center justify-center">
                    {getSessionTypeIcon(session.session_type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {getSessionTypeLabel(session.session_type)}
                      </h3>
                      <Badge className={`px-2 py-1 text-xs rounded-full ${getStatusColor(session.session_status)}`}>
                        {session.session_status}
                      </Badge>
                      {session.virtue_earned && (
                        <Badge variant="virtue" size="small">
                          {session.virtue_earned}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-white/60 mb-3">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(session.session_date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDuration(session.duration_seconds)}
                      </span>
                      {session.completed_at && (
                        <span>
                          {new Date(session.completed_at).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      )}
                    </div>

                    {/* Emotional Snapshot */}
                    {session.emotional_snapshot && session.emotional_snapshot.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {session.emotional_snapshot.slice(0, 3).map((emotion, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/80"
                            style={{ backgroundColor: emotion.color + '20' }}
                          >
                            {emotion.emotion}
                          </span>
                        ))}
                        {session.emotional_snapshot.length > 3 && (
                          <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/60">
                            +{session.emotional_snapshot.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Key Insights Preview */}
                    {session.key_insights && session.key_insights.length > 0 && (
                      <p className="text-white/70 text-sm line-clamp-2">
                        {session.key_insights[0]}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="small"
                  icon={Eye}
                  onClick={() => setSelectedSession(session)}
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Session Details Modal */}
      <Modal
        isOpen={!!selectedSession}
        onClose={() => setSelectedSession(null)}
        title="Session Details"
        size="large"
      >
        {selectedSession && (
          <div className="space-y-6">
            {/* Session Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">
                  {getSessionTypeLabel(selectedSession.session_type)}
                </h3>
                <p className="text-white/60">
                  {new Date(selectedSession.session_date).toLocaleDateString()} • 
                  {formatDuration(selectedSession.duration_seconds)}
                </p>
              </div>
              <Badge className={`px-3 py-1 rounded-full ${getStatusColor(selectedSession.session_status)}`}>
                {selectedSession.session_status}
              </Badge>
            </div>

            {/* Virtue Earned */}
            {selectedSession.virtue_earned && (
              <Card variant="glass" padding="small">
                <div className="flex items-center space-x-3">
                  <Award className="w-6 h-6 text-yellow-400" />
                  <div>
                    <h4 className="font-semibold text-white">Virtue Earned</h4>
                    <p className="text-white/70">{selectedSession.virtue_earned}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Emotional Snapshot */}
            {selectedSession.emotional_snapshot && selectedSession.emotional_snapshot.length > 0 && (
              <div>
                <h4 className="font-semibold text-white mb-3 flex items-center">
                  <Heart className="w-4 h-4 mr-2" />
                  Emotional Snapshot
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {selectedSession.emotional_snapshot.map((emotion, index) => (
                    <div
                      key={index}
                      className="p-3 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white font-medium">{emotion.emotion}</span>
                        <span className="text-white/60 text-sm">Intensity: {emotion.intensity}/5</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1">
                        <div 
                          className="h-1 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${(emotion.intensity / 5) * 100}%`,
                            backgroundColor: emotion.color 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Insights */}
            {selectedSession.key_insights && selectedSession.key_insights.length > 0 && (
              <div>
                <h4 className="font-semibold text-white mb-3 flex items-center">
                  <Brain className="w-4 h-4 mr-2" />
                  Key Insights
                </h4>
                <div className="space-y-2">
                  {selectedSession.key_insights.map((insight, index) => (
                    <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-white/80">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested Goals */}
            {selectedSession.suggested_goals && selectedSession.suggested_goals.length > 0 && (
              <div>
                <h4 className="font-semibold text-white mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Suggested Goals
                </h4>
                <div className="space-y-3">
                  {selectedSession.suggested_goals.map((goal, index) => (
                    <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{goal.description}</span>
                        <Badge className="bg-blue-500/20 text-blue-400 px-2 py-1 text-xs rounded-full">
                          {goal.category}
                        </Badge>
                      </div>
                      {goal.smart_goal && (
                        <p className="text-white/70 text-sm mb-1">{goal.smart_goal}</p>
                      )}
                      <p className="text-white/60 text-xs">Timeframe: {goal.timeframe}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};