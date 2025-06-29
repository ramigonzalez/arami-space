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

  // Function to refresh profile data
  const refreshProfile = async () => {
    if (!user) {
      console.log('refreshProfile: No user, clearing profile');
      setProfile(null);
      return;
    }

    try {
      console.log('refreshProfile: Fetching profile for user:', user.id);
      const profileResponse = await DatabaseService.getProfile(user.id);
      console.log('refreshProfile: Profile fetch response:', profileResponse);
      
      if (profileResponse.success) {
        setProfile(profileResponse.data);
        console.log('refreshProfile: Profile updated successfully:', profileResponse.data);
      } else {
        console.log('refreshProfile: Profile fetch failed:', profileResponse.error);
        setProfile(null);
      }
    } catch (error) {
      console.error('refreshProfile: Error loading profile:', error);
      setProfile(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    console.log('useAuth: Setting up auth state listener');
    setLoading(true);
    setInitialized(false);

    // Listen for auth changes - this will fire immediately with current session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuth: Auth state change event:', event);
        console.log('useAuth: Session exists:', !!session);
        
        if (!mounted) {
          console.log('useAuth: Component unmounted, ignoring auth change');
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('useAuth: User authenticated, fetching profile');
          try {
            // Add timeout to prevent hanging
            const profilePromise = DatabaseService.getProfile(session.user.id);
            const timeoutPromise = new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error('Profile fetch timeout')), 10000)
            );
            
            const profileResponse = await Promise.race([profilePromise, timeoutPromise]) as any;
            console.log('useAuth: Profile fetch response:', profileResponse);
            
            if (mounted) {
              if (profileResponse.success) {
                setProfile(profileResponse.data);
                console.log('useAuth: Profile set successfully:', profileResponse.data);
              } else {
                console.log('useAuth: Profile fetch failed:', profileResponse.error);
                setProfile(null);
              }
            }
          } catch (error) {
            console.error('useAuth: Error loading profile on auth change:', error);
            if (mounted) {
              setProfile(null);
            }
          }
        } else {
          console.log('useAuth: No session user, clearing profile');
          if (mounted) {
            setProfile(null);
          }
        }
        
        // Mark as initialized and stop loading - ensure this always happens
        if (mounted) {
          console.log('useAuth: Setting loading to false and initialized to true');
          setLoading(false);
          setInitialized(true);
          console.log('useAuth: Auth initialization complete');
        }
      }
    );

    return () => {
      console.log('useAuth: Cleaning up auth listener');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log('useAuth: Signing out user');
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('useAuth: Error signing out:', error);
      } else {
        console.log('useAuth: Sign out successful, clearing state');
        setUser(null);
        setSession(null);
        setProfile(null);
      }
    } catch (error) {
      console.error('useAuth: Error in signOut:', error);
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