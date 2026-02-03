import { useEffect, useRef } from 'react';
import { useSyncStatus } from './useSyncStatus';
import { useToast } from '@/contexts/ToastContext';

/**
 * Hook to automatically show toast notifications when syncing to GitHub
 * Displays a green toast at bottom-left corner during sync operations
 */
export function useSyncToast() {
  const { isSyncing, queueSize } = useSyncStatus();
  const { showSuccess } = useToast();
  const wasSyncingRef = useRef(false);

  useEffect(() => {
    // Detect when sync completes (transition from syncing to not syncing)
    if (wasSyncingRef.current && !isSyncing && queueSize === 0) {
      showSuccess('Đã đồng bộ lên GitHub thành công');
    }

    wasSyncingRef.current = isSyncing;
  }, [isSyncing, queueSize, showSuccess]);
}
