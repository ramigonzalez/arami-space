import React from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ArrowRight, Sparkles, Clock, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CTA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <Card variant="glass" padding="large" className="text-center">
          <div className="space-y-8">
            {/* Badge */}
            <div className="flex justify-center">
              <Badge size="large" />
            </div>
            
            {/* Headline */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Discover Your Voice?
              </h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Join thousands of users who are building emotional intelligence and achieving their goals through personalized AI conversations.
              </p>
            </div>
            
            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center space-y-2">
                <Clock className="w-8 h-8 text-accent-300" />
                <h3 className="text-white font-semibold">3-Minute Setup</h3>
                <p className="text-white/70 text-sm text-center">
                  Quick personality assessment to get started
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Sparkles className="w-8 h-8 text-accent-300" />
                <h3 className="text-white font-semibold">Personalized Experience</h3>
                <p className="text-white/70 text-sm text-center">
                  AI adapts to your unique personality type
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Shield className="w-8 h-8 text-accent-300" />
                <h3 className="text-white font-semibold">Privacy First</h3>
                <p className="text-white/70 text-sm text-center">
                  Your conversations are encrypted and secure
                </p>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="large" 
                icon={ArrowRight} 
                iconPosition="right"
                className="w-full sm:w-auto"
                onClick={() => navigate('/auth')}
              >
                Start Free Trial
              </Button>
              <Button 
                variant="secondary" 
                size="large"
                className="w-full sm:w-auto"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="pt-6 border-t border-white/10">
              <p className="text-white/60 text-sm mb-4">
                ✓ 7-day free trial • ✓ No credit card required • ✓ Cancel anytime
              </p>
              <div className="flex justify-center items-center space-x-6 text-white/40 text-xs">
                <span>🔒 SOC 2 Compliant</span>
                <span>🛡️ GDPR Compliant</span>
                <span>⭐ 4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};