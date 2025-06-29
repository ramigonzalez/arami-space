import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Manager',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'Arami helped me understand my DISC type and how it affects my leadership style. The daily voice sessions fit perfectly into my morning routine.',
    rating: 5,
    virtue: 'Clarity',
    streak: 28,
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Software Engineer',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'As an introvert, I love that I can work on my emotional intelligence through voice conversations. It feels more natural than typing.',
    rating: 5,
    virtue: 'Courage',
    streak: 45,
  },
  {
    name: 'Dr. Emily Watson',
    role: 'Clinical Psychologist',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'The personality-driven approach is brilliant. Arami adapts to each user\'s communication style, making emotional growth more accessible.',
    rating: 5,
    virtue: 'Compassion',
    streak: 67,
  },
  {
    name: 'James Park',
    role: 'Entrepreneur',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'The SMART goal feature transformed how I approach personal development. Breaking down big goals into daily rituals actually works.',
    rating: 5,
    virtue: 'Determination',
    streak: 34,
  },
  {
    name: 'Lisa Thompson',
    role: 'Marketing Director',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'I\'ve tried many wellness apps, but Arami is the first one that truly understands my personality. The insights are incredibly accurate.',
    rating: 5,
    virtue: 'Wisdom',
    streak: 52,
  },
  {
    name: 'David Kim',
    role: 'Teacher',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'The virtue collection system makes personal growth feel like a game. I look forward to my daily sessions and seeing what virtue I\'ll earn.',
    rating: 5,
    virtue: 'Patience',
    streak: 89,
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section className="px-4 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Loved by Thousands of Users
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            See how Arami is helping people discover their unique personalities and build emotional intelligence through personalized daily rituals.
          </p>
        </div>
        
        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              variant="glass" 
              className="group hover:bg-white/15 transition-all duration-300"
            >
              <div className="space-y-4">
                {/* Quote icon */}
                <Quote className="w-8 h-8 text-accent-300 opacity-60" />
                
                {/* Rating */}
                <div className="flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                {/* Content */}
                <p className="text-white/90 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                {/* User info */}
                <div className="flex items-center space-x-3 pt-4 border-t border-white/10">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-white/60 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                
                {/* Achievement badges */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <Badge size="small" variant="virtue" />
                    <span className="text-white/80 text-sm">{testimonial.virtue}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge size="small" variant="streak" count={testimonial.streak} />
                    <span className="text-white/80 text-sm">day streak</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Bottom stats */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold text-white mb-2">4.9★</div>
              <div className="text-white/60 text-sm">App Store Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">50K+</div>
              <div className="text-white/60 text-sm">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">1M+</div>
              <div className="text-white/60 text-sm">Sessions Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">85%</div>
              <div className="text-white/60 text-sm">Daily Retention</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};