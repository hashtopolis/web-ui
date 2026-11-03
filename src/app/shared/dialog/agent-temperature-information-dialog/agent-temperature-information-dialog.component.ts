import { DragDropModule } from '@angular/cdk/drag-drop';
import { LowerCasePipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { AgentTemperatureInformationDialogData } from '@src/app/shared/dialog/agent-temperature-information-dialog/agent-temperature-information-dialog.model';

@Component({
  selector: 'app-agent-temperature-information-dialog',
  imports: [
    MatTabsModule,
    MatIconModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    LowerCasePipe,
    MatButtonModule,
    DragDropModule
  ],
  templateUrl: './agent-temperature-information-dialog.component.html'
})
export class AgentTemperatureInformationDialogComponent {
  data = inject(MAT_DIALOG_DATA);

  @Input() agentData: AgentTemperatureInformationDialogData[] = [];
}
