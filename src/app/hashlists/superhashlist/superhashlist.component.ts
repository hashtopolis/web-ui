import { Component, OnInit, inject } from '@angular/core';

import { RoleService } from '@services/roles/base/role.service';
import { SuperHashListRoleService } from '@services/roles/hashlists/superhashlist-role.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

@Component({
  selector: 'app-superhashlist',
  templateUrl: './superhashlist.component.html',
  standalone: false
})
export class SuperhashlistComponent implements OnInit {
  private readonly titleService = inject(AutoTitleService);
  private readonly roleService: RoleService = inject(SuperHashListRoleService);

  protected showCreateButton = this.roleService.hasRole('create');

  ngOnInit(): void {
    this.titleService.set(['Show Superhashlist']);
  }
}
