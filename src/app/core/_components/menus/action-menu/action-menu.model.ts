export interface ActionMenuEvent<T> {
  menuItem: ActionMenuItem
  data: T
}

export interface ActionMenuItem {
  label: string
  action: string
  icon?: string
  red?: boolean
}