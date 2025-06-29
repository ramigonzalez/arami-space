import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepLabels = [],
  className = '',
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Progress bar */}
      <div className="relative">
        <div className="w-full bg-white/10 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary-600 to-accent-300 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Step indicators */}
        <div className="flex justify-between mt-3">
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            
            return (
              <div key={stepNumber} className="flex flex-col items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                  transition-all duration-300
                  ${isCompleted 
                    ? 'bg-primary-600 text-white' 
                    : isCurrent 
                      ? 'bg-accent-300 text-white' 
                      : 'bg-white/20 text-white/60'
                  }
                `}>
                  {isCompleted ? '✓' : stepNumber}
                </div>
                
                {stepLabels[index] && (
                  <span className={`
                    mt-2 text-xs text-center max-w-16
                    ${isCurrent ? 'text-white' : 'text-white/60'}
                  `}>
                    {stepLabels[index]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress text */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-white/80">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-white/60">
          {Math.round(progress)}% complete
        </span>
      </div>
    </div>
  );
};