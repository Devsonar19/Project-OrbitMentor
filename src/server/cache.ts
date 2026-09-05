/**
 * PROJECT ORBITMENTOR - High-Efficiency In-Memory Cache
 * 
 * Implements a time-to-live (TTL) and LRU eviction cache to reduce latency,
 * save Gemini API token bandwidth, and provide instantaneous responses (<10ms)
 * for repeated or common student project generation queries.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class MemoryCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxEntries: number;
  private defaultTtlMs: number;

  constructor(maxEntries = 100, defaultTtlSeconds = 900) {
    this.maxEntries = maxEntries;
    this.defaultTtlMs = defaultTtlSeconds * 1000;
  }

  /**
   * Generates a deterministic cache key from an object or string
   */
  public static createKey(prefix: string, payload: unknown): string {
    if (typeof payload === 'string') {
      return `${prefix}:${payload.toLowerCase().trim()}`;
    }
    try {
      const serialized = JSON.stringify(payload, Object.keys(payload as object).sort());
      return `${prefix}:${serialized.toLowerCase()}`;
    } catch {
      return `${prefix}:${String(payload)}`;
    }
  }

  /**
   * Retrieves an item from cache if it exists and has not expired.
   */
  public get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    // Refresh position for LRU semantics
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.value;
  }

  /**
   * Stores an item with an optional custom TTL.
   */
  public set(key: string, value: T, ttlSeconds?: number): void {
    const ttlMs = ttlSeconds ? ttlSeconds * 1000 : this.defaultTtlMs;

    // Evict oldest entry if at capacity
    if (this.cache.size >= this.maxEntries) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  /**
   * Clears all cache entries (useful for testing)
   */
  public clear(): void {
    this.cache.clear();
  }

  /**
   * Returns current active entry count
   */
  public size(): number {
    return this.cache.size;
  }
}
