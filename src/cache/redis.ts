import {
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from 'redis';
import {CacheValue, ICache} from './cache';

export default class RedisCache<
  M extends RedisModules,
  F extends RedisFunctions,
  S extends RedisScripts
> implements ICache
{
  constructor(private client: RedisClientType<M, F, S>) {}

  public async get(key: string, defaultValue: CacheValue = null) {
    const stringValue = await this.client.get(key);
    return stringValue ? JSON.parse(stringValue) : defaultValue;
  }

  public async set(key: string, value: CacheValue) {
    const stringValue = JSON.stringify(value);
    await this.client.set(key, stringValue);
  }

  public async delete(key: string) {
    await this.client.del(key);
  }
}
