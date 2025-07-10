import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-subtasks',
  templateUrl: './modal-subtasks.component.html',
  standalone: false
})
export class ModalSubtasksComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { supertaskId: number; supertaskName: string },
    private dialogRef: MatDialogRef<ModalSubtasksComponent>
  ) {}

  get supertaskId(): number {
    return this.data.supertaskId;
  }

  get supertaskName(): string {
    return 'Subtasks of ' + this.data.supertaskName;
  }

  close(): void {
    this.dialogRef.close();
  }
}
