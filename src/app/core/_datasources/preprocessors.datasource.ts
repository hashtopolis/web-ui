/**
 * This module contains the datasource definition for the preprocessors table component
 */
import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from '@datasources/base.datasource';
import { Filter } from '@models/request-params.model';
import { JPreprocessor } from '@models/preprocessor.model';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { ResponseWrapper } from '@models/response.model';
import { SERV } from '@services/main.config';

export class PreprocessorsDataSource extends BaseDataSource<JPreprocessor> {
  loadAll(query?: Filter): void {
    this.loading = true;
    const params = new RequestParamBuilder().addInitial(this);
    if (query) {
      params.addFilter(query);
    }

    const preprocessors$ = this.service.getAll(SERV.PREPROCESSORS, params.create());

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

          this.setPaginationConfig(this.pageSize, length, this.pageAfter, this.pageBefore, this.index);
          this.setData(preprocessors);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
