/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActionMenuEvent, ActionMenuItem } from './action-menu.model';

@Component({
  selector: 'action-menu',
  templateUrl: './action-menu.component.html'
})
export class ActionMenuComponent {

  @Input() icon: string;
  @Input() label: string;
  @Input() disabled = false;
  @Input() cls = ''
  @Input() data: any;
  @Input() actionMenuItems: ActionMenuItem[][] = []

  @Output() menuItemClicked: EventEmitter<ActionMenuEvent<any>> = new EventEmitter<ActionMenuEvent<any>>();

  /**
   * Handle the click event when a menu item is selected.
   * @param menuItem - The selected menu item.
   */
  onMenuItemClick(menuItem: ActionMenuItem): void {
    this.menuItemClicked.emit({
      menuItem: menuItem,
      data: this.data
    });
  }
}