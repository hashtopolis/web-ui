import { CacheService } from "../_services/shared/cache.service";

/**
 * A decorator for caching the results of a method based on its arguments.
 *
 * @param property - An optional array of attribute names to construct the cache key from.
 *                   If provided, the cache key will be constructed based on the values of these attributes.
 *                   If not provided, the cache key will be based on the stringified arguments.
 * @returns A decorator function.
*
 * @example
 * ```typescript
 * class YourClass {
 *   @Cacheable(['arg1', 'arg2'])
 *   yourMethod(arg1: string, arg2: number): any {
 *     // Your method logic here
 *   }
 * }
 * ```
 */
export function Cacheable(property: string[] | undefined = undefined): MethodDecorator {
  return function (target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor.value = function (...args: any[]): any {
      let cacheKey: string
      if (property) {
        const attributeValues = property.map((key) => args[0][key] || '').join('_');
        cacheKey = `${propertyKey.toString()}_${attributeValues}`;
      } else {
        cacheKey = `${propertyKey.toString()}_${JSON.stringify(args)}`;
      }
      const cachedResult = CacheService.get(cacheKey);

      if (cachedResult !== undefined) {
        return cachedResult;
      }

      const result = originalMethod.apply(this, args);
      CacheService.set(cacheKey, result);
      return result;
    };

    return descriptor;
  };
}