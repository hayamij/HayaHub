import type { IStorageService } from 'hayahub-business';
import type { IStorageStrategy } from './strategies/IStorageStrategy';

/**
 * Hybrid Storage Adapter that combines two storage strategies (e.g., LocalStorage + GitHub API)
 * 
 * Strategy Pattern:
 * - Primary storage: Fast, local access (e.g., localStorage)
 * - Secondary storage: Persistent, remote backup (e.g., GitHub API, PostgreSQL)
 * 
 * Read operations: Check primary first (fast), fallback to secondary if not found
 * Write operations: Write to primary immediately, then sync to secondary in background
 */
export class HybridStorageAdapter implements IStorageService {
  private syncQueue: Map<string, any> = new Map();
  private isSyncing = false;
  private syncCallbacks: (() => void)[] = [];

  constructor(
    private readonly primaryStorage: IStorageStrategy,
    private readonly secondaryStorage: IStorageStrategy
  ) {
    // Start background sync on initialization
    this.startBackgroundSync();
  }

  /**
   * Register a callback to be called when sync completes
   */
  onSyncComplete(callback: () => void): void {
    this.syncCallbacks.push(callback);
  }

  /**
   * Get current sync status
   */
  getSyncStatus(): { isSyncing: boolean; queueSize: number } {
    return {
      isSyncing: this.isSyncing,
      queueSize: this.syncQueue.size,
    };
  }

