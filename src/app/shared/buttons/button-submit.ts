import { Location } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

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
    <button
      mat-raised-button
      class="separation-button"
      [ngClass]="getCustomClass()"
      [type]="getTypeAttribute()"
      [disabled]="disabled"
      (click)="type === 'cancel' || type === 'delete' ? handleClick($event) : null"
    >
      {{ name }}
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
  standalone: false
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

  constructor(
    private router: Router,
    private location: Location
  ) {}

  /**
   * Get the custom CSS class based on the button type.
   */
  getCustomClass(): string {
    if (this.type === 'cancel' || this.type === 'delete') {
      return 'mat-raised-button mat-warn mat-button-sm mat-button-shadow';
    } else {
      return 'mat-raised-button mat-primary mat-button-sm mat-button-shadow';
    }
  }

  /**
   * Handle the button click based on its type.
   */
  handleClick(event: Event): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    if (this.type === 'cancel') {
      this.location.back();
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
