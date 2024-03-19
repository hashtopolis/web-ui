import { Component, Input, OnInit } from '@angular/core';

/**
 * Component for truncating and expanding text with a "More/Less" button.
 */
@Component({
  selector: 'table-truncate',
  templateUrl: './table-truncate.component.html',
  styleUrls: ['./table-truncate.component.scss']
})
export class TableTruncateComponent implements OnInit {
  @Input() text: string;
  @Input() maxLength = 40;

  expanded = false;
  abbr: string;

  ngOnInit(): void {
    if (this.text.length > this.maxLength) {
      this.abbr = `${this.text.substring(0, this.maxLength)} [...]`;
    } else {
      this.abbr = this.text;
    }
  }

  toggleExpansion(event: MouseEvent): void {
    event.stopPropagation();
    this.expanded = !this.expanded;
  }
}
