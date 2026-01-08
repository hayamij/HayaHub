'use client';

import { useOnlineSync } from '@/hooks/useOnlineSync';
import { useDataRefresh } from '@/hooks/useDataRefresh';
import { useEffect } from 'react';

/**
 * Component to initialize online/offline sync monitoring and auto-refresh
 * Place this at the root level to ensure it runs throughout the app lifecycle
 */
export function OnlineSyncProvider({ children }: { children: React.ReactNode }) {
  const { isOnline } = useOnlineSync();
  
  // Auto-refresh data from GitHub after login
  useDataRefresh();

  useEffect(() => {
    // Visual feedback for online/offline status (optional)
    if (!isOnline) {
      document.body.classList.add('offline-mode');
    } else {
      document.body.classList.remove('offline-mode');
    }
  }, [isOnline]);

  return <>{children}</>;
}
