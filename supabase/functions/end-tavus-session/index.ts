import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface EndSessionRequest {
  tavus_conversation_id: string;
  mentor_conversation_id: string;
  daily_session_id: string;
  user_id: string;
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

    const { 
      tavus_conversation_id, 
      mentor_conversation_id, 
      daily_session_id, 
      user_id 
    }: EndSessionRequest = await req.json();

    if (!tavus_conversation_id || !mentor_conversation_id || !daily_session_id || !user_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // End conversation with Tavus
    const tavusResponse = await fetch(`https://tavusapi.com/v2/conversations/${tavus_conversation_id}/end`, {
      method: 'POST',
      headers: {
        'x-api-key': `Bearer ${Deno.env.get('TAVUS_API_KEY')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!tavusResponse.ok) {
      console.error('Tavus API error:', await tavusResponse.text());
      // Continue with database updates even if Tavus call fails
    }

    const endTime = new Date().toISOString();

    // Get the mentor conversation to calculate duration
    const { data: mentorConversation } = await supabaseClient
      .from('mentor_conversations')
      .select('start_time')
      .eq('id', mentor_conversation_id)
      .eq('user_id', user_id)
      .single();

    let durationSeconds = 0;
    if (mentorConversation?.start_time) {
      const startTime = new Date(mentorConversation.start_time);
      const endTimeDate = new Date(endTime);
      durationSeconds = Math.floor((endTimeDate.getTime() - startTime.getTime()) / 1000);
    }

    // Update mentor conversation
    const { error: conversationError } = await supabaseClient
      .from('mentor_conversations')
      .update({
        end_time: endTime,
        duration_seconds: durationSeconds,
        status: 'completed',
      })
      .eq('id', mentor_conversation_id)
      .eq('user_id', user_id);

    if (conversationError) {
      throw new Error(`Failed to update mentor conversation: ${conversationError.message}`);
    }

    // Update daily session
    const { error: sessionError } = await supabaseClient
      .from('daily_sessions')
      .update({
        completed_at: endTime,
        duration_seconds: durationSeconds,
        session_status: 'completed',
      })
      .eq('id', daily_session_id)
      .eq('user_id', user_id);

    if (sessionError) {
      throw new Error(`Failed to update daily session: ${sessionError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        duration_seconds: durationSeconds,
        message: 'Session ended successfully',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error ending Tavus session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});