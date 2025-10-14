import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
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
  @Input() inputType: 'text' | 'password' | 'email' | 'url' = 'text';
  @Input() icon: string;
  @Input() width: string = '';
  @Input() minLength?: number;
  @Input() maxLength?: number;
  @Input() showPasswordToggle: boolean = false;
  @Input() passwordIsVisible: boolean = true;

  @Output() ShowPasswordEmit = new EventEmitter<boolean>();

  emitShowPassword() {
    this.passwordIsVisible = !this.passwordIsVisible;
    this.ShowPasswordEmit.emit(this.passwordIsVisible);
  }

  get resolvedInputType(): string {
    if (this.showPasswordToggle) {
      return this.passwordIsVisible ? 'text' : 'password';
    }
    return this.inputType;
  }

  constructor() {
    super();
  }
}
