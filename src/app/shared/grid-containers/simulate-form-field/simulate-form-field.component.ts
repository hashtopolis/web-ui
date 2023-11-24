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
    // Add logic to determine if the link is active based on the current route
    // You can use Angular's Router service to achieve this
    // For example, you can inject Router in the component's constructor and use its methods to check the active route
    return false; // Replace with your actual logic
  }
}
