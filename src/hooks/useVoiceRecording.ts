import { useState, useRef, useCallback } from 'react';

export interface VoiceRecordingState {
  isRecording: boolean;
  isProcessing: boolean;
  transcript: string;
  error: string | null;
  audioLevel: number;
}

export interface UseVoiceRecordingReturn extends VoiceRecordingState {
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  clearTranscript: () => void;
  resetError: () => void;
}

export const useVoiceRecording = (): UseVoiceRecordingReturn => {
  const [state, setState] = useState<VoiceRecordingState>({
    isRecording: false,
    isProcessing: false,
    transcript: '',
    error: null,
    audioLevel: 0,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const updateAudioLevel = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    const normalizedLevel = Math.min(average / 128, 1);
    
    setState(prev => ({ ...prev, audioLevel: normalizedLevel }));
    
    if (state.isRecording) {
      animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
    }
  }, [state.isRecording]);

  const startRecording = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null, isProcessing: true }));

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });

      // Set up audio analysis for visual feedback
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      // Set up media recorder
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      const audioChunks: Blob[] = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        setState(prev => ({ ...prev, isProcessing: true }));
        
        try {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          
          // For now, we'll simulate speech-to-text processing
          // In a real implementation, you would send this to a speech-to-text service
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Simulate transcript result
          const mockTranscript = "I'm interested in improving my emotional intelligence and building better relationships.";
          
          setState(prev => ({ 
            ...prev, 
            transcript: mockTranscript,
            isProcessing: false,
            audioLevel: 0
          }));
        } catch (error) {
          setState(prev => ({ 
            ...prev, 
            error: 'Failed to process audio recording',
            isProcessing: false,
            audioLevel: 0
          }));
        }

        // Clean up
        stream.getTracks().forEach(track => track.stop());
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
      };

      // Start recording
      mediaRecorderRef.current.start();
      setState(prev => ({ 
        ...prev, 
        isRecording: true, 
        isProcessing: false,
        transcript: ''
      }));

      // Start audio level monitoring
      updateAudioLevel();

    } catch (error) {
      console.error('Error starting recording:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to access microphone. Please check permissions.',
        isProcessing: false
      }));
    }
  }, [updateAudioLevel]);

  const stopRecording = useCallback(async () => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
      setState(prev => ({ ...prev, isRecording: false }));
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }
  }, [state.isRecording]);

  const clearTranscript = useCallback(() => {
    setState(prev => ({ ...prev, transcript: '' }));
  }, []);

  const resetError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    startRecording,
    stopRecording,
    clearTranscript,
    resetError,
  };
};