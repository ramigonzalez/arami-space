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
    requireOnboarding
  });

  // Show loading while auth is initializing
  if (!initialized || loading) {
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

  console.log("ProtectedRoute - All checks passed, rendering children");
  return <>{children}</>;
};