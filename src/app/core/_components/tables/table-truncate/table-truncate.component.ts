import { Component, Input, OnInit, input } from '@angular/core';

/**
 * Component for truncating and expanding text with a "More/Less" button.
 */
@Component({
  selector: 'table-truncate',
  templateUrl: './table-truncate.component.html',
  styleUrls: ['./table-truncate.component.scss'],
  standalone: false
})
export class TableTruncateComponent implements OnInit {
  @Input() text: string;
  @Input() path: string;
  @Input() maxLength = 30;
  @Input() endLength = 10;

  expanded = false;
  abbr: string;

  ngOnInit(): void {
    if (this.path !== undefined && this.path === 'hash') {
      let objText: string = this.text['hash'];
      this.text = objText;
    }

    if (this.text.length > this.maxLength) {
      const start = this.text.substring(0, this.maxLength);
      const end = this.text.substring(this.text.length - this.endLength);
      this.abbr = `${start}…${end}`;
    } else {
      this.abbr = this.text;
    }
  }

  toggleExpansion(event: MouseEvent): void {
    event.stopPropagation();
    this.expanded = !this.expanded;
  }
}
