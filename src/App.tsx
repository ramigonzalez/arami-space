import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Layout } from './components/layout/Layout';
import { Landing } from './pages/Landing';
import AuthCallback from './pages/AuthCallback';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

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
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
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