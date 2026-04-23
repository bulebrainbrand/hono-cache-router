# hono-cache-router

Cache routing for long time running optimaize.

## usage

when make `Hono` instance,set router option.

```typescript
new Hono({
  // CacheRouter expect router option
  router: new CacheRouter({
    router: new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()],
    }),
  }),
});
```
