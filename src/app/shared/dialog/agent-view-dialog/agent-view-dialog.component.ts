import { Component, Inject, Input, inject } from '@angular/core';

import { AgentViewDialogData } from './agent-view-dialog.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { UIConfigService } from '@src/app/core/_services/shared/storage.service';

@Component({
  selector: 'app-agent-view-dialog',
  imports: [MatTabsModule],
  templateUrl: './agent-view-dialog.component.html',
  styleUrl: './agent-view-dialog.component.scss'
})
export class AgentViewDialogComponent {
  data = inject(MAT_DIALOG_DATA);
  private uiService = Inject(UIConfigService); // Inject the UIConfigService
  @Input() agentData: AgentViewDialogData[] = [];
}
