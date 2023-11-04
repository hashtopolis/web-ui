import { ActionMenuItem } from "src/app/core/_components/menus/action-menu/action-menu.model"

export interface MainMenuItem {
  label?: string
  icon?: string
  actions: ActionMenuItem[][]
  display: boolean
}