export interface ListResponseWrapper<T> {
  _expandable: string
  startAt: number
  maxResults: number
  total: number
  isLast: number
  values: T[]
}