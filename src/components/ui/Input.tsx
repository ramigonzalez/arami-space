import React, { useState } from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface InputProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'password';
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  success?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  className?: string;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  success,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  required = false,
}) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setHasValue(!!newValue);
    onChange?.(newValue);
  };

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  const inputClasses = `
    w-full px-4 py-3 text-lg bg-white/10 border border-white/20 rounded-xl 
    text-white placeholder-white/60 transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent
    disabled:opacity-50 disabled:cursor-not-allowed
    ${error ? 'border-red-400 focus:ring-red-400' : ''}
    ${success ? 'border-green-400 focus:ring-green-400' : ''}
    ${Icon && iconPosition === 'left' ? 'pl-12' : ''}
    ${Icon && iconPosition === 'right' ? 'pr-12' : ''}
    ${className}
  `;

  const labelClasses = `
    absolute left-4 transition-all duration-200 pointer-events-none
    ${focused || hasValue 
      ? 'top-2 text-xs text-white/80 transform -translate-y-1' 
      : 'top-1/2 text-base text-white/60 transform -translate-y-1/2'
    }
    ${Icon && iconPosition === 'left' ? 'left-12' : ''}
  `;

  return (
    <div className="relative">
      {label && !placeholder && (
        <label className={labelClasses}>
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
        )}
        
        <input
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder || (label && focused ? '' : label)}
          disabled={disabled}
          required={required}
          className={inputClasses}
        />
        
        {Icon && iconPosition === 'right' && (
          <Icon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-400 animate-fade-in">
          {error}
        </p>
      )}
      
      {success && !error && (
        <p className="mt-2 text-sm text-green-400 animate-fade-in">
          ✓ Looks good!
        </p>
      )}
    </div>
  );
};