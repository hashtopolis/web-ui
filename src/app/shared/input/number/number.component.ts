import { AbstractInputComponent } from '../abstract-input';
import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Custom Input Number Component.
 *
 * Usage Example:
 * ```html
 * <app-input-number
 *   title="Name"
 *   [error]="error?.name"
 *   formControlName="name"
 * ></app-input-number>
 * ```
 */
@Component({
  selector: 'app-input-number',
  templateUrl: './number.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumberComponent),
      multi: true
    }
  ]
})
export class InputNumberComponent extends AbstractInputComponent<boolean> {
  constructor() {
    super();
  }
}
