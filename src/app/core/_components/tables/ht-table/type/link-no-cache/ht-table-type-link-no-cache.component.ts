import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { BaseModel } from '@models/base.model';

import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';

@Component({
  selector: 'app-ht-table-link-no-cache',
  templateUrl: './ht-table-type-link-no-cache.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class HTTableTypeLinkNoCacheComponent {
  @Input() element: BaseModel;
  @Input() tableColumn: HTTableColumn;
}
