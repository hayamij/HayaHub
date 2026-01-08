/**
 * Storage Strategy Interface
 * Defines contract for storage implementations (localStorage, GitHub, PostgreSQL, etc.)
 */
export interface IStorageStrategy {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  getAllKeys(): Promise<string[]>;
}
