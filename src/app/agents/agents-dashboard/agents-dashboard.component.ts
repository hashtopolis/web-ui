// typescript
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { CoreComponentsModule } from '@components/core-components.module';

import { AgentsDashboardTileComponent } from '@src/app/agents/agents-dashboard-tile/agents-dashboard-tile.component';
import { PageTitleModule } from '@src/app/shared/page-headers/page-title.module';
import { TableModule } from '@src/app/shared/table/table-actions.module';

// Definiere das Interface für die Agenten-Daten
export interface AgentData {
  name: string;
  status: 'ok' | 'warning' | 'critical' | 'error' | 'disabled';
  load: number;
  temp: number;
  icon: string;
  lastActivity: string;
}

@Component({
  selector: 'app-agents-dashboard',
  standalone: true,
  imports: [CommonModule, AgentsDashboardTileComponent, CoreComponentsModule, PageTitleModule, TableModule],
  templateUrl: './agents-dashboard.component.html',
  styleUrls: ['./agents-dashboard.component.scss']
})
export class AgentsDashboardComponent implements OnInit {
  agents: AgentData[] = [];

  ngOnInit(): void {
    this.agents = [
      {
        name: 'Agent-06 (ERROR)',
        status: 'error',
        load: 10,
        temp: 65,
        icon: 'fas fa-exclamation-triangle',
        lastActivity: '2025-10-16 12:00'
      },
      {
        name: 'Agent-03 (Disabled)',
        status: 'disabled',
        load: 0,
        temp: 28,
        icon: 'fas fa-server',
        lastActivity: '2025-10-14 09:00'
      },
      {
        name: 'Agent-02 (High Temp)',
        status: 'warning',
        load: 92,
        temp: 75,
        icon: 'fas fa-server',
        lastActivity: '2025-10-16 14:35'
      },
      {
        name: 'Agent-01 (Max Load)',
        status: 'ok',
        load: 98,
        temp: 58,
        icon: 'fas fa-server',
        lastActivity: '2025-10-16 14:30'
      },
      {
        name: 'Agent-04 (Medium Load)',
        status: 'warning',
        load: 78,
        temp: 32,
        icon: 'fas fa-server',
        lastActivity: '2025-10-16 14:20'
      },
      {
        name: 'Agent-05 (Overheat)',
        status: 'critical',
        load: 95,
        temp: 85,
        icon: 'fas fa-server',
        lastActivity: '2025-10-16 14:38'
      },
      {
        name: 'Agent-06 (Overheat)',
        status: 'critical',
        load: 95,
        temp: 85,
        icon: 'fas fa-server',
        lastActivity: '2025-10-16 14:38'
      },
      {
        name: 'Agent-06 (Overheat)',
        status: 'warning',
        load: 95,
        temp: 85,
        icon: 'fas fa-server',
        lastActivity: '2025-10-16 14:38'
      },
      {
        name: 'Agent-056 (Overheat)',
        status: 'warning',
        load: 95,
        temp: 85,
        icon: 'fas fa-server',
        lastActivity: '2025-10-16 14:38'
      }
    ];
  }

  // Hilfsfunktion zur Bestimmung des Load-Badges
  getLoadStatus(load: number): 'ok' | 'warning' | 'critical' {
    // Load: > 90% = ok (grün), 75-90% = warning (gelb), < 75% = critical (rot)
    if (load <= 75) return 'critical';
    if (load <= 90) return 'warning';
    return 'ok';
  }

  // Hilfsfunktion zur Bestimmung des Temp-Badges
  getTempStatus(temp: number): 'ok' | 'warning' | 'critical' {
    // Temp: < 70°C = ok (grün), 70-80°C = warning (gelb), > 80°C = critical (rot)
    if (temp >= 80) return 'critical';
    if (temp >= 70) return 'warning';
    return 'ok';
  }
}
