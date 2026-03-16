import { UIConfigService } from 'src/app/core/_services/shared/storage.service';

import { Component, Input, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export const ThresholdType = {
  temp: 'temp',
  device: 'device',
  util: 'util'
} as const;

export type ThresholdType = (typeof ThresholdType)[keyof typeof ThresholdType];

type ThresholdSettingName =
  | 'agentTempThreshold1'
  | 'agentTempThreshold2'
  | 'agentUtilThreshold1'
  | 'agentUtilThreshold2';

@Component({
  selector: 'app-agent-status-modal',
  templateUrl: './agent-status-modal.component.html',
  standalone: false
})
export class AgentStatusModalComponent implements OnInit {
  @Input() title = '';
  @Input() icon = '';
  @Input() content = '';
  @Input() thresholdType: ThresholdType;

  // Threshold values from the config database
  threshold1: string;
  threshold2: string;
  unitLabel: string;

  // Text and labels
  statusNumber: number;
  statusLabel: string;
  statusInvalid: string;
  note = 'Note: Threshold can be configured in the config section.';

  public dialogRef = inject(MatDialogRef<AgentStatusModalComponent>);
  private uiService = inject(UIConfigService);
  public data: {
    title: string;
    icon: string;
    content: string;
    thresholdType: ThresholdType;
    result: number | string;
    form: { isActive: number | boolean; lastTime: number; agentName: string };
  } = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
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

  /**
   * Fetches and sets threshold values based on the threshold type.
   * @returns {void}
   */
  private fetchThresholds(): void {
    if (this.thresholdType === ThresholdType.temp) {
      this.threshold1 = this.getThresholdValue('agentTempThreshold1');
      this.threshold2 = this.getThresholdValue('agentTempThreshold2');
    } else if (this.thresholdType === ThresholdType.util || this.thresholdType === ThresholdType.device) {
      this.threshold1 = this.getThresholdValue('agentUtilThreshold1');
      this.threshold2 = this.getThresholdValue('agentUtilThreshold2');
    }
  }

  private getThresholdValue(settingKey: ThresholdSettingName): string {
    return String(this.uiService.getUIsettings(settingKey).value);
  }

  /**
   * Generates text labels and settings based on the threshold type.
   * @returns {void}
   */
  private generateText(): void {
    if (this.thresholdType === ThresholdType.temp) {
      this.statusNumber = 2;
      this.statusLabel = 'Device temperatures';
      this.statusInvalid = 'device';
      this.unitLabel = '°';
    } else if (this.thresholdType === ThresholdType.util) {
      this.statusNumber = 3;
      this.statusLabel = 'Device utilisation';
      this.statusInvalid = 'device';
      this.unitLabel = '%';
    } else if (this.thresholdType === ThresholdType.device) {
      this.statusNumber = 1;
      this.statusLabel = 'CPU utilisation';
      this.statusInvalid = 'CPU';
      this.unitLabel = '%';
    }
  }
}
