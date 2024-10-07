import {CacheValue, ICache} from './cache';

export default class MemoryCache implements ICache {
  private cache: Map<string, CacheValue>;

  constructor() {
    this.cache = new Map();
  }

  public get<T extends CacheValue>(key: string, defaultValue: T) {
    const value = this.cache.get(key);
    return Promise.resolve(value ? (value as T) : defaultValue);
  }

  public set<T extends CacheValue>(key: string, value: T) {
    this.cache.set(key, value);
    return Promise.resolve();
  }

  public delete(key: string) {
    this.cache.delete(key);
    return Promise.resolve();
  }
}
