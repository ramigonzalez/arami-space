import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  User, 
  Target, 
  MessageCircle, 
  Award, 
  Settings,
  Calendar,
  BarChart3
} from 'lucide-react';

interface NavigationProps {
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/sessions', icon: MessageCircle, label: 'Sessions' },
    { to: '/goals', icon: Target, label: 'Goals' },
    { to: '/virtues', icon: Award, label: 'Virtues' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className={`bg-white/5 backdrop-blur-md border-t border-white/10 ${className}`}>
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around py-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-[60px] ${
                  isActive
                    ? 'text-primary-400 bg-primary-400/10'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};