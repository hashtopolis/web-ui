import { AbstractInputComponent } from '../abstract-input';
import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Custom Input Text Component.
 *
 * Usage Example:
 * ```html
 * <input-text-area
 *   title="Name"
 *   [error]="error?.name"
 *   formControlName="name"
 *   tooltip='Description..'
 *   hint='Hint under field'
 * ></input-text-area>
 * ```
 */
@Component({
    selector: 'input-text-area',
    templateUrl: './text-area.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputTextAreaComponent),
            multi: true
        }
    ],
    standalone: false
})
export class InputTextAreaComponent extends AbstractInputComponent<string> {
  constructor() {
    super();
  }
}
