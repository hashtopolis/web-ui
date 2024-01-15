import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-st-pretasks',
  templateUrl: './modal-pretasks.component.html'
})
export class ModalPretasksComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { supertaskId: number; supertaskName: string }
  ) {}

  get supertaskId(): number {
    return this.data.supertaskId;
  }

  get supertaskName(): string {
    return 'Subtasks of ' + this.data.supertaskName;
  }
}
