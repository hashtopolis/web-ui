import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'simulate-form-field',
    templateUrl: './simulate-form-field.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class SimulateFormFieldComponent {
  @Input() label: string;
  @Input() message: string;
  @Input() routerLink: string;
  @Input() icon: string;

  isActive(): boolean {
    return false;
  }
}
