import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { Component } from '@angular/core';

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
