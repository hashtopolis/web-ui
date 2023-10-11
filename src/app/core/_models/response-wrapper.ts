export interface ResponseWrapper<T> {
  _expandable?: string
  startAt: number
  maxResults: number
  total: number
  isLast: boolean
  values: T[]
}