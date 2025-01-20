export interface RequestParams {
  maxResults: number;
  startsAt: number;
  include?: string;
  filter?: string;
  ordering?: string;

// OLD remove later
  expand?: string;
}
