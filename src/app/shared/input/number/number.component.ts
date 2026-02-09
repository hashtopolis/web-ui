import { Component, forwardRef, inject, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { AbstractInputComponent } from '@src/app/shared/input/abstract-input';

/**
 * Custom Input Number Component.
 *
 * Usage Example (Reactive Form):
 * ```html
 * <form [formGroup]="form">
 *   <input-number
 *     title="Age"
 *     formControlName="age"
 *     [min]="0"
 *     [max]="120"
 *     [step]="1"
 *     [error]="form.controls.age.errors"
 *   ></input-number>
 * </form>
 * ```
 *
 * In the component:
 * ```ts
 * this.form = this.fb.group({
 *   age: [null] // numeric form control
 * });
 * ```
 */

@Component({
  selector: 'input-number',
  templateUrl: './number.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumberComponent),
      multi: true
    }
  ],
  standalone: false
})
export class InputNumberComponent extends AbstractInputComponent<number> {
  @Input() min?: number;
  @Input() max?: number;

  onValueChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const numValue = target.value ? parseFloat(target.value) : null;
    this.value = numValue;
    this.onChange(this.value);
  }
}
