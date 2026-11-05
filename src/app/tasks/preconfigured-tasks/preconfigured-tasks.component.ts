import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PreconfiguredTasksRoleService } from '@services/roles/tasks/preconfiguredTasks-role.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

@Component({
  selector: 'app-preconfigured-tasks',
  templateUrl: './preconfigured-tasks.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
/**
 * PreconfiguredTasksComponent is a component that manages and displays preconfigured tasks data.
 *
 */
export class PreconfiguredTasksComponent {
  private titleService = inject(AutoTitleService);
  readonly roleService = inject(PreconfiguredTasksRoleService);

  showCreateButton: boolean = true;

  constructor() {
    this.titleService.set(['Show Preconfigured Task']);
    this.showCreateButton = this.roleService.hasRole('create');
  }
}
