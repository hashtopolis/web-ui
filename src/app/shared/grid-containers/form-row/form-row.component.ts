import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-form-row',
  templateUrl: './form-row.component.html',
  styleUrls: ['./form-row.component.scss'],
  standalone: false
})
export class FormRowComponent {
  @Input() columns?: 1 | 2 | 3 | 4;

  @HostBinding('style.--form-row-cols') get colsVar(): string {
    return String(this.columns ?? 2);
  }

  @HostBinding('class.row-fill') get fillMode(): boolean {
    return this.columns === undefined;
  }
}
