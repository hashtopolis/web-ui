import { Component } from '@angular/core';

import { AutoTitleService } from '@services/shared/autotitle.service';

@Component({
  selector: 'app-show-agents',
  templateUrl: './show-agents.component.html',
  standalone: false
})
export class ShowAgentsComponent {
  constructor(private titleService: AutoTitleService) {
    this.titleService.set(['Show Agents']);
  }
}
