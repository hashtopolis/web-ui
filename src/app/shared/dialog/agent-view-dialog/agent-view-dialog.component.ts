import { Component, Inject, Input, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

import { AgentViewDialogData } from './agent-view-dialog.model';
import { LowerCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { UIConfigService } from '@src/app/core/_services/shared/storage.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-agent-view-dialog',
  imports: [MatTabsModule, MatIconModule, MatDialogContent, MatDialogActions, LowerCasePipe, MatButtonModule],
  templateUrl: './agent-view-dialog.component.html',
  styleUrl: './agent-view-dialog.component.scss'
})
export class AgentViewDialogComponent {
  data = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<AgentViewDialogComponent>);

  private uiService = Inject(UIConfigService); // Inject the UIConfigService
  @Input() agentData: AgentViewDialogData[] = [];
  closeDialog(): void {
    this.dialogRef.close();
  }
}
