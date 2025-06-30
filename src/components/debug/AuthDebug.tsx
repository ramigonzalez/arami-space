import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { DatabaseService } from '../../lib/database';
import { supabase } from '../../lib/supabase';

export const AuthDebug: React.FC = () => {
  const { user, profile, loading, initialized } = useAuth();

  const testProfileFetch = async () => {
    if (!user) {
      console.log('No user available for profile test');
      return;
    }

    console.log('=== Testing Profile Fetch ===');
    console.log('User ID:', user.id);
    
    try {
      // Test direct Supabase query
      console.log('Testing direct Supabase query...');
      const { data: directData, error: directError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      console.log('Direct query result:', { data: directData, error: directError });
      
      // Test DatabaseService
      console.log('Testing DatabaseService...');
      const serviceResult = await DatabaseService.getProfile(user.id);
      console.log('DatabaseService result:', serviceResult);
      
    } catch (error) {
      console.error('Profile test error:', error);
    }
  };

  const testAuthState = () => {
    console.log('=== Current Auth State ===');
    console.log('User:', user);
    console.log('Profile:', profile);
    console.log('Loading:', loading);
    console.log('Initialized:', initialized);
    console.log('User ID:', user?.id);
    console.log('Onboarding Complete:', profile?.onboarding_completed);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-50">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div className="space-y-2 text-sm">
        <div>User: {user ? 'Authenticated' : 'Not authenticated'}</div>
        <div>Profile: {profile ? 'Loaded' : 'Not loaded'}</div>
        <div>Loading: {loading ? 'Yes' : 'No'}</div>
        <div>Initialized: {initialized ? 'Yes' : 'No'}</div>
        {profile && (
          <div>Onboarding: {profile.onboarding_completed ? 'Complete' : 'Incomplete'}</div>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <button
          onClick={testAuthState}
          className="block w-full text-left px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded text-xs"
        >
          Log Auth State
        </button>
        <button
          onClick={testProfileFetch}
          className="block w-full text-left px-2 py-1 bg-green-100 hover:bg-green-200 rounded text-xs"
        >
          Test Profile Fetch
        </button>
      </div>
    </div>
  );
};

// Make functions available globally for console debugging
if (typeof window !== 'undefined') {
  (window as any).debugAuth = {
    testProfileFetch: async (userId: string) => {
      console.log('=== Manual Profile Fetch Test ===');
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        console.log('Result:', { data, error });
        return { data, error };
      } catch (err) {
        console.error('Error:', err);
        return { error: err };
      }
    },
    getSession: async () => {
      const { data, error } = await supabase.auth.getSession();
      console.log('Session:', { data, error });
      return { data, error };
    }
  };
} 