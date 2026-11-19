import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NotificationsRoleService } from '@services/roles/config/notifications-role.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

export interface Filter {
  id: number;
  name: string;
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class NotificationsComponent {
  private titleService = inject(AutoTitleService);
  private roleService = inject(NotificationsRoleService);

  protected showCreateButton: boolean = true;

  constructor() {
    this.showCreateButton = this.roleService.hasRole('create');
    this.titleService.set(['Notifications']);
  }
}
