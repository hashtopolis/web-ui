import { TJsonApiLinks } from 'jsona/lib/JsonaTypes';

/**
 * Interface for base object model for json:api resources
 * @prop id                 Database ID of object
 * @prop type               Resource type
 * @prop links              Links to related objects and for pagination
 * @prop relationshipNames  Names of related resources
 */
export interface BaseModel {
  id: number;
  type: string;
  links?: TJsonApiLinks;
  relationshipNames?: string[];
}

/** BaseModel with index signature for dynamic property access (menus, table utils, etc.). */
export type DynamicModel = BaseModel & Record<string, unknown>;

/**
 * Shape of `T` with all on-demand conditional fields removed — the default response shape.
 * works for `?include=` relationships and `aggregate[..]=` fields alike.
 */
export type Thin<T, Conditional extends keyof T> = Omit<T, Conditional>;

/**
 * Shape of `T` with only a chosen subset `K` of on-demand conditional fields present.
 * works for `?include=` relationships and `aggregate[..]=` fields alike.
 */
export type With<T, Conditional extends keyof T, K extends Conditional> = Omit<T, Conditional> & Pick<T, K>;
