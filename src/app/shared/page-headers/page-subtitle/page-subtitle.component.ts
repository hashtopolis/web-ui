import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-page-subtitle',
    templateUrl: './page-subtitle.component.html',
    styleUrls: ['./page-subtitle.component.scss'],
    standalone: false
})
export class PageSubTitleComponent {
  @Input() subtitle: string;
  @Input() actionTitle = '';
  @Input() actionIcon = '';

  @Output() actionClicked = new EventEmitter<void>();

  onAction(): void {
    this.actionClicked.emit();
  }
}
