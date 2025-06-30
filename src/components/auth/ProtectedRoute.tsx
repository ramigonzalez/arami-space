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
  console.log("ProtectedRoute - location", location)

  // Derive booleans locally
  const isAuthenticated = !!user;
  const isOnboardingComplete = profile?.onboarding_completed || false;

  console.log("ProtectedRoute - initialized", initialized)
  console.log("ProtectedRoute - loading", loading)

  // Show loading while auth is initializing
  if (!initialized || loading) {
    return (
      <div className="min-h-screen bg-arami-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Loading your sanctuary...</p>
        </div>
      </div>
    );
  }

  console.log("ProtectedRoute - isAuthenticated", isAuthenticated)
  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Redirect to onboarding if required and not completed
  if (requireOnboarding && !isOnboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  // Redirect to dashboard if onboarding is complete but user is on onboarding page
  if (location.pathname === '/onboarding' && isOnboardingComplete) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};