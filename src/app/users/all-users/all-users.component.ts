import { Component } from '@angular/core';

import { UserRoleService } from '@services/roles/user/user-role.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  standalone: false
})
export class AllUsersComponent {
  protected showCreateButton: boolean = false;

  constructor(
    private titleService: AutoTitleService,
    private userRoleService: UserRoleService
  ) {
    this.titleService.set(['Show Users']);
    this.showCreateButton = this.userRoleService.hasRole('create');
  }
}
