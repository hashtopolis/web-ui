import { Component } from '@angular/core';

import { AutoTitleService } from '@services/shared/autotitle.service';

@Component({
  selector: 'app-agent-binaries',
  templateUrl: './agent-binaries.component.html',
  standalone: false
})
export class AgentBinariesComponent {
  constructor(private titleService: AutoTitleService) {
    this.titleService.set(['Show Agent Binaries']);
  }
}
