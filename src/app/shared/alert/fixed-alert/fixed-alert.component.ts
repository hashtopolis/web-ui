import { Component, Input } from '@angular/core';

@Component({
  selector: 'fixed-alert',
  templateUrl: './fixed-alert.component.html',
  styleUrls: ['./fixed-alert.component.scss'],
  host: { class: 'block my-2' },
  standalone: false
})
export class FixedAlertComponent {
  @Input() message = '';
}
