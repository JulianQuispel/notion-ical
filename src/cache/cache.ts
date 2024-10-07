export type CacheValue = number | string | boolean | object | null;

export interface ICache {
  get<T extends CacheValue>(key: string, defaultValue: T): Promise<T>;
  set<T extends CacheValue>(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
}
