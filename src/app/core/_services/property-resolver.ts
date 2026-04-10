export class PropertyResolver {
  static resolve(path: string, obj: object): unknown {
    return path.split('.').reduce<unknown>((prev, curr) => {
      return prev ? (prev as Record<string, unknown>)[curr] : undefined;
    }, obj);
  }
}
