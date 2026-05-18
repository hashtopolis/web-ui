import { Component } from '@angular/core';

import { SupertasksRoleService } from '@services/roles/tasks/supertasks-role.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

@Component({
  selector: 'app-supertasks',
  templateUrl: './supertasks.component.html',
  standalone: false
})
export class SupertasksComponent {
  showCreateButton: boolean = true;

  constructor(
    private titleService: AutoTitleService,
    readonly roleService: SupertasksRoleService
  ) {
    titleService.set(['Show Preconfigured Task']);
    this.showCreateButton = this.roleService.hasRole('create');
  }
}
