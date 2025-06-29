import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'elevated';
  padding?: 'none' | 'small' | 'medium' | 'large';
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  className = '',
  onClick,
}) => {
  const baseClasses = 'rounded-2xl transition-all duration-200';
  
  const variantClasses = {
    default: 'bg-white shadow-lg',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20',
    elevated: 'bg-white shadow-arami-glow hover:shadow-xl transform hover:scale-[1.02]',
  };
  
  const paddingClasses = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
  };
  
  const interactiveClasses = onClick ? 'cursor-pointer hover:shadow-xl transform hover:scale-[1.02]' : '';
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${interactiveClasses} ${className}`;
  
  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};