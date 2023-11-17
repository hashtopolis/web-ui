import { AbstractInputComponent } from '../abstract-input';
import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Custom Input Check Component.
 *
 * Usage Example:
 * ```html
 * <app-input-check
 *   title="Name"
 *   [error]="error?.name"
 *   formControlName="name"
 * ></app-input-check>
 * ```
 */
@Component({
  selector: 'app-input-check',
  templateUrl: './check.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputCheckComponent),
      multi: true
    }
  ]
})
export class InputCheckComponent extends AbstractInputComponent<boolean> {
  constructor() {
    super();
  }
}
