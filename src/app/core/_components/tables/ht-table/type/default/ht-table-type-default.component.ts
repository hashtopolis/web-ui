import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { BaseModel } from '@models/base.model';

import { HTTableColumn } from '../../ht-table.models';

@Component({
  selector: 'ht-table-default',
  templateUrl: './ht-table-type-default.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class HTTableTypeDefaultComponent {
  @Input() element: BaseModel;
  @Input() tableColumn: HTTableColumn;
}
