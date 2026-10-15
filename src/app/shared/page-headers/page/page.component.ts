import { Component, Input, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class PageComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;
  @Input() actionTitle?: string;
  @Input() actionLink?: string;
  @Input() showAction?: boolean;

  private router = inject(Router);

  navigate(): void {
    if (this.actionLink) {
      this.router.navigate([this.actionLink]);
    }
  }
}
