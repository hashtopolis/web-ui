import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

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
  @Input() faIcon: IconDefinition | null = null;

  isActive(): boolean {
    return false;
  }
}
