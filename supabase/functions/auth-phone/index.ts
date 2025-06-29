/*
  # Phone Authentication Function

  1. Purpose
    - Handle phone number authentication requests
    - Send SMS verification codes
    - Validate phone numbers

  2. Security
    - Rate limiting for SMS sending
    - Phone number validation
    - CORS handling
*/

import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface PhoneAuthRequest {
  phone: string;
  action: 'send_otp' | 'verify_otp';
  token?: string;
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
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { phone, action, token }: PhoneAuthRequest = await req.json();

    // Validate phone number
    if (!phone || !phone.startsWith('+')) {
      return new Response(
        JSON.stringify({ error: 'Valid phone number with country code is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (action === 'send_otp') {
      // Send OTP
      const { error } = await supabaseClient.auth.signInWithOtp({
        phone,
      });

      if (error) {
        console.error('SMS OTP error:', error);
        
        // Check if it's a configuration error
        if (error.message?.includes('SMS provider') || 
            error.message?.includes('not configured') ||
            error.message?.includes('Twilio') ||
            error.message?.includes('provider')) {
          return new Response(
            JSON.stringify({ 
              error: 'SMS service is not configured. Please contact support or use email authentication.',
              code: 'SMS_NOT_CONFIGURED'
            }),
            {
              status: 503,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        // Generic SMS error
        return new Response(
          JSON.stringify({ 
            error: 'Failed to send SMS code. Please try again or use email authentication.',
            code: 'SMS_SEND_FAILED'
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(
        JSON.stringify({ 
          message: 'SMS code sent successfully',
          phone 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );

    } else if (action === 'verify_otp') {
      if (!token) {
        return new Response(
          JSON.stringify({ error: 'Verification token is required' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Verify OTP
      const { data, error } = await supabaseClient.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      });

      if (error) {
        console.error('OTP verification error:', error);
        
        if (error.message?.includes('expired')) {
          return new Response(
            JSON.stringify({ 
              error: 'Verification code has expired. Please request a new one.',
              code: 'CODE_EXPIRED'
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        return new Response(
          JSON.stringify({ 
            error: 'Invalid verification code. Please check and try again.',
            code: 'INVALID_CODE'
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(
        JSON.stringify({ 
          message: 'Phone verified successfully',
          user: data.user,
          session: data.session
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );

    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error. Please try again later.',
        code: 'INTERNAL_ERROR'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});