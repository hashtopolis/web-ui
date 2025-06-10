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

          this.setPaginationConfig(
            this.pageSize,
            length,
            this.pageAfter,
            this.pageBefore,
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
