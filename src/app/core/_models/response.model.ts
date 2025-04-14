import { TJsonApiBody } from 'jsona/lib/JsonaTypes';

/**
 * Interface for response object received by json:api call
 * @extends TJsonApiBody This interface extends TJsonApiBody from jsona library containing data and included
 * relationships
 * @prop jsonapi  Object containing json:api version and extensions
 * @prop links    Object containing json:api links
 * @prop meta     Object containing metadata like count of received and total objects/resources
 */
export interface ResponseWrapper extends TJsonApiBody {
  jsonapi?: JsonApi;
  links?: Links;
  meta?: Meta;
}

/**
 * Interface for json:api data
 * @prop version Version of json:api specification
 * @prop ext     List of used json:api extensions
 */
export interface JsonApi {
  version: string;
  ext: string[];
}

/**
 * Interface for json:api links containing links for pagination
 * @prop self URL of the current resource or request
 * @prop first URL of the first page of results.
 * @prop last URL of the last page of results.
 * @prop next URL of the next page of results.
 * @prop prev URL of the previous page of results.
 */
export interface Links {
  self: string;
  first?: string;
  last?: string;
  next?: null;
  prev?: string;
}

/**
 * Interface for json:api metadata
 * @prop count Amount of returned objects/resources
 * @prop total_count Total amount of objects/resources on the server
 */
export interface Meta {
  count?: number;
  total_count?: number;
}
