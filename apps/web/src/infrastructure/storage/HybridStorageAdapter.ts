import type { IStorageService } from 'hayahub-business';
import { LocalStorageAdapter } from './LocalStorageAdapter';
import { GitHubStorageAdapter } from './GitHubStorageAdapter';

/**
 * Hybrid Storage Adapter that combines LocalStorage and GitHub API
 * 
 * Strategy:
 * - Read operations: First check localStorage (fast), fallback to GitHub if not found
 * - Write operations: Write to localStorage immediately (instant feedback), then sync to GitHub in background
 * - This provides smooth UX with localStorage speed while maintaining GitHub persistence
 */
export class HybridStorageAdapter implements IStorageService {
  private localStorage: LocalStorageAdapter;
  private githubStorage: GitHubStorageAdapter;
  private syncQueue: Map<string, any> = new Map();
  private isSyncing = false;
  private syncCallbacks: (() => void)[] = [];

  constructor() {
    this.localStorage = new LocalStorageAdapter();
    this.githubStorage = new GitHubStorageAdapter();
    
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
   * Get data: Try localStorage first, then GitHub
   */
  async get<T>(key: string): Promise<T | null> {
    // Try localStorage first (instant)
    const localData = await this.localStorage.get<T>(key);
    if (localData !== null) {
      return localData;
    }

    // Fallback to GitHub (network call)
    try {
      const githubData = await this.githubStorage.get<T>(key);
      if (githubData !== null) {
        // Cache in localStorage for next time
        await this.localStorage.set(key, githubData);
        return githubData;
      }
    } catch (error) {
      console.warn(`Failed to fetch ${key} from GitHub:`, error);
    }

    return null;
  }

  /**
   * Set data: Write to localStorage immediately, queue GitHub sync
   */
  async set<T>(key: string, value: T): Promise<void> {
    // Write to localStorage immediately (instant)
    await this.localStorage.set(key, value);

    // Queue for GitHub sync (background)
    this.syncQueue.set(key, value);
    this.triggerSync();
  }

  /**
   * Remove data: Remove from both storages
   */
  async remove(key: string): Promise<void> {
    // Remove from localStorage immediately
    await this.localStorage.remove(key);

    // Remove from sync queue if present
    this.syncQueue.delete(key);

    // Remove from GitHub in background
    try {
      await this.githubStorage.remove(key);
    } catch (error) {
      console.warn(`Failed to remove ${key} from GitHub:`, error);
    }
  }

  /**
   * Clear all data from both storages
   */
  async clear(): Promise<void> {
    await this.localStorage.clear();
    this.syncQueue.clear();
    // Note: GitHub clear is not implemented in GitHubStorageAdapter
    await this.githubStorage.clear();
  }

  /**
   * Get all keys from both storages (union)
   */
  async getAllKeys(): Promise<string[]> {
    const localKeys = await this.localStorage.getAllKeys();
    
    try {
      const githubKeys = await this.githubStorage.getAllKeys();
      
      // Merge and deduplicate
      const allKeys = new Set([...localKeys, ...githubKeys]);
      return Array.from(allKeys);
    } catch (error) {
      console.warn('Failed to get keys from GitHub:', error);
      return localKeys;
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
   * Process the sync queue: upload pending changes to GitHub
   */
  private async processSyncQueue(): Promise<void> {
    while (this.syncQueue.size > 0) {
      const entries = Array.from(this.syncQueue.entries());
      
      for (const [key, value] of entries) {
        try {
          await this.githubStorage.set(key, value);
          this.syncQueue.delete(key);
          console.log(`✓ Synced ${key} to GitHub`);
        } catch (error) {
          console.error(`✗ Failed to sync ${key} to GitHub:`, error);
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
        console.log('⟳ Starting periodic sync to GitHub...');
        this.triggerSync();
      }
    }, 30000); // 30 seconds
  }

  /**
   * Manually trigger a full sync from localStorage to GitHub
   */
  async fullSync(): Promise<void> {
    try {
      console.log('🔄 Starting full sync...');
      const localKeys = await this.localStorage.getAllKeys();
      let syncedCount = 0;
      
      for (const key of localKeys) {
        const value = await this.localStorage.get(key);
        if (value !== null) {
          await this.githubStorage.set(key, value);
          console.log(`✓ Full synced ${key} to GitHub`);
          syncedCount++;
        }
      }
      
      console.log(`✓ Full sync completed (${syncedCount}/${localKeys.length} items)`);
    } catch (error) {
      console.error('✗ Full sync failed:', error);
      throw error;
    }
  }

  /**
   * Smart sync: Compare localStorage and GitHub, only sync differences
   * This is more efficient than fullSync for large datasets
   */
  async compareAndSync(): Promise<void> {
    try {
      console.log('🔍 Starting smart sync (comparing localStorage vs GitHub)...');
      const localKeys = await this.localStorage.getAllKeys();
      let syncedCount = 0;
      let skippedCount = 0;
      
      for (const key of localKeys) {
        const localValue = await this.localStorage.get(key);
        if (localValue === null) continue;
        
        // Get GitHub value to compare
        const githubValue = await this.githubStorage.get(key);
        
        // Compare by stringifying (simple but effective)
        const localStr = JSON.stringify(localValue);
        const githubStr = githubValue ? JSON.stringify(githubValue) : null;
        
        if (localStr !== githubStr) {
          // Data is different or missing in GitHub, sync it
          await this.githubStorage.set(key, localValue);
          console.log(`✓ Synced ${key} to GitHub (changed)`);
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
   * Pull all data from GitHub to localStorage (useful for initial load or after login)
   */
  async pullFromGitHub(): Promise<void> {
    try {
      const githubKeys = await this.githubStorage.getAllKeys();
      
      for (const key of githubKeys) {
        const value = await this.githubStorage.get(key);
        if (value !== null) {
          await this.localStorage.set(key, value);
          console.log(`✓ Pulled ${key} from GitHub`);
        }
      }
      
      console.log('✓ Pull from GitHub completed');
    } catch (error) {
      console.error('✗ Pull from GitHub failed:', error);
      throw error;
    }
  }

  /**
   * Refresh data from GitHub: Clear all data keys (keep auth), then pull from GitHub
   * This ensures localStorage is always in sync with GitHub as source of truth
   */
  async refreshFromGitHub(): Promise<void> {
    try {
      console.log('🔄 Refreshing data from GitHub...');
      
      // Step 1: Get all current localStorage keys
      const allKeys = await this.localStorage.getAllKeys();
      
      // Step 2: Clear all keys EXCEPT currentUser (auth session)
      const authKeys = ['currentUser'];
      for (const key of allKeys) {
        if (!authKeys.includes(key)) {
          await this.localStorage.remove(key);
          console.log(`🗑️ Cleared ${key} from localStorage`);
        }
      }
      
      // Step 3: Pull fresh data from GitHub
      await this.pullFromGitHub();
      
      console.log('✓ Refresh from GitHub completed');
    } catch (error) {
      console.error('✗ Refresh from GitHub failed:', error);
      throw error;
    }
  }
}
