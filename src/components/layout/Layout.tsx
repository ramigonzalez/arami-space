import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Navigation } from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Don't show navigation on landing page, auth page, or onboarding
  const hideNavigation = !user || 
    location.pathname === '/' || 
    location.pathname === '/auth' || 
    location.pathname === '/onboarding';

  return (
    <div className="min-h-screen bg-arami-gradient">
      {/* Header - only show for authenticated users */}
      {user && (
        <header className="px-4 pt-safe-top pb-4">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-white">Arami Space</h1>
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`${hideNavigation ? '' : 'pb-20'}`}>
        <div className="max-w-md mx-auto px-4">
          {children}
        </div>
      </main>

      {/* Bottom Navigation - only show for authenticated users on main pages */}
      {!hideNavigation && (
        <div className="fixed bottom-0 left-0 right-0 pb-safe-bottom">
          <Navigation />
        </div>
      )}
    </div>
  );
};