import { Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
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

  // Use refs to prevent race conditions and duplicate fetches
  const mountedRef = useRef(true);
  const initializationPromiseRef = useRef<Promise<void> | null>(null);
  const initializedRef = useRef(false);
  const profileCacheRef = useRef<{ [userId: string]: any }>({});
  const activeProfileFetchRef = useRef<{ [userId: string]: Promise<any> }>({});

  // Simplified profile fetch with caching and deduplication
  const fetchProfile = async (userId: string): Promise<any> => {
    if (!mountedRef.current) return null;

    // Return cached profile if available
    if (profileCacheRef.current[userId]) {
      console.log('[useAuth] Returning cached profile for user:', userId);
      setProfile(profileCacheRef.current[userId]);
      return profileCacheRef.current[userId];
    }

    // Return existing promise if fetch is already in progress
    if (activeProfileFetchRef.current[userId] !== undefined) {
      console.log('[useAuth] Profile fetch already in progress for user:', userId);
      return activeProfileFetchRef.current[userId];
    }

    // Create new fetch promise
    console.log('[useAuth] Fetching fresh profile for user:', userId);
    const fetchPromise = DatabaseService.getProfile(userId)
      .then(response => {
        if (!mountedRef.current) return null;

        if (response.success && response.data) {
          console.log('[useAuth] Profile fetch succeeded:', response.data);
          profileCacheRef.current[userId] = response.data;
          setProfile(response.data);
          return response.data;
        } else {
          console.log('[useAuth] Profile fetch failed:', response.error);
          setProfile(null);
          return null;
        }
      })
      .catch(error => {
        if (!mountedRef.current) return null;
        console.error('[useAuth] Profile fetch error:', error);
        setProfile(null);
        return null;
      })
      .finally(() => {
        // Clean up active fetch reference
        delete activeProfileFetchRef.current[userId];
      });

    // Store the active fetch promise
    activeProfileFetchRef.current[userId] = fetchPromise;
    return fetchPromise;
  };

  // Function to refresh profile data
  const refreshProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }
    // Clear cache and fetch fresh
    delete profileCacheRef.current[user.id];
    await fetchProfile(user.id);
  };

  // Initialize auth state once
  const initializeAuth = async (): Promise<void> => {
    try {
      console.log('[useAuth] Initializing auth...');
      const { data: { session: initialSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('[useAuth] Error getting initial session:', error);
      }

      if (!mountedRef.current) return;

      console.log('[useAuth] Initial session:', initialSession);
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      if (initialSession?.user) {
        console.log('[useAuth] User found in initial session, fetching profile...');
        await fetchProfile(initialSession.user.id);
      } else {
        console.log('[useAuth] No user in initial session');
        setProfile(null);
      }

             console.log('[useAuth] Auth initialization complete');
       setLoading(false);
       setInitialized(true);
       initializedRef.current = true;
         } catch (error) {
       console.error('[useAuth] Error initializing auth:', error);
       if (mountedRef.current) {
         setLoading(false);
         setInitialized(true);
         initializedRef.current = true;
       }
     }
  };

  useEffect(() => {
    mountedRef.current = true;
    initializedRef.current = false;

    // Prevent duplicate initialization (especially important for StrictMode)
    if (!initializationPromiseRef.current) {
      initializationPromiseRef.current = initializeAuth();
    }

    // Fallback timeout to ensure auth never gets stuck permanently
    const fallbackTimeout = setTimeout(() => {
      if (mountedRef.current && !initializedRef.current) {
        console.log('[useAuth] Fallback timeout triggered, forcing initialization');
        setLoading(false);
        setInitialized(true);
        initializedRef.current = true;
      }
    }, 10000); // 10 second fallback

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[useAuth] onAuthStateChange fired:', { event, session });
        if (!mountedRef.current) return;

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('[useAuth] Fetching profile after auth state change');
          await fetchProfile(session.user.id);
        } else {
          console.log('[useAuth] No user, clearing profile');
          setProfile(null);
          // Clear all cached profiles when user signs out
          profileCacheRef.current = {};
        }

        // Ensure auth is marked as initialized after any auth state change
        if (!initializedRef.current) {
          console.log('[useAuth] Marking auth as initialized after state change');
          setLoading(false);
          setInitialized(true);
          initializedRef.current = true;
        }
      }
    );

    return () => {
      mountedRef.current = false;
      clearTimeout(fallbackTimeout);
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array to prevent re-initialization

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
        // Clear all cached profiles
        profileCacheRef.current = {};
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