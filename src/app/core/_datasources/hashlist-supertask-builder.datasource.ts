import { zSupertaskListResponse } from '@generated/api/zod';
import { EMPTY, catchError, finalize } from 'rxjs';

import { HttpHeaders } from '@angular/common/http';

import { ResponseWrapper } from '@models/response.model';
import { JSuperTask } from '@models/supertask.model';

import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

import { BaseDataSource } from '@datasources/base.datasource';

export class HashlistSupertaskBuilderDataSource extends BaseDataSource<JSuperTask> {
  loadAll(): void {
    this.loading = true;

    // Builder table should show a larger batch because it is used as a selector list.
    this.pageSize = 100;

    const params = new RequestParamBuilder().addInitial(this);
    const httpOptions = { headers: new HttpHeaders({ 'X-Skip-Error-Dialog': 'true' }) };
    const supertasks$ = this.service.getAll(SERV.SUPER_TASKS, params.create(), httpOptions);

    this.subscriptions.push(
      supertasks$
        .pipe(
          catchError((error) => {
            this.handleFilterError(error);
            return EMPTY;
          }),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const supertasks = this.serializer.deserialize(response, zSupertaskListResponse);
          const length = response.meta?.page?.total_elements ?? supertasks.length;
          const nextLink = response.links?.next;
          const prevLink = response.links?.prev;
          const after = nextLink ? new URL(nextLink).searchParams.get('page[after]') : null;
          const before = prevLink ? new URL(prevLink).searchParams.get('page[before]') : null;

          this.setPaginationConfig(this.pageSize, length, after, before, this.index);
          this.setData(supertasks);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
