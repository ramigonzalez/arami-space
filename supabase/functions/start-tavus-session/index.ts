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
  const startTime = Date.now();
  const requestId = crypto.randomUUID().split('-')[0]; // Short request ID for tracking
  
  console.log(`🚀 [${requestId}] start-tavus-session function called`);
  console.log(`📊 [${requestId}] Request details:`, {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries()),
    timestamp: new Date().toISOString()
  });
  
  if (req.method === 'OPTIONS') {
    console.log(`✅ [${requestId}] OPTIONS request handled`);
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log(`🔍 [${requestId}] Starting request processing...`);
    
    // Environment validation with detailed logging
    const envCheck = {
      SUPABASE_URL: !!Deno.env.get('SUPABASE_URL'),
      SUPABASE_SERVICE_ROLE_KEY: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
      TAVUS_API_KEY: !!Deno.env.get('TAVUS_API_KEY')
    };
    console.log(`📋 [${requestId}] Environment check:`, envCheck);

    if (!Deno.env.get('TAVUS_API_KEY')) {
      console.error(`❌ [${requestId}] TAVUS_API_KEY environment variable is missing`);
      return new Response(
        JSON.stringify({ error: 'TAVUS_API_KEY not configured. Please set environment variable.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    console.log(`🔧 [${requestId}] Initializing Supabase client...`);
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    console.log(`✅ [${requestId}] Supabase client initialized`);

    // Parse request body
    console.log(`📝 [${requestId}] Parsing request body...`);
    const requestBody = await req.json();
    console.log(`📝 [${requestId}] Raw request body:`, requestBody);
    
    const { user_id }: StartSessionRequest = requestBody;
    console.log(`📝 [${requestId}] Extracted user_id: "${user_id}"`);

    if (!user_id) {
      console.error(`❌ [${requestId}] Missing user_id in request`);
      return new Response(
        JSON.stringify({ error: 'Missing user_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user profile data
    console.log(`👤 [${requestId}] Fetching user profile for user_id: ${user_id}...`);
    const profileStart = Date.now();
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user_id)
      .single();
    
    console.log(`👤 [${requestId}] Profile query completed in ${Date.now() - profileStart}ms`);
    
    if (profileError) {
      console.error(`❌ [${requestId}] Profile fetch error:`, profileError);
      throw new Error(`Failed to fetch profile: ${profileError.message}`);
    }
    
    console.log(`👤 [${requestId}] Profile data retrieved:`, {
      id: profile.id,
      full_name: profile.full_name,
      language: profile.language,
      created_at: profile.created_at
    });

    // Get onboarding profile data
    console.log(`🎯 [${requestId}] Fetching onboarding profile...`);
    const onboardingStart = Date.now();
    const { data: onboardingProfile, error: onboardingError } = await supabaseClient
      .from('onboarding_profiles')
      .select('*')
      .eq('user_id', user_id)
      .single();
    
    console.log(`🎯 [${requestId}] Onboarding query completed in ${Date.now() - onboardingStart}ms`);
    
    if (onboardingError) {
      console.log(`⚠️ [${requestId}] Onboarding profile not found (this is optional):`, onboardingError.message);
    } else {
      console.log(`🎯 [${requestId}] Onboarding profile data:`, {
        disc_type: onboardingProfile?.disc_type,
        enneagram_type: onboardingProfile?.enneagram_type,
        confidence_score: onboardingProfile?.confidence_score
      });
    }

    // Get ritual preferences
    console.log(`🧘 [${requestId}] Fetching ritual preferences...`);
    const ritualStart = Date.now();
    const { data: ritualPreferences, error: ritualError } = await supabaseClient
      .from('ritual_preferences')
      .select('*')
      .eq('user_id', user_id)
      .single();
    
    console.log(`🧘 [${requestId}] Ritual preferences query completed in ${Date.now() - ritualStart}ms`);
    
    if (ritualError) {
      console.log(`⚠️ [${requestId}] Ritual preferences not found (this is optional):`, ritualError.message);
    } else {
      console.log(`🧘 [${requestId}] Ritual preferences data:`, {
        timing: ritualPreferences?.timing,
        duration: ritualPreferences?.duration,
        style: ritualPreferences?.style,
        focus_area: ritualPreferences?.focus_area
      });
    }

    // Get emotional categories
    console.log(`😊 [${requestId}] Fetching emotional categories...`);
    const emotionalStart = Date.now();
    const { data: emotionalCategories, error: emotionalError } = await supabaseClient
      .from('user_emotional_categories')
      .select('*')
      .eq('user_id', user_id);
    
    console.log(`😊 [${requestId}] Emotional categories query completed in ${Date.now() - emotionalStart}ms`);
    
    if (emotionalError) {
      console.log(`⚠️ [${requestId}] Emotional categories error:`, emotionalError.message);
    } else {
      console.log(`😊 [${requestId}] Emotional categories count: ${emotionalCategories?.length || 0}`);
      console.log(`😊 [${requestId}] Emotional categories:`, emotionalCategories?.map(cat => cat.category));
    }

    // Get user goals
    console.log(`🎯 [${requestId}] Fetching user goals...`);
    const goalsStart = Date.now();
    const { data: userGoals, error: goalsError } = await supabaseClient
      .from('user_goals')
      .select('*')
      .eq('user_id', user_id)
      .eq('status', 'active');
    
    console.log(`🎯 [${requestId}] User goals query completed in ${Date.now() - goalsStart}ms`);
    
    if (goalsError) {
      console.log(`⚠️ [${requestId}] User goals error:`, goalsError.message);
    } else {
      console.log(`🎯 [${requestId}] Active goals count: ${userGoals?.length || 0}`);
      console.log(`🎯 [${requestId}] Goals:`, userGoals?.map(goal => goal.goal_text));
    }

    // Build conversational context
    console.log(`📝 [${requestId}] Building conversational context...`);
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

    const conversationalContext = contextParts.join('\n');
    console.log(`📝 [${requestId}] Conversational context built:`, { conversationalContext });

    // Map language codes to full language names for Tavus API
    console.log(`🌐 [${requestId}] Processing language mapping...`);
    const languageMap: { [key: string]: string } = {
      'en': 'english',
      'es': 'spanish',
      'pt': 'portuguese',
      'fr': 'french'
    };

    const tavusLanguage = languageMap[profile.language] || 'english';
    console.log(`🌐 [${requestId}] Language mapping: ${profile.language} -> ${tavusLanguage}`);

    const PERSONA_ID = 'p1c81be642e7'; // HARDCODED: Growth Mentor with Tools
    const REPLICA_ID = 'r6ca16dbe104'; // HARDCODED: Mary
    
    console.log(`🤖 [${requestId}] Using hardcoded values:`, {
      PERSONA_ID,
      REPLICA_ID
    });

    // Prepare Tavus API request
    console.log(`📞 [${requestId}] Preparing Tavus API request...`);
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
    
    console.log(`📞 [${requestId}] Tavus request prepared:`, {
      persona_id: tavusRequest.persona_id,
      replica_id: tavusRequest.replica_id,
      callback_url: tavusRequest.callback_url,
      conversation_name: tavusRequest.conversation_name,
      context_length: tavusRequest.conversational_context.length,
      properties: tavusRequest.properties
    });

    // Call Tavus API to create conversation
    console.log(`🌐 [${requestId}] Calling Tavus API...`);
    const tavusApiStart = Date.now();
    const tavusResponse = await fetch('https://tavusapi.com/v2/conversations', {
      method: 'POST',
      headers: {
        'x-api-key': Deno.env.get('TAVUS_API_KEY') ?? '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tavusRequest),
    });

    console.log(`🌐 [${requestId}] Tavus API call completed in ${Date.now() - tavusApiStart}ms`);
    console.log(`🌐 [${requestId}] Tavus API response status: ${tavusResponse.status}`);
    console.log(`🌐 [${requestId}] Tavus API response headers:`, Object.fromEntries(tavusResponse.headers.entries()));

    if (!tavusResponse.ok) {
      const errorText = await tavusResponse.text();
      console.error(`❌ [${requestId}] Tavus API error:`, {
        status: tavusResponse.status,
        statusText: tavusResponse.statusText,
        errorText: errorText
      });
      throw new Error(`Tavus API error: ${tavusResponse.status} - ${errorText}`);
    }

    const tavusData = await tavusResponse.json();
    console.log(`🌐 [${requestId}] Tavus API response data:`, tavusData);

    // Create mentor conversation record
    console.log(`💾 [${requestId}] Creating mentor conversation record...`);
    const mentorConvStart = Date.now();
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

    console.log(`💾 [${requestId}] Mentor conversation insert completed in ${Date.now() - mentorConvStart}ms`);

    if (conversationError) {
      console.error(`❌ [${requestId}] Mentor conversation creation error:`, conversationError);
      throw new Error(`Failed to create mentor conversation: ${conversationError.message}`);
    }
    
    console.log(`💾 [${requestId}] Mentor conversation created:`, {
      id: mentorConversation.id,
      tavus_conversation_id: mentorConversation.tavus_conversation_id,
      status: mentorConversation.status
    });

    // Create daily session record
    console.log(`📅 [${requestId}] Creating daily session record...`);
    const dailySessionStart = Date.now();
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

    console.log(`📅 [${requestId}] Daily session insert completed in ${Date.now() - dailySessionStart}ms`);

    if (sessionError) {
      console.error(`❌ [${requestId}] Daily session creation error:`, sessionError);
      throw new Error(`Failed to create daily session: ${sessionError.message}`);
    }
    
    console.log(`📅 [${requestId}] Daily session created:`, {
      id: dailySession.id,
      session_type: dailySession.session_type,
      session_status: dailySession.session_status,
      session_date: dailySession.session_date
    });

    const totalTime = Date.now() - startTime;
    const responseData = {
      success: true,
      conversation_url: tavusData.conversation_url,
      conversation_id: tavusData.conversation_id,
      mentor_conversation_id: mentorConversation.id,
      daily_session_id: dailySession.id,
      persona_name: 'Growth Mentor with Tools',
    };
    
    console.log(`✅ [${requestId}] Function completed successfully in ${totalTime}ms`);
    console.log(`📤 [${requestId}] Response data:`, responseData);

    return new Response(
      JSON.stringify(responseData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error(`❌ [${requestId}] Error starting Tavus session (after ${totalTime}ms):`, {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return new Response(
      JSON.stringify({ error: error.message, requestId }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});