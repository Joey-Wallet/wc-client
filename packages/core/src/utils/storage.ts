import { openDB } from 'idb';
import type { IDBPDatabase } from 'idb';

export interface IKeyValueStorage {
  setItem: <T = any>(key: string, value: T) => Promise<void>;
  getItem: <T = any>(key: string) => Promise<T | undefined>;
  removeItem: (key: string) => Promise<void>;
  getKeys: () => Promise<string[]>;
  getEntries: <T = any>() => Promise<[string, T][]>;
}

export class IndexedDBStorage implements IKeyValueStorage {
  private dbName: string;
  private storeName: string;
  private dbPromise: Promise<IDBPDatabase>;

  constructor(dbName: string = 'WalletConnectDB', storeName: string = 'KeyValueStore') {
    this.dbName = dbName;
    this.storeName = storeName;
    this.dbPromise = this.initDB();
  }

  // Initialize IndexedDB database and object store using idb
  private initDB(): Promise<IDBPDatabase> {
    const storeName = this.storeName; // Capture storeName in closure
    return openDB(this.dbName, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'key' });
        }
      },
    });
  }

  async setItem<T = any>(key: string, value: T): Promise<void> {
    try {
      const db = await this.dbPromise;
      await db.put(this.storeName, { key, value });
    } catch (error) {
      console.error(`Error setting item "${key}" in IndexedDB:`, error);
      throw new Error(
        `Failed to set item "${key}": ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getItem<T = any>(key: string): Promise<T | undefined> {
    try {
      const db = await this.dbPromise;
      const result = await db.get(this.storeName, key);
      return result ? result.value : undefined;
    } catch (error) {
      console.error(`Error getting item "${key}" from IndexedDB:`, error);
      throw new Error(
        `Failed to get item "${key}": ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      const db = await this.dbPromise;
      await db.delete(this.storeName, key);
    } catch (error) {
      console.error(`Error removing item "${key}" from IndexedDB:`, error);
      throw new Error(
        `Failed to remove item "${key}": ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getKeys(): Promise<string[]> {
    try {
      const db = await this.dbPromise;
      return (await db.getAllKeys(this.storeName)) as string[];
    } catch (error) {
      console.error('Error getting keys from IndexedDB:', error);
      throw new Error(
        `Failed to get keys: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getEntries<T = any>(): Promise<[string, T][]> {
    try {
      const db = await this.dbPromise;
      const entries = await db.getAll(this.storeName);
      return entries.map(
        (item: { key: string; value: T }) => [item.key, item.value] as [string, T]
      );
    } catch (error) {
      console.error('Error getting entries from IndexedDB:', error);
      throw new Error(
        `Failed to get entries: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

export class MemoryStorage implements IKeyValueStorage {
  private store: Map<string, any> = new Map();

  async setItem<T = any>(key: string, value: T): Promise<void> {
    this.store.set(key, value);
  }

  async getItem<T = any>(key: string): Promise<T | undefined> {
    return this.store.get(key);
  }

  async removeItem(key: string): Promise<void> {
    this.store.delete(key);
  }

  async getKeys(): Promise<string[]> {
    return Array.from(this.store.keys());
  }

  async getEntries<T = any>(): Promise<[string, T][]> {
    return Array.from(this.store.entries()) as [string, T][];
  }
}

export class NoStorage implements IKeyValueStorage {
  async setItem<T = any>(key: string, value: T): Promise<void> {
    // Do nothing
  }

  async getItem<T = any>(key: string): Promise<T | undefined> {
    return undefined;
  }

  async removeItem(key: string): Promise<void> {
    // Do nothing
  }

  async getKeys(): Promise<string[]> {
    return [];
  }

  async getEntries<T = any>(): Promise<[string, T][]> {
    return [];
  }
}

export class LocalStorage implements IKeyValueStorage {
  async setItem<T = any>(key: string, value: T): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value));
  }

  async getItem<T = any>(key: string): Promise<T | undefined> {
    const value = localStorage.getItem(key);
    if (value === null) return undefined;
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Error parsing localStorage value for key "${key}":`, error);
      return undefined; // Return undefined for invalid JSON
    }
  }

  async removeItem(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  async getKeys(): Promise<string[]> {
    return Object.keys(localStorage);
  }

  async getEntries<T = any>(): Promise<[string, T][]> {
    return Object.entries(localStorage).map(([key, value]) => [
      key,
      value ? JSON.parse(value) : undefined,
    ]) as [string, T][];
  }
}
