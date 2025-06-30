import React from 'react';
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

  // Derive booleans locally
  const isAuthenticated = !!user;
  const isOnboardingComplete = profile?.onboarding_completed || false;

  console.log("ProtectedRoute - State Check:", {
    path: location.pathname,
    initialized,
    loading,
    isAuthenticated,
    isOnboardingComplete,
    userId: user?.id,
    profileExists: !!profile,
    profileIsNull: profile === null,
    requireOnboarding
  });

  // Show loading while auth is initializing
  if (!initialized || loading) {
    console.log("ProtectedRoute - Auth still initializing, showing loading spinner");
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

  // For authenticated users, handle profile loading states
  if (isAuthenticated && profile === undefined) {
    // Profile is still loading (undefined means not yet fetched)
    console.log("ProtectedRoute - User authenticated but profile still loading, continuing to wait");
    return (
      <div className="min-h-screen bg-arami-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // At this point, we either have profile data or profile is explicitly null (fetch failed)
  if (profile) {
    // We have profile data, make routing decisions based on onboarding status
    if (location.pathname === '/dashboard' && !isOnboardingComplete) {
      console.log("ProtectedRoute - Dashboard access without onboarding, redirecting to onboarding");
      return <Navigate to="/onboarding" replace />;
    }

    if (location.pathname === '/onboarding' && isOnboardingComplete) {
      console.log("ProtectedRoute - Onboarding complete, redirecting to dashboard");
      return <Navigate to="/dashboard" replace />;
    }

    if (requireOnboarding && !isOnboardingComplete) {
      console.log("ProtectedRoute - Onboarding required but not complete, redirecting");
      return <Navigate to="/onboarding" replace />;
    }
  } else if (profile === null) {
    // Profile fetch failed, but user is authenticated
    // This is an edge case - allow access but log for debugging
    console.log("ProtectedRoute - Profile fetch failed but user is authenticated, allowing access");
    
    // If they're trying to access dashboard without a profile, redirect to onboarding
    // as a safety measure
    if (location.pathname === '/dashboard') {
      console.log("ProtectedRoute - No profile but accessing dashboard, redirecting to onboarding as safety measure");
      return <Navigate to="/onboarding" replace />;
    }
  }

  console.log("ProtectedRoute - All checks passed, rendering children");
  return <>{children}</>;
};