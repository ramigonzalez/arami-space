import React from 'react';
import { Mic, MicOff, Square, Play } from 'lucide-react';
import { Button } from '../ui/Button';

interface VoiceControlsProps {
  isRecording: boolean;
  isProcessing: boolean;
  audioLevel: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  disabled?: boolean;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  isRecording,
  isProcessing,
  audioLevel,
  onStartRecording,
  onStopRecording,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Main voice button */}
      <div className="relative">
        {/* Audio level visualization */}
        {isRecording && (
          <div 
            className="absolute inset-0 rounded-full border-4 border-primary-400 animate-pulse"
            style={{
              transform: `scale(${1 + audioLevel * 0.3})`,
              opacity: 0.6 + audioLevel * 0.4,
            }}
          />
        )}
        
        <button
          onClick={isRecording ? onStopRecording : onStartRecording}
          disabled={disabled || isProcessing}
          className={`
            relative w-20 h-20 rounded-full flex items-center justify-center
            transition-all duration-200 transform active:scale-95
            ${isRecording 
              ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30' 
              : 'bg-primary-600 hover:bg-primary-500 shadow-lg shadow-primary-600/30'
            }
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          style={{
            boxShadow: isRecording 
              ? `0 0 ${20 + audioLevel * 20}px rgba(239, 68, 68, 0.4)`
              : '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
          }}
        >
          {isProcessing ? (
            <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
          ) : isRecording ? (
            <Square className="w-8 h-8 text-white fill-current" />
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </button>
      </div>

      {/* Status text */}
      <div className="text-center">
        {isProcessing ? (
          <p className="text-white/80 text-sm">Processing your voice...</p>
        ) : isRecording ? (
          <p className="text-white/80 text-sm animate-pulse">Listening... Tap to stop</p>
        ) : (
          <p className="text-white/80 text-sm">Tap to speak with Genesis</p>
        )}
      </div>

      {/* Audio level indicator */}
      {isRecording && (
        <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-400 transition-all duration-100 rounded-full"
            style={{ width: `${audioLevel * 100}%` }}
          />
        </div>
      )}
    </div>
  );
};