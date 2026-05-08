import { Clipboard } from '@angular/cdk/clipboard';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AlertService } from '@services/shared/alert.service';

export interface RevealApiKeyDialogData {
  token: string;
}

@Component({
  selector: 'app-reveal-api-key-dialog',
  templateUrl: './reveal-api-key.component.html',
  standalone: false
})
export class RevealApiKeyDialogComponent {
  private clipboard = inject(Clipboard);
  private alert = inject(AlertService);
  private dialogRef = inject(MatDialogRef<RevealApiKeyDialogComponent>);

  /** The freshly minted JWT, handed in by the list page after consuming the reveal store. */
  readonly token: string = inject<RevealApiKeyDialogData>(MAT_DIALOG_DATA).token;

  copy(): void {
    const ok = this.clipboard.copy(this.token);
    if (ok) {
      this.alert.showSuccessMessage('API key copied to clipboard.');
    } else {
      this.alert.showErrorMessage('Could not copy to clipboard. Please copy manually.');
    }
  }

  done(): void {
    this.dialogRef.close();
  }
}
