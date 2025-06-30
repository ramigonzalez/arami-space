import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  Users, 
  MoreHorizontal,
  ArrowLeft,
  Volume2,
  RotateCcw
} from 'lucide-react';

interface VideoCallUIProps {
  conversationUrl: string;
  personaName: string;
  userAvatar?: string;
  userName: string;
  onEndCall: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export const VideoCallUI: React.FC<VideoCallUIProps> = ({
  conversationUrl,
  personaName,
  userAvatar,
  userName,
  onEndCall,
  onBack,
  isLoading = false,
}) => {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallActive, setIsCallActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isCallActive]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    onEndCall();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-900 via-primary-800 to-primary-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4 pt-12">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-4">
          {isCallActive && (
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">{formatDuration(callDuration)}</span>
            </div>
          )}
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <RotateCcw className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="relative z-10 text-center px-4 mb-8">
        <h1 className="text-2xl font-bold mb-2">Face-to-Face with {personaName}</h1>
        <p className="text-white/70 text-sm">AI-powered mentoring session</p>
      </div>

      {/* Video Container */}
      <div className="relative z-10 flex-1 px-4 mb-8">
        <div className="relative w-full max-w-4xl mx-auto bg-black/20 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10">
          {/* Video Stream Area */}
          <div className="aspect-video relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4 mx-auto"></div>
                  <p className="text-white/70">Connecting to {personaName}...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Tavus Video Embed */}
                <iframe
                  src={conversationUrl}
                  className="w-full h-full"
                  allow="camera; microphone; fullscreen"
                  onLoad={() => setIsCallActive(true)}
                />
                
                {/* AI Avatar Placeholder (if iframe doesn't load) */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-600/20 to-primary-800/20">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <span className="text-4xl font-bold">AI</span>
                    </div>
                    <p className="text-lg font-medium">{personaName}</p>
                    <p className="text-white/70 text-sm">AI Mentor</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Avatar (Picture-in-Picture) */}
          <div className="absolute bottom-4 right-4 w-24 h-24 bg-surface-800 rounded-xl overflow-hidden border-2 border-white/20">
            {userAvatar ? (
              <img 
                src={userAvatar} 
                alt={userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {!isVideoEnabled && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <VideoOff className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Call Controls */}
      <div className="relative z-10 pb-8 px-4">
        <div className="flex items-center justify-center gap-4">
          {/* Camera Toggle */}
          <button
            onClick={() => setIsVideoEnabled(!isVideoEnabled)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isVideoEnabled 
                ? 'bg-white/10 hover:bg-white/20' 
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {isVideoEnabled ? (
              <Video className="w-6 h-6" />
            ) : (
              <VideoOff className="w-6 h-6" />
            )}
          </button>

          {/* Microphone Toggle */}
          <button
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isAudioEnabled 
                ? 'bg-white/10 hover:bg-white/20' 
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {isAudioEnabled ? (
              <Mic className="w-6 h-6" />
            ) : (
              <MicOff className="w-6 h-6" />
            )}
          </button>

          {/* End Call */}
          <button
            onClick={handleEndCall}
            className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all transform hover:scale-105"
          >
            <Phone className="w-7 h-7 rotate-[135deg]" />
          </button>

          {/* Participants */}
          <button className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
            <Users className="w-6 h-6" />
          </button>

          {/* More Options */}
          <button className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
            <MoreHorizontal className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Status Indicator */}
      {isCallActive && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-100">Session Active</span>
          </div>
        </div>
      )}
    </div>
  );
};