import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Brain, Heart, Target, Mic, Sparkles, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Personality-Driven Insights',
    description: 'Genesis, our onboarding AI, discovers your DISC and Enneagram types through natural conversation, creating a personalized emotional intelligence profile.',
    highlight: 'DISC & Enneagram Assessment',
  },
  {
    icon: Mic,
    title: 'Voice-First Experience',
    description: 'Speak naturally with your AI companion. No typing, no screens to stare at—just authentic conversation that feels like talking to a wise friend.',
    highlight: 'Natural Voice Interaction',
  },
  {
    icon: Heart,
    title: 'Daily Emotional Rituals',
    description: 'Personalized 3-5 minute daily sessions that adapt to your personality, goals, and emotional state. Build consistency without overwhelm.',
    highlight: 'Personalized Daily Sessions',
  },
  {
    icon: Target,
    title: 'SMART Goal Creation',
    description: 'Transform your aspirations into actionable SMART goals. Our AI helps you break down big dreams into achievable daily steps.',
    highlight: 'AI-Powered Goal Setting',
  },
  {
    icon: Sparkles,
    title: 'Virtue Collection System',
    description: 'Earn virtues like Clarity, Courage, and Compassion through your sessions. Track your emotional growth with meaningful achievements.',
    highlight: 'Gamified Growth Tracking',
  },
  {
    icon: TrendingUp,
    title: 'Emotional Intelligence Analytics',
    description: 'Visualize your emotional patterns, track mood trends, and see how your daily rituals impact your overall well-being and goal achievement.',
    highlight: 'Advanced Analytics Dashboard',
  },
];

export const Features: React.FC = () => {
  return (
    <section id="features" className="px-4 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <Badge size="medium" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Why Arami is Different
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Unlike generic chatbots or clinical therapy apps, Arami understands your unique personality and adapts to your communication style, making emotional growth feel natural and achievable.
          </p>
        </div>
        
        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              variant="glass" 
              className="group hover:bg-white/15 transition-all duration-300"
            >
              <div className="flex flex-col items-start space-y-4">
                {/* Icon */}
                <div className="p-3 bg-primary-600/20 rounded-xl group-hover:bg-primary-600/30 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary-400" />
                </div>
                
                {/* Content */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="inline-flex items-center px-3 py-1 bg-accent-300/20 rounded-full">
                    <span className="text-accent-300 text-sm font-medium">
                      {feature.highlight}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-white/60 mb-6">
            Ready to discover what makes you unique?
          </p>
          <div className="flex justify-center">
            <Card variant="glass" padding="small" className="inline-flex items-center space-x-3">
              <Badge size="small" />
              <span className="text-white font-medium">Start with a 3-minute personality assessment</span>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};