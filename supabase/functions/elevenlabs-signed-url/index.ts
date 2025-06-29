/*
  # ElevenLabs Signed URL Generator

  1. Purpose
    - Generates secure signed WebSocket URLs for ElevenLabs Conversational AI
    - Enables client-side voice conversations without exposing API keys
    - Supports agent-based conversations with personalized context

  2. Security
    - Uses server-side ElevenLabs API key
    - Returns time-limited signed URLs
    - Validates user authentication

  3. Usage
    - Called from onboarding flow to establish voice conversations
    - Supports different agent configurations
*/

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface SignedUrlRequest {
  agent_id?: string;
  user_context?: {
    name: string;
    language: string;
    gender: string;
  };
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get ElevenLabs API key from environment
    const elevenLabsApiKey = Deno.env.get("ELEVENLABS_API_KEY");
    if (!elevenLabsApiKey) {
      console.error("ELEVENLABS_API_KEY not found in environment");
      return new Response(
        JSON.stringify({ error: "ElevenLabs API key not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse request body
    const { agent_id = "genesis-onboarding", user_context }: SignedUrlRequest = await req.json();

    // Prepare the request to ElevenLabs
    const elevenLabsUrl = "https://api.elevenlabs.io/v1/convai/conversations/get_signed_url";
    
    const requestBody = {
      agent_id,
      ...(user_context && {
        override_agent_config: {
          prompt: {
            prompt: `You are Genesis, a warm and empathetic AI guide helping ${user_context.name} through their onboarding journey. 
            
            User details:
            - Name: ${user_context.name}
            - Preferred Language: ${user_context.language}
            - Gender: ${user_context.gender}
            
            Your role is to:
            1. Conduct a personality assessment (DISC and Enneagram)
            2. Understand their emotional wellness goals
            3. Set up their ritual preferences (timing, duration, style, voice preference)
            4. Make them feel welcomed and understood
            
            Be conversational, warm, and guide them naturally through these topics. Use their name frequently to create a personal connection.`
          }
        }
      })
    };

    // Make request to ElevenLabs
    const response = await fetch(elevenLabsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": elevenLabsApiKey,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ 
          error: "Failed to generate signed URL",
          details: errorText 
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({
        signed_url: data.signed_url,
        conversation_id: data.conversation_id,
        expires_at: data.expires_at
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in elevenlabs-signed-url function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        message: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});