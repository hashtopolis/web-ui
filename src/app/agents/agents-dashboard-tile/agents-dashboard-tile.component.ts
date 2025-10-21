import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentData } from '../agents-dashboard/agents-dashboard.component';


@Component({
  selector: 'app-agents-dashboard-tile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agents-dashboard-tile.component.html',
  styleUrls: ['./agents-dashboard-tile.component.scss']
})
export class AgentsDashboardTileComponent {
  @Input() agent!: AgentData;
  @Input() loadStatus: string = 'ok'; // Status-Klasse für Load
  @Input() tempStatus: string = 'ok'; // Status-Klasse für Temp
}
