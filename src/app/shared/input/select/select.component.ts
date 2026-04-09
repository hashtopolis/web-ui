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
export class InputSelectComponent<T extends string | number | boolean = string> extends AbstractInputComponent<T> {
  @Input() items: SelectOption<T>[] | undefined = [];
  @Input() isBlankOptionDisabled = false;
  @Input() blankOptionText: string;
  @Input() isLoading = false;
  @Input() width: string = '';

  onChangeValue(value: T) {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  onOpenedChange(opened: boolean) {
    // When the select panel closes, mark as touched
    if (!opened) {
      this.onTouched();
    }
  }
}
