export interface RequestParams {
  maxResults: number;
  startsAt: number;
  expand?: string;
  filter?: string;
  ordering?: string;
}
