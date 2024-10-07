import MemoryCache from '../cache/memory';
import {CacheValue, ICache} from '../cache/cache';

describe('MemoryCache', () => {
  let cache: ICache;

  beforeEach(() => {
    cache = new MemoryCache();
  });

  it('should return default if key does not exist', async () => {
    const result = await cache.get('nonexistent', 'default');
    expect(result).toStrictEqual('default');
  });

  it('should return the correct value if key exists', async () => {
    const value: CacheValue = {foo: 'bar'};
    await cache.set('existent', value);
    const result = await cache.get('existent', 'default');
    expect(result).toEqual(value);
  });

  it('should set value correctly', async () => {
    const value: CacheValue = {foo: 'bar'};
    await cache.set('key', value);
    const result = await cache.get('key', 'default');
    expect(result).toEqual(value);
  });

  it('should delete value correctly', async () => {
    const value: CacheValue = {foo: 'bar'};
    await cache.set('key', value);
    const result1 = await cache.get('key', 'default');
    expect(result1).toStrictEqual(value);
    await cache.delete('key');
    const result2 = await cache.get('key', 'default');
    expect(result2).toStrictEqual('default');
  });
});
