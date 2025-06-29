import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Play, Pause, Volume2 } from 'lucide-react';
import { VOICE_CONFIGS, VoiceId, voiceService } from '../../lib/elevenlabs';

interface VoiceSelectorProps {
  selectedVoice: VoiceId | null;
  onVoiceSelect: (voiceId: VoiceId) => void;
  className?: string;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoice,
  onVoiceSelect,
  className = '',
}) => {
  const [playingVoice, setPlayingVoice] = useState<VoiceId | null>(null);
  const [isLoading, setIsLoading] = useState<VoiceId | null>(null);

  const handlePreviewVoice = async (voiceId: VoiceId) => {
    if (playingVoice === voiceId) {
      // Stop current playback
      voiceService.stopAudio();
      setPlayingVoice(null);
      return;
    }

    try {
      setIsLoading(voiceId);
      setPlayingVoice(null);
      
      // Stop any currently playing audio
      voiceService.stopAudio();
      
      // Play the preview
      setPlayingVoice(voiceId);
      await voiceService.previewVoice(voiceId);
      setPlayingVoice(null);
    } catch (error) {
      console.error('Error playing voice preview:', error);
      setPlayingVoice(null);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">
          Choose Your AI Companion's Voice
        </h3>
        <p className="text-white/70">
          Select the voice that feels most comfortable for your journey
        </p>
      </div>

      <div className="grid gap-4">
        {Object.entries(VOICE_CONFIGS).map(([voiceId, config]) => {
          const isSelected = selectedVoice === voiceId;
          const isPlaying = playingVoice === voiceId;
          const isLoadingThis = isLoading === voiceId;
          
          return (
            <Card
              key={voiceId}
              variant="glass"
              className={`
                cursor-pointer transition-all duration-200 hover:bg-white/15
                ${isSelected ? 'border-primary-400 bg-primary-600/20' : 'border-white/20'}
              `}
              onClick={() => onVoiceSelect(voiceId as VoiceId)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`
                      w-3 h-3 rounded-full transition-colors
                      ${isSelected ? 'bg-primary-400' : 'bg-white/30'}
                    `} />
                    <h4 className="text-white font-semibold">{config.name}</h4>
                  </div>
                  <p className="text-white/70 text-sm mb-3">
                    {config.description}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="small"
                  icon={isLoadingThis ? undefined : isPlaying ? Pause : Play}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreviewVoice(voiceId as VoiceId);
                  }}
                  disabled={isLoadingThis}
                  className="ml-4"
                >
                  {isLoadingThis ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    'Stop'
                  ) : (
                    'Preview'
                  )}
                </Button>
              </div>

              {isSelected && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="flex items-center space-x-2 text-primary-400">
                    <Volume2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Selected Voice</span>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {!selectedVoice && (
        <div className="text-center mt-6">
          <p className="text-white/60 text-sm">
            Please select a voice to continue
          </p>
        </div>
      )}
    </div>
  );
};