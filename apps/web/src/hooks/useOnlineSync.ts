'use client';

import { useEffect, useState } from 'react';
import { Container } from '@/infrastructure/di/Container';

/**
 * Hook to monitor online/offline status and trigger sync when coming back online
 */
export function useOnlineSync() {
  const [isOnline, setIsOnline] = useState(true);
  const [lastOnlineTime, setLastOnlineTime] = useState<Date>(new Date());

  useEffect(() => {
    // Initialize with current online status
    setIsOnline(navigator.onLine);

    const handleOnline = async () => {
      console.log('🌐 Network connection restored - triggering sync...');
      setIsOnline(true);
      
      const now = new Date();
      
      // Always trigger sync when coming back online, regardless of duration
      try {
        const storage = Container.getInstance().storageService;
        
        // Check if storage has compareAndSync method (HybridStorageAdapter)
        if ('compareAndSync' in storage && typeof storage.compareAndSync === 'function') {
          await storage.compareAndSync();
          console.log('✓ Smart sync completed after network restoration');
        } else if ('fullSync' in storage && typeof storage.fullSync === 'function') {
          // Fallback to fullSync if compareAndSync not available
          await storage.fullSync();
          console.log('✓ Full sync completed after network restoration');
        }
      } catch (error) {
        console.error('✗ Sync failed after network restoration:', error);
      }
      
      setLastOnlineTime(now);
    };

    const handleOffline = () => {
      console.log('📡 Network connection lost - entering offline mode');
      setIsOnline(false);
      setLastOnlineTime(new Date());
    };

    // Listen to online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [lastOnlineTime]);

  return { isOnline, lastOnlineTime };
}
