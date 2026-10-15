import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AgentRoleService } from '@services/roles/agents/agent-role.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

@Component({
  selector: 'app-show-agents',
  templateUrl: './show-agents.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class ShowAgentsComponent {
  private titleService = inject(AutoTitleService);
  protected agentRoleService = inject(AgentRoleService);

  constructor() {
    this.titleService.set(['Agents Overview']);
  }
}
