import { zPreTaskListResponse } from '@generated/api/zod';
import { EMPTY, catchError, finalize } from 'rxjs';

import { HttpHeaders } from '@angular/common/http';

import { JPretask } from '@models/pretask.model';
import { FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';

import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

import { BaseDataSource } from '@datasources/base.datasource';

export class HashlistPretaskBuilderDataSource extends BaseDataSource<JPretask> {
  loadAll(): void {
    this.loading = true;

    // Builder table should show a larger batch because it is used as a selector list.
    this.pageSize = 100;

    let params = new RequestParamBuilder().addInitial(this).addInclude('pretaskFiles');
    if (this.uiService.getUISettings()?.hideImportMasks === 1) {
      params = params.addFilter({ field: 'isMaskImport', operator: FilterType.EQUAL, value: false });
    }

    const httpOptions = { headers: new HttpHeaders({ 'X-Skip-Error-Dialog': 'true' }) };
    const pretasks$ = this.service.getAll(SERV.PRETASKS, params.create(), httpOptions);

    this.subscriptions.push(
      pretasks$
        .pipe(
          catchError((error) => {
            this.handleFilterError(error);
            return EMPTY;
          }),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const pretasks = this.serializer.deserialize(response, zPreTaskListResponse);
          const length = response.meta?.page?.total_elements ?? pretasks.length;
          const nextLink = response.links?.next;
          const prevLink = response.links?.prev;
          const after = nextLink ? new URL(nextLink).searchParams.get('page[after]') : null;
          const before = prevLink ? new URL(prevLink).searchParams.get('page[before]') : null;

          this.setPaginationConfig(this.pageSize, length, after, before, this.index);
          this.setData(pretasks);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
