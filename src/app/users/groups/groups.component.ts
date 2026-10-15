import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AccessGroupRoleService } from '@services/roles/user/accessgroup-role.service';

import { AutoTitleService } from '@src/app/core/_services/shared/autotitle.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class GroupsComponent {
  private titleService = inject(AutoTitleService);
  private accessGroupRoleService = inject(AccessGroupRoleService);

  protected showCreateButton: boolean = false;

  constructor() {
    this.titleService.set(['Show Groups']);
    this.showCreateButton = this.accessGroupRoleService.hasRole('create');
  }
}
