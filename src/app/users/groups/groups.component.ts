import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';

import { Component, ChangeDetectionStrategy } from '@angular/core';

import { AccessGroupRoleService } from '@services/roles/user/accessgroup-role.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class GroupsComponent {
  protected showCreateButton: boolean = false;

  constructor(
    private titleService: AutoTitleService,
    private accessGroupRoleService: AccessGroupRoleService
  ) {
    titleService.set(['Show Groups']);
    this.showCreateButton = this.accessGroupRoleService.hasRole('create');
  }
}
