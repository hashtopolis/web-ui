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
