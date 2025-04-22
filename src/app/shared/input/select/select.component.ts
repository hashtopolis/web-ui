import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { AbstractInputComponent } from '@src/app/shared/input/abstract-input';
import { SelectOption } from '@src/app/shared/utils/forms';

/**
 * Custom Select Component.
 *
 * Usage Example:
 * ```html
 * <input-select
 *   title="Name"
 *   [error]="error?.name"
 *   formControlName="name"
 *   tooltip='Description..'
 *   hint='Hint under field'
 * ></input-select>
 * ```
 */
@Component({
  selector: 'input-select',
  templateUrl: './select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSelectComponent),
      multi: true
    }
  ],
  standalone: false
})
export class InputSelectComponent extends AbstractInputComponent<any> {
  @Input() items: any;
  @Input() isBlankOptionDisabled = false;
  @Input() blankOptionText: string;

  constructor() {
    super();
  }

  onChangeValue(value) {
    this.value = value;
    this.onChange(value);
  }
}
