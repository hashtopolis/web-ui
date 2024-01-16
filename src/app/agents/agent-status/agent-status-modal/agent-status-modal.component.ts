import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UIConfigService } from 'src/app/core/_services/shared/storage.service';

@Component({
  selector: 'app-agent-status-modal',
  templateUrl: './agent-status-modal.component.html'
})
export class AgentStatusModalComponent implements OnInit {
  @Input() title = '';
  @Input() icon = '';
  @Input() content = '';
  @Input() thresholdType: string; // 'temp', 'device' or 'util'

  // Threshold values from the database
  threshold1: string;
  threshold2: string;
  unitLabel: string;

  // Text and labels
  statusNumber: number;
  statusLabel: string;
  statusInvalid: string;
  note = 'Note: Threshold can be configured in the config section.';

  constructor(
    public dialogRef: MatDialogRef<AgentStatusModalComponent>,
    private uiService: UIConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    console.log('Data received in modal:', this.data);
    this.title = this.data.title;
    this.icon = this.data.icon;
    this.content = this.data.content;
    this.thresholdType = this.data.thresholdType;
    this.fetchThresholds();
    this.generateText();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  private fetchThresholds(): void {
    if (this.thresholdType === 'temp') {
      this.threshold1 = this.getThresholdValue('agentTempThreshold1');
      this.threshold2 = this.getThresholdValue('agentTempThreshold2');
    } else if (
      this.thresholdType === 'util' ||
      this.thresholdType === 'device'
    ) {
      this.threshold1 = this.getThresholdValue('agentUtilThreshold1');
      this.threshold2 = this.getThresholdValue('agentUtilThreshold2');
    }
  }

  private getThresholdValue(settingKey: string): string {
    return this.uiService.getUIsettings(settingKey).value;
  }

  private generateText(): void {
    if (this.thresholdType === 'temp') {
      this.statusNumber = 2;
      this.statusLabel = 'Device temperatures';
      this.statusInvalid = 'device';
      this.unitLabel = '';
    } else if (this.thresholdType === 'util') {
      this.statusNumber = 3;
      this.statusLabel = 'Device utilisation';
      this.statusInvalid = 'device';
      this.unitLabel = '%';
    } else if (this.thresholdType === 'device') {
      this.statusNumber = 1;
      this.statusLabel = 'CPU utilisation';
      this.statusInvalid = 'CPU';
      this.unitLabel = '%';
    }
  }
}
