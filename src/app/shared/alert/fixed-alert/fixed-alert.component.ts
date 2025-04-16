import { Component, Input } from '@angular/core';

@Component({
    selector: 'fixed-alert',
    templateUrl: './fixed-alert.component.html',
    standalone: false
})
export class FixedAlertComponent {
  @Input() message = '';
}
