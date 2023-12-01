import { Component, Input } from '@angular/core';

@Component({
  selector: 'fixed-alert',
  templateUrl: './fixed-alert.component.html'
})
export class FixedAlertComponent {
  @Input() message = '';
}
