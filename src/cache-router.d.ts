import type { Result, Router } from 'hono/router';
/**
 * Cache routing result.
 * @template T - The type of the handler
 */
export declare class CacheRouter<T> implements Router<T> {
    #private;
    name: string;
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
    constructor(init: {
        router: Router<T>;
        maxCacheEntries?: number;
        checkDiffOnAdd?: boolean;
    });
    add(method: string, path: string, handler: T): void;
    match(method: string, path: string): Result<T>;
}
//# sourceMappingURL=cache-router.d.ts.map