import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

/**
 * Component for rendering a submit or cancel button.
 *
 * This component provides a button element for form submissions or cancel actions with customizable label,
 * disabled state, and a dynamic custom CSS class based on the type (cancel or normal).
 *
 * @selector button-submit
 *
 * @param name - The label to display on the button.
 * @param disabled - A boolean value that determines whether the button is disabled or not.
 * @param type - The type of the button (cancel or normal).
 *
 * @example
 * ```
 * <!-- Normal button -->
 * <button-submit name="Submit Form" [disabled]="isFormInvalid" type="normal"></button-submit>
 *
 * <!-- Cancel button -->
 * <button-submit name="Cancel" [type]="'cancel'"></button-submit>
 *
 * <!-- Default (normal) button when type is not specified or invalid -->
 * <button-submit name="Default" [disabled]="false"></button-submit>
 * ```
 */
@Component({
  selector: 'button-submit',
  template: `
    <button class="btn" [class]="getCustomClass()" [attr.type]="getTypeAttribute()" [disabled]="disabled" (click)="handleClick()">{{name}}</button>
  `
})
export class ButtonSubmitComponent {
  /**
   * The label to display on the button.
   */
  @Input() name: string;

  /**
   * A boolean value that determines whether the button is disabled or not.
   */
  @Input() disabled: boolean;

  /**
   * The type of the button (cancel or normal).
   */
  @Input() type: string;

  constructor(private router: Router, private location: Location) {}

  /**
   * Get the custom CSS class based on the button type.
   */
  getCustomClass(): string {
    if (this.type === 'cancel' || this.type === 'delete') {
      return "btn-danger shadow-sm btn-sm me-3";
    } else {
      return "btn btn-gray-800"; // Default to normal style
    }
  }

  /**
   * Handle the button click based on its type.
  */
  handleClick(): void {
    if (this.type === 'cancel') {
      this.location.back(); // Go back to the previous window
    } else {
      return
    }
  }

  /**
   * Get attribute and inject in button.
  */
  getTypeAttribute(): string {
    if (this.type === 'cancel' || this.type === 'delete') {
      return 'button';
    } else {
      return 'submit';
    }
  }

}
