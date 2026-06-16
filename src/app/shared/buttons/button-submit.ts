import { Location } from '@angular/common';
import { Component, Input, ViewEncapsulation, inject } from '@angular/core';

/**
 * Variants for `<button-submit>`. Const-object + `(typeof X)[keyof typeof X]`
 * keeps the runtime values introspectable from templates and tests, while
 * still narrowing the input type to the allowed literals.
 */
export const ButtonSubmitType = {
  Submit: 'submit',
  Cancel: 'cancel',
  CancelDialog: 'cancel-dialog',
  Delete: 'delete'
} as const;
export type ButtonSubmitType = (typeof ButtonSubmitType)[keyof typeof ButtonSubmitType];

/**
 * Submit / cancel / delete button with design-system M3 variants.
 *
 * Variants:
 *  - `submit` (default): filled accent button for primary form actions
 *  - `cancel`: outlined button that navigates back in history (page-level forms)
 *  - `cancel-dialog`: outlined button with no auto-action — consumer binds
 *    `(click)="dialogRef.close()"`. Use inside MatDialog content where
 *    `location.back()` would navigate the underlying page instead of closing.
 *  - `delete`: outlined danger button for destructive actions
 *
 * Loading: pass `[loading]="isLoading"` to disable the button and render an
 * inline spinner next to the label. Replaces the legacy pattern of pairing
 * `appLoadingButton` with a sibling `<mat-spinner>` block.
 */
@Component({
  selector: 'button-submit',
  template: `
    @if (
      type === ButtonSubmitType.Cancel || type === ButtonSubmitType.CancelDialog || type === ButtonSubmitType.Delete
    ) {
      <button
        matButton="outlined"
        class="btn-submit"
        [class.btn-submit--danger]="type === ButtonSubmitType.Delete"
        type="button"
        [disabled]="disabled || loading"
        (click)="onClick($event)"
      >
        <span class="inline-flex items-center gap-2">
          {{ name }}
          @if (loading) {
            <mat-spinner diameter="16"></mat-spinner>
          }
        </span>
      </button>
    } @else {
      <button
        matButton="filled"
        class="btn-submit btn-submit--primary"
        type="submit"
        [disabled]="disabled || loading"
        (click)="onClick($event)"
      >
        <span class="inline-flex items-center gap-2">
          {{ name }}
          @if (loading) {
            <mat-spinner diameter="16"></mat-spinner>
          }
        </span>
      </button>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class ButtonSubmitComponent {
  protected readonly ButtonSubmitType = ButtonSubmitType;

  private location = inject(Location);

  @Input() name: string;
  @Input() disabled: boolean;
  @Input() type: ButtonSubmitType = ButtonSubmitType.Submit;
  @Input() loading = false;

  onClick(event: Event): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    if (this.type === ButtonSubmitType.Cancel) {
      this.location.back();
    }
  }
}
