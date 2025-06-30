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

  // Helper to fetch profile safely with retry logic
  const fetchProfile = async (userId: string, retryCount = 0): Promise<void> => {
    try {
      console.log('[useAuth] Fetching profile for user:', userId, 'attempt:', retryCount + 1);
      const profileResponse = await DatabaseService.getProfile(userId);
      if (profileResponse.success) {
        console.log('[useAuth] Profile fetch succeeded:', profileResponse.data);
        setProfile(profileResponse.data);
        return; // Success - exit the function
      } else {
        console.log('[useAuth] Profile fetch failed:', profileResponse.error);
        
        // If profile doesn't exist and this is a new user, retry a few times
        // as the database trigger might still be creating the profile
        if (profileResponse.error?.includes('No rows returned') && retryCount < 3) {
          console.log('[useAuth] Profile not found, retrying in 1 second...');
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
          return await fetchProfile(userId, retryCount + 1); // Recursive retry
        } else {
          console.log('[useAuth] Profile fetch failed permanently, setting profile to null');
          setProfile(null);
          
          // If user doesn't exist in database but has a session, clear the session
          if (profileResponse.error?.includes('No rows returned')) {
            console.log('[useAuth] User not found in database, clearing stale session');
            try {
              await supabase.auth.signOut();
            } catch (signOutError) {
              console.error('[useAuth] Error clearing stale session:', signOutError);
            }
          }
          return; // Failed permanently - exit the function
        }
      }
    } catch (error) {
      console.error('[useAuth] Profile fetch error:', error);
      
      // Retry on network errors for new users
      if (retryCount < 3) {
        console.log('[useAuth] Network error, retrying in 1 second...');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        return await fetchProfile(userId, retryCount + 1); // Recursive retry
      } else {
        console.log('[useAuth] Profile fetch failed permanently after network errors, setting profile to null');
        setProfile(null);
        return; // Failed permanently - exit the function
      }
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
    
    // Safety timeout to ensure auth is always initialized
    const safetyTimeout = setTimeout(() => {
      if (mounted && !initialized) {
        console.log('[useAuth] Safety timeout triggered, forcing auth initialization');
        setLoading(false);
        setInitialized(true);
      }
    }, 10000); // 10 second timeout
    
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
            console.log('[useAuth] User found in initial session, fetching profile...');
            try {
              await fetchProfile(initialSession.user.id);
            } catch (profileError) {
              console.error('[useAuth] Profile fetch failed during initialization:', profileError);
              setProfile(null);
            }
          } else {
            console.log('[useAuth] No user in initial session, setting profile to null');
            setProfile(null);
          }
          
          console.log('[useAuth] Auth initialization complete, setting loading=false, initialized=true');
          setLoading(false);
          setInitialized(true);
          clearTimeout(safetyTimeout); // Clear safety timeout on successful init
        }
      } catch (error) {
        console.error('[useAuth] Error initializing auth:', error);
        if (mounted) {
          console.log('[useAuth] Auth initialization failed, setting loading=false, initialized=true');
          setLoading(false);
          setInitialized(true);
          clearTimeout(safetyTimeout); // Clear safety timeout on failed init
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[useAuth] onAuthStateChange fired:', { event, session });
        if (!mounted) return;
        
        // Handle all auth changes, not just after initialization
        // This fixes the race condition where SIGNED_IN events might be missed
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('[useAuth] Fetching profile after auth state change');
          try {
            await fetchProfile(session.user.id);
            console.log('[useAuth] Profile fetch completed after auth state change');
          } catch (error) {
            console.error('[useAuth] Profile fetch failed after auth state change:', error);
            setProfile(null);
          }
        } else {
          console.log('[useAuth] No user, clearing profile');
          setProfile(null);
        }
        
        // Mark as initialized and not loading (using current state)
        console.log('[useAuth] Auth state change complete, setting loading=false, initialized=true');
        setLoading(false);
        setInitialized(true);
        clearTimeout(safetyTimeout); // Clear safety timeout on auth state change
      }
    );

    // Initialize auth state
    initializeAuth();

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
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