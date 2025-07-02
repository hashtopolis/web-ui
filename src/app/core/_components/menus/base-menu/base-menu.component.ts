import { Component, EventEmitter, Input, Output } from '@angular/core';

import { BaseModel } from '@models/base.model';

import { ContextMenuType } from '@services/context-menu/base/context-menu.service';

import { ActionMenuEvent, ActionMenuItem } from '@src/app/core/_components/menus/action-menu/action-menu.model';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'base-menu',
  template: '',
  standalone: false
})
export class BaseMenuComponent {
  @Input() disabled = false;
  @Input() data: any;

  @Output() menuItemClicked: EventEmitter<ActionMenuEvent<BaseModel>> = new EventEmitter<ActionMenuEvent<BaseModel>>();

  actionMenuItems: ActionMenuItem[][] = [];

  constructor() {}

  // 🔧 Utility: Safe key check
  private hasKeys(...keys: string[]): boolean {
    return typeof this.data === 'object' && this.data !== null && keys.every((key) => key in this.data);
  }

  private checkId(attribute: string): boolean {
    return this.hasKeys('id', attribute) && this.data.id === this.data[attribute];
  }

  private checkType(attribute: string): boolean {
    return this.data?.type === attribute;
  }

  protected isTaskWrapperModal(): boolean {
    return this.checkId('taskId') && !this.checkType('chunk') && this.hasKeys('taskName');
  }

  protected setActionMenuItems(index: number, items: ActionMenuItem[]): void {
    this.actionMenuItems[index] = items;
  }

  protected addActionMenuItem(index: number, item: ActionMenuItem): void {
    if (this.actionMenuItems.length <= index) {
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
  protected conditionallyAddMenuItem(item: ContextMenuType, data: BaseModel): void {
    const condition = item.condition;

    if (condition.key && condition.key.length > 0) {
      if (condition.key in data && Boolean(data[condition.key]) === condition.value) {
        this.addActionMenuItem(item.index, item.menuItem);
      } else if (data[condition.key] === undefined && condition.value === false) {
        this.addActionMenuItem(item.index, item.menuItem);
      } else if (data[condition.key] !== undefined && Array.isArray(data[condition.key])) {
        if (
          (data[condition.key].length > 0 && condition.value === true) ||
          (data[condition.key].length === 0 && condition.value === false)
        ) {
          this.addActionMenuItem(item.index, item.menuItem);
        }
      }
    } else {
      this.addActionMenuItem(item.index, item.menuItem);
    }
  }

  onMenuItemClick(event: ActionMenuEvent<any>): void {
    this.menuItemClicked.emit(event);
  }
}
