import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Layout } from './components/layout/Layout';
import { Landing } from './pages/Landing';

interface AppRouterProps {
  // Future props can be added here
}

interface AppProps {
  // Future props can be added here
}

// Main App Router Component
const AppRouter: React.FC<AppRouterProps> = () => {
  const { user, profile, loading, initialized } = useAuth();

  if (!initialized || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Arami Space...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Setting up your profile...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  const needsOnboarding = !profile.onboarding_completed;

  return (
    <Layout>
      <Routes>
        {needsOnboarding ? (
          <>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="*" element={<Navigate to="/onboarding" replace />} />
          </>
        ) : (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/onboarding" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}
      </Routes>
    </Layout>
  );
};

// Main App Component
const App: React.FC<AppProps> = () => {
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