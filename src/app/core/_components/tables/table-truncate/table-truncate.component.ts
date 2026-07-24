import { Component, Input, OnInit } from '@angular/core';

import { BaseModel, DynamicModel } from '@models/base.model';

import { truncateMiddle } from '@src/app/shared/utils/util';

/** Text up to this length is shown in full; longer values get a middle ellipsis. */
export const TABLE_TRUNCATE_MAX_LENGTH = 64;

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
  @Input() maxLength = TABLE_TRUNCATE_MAX_LENGTH;
  @Input() endLength = 10;

  expanded = false;
  abbr: string;
  displayText: string;

  ngOnInit(): void {
    this.displayText = typeof this.text === 'string' ? this.text : String((this.text as DynamicModel)[this.path] ?? '');

    this.abbr = truncateMiddle(this.displayText, this.maxLength, this.endLength);
  }

  toggleExpansion(event: MouseEvent): void {
    event.stopPropagation();
    this.expanded = !this.expanded;
  }
}
