'use client';

import { useEffect, useRef } from 'react';
import { container } from '@/infrastructure/di/Container';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to automatically refresh data from GitHub after login
 * This ensures localStorage is always in sync with GitHub (source of truth)
 * 
 * Usage: Place in AuthProvider or root layout to run once per session
 */
export function useDataRefresh() {
  const { user } = useAuth();
  const hasRefreshed = useRef(false);

  useEffect(() => {
    // Only refresh once per session, when user is logged in
    if (user && !hasRefreshed.current) {
      const refreshData = async () => {
        try {
          console.log('🔄 Auto-refreshing data from GitHub...');
          const storage = container.storageService;
          
          // Check if storage has refreshFromGitHub method
          if ('refreshFromGitHub' in storage && typeof storage.refreshFromGitHub === 'function') {
            await storage.refreshFromGitHub();
            console.log('✓ Auto-refresh completed');
            hasRefreshed.current = true;
          }
        } catch (error) {
          console.error('✗ Auto-refresh failed:', error);
          // Don't block user experience on refresh failure
        }
      };

      refreshData();
    }

    // Reset flag when user logs out
    if (!user) {
      hasRefreshed.current = false;
    }
  }, [user]);
}
