import {
  Directive,
  Input } from '@angular/core';
import {
  NG_VALIDATORS,
  Validator,
  AbstractControl } from '@angular/forms';

/**
 * Validate Input Number only allows to type a number, it is important for validation
 * Usage:
 *   value | validateInputNumber
 * Example:
 *     validateInputNumber >
 * @returns 1KB
 *   output is: dont let you type any number
**/

@Directive({
  selector: '[validateInputNumber]',
  providers: [{provide: NG_VALIDATORS, useExisting: InputNumberValidator, multi: true}]
})
export class InputNumberValidator implements Validator {

  @Input('validateInputNumber') length: number;

  validate(control: AbstractControl): {[key: string]: any} | null {
    return control.value.toString().length < this.length ? null : { validateFieldNumber: { NotEqual: true }};
  }
}
