import { Component, Inject, Input, inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UIConfigService } from '@src/app/core/_services/shared/storage.service';

@Component({
  selector: 'app-agent-view-dialog',
  imports: [],
  templateUrl: './agent-view-dialog.component.html',
  styleUrl: './agent-view-dialog.component.scss'
})
export class AgentViewDialogComponent {
  data = inject(MAT_DIALOG_DATA);
  private uiService = Inject(UIConfigService); // Inject the UIConfigService
  @Input() title: string[] = []; // Title of the dialog
}
