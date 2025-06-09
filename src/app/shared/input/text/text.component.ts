import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';

import { AbstractInputComponent } from '../abstract-input';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

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
  @Input() showPasswordToggle: boolean = false;
  @Input() passwordIsVisible: boolean = true;
  @Output() ShowPasswordEmit = new EventEmitter<boolean>();

  emitShowPassword() {
    this.passwordIsVisible = !this.passwordIsVisible;
    this.ShowPasswordEmit.emit(this.passwordIsVisible);
  }
  constructor() {
    super();
  }
}
