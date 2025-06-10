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

  @Output() actionClicked: EventEmitter<any> = new EventEmitter<any>();

  onAction(): void {
    this.actionClicked.emit();
  }
}
