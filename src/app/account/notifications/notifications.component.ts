import { Component } from '@angular/core';

import { NotificationsRoleService } from '@services/roles/config/notifications-role.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

export interface Filter {
  id: number;
  name: string;
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  standalone: false
})
export class NotificationsComponent {
  protected showCreateButton: boolean = true;

  constructor(
    private titleService: AutoTitleService,
    private roleService: NotificationsRoleService
  ) {
    this.showCreateButton = this.roleService.hasRole('create');
    titleService.set(['Notifications']);
  }
}