  /**
   * Wait for sync to complete
   */
  async waitForSync(timeoutMs: number = 10000): Promise<boolean> {
    const startTime = Date.now();
    
    while (this.syncQueue.size > 0 || this.isSyncing) {
      if (Date.now() - startTime > timeoutMs) {
        return false; // Timeout
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return true; // Sync completed
  }

  /**
   * Get data: Try primary storage first, then secondary
   */
  async get<T>(key: string): Promise<T | null> {
    // Try primary storage first (instant)
    const primaryData = await this.primaryStorage.get<T>(key);
    if (primaryData !== null) {
      return primaryData;
    }

    // Fallback to secondary storage (network call)
    try {
      const secondaryData = await this.secondaryStorage.get<T>(key);
      if (secondaryData !== null) {
        // Cache in primary storage for next time
        await this.primaryStorage.set(key, secondaryData);
        return secondaryData;
      }
    } catch (error) {
      console.warn(`Failed to fetch ${key} from secondary storage:`, error);
    }

    return null;
  }

  /**
   * Set data: Write to primary storage immediately, queue secondary sync
   */
  async set<T>(key: string, value: T): Promise<void> {
    // Write to primary storage immediately (instant)
    await this.primaryStorage.set(key, value);

    // Queue for secondary storage sync (background)
    this.syncQueue.set(key, value);
    this.triggerSync();
  }

  /**
   * Remove data: Remove from both storages
   */
  async remove(key: string): Promise<void> {
    // Remove from primary storage immediately
    await this.primaryStorage.remove(key);

    // Remove from sync queue if present
    this.syncQueue.delete(key);

    // Remove from secondary storage in background
    try {
      await this.secondaryStorage.remove(key);
    } catch (error) {
      console.warn(`Failed to remove ${key} from secondary storage:`, error);
    }
  }

  /**
   * Clear all data from both storages
   */
  async clear(): Promise<void> {
    await this.primaryStorage.clear();
    this.syncQueue.clear();
    await this.secondaryStorage.clear();
  }

  /**
   * Get all keys from both storages (union)
   */
  async getAllKeys(): Promise<string[]> {
    const primaryKeys = await this.primaryStorage.getAllKeys();
    
    try {
      const secondaryKeys = await this.secondaryStorage.getAllKeys();
      
      // Merge and deduplicate
      const allKeys = new Set([...primaryKeys, ...secondaryKeys]);
      return Array.from(allKeys);
    } catch (error) {
      console.warn('Failed to get keys from secondary storage:', error);
      return primaryKeys;
    }
  }

  /**
   * Trigger background sync to GitHub
   */
  private triggerSync(): void {
    if (this.isSyncing || this.syncQueue.size === 0) {
      return;
    }

    this.isSyncing = true;

    // Use setTimeout to avoid blocking the UI
    setTimeout(() => this.processSyncQueue(), 100);
  }

  /**
   * Process the sync queue: upload pending changes to secondary storage
   */
  private async processSyncQueue(): Promise<void> {
    while (this.syncQueue.size > 0) {
      const entries = Array.from(this.syncQueue.entries());
      
      for (const [key, value] of entries) {
        try {
          await this.secondaryStorage.set(key, value);
          this.syncQueue.delete(key);
          console.log(`✓ Synced ${key} to secondary storage`);
        } catch (error) {
          console.error(`✗ Failed to sync ${key} to secondary storage:`, error);
          // Keep in queue for retry
        }
      }

      // Wait a bit before checking if more items were added
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    this.isSyncing = false;
    
    // Notify all callbacks that sync is complete
    this.syncCallbacks.forEach(callback => callback());
    this.syncCallbacks = [];
  }

  /**
   * Start periodic background sync (every 30 seconds)
   */
  private startBackgroundSync(): void {
    setInterval(() => {
      if (this.syncQueue.size > 0 && !this.isSyncing) {
        console.log('⟳ Starting periodic sync to secondary storage...');
        this.triggerSync();
      }
    }, 30000); // 30 seconds
  }

  /**
   * Manually trigger a full sync from primary to secondary storage
   */
  async fullSync(): Promise<void> {
    try {
      console.log('🔄 Starting full sync...');
      const primaryKeys = await this.primaryStorage.getAllKeys();
      let syncedCount = 0;
      
      for (const key of primaryKeys) {
        const value = await this.primaryStorage.get(key);
        if (value !== null) {
          await this.secondaryStorage.set(key, value);
          console.log(`✓ Full synced ${key} to secondary storage`);
          syncedCount++;
        }
      }
      
      console.log(`✓ Full sync completed (${syncedCount}/${primaryKeys.length} items)`);
    } catch (error) {
      console.error('✗ Full sync failed:', error);
      throw error;
    }
  }

  /**
   * Smart sync: Compare primary and secondary storage, only sync differences
   * This is more efficient than fullSync for large datasets
   */
  async compareAndSync(): Promise<void> {
    try {
      console.log('🔍 Starting smart sync (comparing primary vs secondary storage)...');
      const primaryKeys = await this.primaryStorage.getAllKeys();
      let syncedCount = 0;
      let skippedCount = 0;
      
      for (const key of primaryKeys) {
        const primaryValue = await this.primaryStorage.get(key);
        if (primaryValue === null) continue;
        
        // Get secondary value to compare
        const secondaryValue = await this.secondaryStorage.get(key);
        
        // Compare by stringifying (simple but effective)
        const primaryStr = JSON.stringify(primaryValue);
        const secondaryStr = secondaryValue ? JSON.stringify(secondaryValue) : null;
        
        if (primaryStr !== secondaryStr) {
          // Data is different or missing in secondary, sync it
          await this.secondaryStorage.set(key, primaryValue);
          console.log(`✓ Synced ${key} to secondary storage (changed)`);
          syncedCount++;
        } else {
          skippedCount++;
        }
      }
      
      console.log(`✓ Smart sync completed (${syncedCount} synced, ${skippedCount} unchanged)`);
    } catch (error) {
      console.error('✗ Smart sync failed:', error);
      throw error;
    }
  }

  /**
   * Pull all data from secondary to primary storage (useful for initial load or after login)
   */
  async pullFromGitHub(): Promise<void> {
    try {
      const secondaryKeys = await this.secondaryStorage.getAllKeys();
      
      for (const key of secondaryKeys) {
        const value = await this.secondaryStorage.get(key);
        if (value !== null) {
          await this.primaryStorage.set(key, value);
          console.log(`✓ Pulled ${key} from secondary storage`);
        }
      }
      
      console.log('✓ Pull from secondary storage completed');
    } catch (error) {
      console.error('✗ Pull from secondary storage failed:', error);
      throw error;
    }
  }

  /**
   * Refresh data from secondary storage: Clear all data keys (keep auth), then pull from secondary
   * This ensures primary storage is always in sync with secondary storage as source of truth
   */
  async refreshFromGitHub(): Promise<void> {
    try {
      console.log('🔄 Refreshing data from secondary storage...');
      
      // Step 1: Get all current primary storage keys
      const allKeys = await this.primaryStorage.getAllKeys();
      
      // Step 2: Clear all keys EXCEPT currentUser (auth session)
      const authKeys = ['currentUser'];
      for (const key of allKeys) {
        if (!authKeys.includes(key)) {
          await this.primaryStorage.remove(key);
          console.log(`🗑️ Cleared ${key} from primary storage`);
        }
      }
      
      // Step 3: Pull fresh data from secondary storage
      await this.pullFromGitHub();
      
      console.log('✓ Refresh from secondary storage completed');
    } catch (error) {
      console.error('✗ Refresh from secondary storage failed:', error);
      throw error;
    }
  }
}
