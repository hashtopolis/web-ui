import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'fixed-alert',
  templateUrl: './fixed-alert.component.html',
  styleUrls: ['./fixed-alert.component.scss'],
  host: { class: 'block my-2' },
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class FixedAlertComponent {
  @Input() message = '';
}
