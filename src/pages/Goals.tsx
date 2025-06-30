import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { 
  Target, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Circle, 
  Calendar,
  TrendingUp,
  Archive,
  Play,
  Pause
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Goal {
  id: string;
  goal_text: string;
  goal_type: string;
  smart_goal?: string;
  status: 'active' | 'completed' | 'paused' | 'archived';
  target_date?: string;
  progress_percentage: number;
  source: 'onboarding' | 'session_suggestion' | 'user_created';
  created_at: string;
  updated_at: string;
}

export const Goals: React.FC = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'paused'>('all');

  // Form state
  const [formData, setFormData] = useState({
    goal_text: '',
    goal_type: 'emotional_wellness',
    target_date: '',
    smart_goal: ''
  });

  useEffect(() => {
    fetchGoals();
  }, [user]);

  const fetchGoals = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async () => {
    if (!user || !formData.goal_text.trim()) return;

    try {
      setSaving(true);
      const { data, error } = await supabase
        .from('user_goals')
        .insert({
          user_id: user.id,
          goal_text: formData.goal_text,
          goal_type: formData.goal_type,
          target_date: formData.target_date || null,
          smart_goal: formData.smart_goal || null,
          source: 'user_created',
          status: 'active',
          progress_percentage: 0
        })
        .select()
        .single();

      if (error) throw error;

      setGoals(prev => [data, ...prev]);
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating goal:', error);
      alert('Failed to create goal. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateGoal = async () => {
    if (!editingGoal || !formData.goal_text.trim()) return;

    try {
      setSaving(true);
      const { data, error } = await supabase
        .from('user_goals')
        .update({
          goal_text: formData.goal_text,
          goal_type: formData.goal_type,
          target_date: formData.target_date || null,
          smart_goal: formData.smart_goal || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingGoal.id)
        .select()
        .single();

      if (error) throw error;

      setGoals(prev => prev.map(goal => 
        goal.id === editingGoal.id ? data : goal
      ));
      setEditingGoal(null);
      resetForm();
    } catch (error) {
      console.error('Error updating goal:', error);
      alert('Failed to update goal. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProgress = async (goalId: string, progress: number) => {
    try {
      const { error } = await supabase
        .from('user_goals')
        .update({ 
          progress_percentage: progress,
          status: progress >= 100 ? 'completed' : 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', goalId);

      if (error) throw error;

      setGoals(prev => prev.map(goal => 
        goal.id === goalId 
          ? { ...goal, progress_percentage: progress, status: progress >= 100 ? 'completed' : 'active' }
          : goal
      ));
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleStatusChange = async (goalId: string, status: Goal['status']) => {
    try {
      const { error } = await supabase
        .from('user_goals')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', goalId);

      if (error) throw error;

      setGoals(prev => prev.map(goal => 
        goal.id === goalId ? { ...goal, status } : goal
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;

    try {
      const { error } = await supabase
        .from('user_goals')
        .delete()
        .eq('id', goalId);

      if (error) throw error;

      setGoals(prev => prev.filter(goal => goal.id !== goalId));
    } catch (error) {
      console.error('Error deleting goal:', error);
      alert('Failed to delete goal. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      goal_text: '',
      goal_type: 'emotional_wellness',
      target_date: '',
      smart_goal: ''
    });
  };

  const openEditModal = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      goal_text: goal.goal_text,
      goal_type: goal.goal_type,
      target_date: goal.target_date || '',
      smart_goal: goal.smart_goal || ''
    });
  };

  const getStatusIcon = (status: Goal['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'paused': return <Pause className="w-5 h-5 text-yellow-400" />;
      case 'archived': return <Archive className="w-5 h-5 text-gray-400" />;
      default: return <Circle className="w-5 h-5 text-blue-400" />;
    }
  };

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'paused': return 'bg-yellow-500/20 text-yellow-400';
      case 'archived': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };

  const filteredGoals = goals.filter(goal => {
    if (filter === 'all') return true;
    return goal.status === filter;
  });

  const stats = {
    total: goals.length,
    active: goals.filter(g => g.status === 'active').length,
    completed: goals.filter(g => g.status === 'completed').length,
    avgProgress: goals.length > 0 
      ? Math.round(goals.reduce((sum, g) => sum + g.progress_percentage, 0) / goals.length)
      : 0
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Goals & Aspirations</h1>
        <Button
          variant="primary"
          size="medium"
          icon={Plus}
          onClick={() => setShowCreateModal(true)}
        >
          New Goal
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="glass" padding="small">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-xs text-white/60">Total Goals</div>
          </div>
        </Card>

        <Card variant="glass" padding="small">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.completed}</div>
            <div className="text-xs text-white/60">Completed</div>
          </div>
        </Card>

        <Card variant="glass" padding="small">
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Play className="w-6 h-6 text-orange-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.active}</div>
            <div className="text-xs text-white/60">Active</div>
          </div>
        </Card>

        <Card variant="glass" padding="small">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.avgProgress}%</div>
            <div className="text-xs text-white/60">Avg Progress</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        {(['all', 'active', 'completed', 'paused'] as const).map((filterOption) => (
          <Button
            key={filterOption}
            variant={filter === filterOption ? "primary" : "secondary"}
            size="small"
            onClick={() => setFilter(filterOption)}
          >
            {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
          </Button>
        ))}
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {filteredGoals.length === 0 ? (
          <Card variant="glass" padding="large">
            <div className="text-center">
              <Target className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No goals found</h3>
              <p className="text-white/60 mb-4">
                {filter === 'all' 
                  ? "Start your journey by creating your first goal"
                  : `No ${filter} goals at the moment`
                }
              </p>
              {filter === 'all' && (
                <Button
                  variant="primary"
                  size="medium"
                  icon={Plus}
                  onClick={() => setShowCreateModal(true)}
                >
                  Create Your First Goal
                </Button>
              )}
            </div>
          </Card>
        ) : (
          filteredGoals.map((goal) => (
            <Card key={goal.id} variant="glass" padding="medium">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3 flex-1">
                  {getStatusIcon(goal.status)}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{goal.goal_text}</h3>
                    {goal.smart_goal && (
                      <p className="text-white/70 text-sm mb-2">{goal.smart_goal}</p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-white/60">
                      <span className="capitalize">{goal.goal_type.replace('_', ' ')}</span>
                      <span>•</span>
                      <span className="capitalize">{goal.source.replace('_', ' ')}</span>
                      {goal.target_date && (
                        <>
                          <span>•</span>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(goal.target_date).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge className={`px-2 py-1 text-xs rounded-full ${getStatusColor(goal.status)}`}>
                    {goal.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="small"
                    icon={Edit3}
                    onClick={() => openEditModal(goal)}
                  />
                  <Button
                    variant="ghost"
                    size="small"
                    icon={Trash2}
                    onClick={() => handleDeleteGoal(goal.id)}
                  />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/60">Progress</span>
                  <span className="text-sm text-white font-medium">{goal.progress_percentage}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary-600 to-accent-300 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress_percentage}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={goal.progress_percentage}
                    onChange={(e) => handleUpdateProgress(goal.id, parseInt(e.target.value))}
                    className="w-24 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-white/60">Update progress</span>
                </div>

                <div className="flex items-center space-x-2">
                  {goal.status === 'active' && (
                    <Button
                      variant="secondary"
                      size="small"
                      icon={Pause}
                      onClick={() => handleStatusChange(goal.id, 'paused')}
                    >
                      Pause
                    </Button>
                  )}
                  {goal.status === 'paused' && (
                    <Button
                      variant="secondary"
                      size="small"
                      icon={Play}
                      onClick={() => handleStatusChange(goal.id, 'active')}
                    >
                      Resume
                    </Button>
                  )}
                  {goal.status !== 'completed' && goal.progress_percentage < 100 && (
                    <Button
                      variant="secondary"
                      size="small"
                      icon={CheckCircle}
                      onClick={() => handleStatusChange(goal.id, 'completed')}
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreateModal || !!editingGoal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingGoal(null);
          resetForm();
        }}
        title={editingGoal ? 'Edit Goal' : 'Create New Goal'}
        size="medium"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Goal Description</label>
            <Input
              value={formData.goal_text}
              onChange={(value) => setFormData(prev => ({ ...prev, goal_text: value }))}
              placeholder="What do you want to achieve?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Category</label>
            <select
              value={formData.goal_type}
              onChange={(e) => setFormData(prev => ({ ...prev, goal_type: e.target.value }))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
            >
              <option value="emotional_wellness">Emotional Wellness</option>
              <option value="personal_growth">Personal Growth</option>
              <option value="relationships">Relationships</option>
              <option value="career">Career</option>
              <option value="health">Health</option>
              <option value="mindfulness">Mindfulness</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Target Date (Optional)</label>
            <Input
              type="date"
              value={formData.target_date}
              onChange={(value) => setFormData(prev => ({ ...prev, target_date: value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">SMART Goal Format (Optional)</label>
            <textarea
              value={formData.smart_goal}
              onChange={(e) => setFormData(prev => ({ ...prev, smart_goal: e.target.value }))}
              placeholder="Specific, Measurable, Achievable, Relevant, Time-bound version of your goal"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 resize-none"
              rows={3}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="primary"
              size="medium"
              onClick={editingGoal ? handleUpdateGoal : handleCreateGoal}
              loading={saving}
            >
              {editingGoal ? 'Update Goal' : 'Create Goal'}
            </Button>
            <Button
              variant="secondary"
              size="medium"
              onClick={() => {
                setShowCreateModal(false);
                setEditingGoal(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};