import { supabase } from './supabase';

export interface AuthResponse {
  success: boolean;
  error?: string;
  data?: any;
}

export class AuthService {
  // Email/Password Authentication
  static async signUpWithEmail(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: email.split('@')[0], // Use email prefix as default name
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Profile will be created automatically by the database trigger
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  static async signInWithEmail(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log('[AuthService.signInWithEmail] signInWithPassword result:', { data, error });
      if (error) {
        return { success: false, error: error.message };
      }
      console.log('[AuthService.signInWithEmail] returning success:', data);
      return { success: true, data };
    } catch (error) {
      console.error('[AuthService.signInWithEmail] unexpected error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  // Magic Link Authentication
  static async sendMagicLink(email: string): Promise<AuthResponse> {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      const response = await fetch(`${supabaseUrl}/functions/v1/auth-magic-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          email,
          redirectTo: `${window.location.origin}/dashboard`,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to send magic link' };
      }

      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: 'Failed to send magic link' };
    }
  }

  // Phone Authentication
  static async sendPhoneOTP(phone: string): Promise<AuthResponse> {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      const response = await fetch(`${supabaseUrl}/functions/v1/auth-phone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          phone,
          action: 'send_otp',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle specific error codes
        if (result.code === 'SMS_NOT_CONFIGURED') {
          return { 
            success: false, 
            error: 'Phone authentication is currently unavailable. Please use email authentication instead.' 
          };
        }
        
        return { 
          success: false, 
          error: result.error || 'Failed to send SMS code. Please try email authentication.' 
        };
      }

      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error. Please check your connection and try again, or use email authentication.' 
      };
    }
  }

  static async verifyPhoneOTP(phone: string, token: string): Promise<AuthResponse> {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      const response = await fetch(`${supabaseUrl}/functions/v1/auth-phone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          phone,
          token,
          action: 'verify_otp',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle specific error codes
        if (result.code === 'CODE_EXPIRED') {
          return { 
            success: false, 
            error: 'Verification code has expired. Please request a new one.' 
          };
        }
        
        if (result.code === 'INVALID_CODE') {
          return { 
            success: false, 
            error: 'Invalid verification code. Please check the code and try again.' 
          };
        }
        
        return { 
          success: false, 
          error: result.error || 'Verification failed. Please try again.' 
        };
      }

      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error. Please check your connection and try again.' 
      };
    }
  }

  // General Authentication Methods
  static async signOut(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  static onAuthStateChange(callback: (event: string, session: any) => void) {
    console.log("[AuthService] onAuthStateChange")
    return supabase.auth.onAuthStateChange(callback);
  }

  static async resendConfirmationEmail(email: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to resend confirmation email.' };
    }
  }
}