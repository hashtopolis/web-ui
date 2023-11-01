export type Layout = 'full' | 'fixed'
export type Theme = 'light' | 'dark'

export interface TableSettings {
  [key: string]: string[]
}

export interface UIConfig {
  layout: Layout
  theme: Theme
  tableSettings: TableSettings,
  timefmt: string,
}

export const uiConfigDefault: UIConfig = {
  layout: 'fixed',
  theme: 'light',
  timefmt: 'dd/MM/yyyy h:mm:ss',
  tableSettings: {}
}
