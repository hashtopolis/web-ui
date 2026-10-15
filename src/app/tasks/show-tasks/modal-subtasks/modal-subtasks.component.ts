import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-subtasks',
  templateUrl: './modal-subtasks.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class ModalSubtasksComponent {
  data = inject<{
    supertaskId: number;
    supertaskName: string;
  }>(MAT_DIALOG_DATA);
  private dialogRef = inject<MatDialogRef<ModalSubtasksComponent>>(MatDialogRef);

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
