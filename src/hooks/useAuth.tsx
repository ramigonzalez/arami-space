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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Set initial loading state
    setLoading(true);
    setInitialized(false);

    // Listen for auth changes - this will fire immediately with current session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session);
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            console.log('Fetching profile for user:', session.user.id);
            const profileResponse = await DatabaseService.getProfile(session.user.id);
            console.log('Profile fetch response:', profileResponse);
            console.log('Profile fetch response:', profileResponse);
            if (profileResponse.success && mounted) {
              setProfile(profileResponse.data);
              console.log('Profile set successfully:', profileResponse.data);
              console.log('Profile set successfully:', profileResponse.data);
            } else {
              console.log('Profile fetch failed or component unmounted');
              console.log('Profile fetch failed or component unmounted');
              setProfile(null);
            }
          } catch (error) {
            console.error('Error loading profile on auth change:', error);
            console.log('Setting profile to null due to error');
            setProfile(null);
          }
          console.log('Profile fetching completed, proceeding to finalize auth state');
        } else {
          console.log('No session user, clearing profile');
          setProfile(null);
        }
        
        // Mark as initialized and stop loading
        if (mounted) {
          console.log('Setting loading to false and initialized to true');
          setLoading(false);
          setInitialized(true);
          console.log('Auth initialization complete');
        }
        console.log('Auth state change handler completed');
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      } else {
        setUser(null);
        setSession(null);
        setProfile(null);
      }
    } catch (error) {
      console.error('Error in signOut:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    initialized,
    signOut,
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