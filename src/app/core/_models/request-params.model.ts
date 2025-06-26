/**
 * Different filter used in API requests
 * - `EQUAL`    Fetch all resources equal to value
 * - `NOTEQUAL`  Fetch all resources not equal to value
 * - `GREATER`  Fetch all resources greater than value
 * - `IN`       Fetch all resources contained in list of values
 * - `NOTIN`    Fetch all resources not contained in list of values
 * @enum
 */
export enum FilterType {
  EQUAL = 'eq',
  NOTEQUAL = 'neq',
  GREATER = 'gt',
  IN = 'in',
  NOTIN = 'nin',
  CONTAINS = 'contains'
}

/**
 * Interface definition for API Filter
 * @prop field    Field name to filter
 * @prop operator `FilterType`
 * @prop value    Filter value
 */
export interface Filter {
  field: string;
  operator: FilterType;
  value: string | number | number[] | boolean | string[];
}

/**
 * Interface definition for request params
 */
interface IRequestParams {
  page?: {
    size?: number;
    after?: number;
    before?: number;
  };
  //array of object names to include ex. [files, speeds]
  include?: Array<string>;
  // Array of Filter objects that have to be performed
  filter?: Array<Filter>;
  //array of attributes to sort on where '-' implies descending order on ex. [id, -name]
  sort?: Array<string>;
  //Parameter for count endpoints to also include the count without filters
  include_total?: boolean;
}

export type RequestParams = IRequestParams;
