import { catchError, finalize, of } from 'rxjs';

import { JAccessGroup } from '@models/access-group.model';
import { JAgent } from '@models/agent.model';
import { ResponseWrapper } from '@models/response.model';
import { JUser } from '@models/user.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

import { BaseDataSource } from '@datasources/base.datasource';

export class AccessGroupsExpandDataSource extends BaseDataSource<JUser | JAgent> {
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
