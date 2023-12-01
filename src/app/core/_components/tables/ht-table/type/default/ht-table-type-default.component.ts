import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { HTTableColumn } from '../../ht-table.models';

@Component({
  selector: 'ht-table-default',
  templateUrl: './ht-table-type-default.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HTTableTypeDefaultComponent {
  @Input() element: any;
  @Input() tableColumn: HTTableColumn;
}
