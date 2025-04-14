import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { Component } from '@angular/core';

@Component({
    selector: 'app-globalpermissionsgroups',
    templateUrl: './globalpermissionsgroups.component.html',
    standalone: false
})
export class GlobalpermissionsgroupsComponent {
  constructor(private titleService: AutoTitleService) {
    titleService.set(['Show Global Permissions']);
  }
}
