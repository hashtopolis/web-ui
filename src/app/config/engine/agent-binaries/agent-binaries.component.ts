import { Component } from '@angular/core';

import { AgentBinaryRoleService } from '@services/roles/binaries/agent-binary-role.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

@Component({
  selector: 'app-agent-binaries',
  templateUrl: './agent-binaries.component.html',
  standalone: false
})
export class AgentBinariesComponent {
  protected showCreateButton: boolean = false;

  constructor(
    private titleService: AutoTitleService,
    private agentBinaryRoleService: AgentBinaryRoleService
  ) {
    this.titleService.set(['Show Agent Binaries']);
    this.showCreateButton = this.agentBinaryRoleService.hasRole('create');
  }
}
