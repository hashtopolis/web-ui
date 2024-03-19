import { Component, ViewChild } from '@angular/core';

import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { HashlistsTableComponent } from 'src/app/core/_components/tables/hashlists-table/hashlists-table.component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-hashlist',
  templateUrl: './hashlist.component.html'
})
export class HashlistComponent {
  @ViewChild('table') table: HashlistsTableComponent;

  pageTitle = 'Hashlists';

  constructor(private titleService: AutoTitleService) {
    titleService.set(['Show Hashlists']);
  }

  toggleIsArchived(event: MatSlideToggleChange): void {
    this.table.setIsArchived(event.checked);
    this.pageTitle = event.checked ? 'Hashlists (archived)' : 'Hashlists';
    this.table.reload();
  }
}
