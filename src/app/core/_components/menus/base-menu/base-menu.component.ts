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
    return this.checkId('agentId') && 'agentName' in this.data;
  }

  /**
   * Check if the data row is of type "Notification".
   * @returns `true` if the data row is an notification; otherwise, `false`.
   */
  protected isNotification(): boolean {
    return this.checkId('notificationSettingId');
  }

  /**
   * Check if the data row is of type "AccessGroup".
   * @returns `true` if the data row is an access group; otherwise, `false`.
   */
  protected isAccessGroup(): boolean {
    return this.checkId('accessGroupId') && 'groupName' in this.data;
  }

  /**
   * Check if the data row is of type "AgentBinary".
   * @returns `true` if the data row is an agent binary; otherwise, `false`.
   */
  protected isAgentBinary(): boolean {
    return this.checkId('agentBinaryId') && 'filename' in this.data;
  }

  /**
   * Check if the data row is of type "Preprocessor".
   * @returns `true` if the data row is an preprocessor; otherwise, `false`.
   */
  protected isPreprocessor(): boolean {
    return this.checkId('preprocessorId') && 'binaryName' in this.data;
  }

  /**
   * Check if the data row is of type "CrackerBinaryType".
   * @returns `true` if the data row is a cracker; otherwise, `false`.
   */
  protected isCrackerBinaryType(): boolean {
    return this.checkId('crackerBinaryTypeId') && 'typeName' in this.data;
  }

  /**
   * Check if the data row is of type "Pretask".
   * @returns `true` if the data row is a pretask; otherwise, `false`.
   */
  protected isPretask(): boolean {
    return this.checkId('pretaskId') && 'priority' in this.data;
  }

  /**
   * Check if the data row is of type "TaskWrapper".
   * @returns `true` if the data row is a task wrapper; otherwise, `false`.
   */
  protected isTaskWrapper(): boolean {
    return this.checkId('taskWrapperId') && 'priority' in this.data;
  }

  /**
   * Check if the data row is of type "TaskWrapper".
   * @returns `true` if the data row is a task wrapper; otherwise, `false`.
   */
  protected isTaskWrapperModal(): boolean {
    return this.checkId('taskId') && 'taskName' in this.data;
  }

  /**
   * Check if the data row is of type "Supertask".
   * @returns `true` if the data row is a supertask; otherwise, `false`.
   */
  protected isSupertask(): boolean {
    return this.checkId('supertaskId');
  }

  /**
   * Check if the data row is of type "Voucher".
   * @returns `true` if the data row is a voucher; otherwise, `false`.
   */
  protected isVoucher(): boolean {
    return this.checkId('regVoucherId') && 'voucher' in this.data;
  }

  /**
   * Check if the data row is of type "User".
   * @returns `true` if the data row is a user; otherwise, `false`.
   */
  protected isUser(): boolean {
    try {
      return this.data['_id'] === this.data['id'] && 'email' in this.data;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if the data row is of type "GlobalPermissionGroup".
   * @returns `true` if the data row is a permission; otherwise, `false`.
   */
  protected isPermission(): boolean {
    try {
      return this.data['_id'] === this.data['id'] && 'permissions' in this.data;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if the data row is of type "HealthCheck".
   * @returns `true` if the data row is a health check; otherwise, `false`.
   */
  protected isHealthCheck(): boolean {
    return this.checkId('healthCheckId');
  }

  /**
   * Check if the data row is of type "HealthCheckEdit".
   * @returns `true` if the data row is a health check; otherwise, `false`.
   */
  protected isHealthCheckEdit(): boolean {
    return this.checkId('healthCheckId') && 'healthCheckAgentId' in this.data;
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
        'brainFeatures' in this.data &&
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

  /**
   * Sets action menu items at the specified index.
   * @param index The index to set action menu items.
   * @param items The array of ActionMenuItem to set.
   */
  protected setActionMenuItems(index: number, items: ActionMenuItem[]): void {
    this.actionMenuItems[index] = items;
  }

  /**
   * Adds an action menu item at the specified index.
   * @param index The index to add the action menu item.
   * @param item The ActionMenuItem to add.
   */
  protected addActionMenuItem(index: number, item: ActionMenuItem): void {
    this.actionMenuItems[index].push(item);
  }

  onMenuItemClick(event: ActionMenuEvent<any>): void {
    this.menuItemClicked.emit(event);
  }
}
