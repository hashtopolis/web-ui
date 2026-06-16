/**
 * Different filter used in API requests
 * - `EQUAL`    Fetch all resources equal to value
 * - `NOTEQUAL`  Fetch all resources not equal to value
 * - `GREATER`  Fetch all resources greater than value
 * - `IN`       Fetch all resources contained in list of values
 * - `NOTIN`    Fetch all resources not contained in list of values
 * - `CONTAINS`  Fetch all resources containing value
 * - `ICONTAINS` Fetch all resources containing value (case insensitive)
 * @enum
 */
export enum FilterType {
  EQUAL = 'eq',
  NOTEQUAL = 'neq',
  GREATER = 'gt',
  IN = 'in',
  NOTIN = 'nin',
  CONTAINS = 'contains',
  ICONTAINS = 'icontains',
  LESSER = 'lt'
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
  parent?: string | undefined;
}

/**
 * Interface definition for an aggregate fieldset request
 * @prop field   Entity the aggregate values belong to (e.g. 'task', 'pretask')
 * @prop values  Aggregate field names to compute for that entity (e.g. ['searched', 'dispatched'])
 */
export interface Aggregate {
  field: string;
  values: string[];
}

/**
 * Interface definition for request params
 */
interface IRequestParams {
  page?: {
    size?: number;
    after?: number | string;
    before?: number | string;
  };
  //array of object names to include ex. [files, speeds]
  include?: Array<string>;
  // Array of Filter objects that have to be performed
  filter?: Array<Filter>;
  // Array of aggregate fieldsets to request, emitted as aggregate[<field>]=<values> query params
  aggregate?: Array<Aggregate>;
  //array of attributes to sort on where '-' implies descending order on ex. [id, -name]
  sort?: Array<string>;
  //Parameter for count endpoints to also include the count without filters
  include_total?: boolean;
}

export type RequestParams = IRequestParams;

declare const TYPED_PARAMS_BRAND: unique symbol;

/**
 * `RequestParams` branded (at the type level only) with the include relationships and aggregate fields that
 * were requested via the builder. Lets `deserialize(body, schema, params)` derive the result type from the
 * exact same params object that was sent — the single source of truth.
 *
 * `Inc` is the union of requested include keys; `Agg` is the union of requested aggregate field names (across
 * all entities — the deserializer intersects it with the target entity's aggregate set, so cross-entity names
 * are filtered out). The brand is a phantom (never present at runtime), so a `TypedRequestParams` is
 * structurally a plain `RequestParams` and is accepted anywhere one is.
 */
export type TypedRequestParams<Inc extends string = never, Agg extends string = never> = RequestParams & {
  readonly [TYPED_PARAMS_BRAND]?: { inc: Inc; agg: Agg };
};
