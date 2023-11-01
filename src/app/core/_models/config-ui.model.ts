export class IStorage {
  constructor(
    private _timefmt: string,
    private _enablebrain: number,
    private _halias: string,
    private _bchars: string,
    private _chunkt: string,
    private _statimer: string,
    private _timestamp: number,
    private _expiresin: number,
  ) { }
}

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
