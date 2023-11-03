import { SafeHtml } from "@angular/platform-browser"

export type DataType = 'agents' | 'tasks' | 'chunks'

export interface HTTableIcon {
  name: string
  tooltip?: string
  cls?: string
}

export interface HTTableColumn {
  name: string
  dataKey: string
  position?: 'right' | 'left'
  isSortable?: boolean
  icons?: (data: any) => Promise<HTTableIcon[]>
  render?: (data: any) => SafeHtml
  async?: (data: any) => Promise<SafeHtml>
  routerLink?: (data: any) => any[],
  export?: (data: any) => Promise<string>
}