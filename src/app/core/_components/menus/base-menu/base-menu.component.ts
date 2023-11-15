import {
  ActionMenuEvent,
  ActionMenuItem
} from '../action-menu/action-menu.model';
/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { HashListFormat } from 'src/app/core/_constants/hashlist.config';

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

  private checkId(attribute: string): boolean {
    try {
      return this.data['_id'] === this.data[attribute];
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if the data row is of type "Agent".
   * @returns `true` if the data row is an agent; otherwise, `false`.
   */
  protected isAgent(): boolean {
    return this.checkId('agentId');
  }

  /**
   * Check if the data row is of type "AgentBinary".
   * @returns `true` if the data row is an agent binary; otherwise, `false`.
   */
  protected isAgentBinary(): boolean {
    return this.checkId('agentBinaryId');
  }

  /**
   * Check if the data row is of type "Preprocessor".
   * @returns `true` if the data row is an preprocessor; otherwise, `false`.
   */
  protected isPreprocessor(): boolean {
    return this.checkId('preprocessorId');
  }

  /**
   * Check if the data row is of type "CrackerBinaryType".
   * @returns `true` if the data row is a cracker; otherwise, `false`.
   */
  protected isCrackerBinaryType(): boolean {
    return this.checkId('crackerBinaryTypeId');
  }

  /**
   * Check if the data row is of type "Task".
   * @returns `true` if the data row is a task; otherwise, `false`.
   */
  protected isTask(): boolean {
    return this.checkId('taskId');
  }

  /**
   * Check if the data row is of type "File".
   * @returns `true` if the data row is a file; otherwise, `false`.
   */
  protected isFile(): boolean {
    return this.checkId('fileId');
  }

  /**
   * Check if the data row is of type "Hashlist".
   * @returns `true` if the data row is a hashlist; otherwise, `false`.
   */
  protected isHashlist(): boolean {
    try {
      return (
        this.data['_id'] === this.data['hashlistId'] &&
        this.data['format'] !== HashListFormat.SUPERHASHLIST
      );
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if the data row is of type "Hashlist" with format "Superhashlist"
   * @returns `true` if the data row is a superhashlist; otherwise, `false`.
   */
  protected isSuperHashlist(): boolean {
    try {
      return (
        this.data['_id'] === this.data['hashlistId'] &&
        this.data['format'] === HashListFormat.SUPERHASHLIST
      );
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
