import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Layout } from './components/layout/Layout';
import { Landing } from './pages/Landing';
import AuthCallback from './pages/AuthCallback';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

interface AppRouterProps {
  // Future props can be added here
}

interface AppProps {
  // Future props can be added here
}

// Main App Router Component
const AppRouter: React.FC<AppRouterProps> = () => {
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