/* eslint-disable @angular-eslint/component-selector */
import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from './timeout-dialog.model';

@Component({
  selector: 'timeout-dialog',
  templateUrl: 'timeout-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class TimeoutDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TimeoutDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
}
