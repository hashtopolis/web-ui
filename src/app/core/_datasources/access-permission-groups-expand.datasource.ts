import { catchError, finalize, of } from 'rxjs';

import { AccessGroup } from '../_models/access-group.model';
import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { MatTableDataSourcePaginator } from '@angular/material/table';
import { SERV } from '../_services/main.config';

export class AccessPermissionGroupsExpandDataSource extends BaseDataSource<
  AccessGroup,
  MatTableDataSourcePaginator
> {
  private _accesspermgroupId = 0;
  private _expand = '';

  setAccessPermGroupId(accesspermgroupId: number) {
    this._accesspermgroupId = accesspermgroupId;
  }

  setAccessPermGroupExpand(_expand: string) {
    this._expand = _expand;
  }

  loadAll(): void {
    this.loading = true;

    const params = {
      expand: this._expand
    };

    const pretasks$ = this.service.get(
      SERV.ACCESS_PERMISSIONS_GROUPS,
      this._accesspermgroupId,
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
          console.log(data);
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
