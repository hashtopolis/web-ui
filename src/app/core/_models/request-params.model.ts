export enum FilterType {
  EQUAL = 'eq',
  NOT_EQUAL = 'ne',
  LESSER = 'lt',
  LESSER_EQUAL = 'lte',
  GREATER = 'gt',
  GREATER_EQUAL = 'gte',
  CONTAINS = 'contains',
  STARTS = 'startswith',
  ENDS = 'endswith',
  CONTAINS_IGNORE_CASE = 'icontains',
  STARTS_IGNORE_CASE = 'istartswith',
  ENDS_IGNORE_CASE = 'iendswith'
}

export interface Filter {
  field: string;
  operator: FilterType
  value: string | number | boolean;
}

export interface RequestParams {
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
