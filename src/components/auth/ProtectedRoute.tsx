import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireOnboarding = false 
}) => {
  const { user, profile, loading, initialized } = useAuth();
  const location = useLocation();
  const [profileTimeout, setProfileTimeout] = useState(false);

  // Derive booleans locally
  const isAuthenticated = !!user;
  const isOnboardingComplete = profile?.onboarding_completed || false;

  // Set a timeout for profile loading when user is authenticated but profile is null
  useEffect(() => {
    if (isAuthenticated && !profile && initialized && !loading) {
      const timer = setTimeout(() => {
        console.log("ProtectedRoute - Profile loading timeout, proceeding with null profile assumption");
        setProfileTimeout(true);
      }, 3000); // Wait 3 seconds for profile to load

      return () => clearTimeout(timer);
    } else {
      setProfileTimeout(false);
    }
  }, [isAuthenticated, profile, initialized, loading]);

  // Add a timeout for auth initialization to prevent infinite loading
  useEffect(() => {
    if (!initialized && !loading) {
      const authTimer = setTimeout(() => {
        console.log("ProtectedRoute - Auth initialization seems stuck, this might indicate a problem");
        // Don't force anything here, just log for debugging
      }, 5000); // Wait 5 seconds for auth to initialize

      return () => clearTimeout(authTimer);
    }
  }, [initialized, loading]);

  console.log("ProtectedRoute - State Check:", {
    path: location.pathname,
    initialized,
    loading,
    isAuthenticated,
    isOnboardingComplete,
    userId: user?.id,
    profileExists: !!profile,
    requireOnboarding,
    profileTimeout
  });

  // Show loading while auth is initializing or profile is loading (with timeout)
  if (!initialized || loading || (isAuthenticated && !profile && !profileTimeout)) {
    console.log("ProtectedRoute - Showing loading spinner");
    return (
      <div className="min-h-screen bg-arami-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Loading your sanctuary...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    console.log("ProtectedRoute - Not authenticated, redirecting to auth");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // CRITICAL FIX: Only make onboarding decisions when we have profile data OR after timeout
  // This prevents the dashboard refresh bug where users get redirected to onboarding
  // when their profile is still loading
  if (profile || profileTimeout) {
    // Handle routing based on onboarding status and current path
    if (location.pathname === '/dashboard' && !isOnboardingComplete) {
      // User trying to access dashboard but hasn't completed onboarding
      console.log("ProtectedRoute - Dashboard access without onboarding, redirecting to onboarding");
      return <Navigate to="/onboarding" replace />;
    }

    if (location.pathname === '/onboarding' && isOnboardingComplete) {
      // User trying to access onboarding but has already completed it
      console.log("ProtectedRoute - Onboarding complete, redirecting to dashboard");
      return <Navigate to="/dashboard" replace />;
    }

    // Redirect to onboarding if required and not completed
    if (requireOnboarding && !isOnboardingComplete) {
      console.log("ProtectedRoute - Onboarding required but not complete, redirecting");
      return <Navigate to="/onboarding" replace />;
    }
  } else {
    // Profile is still loading, don't make any onboarding-based redirects yet
    // Just ensure the user stays on a valid authenticated page
    console.log("ProtectedRoute - Profile still loading, allowing access to current page");
  }

  console.log("ProtectedRoute - All checks passed, rendering children");
  return <>{children}</>;
};