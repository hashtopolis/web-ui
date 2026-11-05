import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AutoTitleService } from '@src/app/core/_services/shared/autotitle.service';

@Component({
  selector: 'app-globalpermissionsgroups',
  templateUrl: './globalpermissionsgroups.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class GlobalpermissionsgroupsComponent {
  private titleService = inject(AutoTitleService);

  constructor() {
    this.titleService.set(['Show Global Permissions']);
  }
}
