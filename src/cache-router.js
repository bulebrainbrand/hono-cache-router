import { METHOD_NAME_ALL } from 'hono/router';
/**
 * Cache routing result.
 * @template T - The type of the handler
 */
export class CacheRouter {
    name = 'CacheRouter';
    #router;
    #maxCacheEntries;
    #cache;
    #checkDiffOnAdd;
    /**
     * @param init
     * @param init.router - The underlying router used internally by CacheRouter.
     * @param init.maxCacheEntries - Maximum number of cache entries. Must be a positive number. The default is `100`.
     * @param init.checkDiffOnAdd - Strategy for cache invalidation when `add()` method is called:
     * - `true`: Remove only cache entries matching `method`. This is an O(n) operation and may impact performance
     * - `false`: Remove all cache. This is O(1).
     * The default value is `false`.
     * @throws {TypeError} - `init.maxCacheEntries` is less than 1
     */
    constructor(init) {
        this.#router = init.router;
        init.maxCacheEntries ??= 100;
        if (init.maxCacheEntries < 1) {
            throw new TypeError('maxCacheEntries must be greater than or equal to 1. If you want unlimited caching, use `Infinity`.');
        }
        this.#maxCacheEntries = init.maxCacheEntries;
        this.#cache = new Map();
        init.checkDiffOnAdd ??= false;
        this.#checkDiffOnAdd = init.checkDiffOnAdd;
    }
    add(method, path, handler) {
        if (this.#checkDiffOnAdd) {
            if (method === METHOD_NAME_ALL) {
                this.#cache.clear();
            }
            else {
                for (const cacheId of this.#cache.keys()) {
                    const [cacheMethod] = cacheId.split('__');
                    if (cacheMethod === method) {
                        this.#cache.delete(cacheId);
                    }
                }
            }
        }
        else {
            this.#cache.clear();
        }
        this.#router.add(method, path, handler);
    }
    match(method, path) {
        const id = `${method}__${path}`;
        const cachedResult = this.#cache.get(id);
        if (cachedResult) {
            // Cache hit
            // move the cache to map tail for LRU(defer its eviction)
            this.#cache.delete(id);
            this.#cache.set(id, cachedResult);
            return cachedResult;
        }
        // Cache miss
        const result = this.#router.match(method, path);
        if (this.#cache.size >= this.#maxCacheEntries) {
            // Evict the least recently used entry (LRU policy)
            this.#cache.delete(this.#cache.keys().next().value);
        }
        this.#cache.set(id, result);
        return result;
    }
}
//# sourceMappingURL=cache-router.js.map