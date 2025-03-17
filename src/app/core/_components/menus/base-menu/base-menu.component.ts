import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ActionMenuEvent, ActionMenuItem } from '@src/app/core/_components/menus/action-menu/action-menu.model';
import { HashListFormat } from '@src/app/core/_constants/hashlist.config';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
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
      return this.data['id'] === this.data[attribute];
    } catch (error) {
      return false;
    }
  }

  private checkType(attribute: string): boolean {
    try {
      return this.data.type === attribute;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if the data row is of type "Agent".
   * @returns `true` if the data row is an agent; otherwise, `false`.
   */
  protected isAgent(): boolean {
    return this.checkType('agent') && 'agentName' in this.data;
  }

  /**
   * Check if the data row is of type "Notification".
   * @returns `true` if the data row is an notification; otherwise, `false`.
   */
  protected isNotification(): boolean {
    return this.checkType('notificationSetting');
  }

  /**
   * Check if the data row is of type "AccessGroup".
   * @returns `true` if the data row is an access group; otherwise, `false`.
   */
  protected isAccessGroup(): boolean {
    return this.checkType('accessGroup') && 'groupName' in this.data;
  }

  /**
   * Check if the data row is of type "AgentBinary".
   * @returns `true` if the data row is an agent binary; otherwise, `false`.
   */
  protected isAgentBinary(): boolean {
    return this.checkType('agentBinary') && 'filename' in this.data.attributes;
  }

  /**
   * Check if the data row is of type "Preprocessor".
   * @returns `true` if the data row is an preprocessor; otherwise, `false`.
   */
  protected isPreprocessor(): boolean {
    return this.checkType('preprocessor') && 'binaryName' in this.data.attributes;
  }

  /**
   * Check if the data row is of type "CrackerBinaryType".
   * @returns `true` if the data row is a cracker; otherwise, `false`.
   */
  protected isCrackerBinaryType(): boolean {
    return this.checkType('crackerBinaryType') && 'typeName' in this.data.attributes;
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
    return this.checkType('taskWrapper') && 'priority' in this.data;
  }

  /**
   * Check if the data row is of type "TaskWrapper".
   * @returns `true` if the data row is a task wrapper; otherwise, `false`.
   */
  protected isTaskWrapperModal(): boolean {
    return this.checkId('taskId') && 'taskName' in this.data;
  }

  /**
   * Check if the data row is of type "Chunks".
   * @returns `true` if the data row is a task wrapper; otherwise, `false`.
   */
  protected isTaskChunks(): boolean {
    return this.checkType('chunk') && 'skip' in this.data;
  }

  /**
   * Check if the data row is of type "Supertask".
   * @returns `true` if the data row is a supertask; otherwise, `false`.
   */
  protected isSupertask(): boolean {
    return this.checkType('supertask');
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
      return this.checkType('user') && 'email' in this.data;
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
      return this.checkType('globalPermissionGroup') && 'permissions' in this.data.attributes;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if the data row is of type "HealthCheck".
   * @returns `true` if the data row is a health check; otherwise, `false`.
   */
  protected isHealthCheck(): boolean {
    return this.checkType('healthCheck');
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
    return this.checkType('file');
  }

  /**
   * Check if the data row is of type "Hashlist".
   * @returns `true` if the data row is a hashlist; otherwise, `false`.
   */
  protected isHashlist(): boolean {
    try {
      return (
        this.checkType('hashlist') &&
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
        this.checkType('hashlist') &&
        this.data['format'] === HashListFormat.SUPERHASHLIST
      );
    } catch (error) {
      return false;
    }
  }

  protected isHashtype(): boolean {
    return this.checkType('hashType') && 'description' in this.data;
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
