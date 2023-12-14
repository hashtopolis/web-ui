import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-preconfigured-tasks',
  templateUrl: './preconfigured-tasks.component.html'
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
