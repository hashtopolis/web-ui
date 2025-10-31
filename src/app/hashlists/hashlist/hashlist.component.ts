import { HashlistsTableComponent } from 'src/app/core/_components/tables/hashlists-table/hashlists-table.component';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';

import { Component, ViewChild } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { RoleService } from '@services/roles/role.service';

@Component({
  selector: 'app-hashlist',
  templateUrl: './hashlist.component.html',
  standalone: false
})
export class HashlistComponent {
  @ViewChild('table') table: HashlistsTableComponent;

  pageTitle = 'Hashlists';
  showCreateButton: boolean = true;

  constructor(
    readonly titleService: AutoTitleService,
    readonly roleService: RoleService
  ) {
    titleService.set(['Show Hashlists']);
    this.showCreateButton = this.roleService.hasRole('hashList', 'create');
  }

  toggleIsArchived(event: MatSlideToggleChange): void {
    this.table.setIsArchived(event.checked);
    this.pageTitle = event.checked ? 'Hashlists (archived)' : 'Hashlists';
  }
}
