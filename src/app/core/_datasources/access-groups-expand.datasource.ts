import { catchError, finalize, of } from 'rxjs';

import { AccessGroup } from '../_models/access-group.model';
import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { MatTableDataSourcePaginator } from '@angular/material/table';
import { SERV } from '../_services/main.config';

export class AccessGroupsExpandDataSource extends BaseDataSource<
  AccessGroup,
  MatTableDataSourcePaginator
> {
  private _accessgroupId = 0;
  private _expand = '';

  setAccessGroupId(accessgroupId: number) {
    this._accessgroupId = accessgroupId;
  }

  setAccessGroupExpand(_expand: string) {
    this._expand = _expand;
  }

  loadAll(): void {
    this.loading = true;

    const params = {
      include: [this._expand]
    };

    const pretasks$ = this.service.get(
      SERV.ACCESS_GROUPS,
      this._accessgroupId,
      params
    );

    this.subscriptions.push(
      pretasks$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ListResponseWrapper<AccessGroup>) => {
          const data: AccessGroup[] = response[this._expand];
          this.setData(data);
        })
    );
  }

  getData(): AccessGroup[] {
    return this.getOriginalData();
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
