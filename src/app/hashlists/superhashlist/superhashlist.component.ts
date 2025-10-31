import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';

import { Component } from '@angular/core';

import { RoleService } from '@services/roles/role.service';

@Component({
  selector: 'app-superhashlist',
  templateUrl: './superhashlist.component.html',
  standalone: false
})
export class SuperhashlistComponent {
  protected showCreateButton: boolean = true;

  constructor(
    private titleService: AutoTitleService,
    private roleService: RoleService
  ) {
    this.titleService.set(['Show SuperHashlist']);
    this.showCreateButton = this.roleService.hasRole('superHashList', 'create');
  }
}
