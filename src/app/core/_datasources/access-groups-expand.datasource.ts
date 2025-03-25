import { catchError, finalize, of } from 'rxjs';

import { MatTableDataSourcePaginator } from '@angular/material/table';

import { BaseDataSource } from '@src/app/core/_datasources/base.datasource';
import { JAccessGroup } from '@src/app/core/_models/access-group.model';
import { JAgent } from '@src/app/core/_models/agent.model';
import { JUser } from '@src/app/core/_models/user.model';
import { ResponseWrapper } from '@src/app/core/_models/response.model';

import { JsonAPISerializer } from '@src/app/core/_services/api/serializer-service';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';
import { SERV } from '@src/app/core/_services/main.config';


export class AccessGroupsExpandDataSource extends BaseDataSource<JUser | JAgent, MatTableDataSourcePaginator> {
  private _accessgroupId = 0;
  private _include = '';

  setAccessGroupId(accessgroupId: number) {
    this._accessgroupId = accessgroupId;
  }

  setAccessGroupExpand(include: string) {
    this._include = include;
  }

  loadAll(): void {
    this.loading = true;
    const params = new RequestParamBuilder().addInclude(this._include).create();

    const accessGroup$ = this.service.get(SERV.ACCESS_GROUPS, this._accessgroupId, params);

    this.subscriptions.push(
      accessGroup$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const accessGroup = new JsonAPISerializer().deserialize<JAccessGroup>({
            data: response.data,
            included: response.included
          });
          this.setData(accessGroup[this._include]);
        })
    );
  }

  getData(): (JUser | JAgent)[] {
    return this.getOriginalData();
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
