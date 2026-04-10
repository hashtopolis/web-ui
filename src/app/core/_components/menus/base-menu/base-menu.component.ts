import { Component, EventEmitter, Input, Output } from '@angular/core';

import { BaseModel, DynamicModel } from '@models/base.model';

import { ContextMenuType } from '@services/context-menu/base/context-menu.service';

import { ActionMenuEvent, ActionMenuItem } from '@src/app/core/_components/menus/action-menu/action-menu.model';

@Component({
  selector: 'base-menu',
  template: '',
  standalone: false
})
export class BaseMenuComponent<T extends BaseModel = BaseModel> {
  @Input() disabled = false;
  @Input() data!: T;

  @Output() menuItemClicked = new EventEmitter<ActionMenuEvent<T>>();

  actionMenuItems: ActionMenuItem[][] = [];

  protected addActionMenuItem(index: number, item: ActionMenuItem): void {
    if (this.actionMenuItems.length <= index || this.actionMenuItems[index] == undefined) {
      this.actionMenuItems[index] = [item];
    } else {
      this.actionMenuItems[index].push(item);
    }
  }

  /**
   * Add a menu item and check the condition before adding it
   *
   * The condition contains a key, which should be checked in the data object and a boolean value
   *
   * @param item
   * @param data
   * @protected
   */
  protected conditionallyAddMenuItem(item: ContextMenuType, data: T): void {
    const condition = item.condition;
    if (!condition?.key || condition.key.length === 0) {
      this.addActionMenuItem(item.index, item.menuItem);
      return;
    }

    const value = (data as DynamicModel)[condition.key];
    const matches = Array.isArray(value)
      ? (value.length > 0) === condition.value
      : Boolean(value) === condition.value;

    if (matches) {
      this.addActionMenuItem(item.index, item.menuItem);
    }
  }

  onMenuItemClick(event: ActionMenuEvent<T | undefined>): void {
    this.menuItemClicked.emit(event as ActionMenuEvent<T>);
  }
}
