import { Component, ViewChild } from '@angular/core';

import { HashlistsTableComponent } from 'src/app/core/_components/tables/hashlists-table/hashlists-table.component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-hashlist',
  templateUrl: './hashlist.component.html'
})
export class HashlistComponent {
  @ViewChild('table') table: HashlistsTableComponent;

  pageTitle = 'Hashlists';

  toggleIsArchived(event: MatSlideToggleChange): void {
    this.table.setIsArchived(event.checked);
    this.pageTitle = event.checked ? 'Hashlists (archived)' : 'Hashlists';
    this.table.reload();
  }
}
