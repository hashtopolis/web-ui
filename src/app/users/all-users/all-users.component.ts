import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { UserRoleService } from '@services/roles/user/user-role.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class AllUsersComponent {
  private titleService = inject(AutoTitleService);
  private userRoleService = inject(UserRoleService);

  protected showCreateButton: boolean = false;

  constructor() {
    this.titleService.set(['Show Users']);
    this.showCreateButton = this.userRoleService.hasRole('create');
  }
}
