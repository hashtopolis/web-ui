import { AbstractInputComponent } from '../abstract-input';
import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Custom Input Text Component.
 *
 * Usage Example:
 * ```html
 * <app-input-text
 *   title="Name"
 *   [error]="error?.name"
 *   formControlName="name"
 *   tooltip='Description..'
 *   hint='Hint under field'
 * ></app-input-text>
 * ```
 */
@Component({
  selector: 'app-input-text',
  templateUrl: './text.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextComponent),
      multi: true
    }
  ]
})
export class InputTextComponent extends AbstractInputComponent<string> {
  constructor() {
    super();
  }
}
