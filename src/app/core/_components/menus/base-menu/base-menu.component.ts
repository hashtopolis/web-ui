import { ActionMenuEvent, ActionMenuItem } from '@src/app/core/_components/menus/action-menu/action-menu.model';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { BaseModel } from '@models/base.model';
import { HashListFormat } from '@src/app/core/_constants/hashlist.config';

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

  protected isAgent(): boolean {
    return this.checkType('agent') && this.hasKeys('agentName');
  }
  protected isAgentError(): boolean {
    return this.checkType('agentError') && this.hasKeys('error');
  }
  protected isNotification(): boolean {
    return this.checkType('notificationSetting');
  }

  protected isAccessGroup(): boolean {
    return this.checkType('accessGroup') && this.hasKeys('groupName');
  }

  protected isAgentBinary(): boolean {
    return this.checkType('agentBinary') && this.hasKeys('filename');
  }

  protected isPreprocessor(): boolean {
    return this.checkType('preprocessor') && this.hasKeys('binaryName');
  }

  protected isCrackerBinaryType(): boolean {
    return this.checkType('crackerBinaryType') && this.hasKeys('typeName');
  }

  protected isPretask(): boolean {
    return this.checkType('preTask') && this.hasKeys('priority');
  }

  protected isTaskWrapper(): boolean {
    return this.checkType('taskWrapper') && this.hasKeys('priority');
  }

  protected isTaskWrapperModal(): boolean {
    return this.checkId('taskId') && !this.checkType('chunk') && this.hasKeys('taskName');
  }

  protected isTaskChunks(): boolean {
    return this.checkType('chunk') && this.hasKeys('skip');
  }

  protected isSupertask(): boolean {
    return this.checkType('supertask');
  }

  protected isVoucher(): boolean {
    return this.checkId('id') && this.hasKeys('voucher');
  }

  protected isUser(): boolean {
    return this.checkType('user') && this.hasKeys('email');
  }

  protected isPermission(): boolean {
    return this.checkType('globalPermissionGroup') && this.hasKeys('permissions');
  }

  protected isHealthCheck(): boolean {
    return this.checkType('healthCheck');
  }

  protected isHealthCheckEdit(): boolean {
    return this.checkId('healthCheckId') && this.hasKeys('healthCheckAgentId');
  }

  protected isFile(): boolean {
    return this.checkType('file');
  }

  protected isHashlist(): boolean {
    return (
      this.checkType('hashlist') && this.hasKeys('brainFeatures') && this.data.format !== HashListFormat.SUPERHASHLIST
    );
  }

  protected isSuperHashlist(): boolean {
    return this.checkType('hashlist') && this.data?.format === HashListFormat.SUPERHASHLIST;
  }

  protected isHashtype(): boolean {
    return this.checkType('hashType') && this.hasKeys('description');
  }

  protected setActionMenuItems(index: number, items: ActionMenuItem[]): void {
    this.actionMenuItems[index] = items;
  }

  protected addActionMenuItem(index: number, item: ActionMenuItem): void {
    this.actionMenuItems[index].push(item);
  }

  onMenuItemClick(event: ActionMenuEvent<any>): void {
    this.menuItemClicked.emit(event);
  }
}
