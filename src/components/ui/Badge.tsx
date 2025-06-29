import React from 'react';
import { Flame } from 'lucide-react';

interface BadgeProps {
  variant?: 'default' | 'virtue' | 'streak';
  size?: 'small' | 'medium' | 'large';
  children?: React.ReactNode;
  count?: number;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'medium',
  children,
  count,
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200';
  
  const variantClasses = {
    default: 'bg-badge-gradient text-white shadow-badge-rim',
    virtue: 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg',
    streak: 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg',
  };
  
  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-12 h-12 text-sm',
    large: 'w-16 h-16 text-base',
  };
  
  const iconSizeClasses = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-6 h-6',
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  if (variant === 'default' && !children) {
    return (
      <div className={classes}>
        <Flame className={`${iconSizeClasses[size]} text-accent-300`} />
      </div>
    );
  }
  
  return (
    <div className={classes}>
      {count !== undefined ? count : children}
    </div>
  );
};