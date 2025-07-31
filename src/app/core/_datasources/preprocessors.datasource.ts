/**
 * This module contains the datasource definition for the preprocessors table component
 */
import { catchError, finalize, of } from 'rxjs';

import { ResponseWrapper } from '@models/response.model';
import { JPreprocessor } from '@models/preprocessor.model';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

import { SERV } from '@services/main.config';

import { BaseDataSource } from '@datasources/base.datasource';

export class PreprocessorsDataSource extends BaseDataSource<JPreprocessor> {
  loadAll(): void {
    this.loading = true;
    const params = new RequestParamBuilder().addInitial(this).create();
    const preprocessors$ = this.service.getAll(SERV.PREPROCESSORS, params);

    this.subscriptions.push(
      preprocessors$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const responseData = { data: response.data, included: response.included };
          const preprocessors = this.serializer.deserialize<JPreprocessor[]>(responseData);

          const length = response.meta.page.total_elements;
          const nextLink = response.links.next;
          const prevLink = response.links.prev;
          const after = nextLink ? new URL(response.links.next).searchParams.get("page[after]") : null;
          const before = prevLink ? new URL(response.links.prev).searchParams.get("page[before]") : null;

          this.setPaginationConfig(
            this.pageSize,
            length,
            after,
            before,
            this.index
          );
          this.setData(preprocessors);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
