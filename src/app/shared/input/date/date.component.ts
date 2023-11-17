import { AbstractInputComponent } from '../abstract-input';
import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Custom Input Date Component.
 *
 * Usage Example:
 * ```html
    <app-input-date
    title="Date created"
    formControlName="name"
    [error]="error?.created"
    hint="DD/MM/YYYY" //Hint needs to be connected with localstorage and get date format from UISettings or Settings
    ></app-input-date>
 * ```
 */
@Component({
  selector: 'app-input-date',
  templateUrl: './date.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDateComponent),
      multi: true
    }
  ]
})
export class InputDateComponent extends AbstractInputComponent<boolean> {
  constructor() {
    super();
  }
}
