import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'simulate-form-field',
  templateUrl: './simulate-form-field.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SimulateFormFieldComponent {
  @Input() label: string;
  @Input() message: string;
  @Input() routerLink: string;

  isActive(): boolean {
    return false;
  }
}
