import { Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';
import { DatabaseService } from '../lib/database';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: any | null;
  loading: boolean;
  initialized: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Helper to fetch profile safely
  const fetchProfile = async (userId: string) => {
    try {
      console.log('[useAuth] Fetching profile for user:', userId);
      const profileResponse = await DatabaseService.getProfile(userId);
      if (profileResponse.success) {
        console.log('[useAuth] Profile fetch succeeded:', profileResponse.data);
        setProfile(profileResponse.data);
      } else {
        console.log('[useAuth] Profile fetch failed:', profileResponse.error);
        setProfile(null);
      }
    } catch (error) {
      console.error('[useAuth] Profile fetch error:', error);
      setProfile(null);
    }
  };

  // Function to refresh profile data
  const refreshProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }
    await fetchProfile(user.id);
  };

  useEffect(() => {
    let mounted = true;
    
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        console.log('[useAuth] Initializing auth...');
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[useAuth] Error getting initial session:', error);
        }
        
        if (mounted) {
          console.log('[useAuth] Initial session:', initialSession);
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          
          if (initialSession?.user) {
            await fetchProfile(initialSession.user.id);
          } else {
            setProfile(null);
          }
          
          setLoading(false);
          setInitialized(true);
        }
      } catch (error) {
        console.error('[useAuth] Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[useAuth] onAuthStateChange fired:', { event, session });
        if (!mounted) return;
        
        // Only handle subsequent auth changes, not the initial one
        if (initialized) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await fetchProfile(session.user.id);
          } else {
            setProfile(null);
          }
        }
      }
    );

    // Initialize auth state
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    profile,
    loading,
    initialized,
    signOut: async () => {
      setLoading(true);
      try {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    },
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}