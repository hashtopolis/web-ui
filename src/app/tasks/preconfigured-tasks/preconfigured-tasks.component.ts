import { Component } from '@angular/core';

import { PreconfiguredTasksRoleService } from '@services/roles/tasks/preconfiguredTasks-role.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

@Component({
  selector: 'app-preconfigured-tasks',
  templateUrl: './preconfigured-tasks.component.html',
  standalone: false
})
/**
 * PreconfiguredTasksComponent is a component that manages and displays preconfigured tasks data.
 *
 */
export class PreconfiguredTasksComponent {
  showCreateButton: boolean = true;

  constructor(
    private titleService: AutoTitleService,
    readonly roleService: PreconfiguredTasksRoleService
  ) {
    titleService.set(['Show Preconfigured Task']);
    this.showCreateButton = this.roleService.hasRole('create');
  }
}
