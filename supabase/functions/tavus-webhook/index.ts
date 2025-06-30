import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface TavusTranscriptMessage {
  role: string;
  content: string;
}

interface TavusTranscriptionPayload {
  properties: {
    replica_id: string;
    transcript: TavusTranscriptMessage[];
  };
  conversation_id: string;
  webhook_url: string;
  event_type: 'application.transcription_ready';
  message_type: 'application';
  timestamp: string;
}

interface TavusPerceptionPayload {
  properties: {
    analysis: string;
  };
  conversation_id: string;
  webhook_url: string;
  event_type: 'application.perception_analysis';
  message_type: 'application';
  timestamp: string;
}

type TavusWebhookPayload = TavusTranscriptionPayload | TavusPerceptionPayload;

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

    // Only process specific event types
    if (!['application.transcription_ready', 'application.perception_analysis'].includes(payload.event_type)) {
      console.log('Ignoring unhandled event type:', payload.event_type);
      return new Response(
        JSON.stringify({ success: true, message: 'Event type ignored' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
      .select('id, session_metadata')
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
    if (payload.event_type === 'application.transcription_ready') {
      if (payload.properties.transcript && dailySession) {
        // Convert transcript array to a formatted string
        const transcriptText = payload.properties.transcript
          .map(msg => `${msg.role}: ${msg.content}`)
          .join('\n\n');

        // Update daily session with transcript
        const { error: updateError } = await supabaseClient
          .from('daily_sessions')
          .update({
            conversation_transcript: transcriptText,
            session_metadata: {
              ...(dailySession.session_metadata || {}),
              replica_id: payload.properties.replica_id,
              transcript_timestamp: payload.timestamp,
            },
          })
          .eq('id', dailySession.id);

        if (updateError) {
          console.error('Failed to update daily session with transcript:', updateError);
        } else {
          console.log('Successfully updated daily session with transcript');
        }
      }
    } else if (payload.event_type === 'application.perception_analysis') {
      if (payload.properties.analysis && dailySession) {
        // Update daily session with perception analysis
        const { error: updateError } = await supabaseClient
          .from('daily_sessions')
          .update({
            session_metadata: {
              ...(dailySession.session_metadata || {}),
              perception_analysis: payload.properties.analysis,
              analysis_timestamp: payload.timestamp,
            },
          })
          .eq('id', dailySession.id);

        if (updateError) {
          console.error('Failed to update daily session with perception analysis:', updateError);
        } else {
          console.log('Successfully updated daily session with perception analysis');
        }
      }
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