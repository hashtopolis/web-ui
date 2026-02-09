import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { AbstractInputComponent } from '@src/app/shared/input/abstract-input';

/**
 * Custom Input Check Component.
 *
 * Usage Example:
 * ```html
 * <input-check
 *   title="Name"
 *   [error]="error?.name"
 *   formControlName="name"
 * ></input-check>
 * ```
 */
@Component({
  selector: 'input-check',
  templateUrl: './check.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputCheckComponent),
      multi: true
    }
  ],
  standalone: false
})
export class InputCheckComponent extends AbstractInputComponent<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onValueChange(event: any): void {
    this.value = event.checked;
    this.onChange(this.value);
  }
}
