// simulate-form-field.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'simulate-form-field',
  templateUrl: './simulate-form-field.component.html'
})
export class SimulateFormFieldComponent {
  @Input() label: string;
  @Input() message: string;
}
