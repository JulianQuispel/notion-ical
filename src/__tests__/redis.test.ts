import {
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from 'redis';
import RedisCache from '../cache/redis';
import {CacheValue} from '../cache/cache';

jest.mock('redis', () => ({
  createClient: jest.fn(),
}));

describe('RedisCache', () => {
  let client: RedisClientType;
  let cache: RedisCache<RedisModules, RedisFunctions, RedisScripts>;

  beforeEach(() => {
    client = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    } as unknown as RedisClientType;
    cache = new RedisCache(client);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return default value if key does not exist', async () => {
    (client.get as jest.Mock).mockResolvedValue(null);
    const result = await cache.get('nonexistent', 'default');
    expect(result).toBe('default');
    expect(client.get).toHaveBeenCalledWith('nonexistent');
  });

  it('should return parsed value if key exists', async () => {
    const value = {foo: 'bar'};
    (client.get as jest.Mock).mockResolvedValue(JSON.stringify(value));
    const result = await cache.get('existent');
    expect(result).toEqual(value);
    expect(client.get).toHaveBeenCalledWith('existent');
  });

  it('should set value correctly', async () => {
    const value: CacheValue = {foo: 'bar'};
    await cache.set('key', value);
    expect(client.set).toHaveBeenCalledWith('key', JSON.stringify(value));
  });

  it('should delete value correctly', async () => {
    await cache.delete('key');
    expect(client.del).toHaveBeenCalledWith('key');
  });
});
