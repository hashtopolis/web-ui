import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CrackerBinaryRoleService } from '@services/roles/binaries/cracker-binary-role.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

@Component({
  selector: 'app-crackers',
  templateUrl: './crackers.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class CrackersComponent {
  private titleService = inject(AutoTitleService);
  private crackerBinaryService = inject(CrackerBinaryRoleService);

  protected showCreateButton = false;
  constructor() {
    this.titleService.set(['Show Crackers']);
    this.showCreateButton = this.crackerBinaryService.hasRole('create');
  }
}
