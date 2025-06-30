import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

// Pages
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Sessions } from './pages/Sessions';
import { FaceToFaceSessionPage } from './pages/FaceToFaceSessionPage';
import { Goals } from './pages/Goals';
import { Virtues } from './pages/Virtues';
import { Profile } from './pages/Profile';
import { Onboarding } from './pages/Onboarding';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={!user ? <Landing /> : <Navigate to="/dashboard" replace />} />
        <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/dashboard" replace />} />
        
        {/* Protected routes */}
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        } />
        
        <Route path="/face-to-face-session" element={
          <ProtectedRoute>
            <FaceToFaceSessionPage />
          </ProtectedRoute>
        } />
        
        <Route path="/*" element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/sessions" element={<Sessions />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/virtues" element={<Virtues />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;