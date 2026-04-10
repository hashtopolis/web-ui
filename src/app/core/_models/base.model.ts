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

