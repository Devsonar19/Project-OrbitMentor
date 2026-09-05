import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { MemoryCache } from '../src/server/cache';

describe('MemoryCache Engine', () => {
  it('stores and retrieves cached items accurately', () => {
    const cache = new MemoryCache<string>(10, 60);
    cache.set('test-key', 'sample-value');
    assert.equal(cache.get('test-key'), 'sample-value');
  });

  it('returns null for non-existent keys', () => {
    const cache = new MemoryCache<string>(10, 60);
    assert.equal(cache.get('missing-key'), null);
  });

  it('expires entries after TTL duration', async () => {
    const cache = new MemoryCache<string>(10, 0.05); // 50ms TTL
    cache.set('short-lived', 'temporary-data');
    assert.equal(cache.get('short-lived'), 'temporary-data');

    await new Promise((resolve) => setTimeout(resolve, 80));
    assert.equal(cache.get('short-lived'), null);
  });

  it('evicts oldest items when capacity is exceeded', () => {
    const cache = new MemoryCache<number>(2, 60); // max 2 items
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3); // should evict 'a'

    assert.equal(cache.get('a'), null);
    assert.equal(cache.get('b'), 2);
    assert.equal(cache.get('c'), 3);
  });

  it('generates deterministic cache keys', () => {
    const key1 = MemoryCache.createKey('prefix', { domain: 'IoT', tier: 'Safe' });
    const key2 = MemoryCache.createKey('prefix', { tier: 'Safe', domain: 'IoT' });
    assert.equal(key1, key2);
  });
});
