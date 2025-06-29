/*
  # ElevenLabs Text-to-Speech Edge Function

  1. Purpose
    - Secure proxy for ElevenLabs Text-to-Speech API
    - Handle API key securely on server side
    - Convert text to speech using specified voice configurations

  2. Security
    - API key stored as Supabase Edge Function secret
    - CORS handling for frontend requests
    - Input validation and error handling

  3. Features
    - Support for multiple voice configurations
    - Customizable voice settings (stability, similarity boost, etc.)
    - Returns base64 encoded audio data
*/

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface TTSRequest {
  text: string;
  voice_id: string;
  model_id?: string;
  voice_settings?: {
    stability?: number;
    similarity_boost?: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
}

interface TTSResponse {
  success: boolean;
  audio_base64?: string;
  error?: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, error: 'Method not allowed' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get ElevenLabs API key from environment
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    if (!ELEVENLABS_API_KEY) {
      console.error('ElevenLabs API key not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'ElevenLabs service not configured' }),
        {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { text, voice_id, model_id = 'eleven_multilingual_v2', voice_settings }: TTSRequest = await req.json();

    // Validate required fields
    if (!text || !voice_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Text and voice_id are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate text length (ElevenLabs has limits)
    if (text.length > 5000) {
      return new Response(
        JSON.stringify({ success: false, error: 'Text too long. Maximum 5000 characters allowed.' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Prepare request to ElevenLabs API
    const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`;
    
    const requestBody = {
      text,
      model_id,
      voice_settings: {
        stability: voice_settings?.stability ?? 0.5,
        similarity_boost: voice_settings?.similarity_boost ?? 0.8,
        style: voice_settings?.style ?? 0.0,
        use_speaker_boost: voice_settings?.use_speaker_boost ?? true,
      },
    };

    console.log('Making request to ElevenLabs:', { voice_id, text_length: text.length, model_id });

    // Make request to ElevenLabs API
    const response = await fetch(elevenLabsUrl, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', response.status, errorText);
      
      let errorMessage = 'Failed to generate speech';
      if (response.status === 401) {
        errorMessage = 'Invalid API key';
      } else if (response.status === 422) {
        errorMessage = 'Invalid voice ID or request parameters';
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again later.';
      }

      return new Response(
        JSON.stringify({ success: false, error: errorMessage }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get audio data as array buffer
    const audioBuffer = await response.arrayBuffer();
    
    // Convert to base64 for JSON response
    const audioBase64 = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

    console.log('Successfully generated speech:', { 
      voice_id, 
      audio_size: audioBuffer.byteLength,
      base64_length: audioBase64.length 
    });

    const result: TTSResponse = {
      success: true,
      audio_base64: audioBase64,
    };

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error. Please try again later.' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});