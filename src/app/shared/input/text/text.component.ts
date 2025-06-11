import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { AbstractInputComponent } from '@src/app/shared/input/abstract-input';

/**
 * Custom Input Text Component.
 *
 * Usage Example:
 * ```html
 * <input-text
 *   title="Name"
 *   [error]="error?.name"
 *   formControlName="name"
 *   tooltip='Description..'
 *   hint='Hint under field'
 * ></input-text>
 * ```
 */
@Component({
  selector: 'input-text',
  templateUrl: './text.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextComponent),
      multi: true
    }
  ],
  standalone: false
})
export class InputTextComponent extends AbstractInputComponent<string> {
  @Input() pattern: string | RegExp;
  @Input() inputType: 'text' | 'password' = 'text';
  @Input() icon: string;
  @Input() width: string = '';

  constructor() {
    super();
  }
}
