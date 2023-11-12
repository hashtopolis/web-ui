import {
  ActionMenuEvent,
  ActionMenuItem
} from '../action-menu/action-menu.model';
/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'base-menu',
  template: ''
})
export class BaseMenuComponent {
  @Input() disabled = false;
  @Input() data: any;

  @Output() menuItemClicked: EventEmitter<ActionMenuEvent<any>> =
    new EventEmitter<ActionMenuEvent<any>>();

  actionMenuItems: ActionMenuItem[][] = [];

  /**
   * Check if the data row is of type "Agent."
   * @returns `true` if the data row is an agent; otherwise, `false`.
   */
  protected isAgent(): boolean {
    try {
      return this.data['_id'] === this.data['agentId'];
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if the data row is of type "Task."
   * @returns `true` if the data row is a task; otherwise, `false`.
   */
  protected isTask(): boolean {
    try {
      return this.data['_id'] === this.data['taskId'];
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if the data row is of type "Hashlist."
   * @returns `true` if the data row is a hashlist; otherwise, `false`.
   */
  protected isHashlist(): boolean {
    try {
      return this.data['_id'] === this.data['hashlistId'];
    } catch (error) {
      return false;
    }
  }

  protected isHashtype(): boolean {
    return 'hashTypeId' in this.data;
  }

  onMenuItemClick(event: ActionMenuEvent<any>): void {
    this.menuItemClicked.emit(event);
  }
}
