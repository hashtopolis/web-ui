import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { JAgent } from '@models/agent.model';

@Component({
  selector: 'app-agents-dashboard-tile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agents-dashboard-tile.component.html',
  styleUrls: ['./agents-dashboard-tile.component.scss']
})
export class AgentsDashboardTileComponent {
  @Input() agent: JAgent;
  @Input() agentIcon: string;
  @Input() lastActivity: string;
  @Input() cpuLoad: number;
  @Input() gpuLoad: number;
  @Input() gpuTemp: number;
  @Input() cpuLoadStatusClass: string = 'ok';
  @Input() gpuLoadStatusClass: string = 'ok';
  @Input() gpuTempStatusClass: string = 'ok';
  @Input() agentStatusTileClass: string[];
  @Input() agentStatusClass: string;
  @Input() agentStatusContent: string;
}
