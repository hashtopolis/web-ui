import { Component, Input, OnInit } from '@angular/core';

import { BaseModel, DynamicModel } from '@models/base.model';

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
  @Input() text: string | BaseModel;
  @Input() path: string;
  @Input() maxLength = 30;
  @Input() endLength = 10;

  expanded = false;
  abbr: string;
  displayText: string;

  ngOnInit(): void {
    this.displayText = typeof this.text === 'string' ? this.text : String((this.text as DynamicModel)[this.path] ?? '');

    if (this.displayText.length > this.maxLength) {
      const start = this.displayText.substring(0, this.maxLength);
      const end = this.displayText.substring(this.displayText.length - this.endLength);
      this.abbr = `${start}…${end}`;
    } else {
      this.abbr = this.displayText;
    }
  }

  toggleExpansion(event: MouseEvent): void {
    event.stopPropagation();
    this.expanded = !this.expanded;
  }
}
