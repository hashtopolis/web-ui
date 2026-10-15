import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AutoTitleService } from '@src/app/core/_services/shared/autotitle.service';

@Component({
  selector: 'app-globalpermissionsgroups',
  templateUrl: './globalpermissionsgroups.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class GlobalpermissionsgroupsComponent {
  constructor(private titleService: AutoTitleService) {
    titleService.set(['Show Global Permissions']);
  }
}
