import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface StartSessionRequest {
  user_id: string;
  persona_id: string;
}

interface TavusConversationRequest {
  replica_id: string;
  persona_id: string;
  callback_url: string;
  conversation_name: string;
  conversational_context: string;
  properties: {
    max_call_duration: number;
    participant_left_timeout: number;
    participant_absent_timeout: number;
    enable_closed_captions: boolean;
    apply_greenscreen: boolean;
    language: string;
  };
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

    const { user_id }: StartSessionRequest = await req.json();

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'Missing user_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user profile data
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user_id)
      .single();

    if (profileError) {
      throw new Error(`Failed to fetch profile: ${profileError.message}`);
    }

    // Get onboarding profile data
    const { data: onboardingProfile } = await supabaseClient
      .from('onboarding_profiles')
      .select('*')
      .eq('user_id', user_id)
      .single();

    // Get ritual preferences
    const { data: ritualPreferences } = await supabaseClient
      .from('ritual_preferences')
      .select('*')
      .eq('user_id', user_id)
      .single();

    // Get emotional categories
    const { data: emotionalCategories } = await supabaseClient
      .from('user_emotional_categories')
      .select('*')
      .eq('user_id', user_id);

    // Get user goals
    const { data: userGoals } = await supabaseClient
      .from('user_goals')
      .select('*')
      .eq('user_id', user_id)
      .eq('status', 'active');

    // Build conversational context
    const contextParts = [
      `User Profile: ${profile.full_name}, Language: ${profile.language}`,
    ];

    if (onboardingProfile) {
      contextParts.push(
        `Personality: DISC Type ${onboardingProfile.disc_type}`,
        onboardingProfile.enneagram_type ? `Enneagram Type ${onboardingProfile.enneagram_type}` : '',
        onboardingProfile.confidence_score ? `Confidence Score: ${Math.round(onboardingProfile.confidence_score * 100)}%` : ''
      );
    }

    if (ritualPreferences) {
      contextParts.push(
        `Preferences: ${ritualPreferences.timing} timing, ${ritualPreferences.duration} duration, ${ritualPreferences.style} style`,
        `Focus Area: ${ritualPreferences.focus_area}`
      );
    }

    if (emotionalCategories && emotionalCategories.length > 0) {
      const categories = emotionalCategories.map(cat => cat.category).join(', ');
      contextParts.push(`Emotional Focus Areas: ${categories}`);
    }

    if (userGoals && userGoals.length > 0) {
      const goals = userGoals.map(goal => goal.goal_text).join('; ');
      contextParts.push(`Active Goals: ${goals}`);
    }

    const conversationalContext = contextParts.filter(Boolean).join('. ');

    // Map language codes to full language names for Tavus API
    const languageMap: { [key: string]: string } = {
      'en': 'english',
      'es': 'spanish',
      'pt': 'portuguese',
      'fr': 'french'
    };

    const tavusLanguage = languageMap[profile.language] || 'english';

    const PERSONA_ID = 'p1c81be642e7'; // HARDCODED: Growth Mentor with Tools
    const REPLICA_ID = 'r6ca16dbe104'; // HARDCODED: Mary

    // Prepare Tavus API request
    const tavusRequest: TavusConversationRequest = {
      persona_id: PERSONA_ID,
      replica_id: REPLICA_ID,
      callback_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/tavus-webhook`,
      conversation_name: `Face-to-Face Session - ${profile.full_name}`,
      conversational_context: conversationalContext,
      properties: {
        max_call_duration: 180, // 180 seconds = 3 minutes
        participant_left_timeout: 60, // 60 seconds = 1 minute
        participant_absent_timeout: 300, // 300 seconds = 5 minutes
        enable_closed_captions: true,
        apply_greenscreen: false,
        language: tavusLanguage
      }
    };

    // Call Tavus API to create conversation
    const tavusResponse = await fetch('https://tavusapi.com/v2/conversations', {
      method: 'POST',
      headers: {
        'x-api-key': Deno.env.get('TAVUS_API_KEY') ?? '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tavusRequest),
    });

    if (!tavusResponse.ok) {
      const errorText = await tavusResponse.text();
      throw new Error(`Tavus API error: ${tavusResponse.status} - ${errorText}`);
    }

    const tavusData = await tavusResponse.json();

    // Create mentor conversation record
    const { data: mentorConversation, error: conversationError } = await supabaseClient
      .from('mentor_conversations')
      .insert({
        user_id,
        tavus_conversation_id: tavusData.conversation_id,
        replica_id: REPLICA_ID,
        persona_id: PERSONA_ID,
        session_type: 'extended',
        status: 'active',
        start_time: new Date().toISOString(),
      })
      .select()
      .single();

    if (conversationError) {
      throw new Error(`Failed to create mentor conversation: ${conversationError.message}`);
    }

    // Create daily session record
    const { data: dailySession, error: sessionError } = await supabaseClient
      .from('daily_sessions')
      .insert({
        user_id,
        session_type: 'face_to_face',
        session_status: 'started',
        started_at: new Date().toISOString(),
        session_date: new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (sessionError) {
      throw new Error(`Failed to create daily session: ${sessionError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        conversation_url: tavusData.conversation_url,
        conversation_id: tavusData.conversation_id,
        mentor_conversation_id: mentorConversation.id,
        daily_session_id: dailySession.id,
        persona_name: 'Growth Mentor with Tools',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error starting Tavus session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});