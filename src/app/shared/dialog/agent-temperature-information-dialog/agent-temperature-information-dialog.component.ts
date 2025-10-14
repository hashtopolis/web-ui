import { Component, Inject, Input, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AgentTemperatureInformationDialogData } from './agent-temperature-information-dialog.model';
import { LowerCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-agent-temperature-information-dialog',
  imports: [
    MatTabsModule,
    MatIconModule,
    MatDialogContent,
    MatDialogActions,
    LowerCasePipe,
    MatButtonModule,
    DragDropModule
  ],
  templateUrl: './agent-temperature-information-dialog.component.html',
})
export class AgentTemperatureInformationDialogComponent {
  data = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<AgentTemperatureInformationDialogComponent>);

  @Input() agentData: AgentTemperatureInformationDialogData[] = [];
  closeDialog(): void {
    this.dialogRef.close();
  }
}
