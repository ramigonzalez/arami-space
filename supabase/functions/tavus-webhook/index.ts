import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface TavusWebhookPayload {
  conversation_id: string;
  event_type: string;
  transcript?: string;
  recording_url?: string;
  duration?: number;
  participant_count?: number;
  metadata?: any;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const payload: TavusWebhookPayload = await req.json();
    
    console.log('Received Tavus webhook:', JSON.stringify(payload, null, 2));

    if (!payload.conversation_id) {
      return new Response(
        JSON.stringify({ error: 'Missing conversation_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find the mentor conversation
    const { data: mentorConversation, error: findError } = await supabaseClient
      .from('mentor_conversations')
      .select('id, user_id')
      .eq('tavus_conversation_id', payload.conversation_id)
      .single();

    if (findError || !mentorConversation) {
      console.error('Mentor conversation not found:', findError);
      return new Response(
        JSON.stringify({ error: 'Conversation not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find the corresponding daily session
    const { data: dailySession, error: sessionFindError } = await supabaseClient
      .from('daily_sessions')
      .select('id')
      .eq('user_id', mentorConversation.user_id)
      .eq('session_type', 'face_to_face')
      .eq('session_status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (sessionFindError || !dailySession) {
      console.error('Daily session not found:', sessionFindError);
      // Continue processing even if daily session is not found
    }

    // Process different event types
    switch (payload.event_type) {
      case 'conversation_ended':
      case 'transcript_ready':
        if (payload.transcript && dailySession) {
          // Update daily session with transcript
          const { error: updateError } = await supabaseClient
            .from('daily_sessions')
            .update({
              conversation_transcript: payload.transcript,
              session_metadata: {
                recording_url: payload.recording_url,
                participant_count: payload.participant_count,
                tavus_metadata: payload.metadata,
              },
            })
            .eq('id', dailySession.id);

          if (updateError) {
            console.error('Failed to update daily session:', updateError);
          }
        }
        break;

      case 'conversation_started':
        // Update mentor conversation status if needed
        const { error: statusError } = await supabaseClient
          .from('mentor_conversations')
          .update({ status: 'active' })
          .eq('id', mentorConversation.id);

        if (statusError) {
          console.error('Failed to update conversation status:', statusError);
        }
        break;

      default:
        console.log('Unhandled event type:', payload.event_type);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Webhook processed successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing Tavus webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});