import { Component } from '@angular/core';

import { AutoTitleService } from '@services/shared/autotitle.service';

@Component({
  selector: 'app-supertasks',
  templateUrl: './supertasks.component.html'
})
export class SupertasksComponent {
  constructor(private titleService: AutoTitleService) {
    titleService.set(['Show Preconfigured Task']);
  }
}
