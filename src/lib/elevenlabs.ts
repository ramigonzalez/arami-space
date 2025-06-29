// Voice configuration mapping
export const VOICE_CONFIGS = {
  confident_coach: {
    id: 'pNInz6obpgDQGcFmaJgB', // Adam - confident, clear
    name: 'Confident Coach',
    description: 'Clear, authoritative, and motivating',
    preview_text: 'Hello! I\'m here to guide you through your emotional intelligence journey with confidence and clarity.'
  },
  warm_friend: {
    id: 'EXAVITQu4vr4xnSDxMaL', // Bella - warm, friendly
    name: 'Warm Friend',
    description: 'Friendly, supportive, and approachable',
    preview_text: 'Hi there! I\'m excited to be your companion on this journey of self-discovery and growth.'
  },
  gentle_guide: {
    id: 'ThT5KcBeYPX3keUQqHPh', // Dorothy - gentle, nurturing
    name: 'Gentle Guide',
    description: 'Soft, nurturing, and understanding',
    preview_text: 'Welcome, dear friend. I\'m here to gently support you as we explore your inner world together.'
  },
  wise_mentor: {
    id: 'onwK4e9ZLuTAKqWW03F9', // Daniel - wise, mature
    name: 'Wise Mentor',
    description: 'Thoughtful, experienced, and insightful',
    preview_text: 'Greetings. I bring years of wisdom to help you understand yourself more deeply and grow with intention.'
  }
} as const;

export type VoiceId = keyof typeof VOICE_CONFIGS;

export interface VoiceGenerationOptions {
  text: string;
  voiceId: VoiceId;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  useSpeakerBoost?: boolean;
}

interface TTSResponse {
  success: boolean;
  audio_base64?: string;
  error?: string;
}

export class VoiceService {
  private static instance: VoiceService;
  private audioContext: AudioContext | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private supabaseUrl: string;
  private supabaseAnonKey: string;

  static getInstance(): VoiceService {
    if (!VoiceService.instance) {
      VoiceService.instance = new VoiceService();
    }
    return VoiceService.instance;
  }

  private constructor() {
    // Get Supabase configuration
    this.supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    this.supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      console.error('Supabase configuration missing. Voice features will be disabled.');
    }

    // Initialize audio context on first user interaction
    this.initializeAudioContext();
  }

  private initializeAudioContext() {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      this.audioContext = new AudioContext();
    }
  }

  async generateSpeech(options: VoiceGenerationOptions): Promise<ArrayBuffer | null> {
    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      console.warn('Supabase not configured. Voice features disabled.');
      return null;
    }

    try {
      const voiceConfig = VOICE_CONFIGS[options.voiceId];
      
      // Call Supabase Edge Function instead of ElevenLabs directly
      const response = await fetch(`${this.supabaseUrl}/functions/v1/elevenlabs-tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.supabaseAnonKey}`,
        },
        body: JSON.stringify({
          text: options.text,
          voice_id: voiceConfig.id,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: options.stability ?? 0.5,
            similarity_boost: options.similarityBoost ?? 0.8,
            style: options.style ?? 0.0,
            use_speaker_boost: options.useSpeakerBoost ?? true,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('TTS API error:', response.status, errorData);
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result: TTSResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'TTS generation failed');
      }

      if (!result.audio_base64) {
        throw new Error('No audio data received');
      }

      // Convert base64 back to ArrayBuffer
      const binaryString = atob(result.audio_base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      return bytes.buffer;
    } catch (error) {
      console.error('Error generating speech:', error);
      return null;
    }
  }

  async playAudio(audioBuffer: ArrayBuffer): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Stop any currently playing audio
        this.stopAudio();

        // Create blob and object URL
        const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(blob);

        // Create and configure audio element
        this.currentAudio = new Audio(audioUrl);
        this.currentAudio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          this.currentAudio = null;
          resolve();
        };
        this.currentAudio.onerror = (error) => {
          URL.revokeObjectURL(audioUrl);
          this.currentAudio = null;
          reject(error);
        };

        // Play audio
        this.currentAudio.play().catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  stopAudio(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  isPlaying(): boolean {
    return this.currentAudio !== null && !this.currentAudio.paused;
  }

  async generateAndPlay(options: VoiceGenerationOptions): Promise<void> {
    const audioBuffer = await this.generateSpeech(options);
    if (audioBuffer) {
      await this.playAudio(audioBuffer);
    }
  }

  async previewVoice(voiceId: VoiceId): Promise<void> {
    const voiceConfig = VOICE_CONFIGS[voiceId];
    await this.generateAndPlay({
      text: voiceConfig.preview_text,
      voiceId,
    });
  }
}

export const voiceService = VoiceService.getInstance();