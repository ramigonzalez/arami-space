import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"
import { ElevenLabsClient } from 'npm:elevenlabs'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  console.log('Function invoked with request:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  })

  const agentId = Deno.env.get('ELEVENLABS_AGENT_ID')
  if (!agentId) {
    return new Response(JSON.stringify({ error: 'ELEVENLABS_AGENT_ID is not set' }), { status: 500, headers: corsHeaders })
  }
  console.log('Agent', agentId);
  try {
    const client = new ElevenLabsClient({ apiKey: Deno.env.get('ELEVENLABS_API_KEY') })
    console.log('Client passed', agentId);
    const response = await client.conversationalAi.getSignedUrl({ agent_id: agentId })
    return new Response(JSON.stringify({ signed_url: response.signed_url }), { status: 200, headers: corsHeaders })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders })
  }
})