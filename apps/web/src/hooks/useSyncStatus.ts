import { useEffect, useState } from 'react';
import { container } from '@/infrastructure/di/Container';

interface SyncStatus {
  isSyncing: boolean;
  queueSize: number;
}

/**
 * Hook to monitor GitHub sync status
 * Useful for showing sync indicators in the UI
 */
export function useSyncStatus() {
  const [status, setStatus] = useState<SyncStatus>({
    isSyncing: false,
    queueSize: 0,
  });

  useEffect(() => {
    const checkStatus = () => {
      try {
        interface StorageWithSync {
          getSyncStatus?: () => SyncStatus;
        }
        const storageService = container.storageService as StorageWithSync;

        if (typeof storageService.getSyncStatus === 'function') {
          const currentStatus = storageService.getSyncStatus();
          setStatus(currentStatus);
        }
      } catch (error) {
        console.error('Failed to get sync status:', error);
      }
    };

    // Check immediately
    checkStatus();

    // Poll every second
    const interval = setInterval(checkStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  return status;
}
