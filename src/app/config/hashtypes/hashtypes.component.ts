import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';

import { Component } from '@angular/core';

import { HashTypesRoleService } from '@services/roles/config/hashtypes-role.service';

@Component({
  selector: 'app-hashtypes',
  templateUrl: './hashtypes.component.html',
  standalone: false
})
export class HashtypesComponent {
  constructor(
    private titleService: AutoTitleService,
    protected hashtypesRoleService: HashTypesRoleService
  ) {
    this.titleService.set(['Show Hashtypes']);
  }
}
