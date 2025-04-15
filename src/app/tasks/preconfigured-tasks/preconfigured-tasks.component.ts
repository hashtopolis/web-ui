import { Component } from '@angular/core';

import { AutoTitleService } from '@services/shared/autotitle.service';

@Component({
  selector: 'app-preconfigured-tasks',
  templateUrl: './preconfigured-tasks.component.html',
  standalone: false
})
/**
 * PreconfiguredTasksComponent is a component that manages and displays preconfigured tasks data.
 *
 */
export class PreconfiguredTasksComponent {
  constructor(private titleService: AutoTitleService) {
    titleService.set(['Show Preconfigured Task']);
  }
}
