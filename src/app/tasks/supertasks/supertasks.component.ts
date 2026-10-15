import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SupertasksRoleService } from '@services/roles/tasks/supertasks-role.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

@Component({
  selector: 'app-supertasks',
  templateUrl: './supertasks.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class SupertasksComponent {
  private titleService = inject(AutoTitleService);
  readonly roleService = inject(SupertasksRoleService);

  showCreateButton: boolean = true;

  constructor() {
    this.titleService.set(['Show Preconfigured Task']);
    this.showCreateButton = this.roleService.hasRole('create');
  }
}
