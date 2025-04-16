import { AbstractInputComponent } from '../abstract-input';
import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

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
  constructor() {
    super();
  }
}
