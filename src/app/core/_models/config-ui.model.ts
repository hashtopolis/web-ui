import { AgentsTableColumnLabel } from "../_components/tables/agents-table/agents-table.constants"

export type Layout = 'full' | 'fixed'
export type Theme = 'light' | 'dark'

export interface TableSettings {
  [key: string]: string[]
}

export interface UIConfig {
  layout: Layout
  theme: Theme
  tableSettings: TableSettings
  timefmt: string
  refreshPage: boolean
  refreshInterval: number
}

export const uiConfigDefault: UIConfig = {
  layout: 'fixed',
  theme: 'light',
  timefmt: 'dd/MM/yyyy h:mm:ss',
  tableSettings: {
    agentTable: [
      AgentsTableColumnLabel.ID,
      AgentsTableColumnLabel.STATUS,
      AgentsTableColumnLabel.NAME,
      AgentsTableColumnLabel.USER,
      AgentsTableColumnLabel.CLIENT,
      AgentsTableColumnLabel.GPUS_CPUS,
      AgentsTableColumnLabel.LAST_ACTIVITY,
      AgentsTableColumnLabel.ACCESS_GROUP
    ],
  },
  refreshPage: false,
  refreshInterval: 10
}
