import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { DatabaseService } from '../lib/database';

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
  const [profileLoading, setProfileLoading] = useState(false);

  // Helper to fetch profile safely
  const fetchProfile = async (userId: string) => {
    if (profileLoading) return;
    setProfileLoading(true);
    try {
      const profileResponse = await DatabaseService.getProfile(userId);
      if (profileResponse.success) {
        setProfile(profileResponse.data);
      } else {
        setProfile(null);
      }
    } catch (error) {
      setProfile(null);
    } finally {
      setProfileLoading(false);
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
    setLoading(true);
    setInitialized(false);
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[useAuth] onAuthStateChange fired:', { event, session });
        if (!mounted) return;
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          try {
            await fetchProfile(session.user.id);
            console.log('[useAuth] Profile fetch succeeded for user:', session.user.id);
          } catch (err) {
            console.error('[useAuth] Profile fetch failed for user:', session.user.id, err);
          }
        } else {
          setProfile(null);
        }
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    );
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    profile,
    loading: loading || profileLoading,
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