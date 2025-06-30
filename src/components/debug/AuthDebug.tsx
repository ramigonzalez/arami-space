import React from 'react';
import { useAuth } from '../../hooks/useAuth';

export const AuthDebug: React.FC = () => {
  const { user, session, profile, loading, initialized } = useAuth();

  // Only show in development
  if (import.meta.env.VITE_PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div className="space-y-1">
        <div>Loading: {loading ? '✅' : '❌'}</div>
        <div>Initialized: {initialized ? '✅' : '❌'}</div>
        <div>Has User: {user ? '✅' : '❌'}</div>
        <div>Has Session: {session ? '✅' : '❌'}</div>
        <div>Has Profile: {profile ? '✅' : '❌'}</div>
        <div>User ID: {user?.id || 'N/A'}</div>
        <div>Onboarding Complete: {profile?.onboarding_completed ? '✅' : '❌'}</div>
        {user && (
          <div className="mt-2 pt-2 border-t border-gray-600">
            <div>Email: {user.email}</div>
            <div>Created: {user.created_at?.slice(0, 10)}</div>
          </div>
        )}
      </div>
    </div>
  );
}; 