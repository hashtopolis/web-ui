import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { HTTableColumn } from '../../ht-table.models';

@Component({
  selector: 'ht-table-link',
  templateUrl: './ht-table-type-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HTTableTypeLinkComponent {
  @Input() element: any;
  @Input() tableColumn: HTTableColumn;
}
