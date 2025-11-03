import { Component } from '@angular/core';

import { CrackerBinaryRoleService } from '@services/roles/binaries/cracker-binary-role.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

@Component({
  selector: 'app-crackers',
  templateUrl: './crackers.component.html',
  standalone: false
})
export class CrackersComponent {
  protected showCreateButton = false;
  constructor(
    private titleService: AutoTitleService,
    private crackerBinaryService: CrackerBinaryRoleService
  ) {
    this.titleService.set(['Show Crackers']);
    this.showCreateButton = this.crackerBinaryService.hasRole('create');
  }
}
