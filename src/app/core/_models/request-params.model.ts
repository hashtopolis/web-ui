export interface Filter {
  field: string,
  operator: "eq" | "ne" | "lt" | "lte" | "gt" | "gte" | "contains" | "startswith" | "endswith" | 
            "icontains" | "istartswith" | "iendswith",
  value: string | number | boolean
}

export interface RequestParams {
  page?: {
    size?: number;
    after?: number;
    before?: number;
  };
  //array of object names to include ex. [files, speeds]
  include?: Array<string>,
  // Array of Filter objects that have to be performed
  filter?: Array<Filter>,
  //array of attributes to sort on where '-' implies decending order on ex. [id, -name] 
  sort?: Array<string>,
  //Parameter for count endpoints to also include the count without filters
  include_total?: boolean
}