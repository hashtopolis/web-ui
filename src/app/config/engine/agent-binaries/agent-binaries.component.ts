import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AgentBinaryRoleService } from '@services/roles/binaries/agent-binary-role.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

@Component({
  selector: 'app-agent-binaries',
  templateUrl: './agent-binaries.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class AgentBinariesComponent {
  private titleService = inject(AutoTitleService);
  private agentBinaryRoleService = inject(AgentBinaryRoleService);

  protected showCreateButton: boolean = false;

  constructor() {
    this.titleService.set(['Show Agent Binaries']);
    this.showCreateButton = this.agentBinaryRoleService.hasRole('create');
  }
}
