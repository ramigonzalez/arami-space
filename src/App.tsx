import React, { useEffect } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Auth from './pages/Auth';
import AuthCallback from './pages/AuthCallback';
import { Dashboard } from './pages/Dashboard';
import { Landing } from './pages/Landing';
import Onboarding from './pages/Onboarding';

// Main App Router Component
const AppRouter: React.FC = () => {
  const { user, profile, loading, initialized } = useAuth();

  useEffect(() => {
    const isAuthenticated = !!user;
    const isOnboardingComplete = profile?.onboarding_completed || false;
  
    console.log("AppRouter - initialized", initialized)
    console.log("AppRouter - loading", loading)
    console.log("AppRouter - isAuthenticated", isAuthenticated)
    console.log("AppRouter - isOnboardingComplete", isOnboardingComplete)

  }, [initialized, loading]) 

  // Smart redirect component for catch-all route
  const SmartRedirect = () => {
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

    if (!user) {
      return <Navigate to="/" replace />;
    }

    const isOnboardingComplete = profile?.onboarding_completed || false;
    return <Navigate to={isOnboardingComplete ? "/dashboard" : "/onboarding"} replace />;
  };

  return (
    <Layout>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/" element={<Landing />} />
        <Route path="*" element={<SmartRedirect />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  console.log('App render - initializing');
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRouter />
      </Router>
    </AuthProvider>
  );
};

export { App };
export default App;