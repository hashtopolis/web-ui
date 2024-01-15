import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-agent-status-modal',
  templateUrl: './agent-status-modal.component.html'
})
export class AgentStatusModalComponent {
  @Input() title = '';
  @Input() icon = '';
  @Input() color = '';
  @Input() content = '';

  constructor(
    public activeModal: NgbActiveModal,
    public dialogRef: MatDialogRef<AgentStatusModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
