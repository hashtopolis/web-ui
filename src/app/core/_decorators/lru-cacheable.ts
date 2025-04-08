import { LruCacheService } from '@services/shared/lru-cache.service';

export function LruCacheable(
  property: string[] | undefined = undefined
): MethodDecorator {
  return function(
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor.value = function(...args: any[]): object {
      const myProperties = property !== undefined ? property.slice() : [];
      myProperties.push('id', 'type');
      const cacheService = LruCacheService.getInstance();
      let cacheKey: string;
      const attributeValues = myProperties.map((key) => args[0][key]).join('_').replaceAll(' ', '_');
      cacheKey = `${propertyKey.toString()}_${attributeValues}`;
      let cachedResult = cacheService.get(cacheKey);

      if (cachedResult === undefined) {
        cachedResult = originalMethod.apply(this, args);
        cacheService.set(cacheKey, cachedResult);
      }

      return cachedResult;
    };

    return descriptor;
  };
}
