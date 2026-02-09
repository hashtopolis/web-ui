import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { AbstractInputComponent } from '@src/app/shared/input/abstract-input';

/**
 * Custom Input Date Component.
 *
 * Usage Example:
 * ```html
 * <input-date
 *   title="Date created"
 *   formControlName="createdDate"
 *   [error]="error?.created"
 *   hint="DD/MM/YYYY"
 * ></input-date>
 * ```
 */
@Component({
  selector: 'input-date',
  templateUrl: './date.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDateComponent),
      multi: true
    }
  ],
  standalone: false
})
export class InputDateComponent extends AbstractInputComponent<Date | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDateChange(event: any): void {
    this.value = event.value || null;
    this.onChange(this.value);
  }
}
