import { Component } from '@angular/core';

import { AutoTitleService } from '@services/shared/autotitle.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  standalone: false
})
export class AllUsersComponent {
  constructor(private titleService: AutoTitleService) {
    this.titleService.set(['Show Users']);
  }
}
