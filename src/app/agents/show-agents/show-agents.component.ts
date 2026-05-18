import { Component } from '@angular/core';

import { AgentRoleService } from '@services/roles/agents/agent-role.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

@Component({
  selector: 'app-show-agents',
  templateUrl: './show-agents.component.html',
  standalone: false
})
export class ShowAgentsComponent {
  constructor(
    private titleService: AutoTitleService,
    protected agentRoleService: AgentRoleService
  ) {
    this.titleService.set(['Agents Overview']);
  }
}
