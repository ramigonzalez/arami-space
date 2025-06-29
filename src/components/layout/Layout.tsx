import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { LogOut, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-arami-gradient">
      {/* Grain texture overlay */}
      <div className="absolute inset-0 grain-texture opacity-[0.03] pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-10 bg-surface-900/80 backdrop-blur-xl border-b border-accent-300/20 sticky top-0">
        <div className="w-full px-4 py-1">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold bg-badge-gradient bg-clip-text text-transparent">
                  Arami Space
                </h1>
              </div>
            </div>

            {/* User Menu - Mobile Optimized */}
            <div className="flex items-center space-x-2">
              {profile && (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-neutral-0/70" />
                    <span className="text-xs font-medium text-neutral-0 truncate max-w-24">
                      {profile.full_name || user?.email}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={handleSignOut}
                    className="p-2 min-w-0"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        {children}
      </main>
    </div>
  );
}