import { BaseTableComponent } from '../base-table/base-table.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-agent-error-table',
  templateUrl: './agent-error-table.component.html',
  styleUrl: './agent-error-table.component.scss',
  standalone: false
})
export class AgentErrorTableComponent extends BaseTableComponent {}
