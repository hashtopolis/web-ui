import { ChangeDetectionStrategy, Component, ViewChild, inject } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { HashListRoleService } from '@services/roles/hashlists/hashlist-role.service';

import { HashlistsTableComponent } from '@src/app/core/_components/tables/hashlists-table/hashlists-table.component';
import { AutoTitleService } from '@src/app/core/_services/shared/autotitle.service';

@Component({
  selector: 'app-hashlist',
  templateUrl: './hashlist.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class HashlistComponent {
  readonly titleService = inject(AutoTitleService);
  readonly roleService = inject(HashListRoleService);

  @ViewChild('table') table: HashlistsTableComponent;

  pageTitle = 'Hashlists';
  showCreateButton: boolean = true;

  constructor() {
    this.titleService.set(['Show Hashlists']);
    this.showCreateButton = this.roleService.hasRole('create');
  }

  toggleIsArchived(event: MatSlideToggleChange): void {
    this.table.setIsArchived(event.checked);
    this.pageTitle = event.checked ? 'Hashlists (archived)' : 'Hashlists';
  }
}
