import { TJsonApiLinks } from 'jsona/lib/JsonaTypes';

export interface BaseModel {
  id: number;
  type: string;
  links?: TJsonApiLinks;
  relationshipNames?: string[];
}
