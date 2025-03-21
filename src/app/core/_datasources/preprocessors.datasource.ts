import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper, ResponseWrapper } from '../_models/response.model';
import { JPreprocessor, PreprocessorData } from '../_models/preprocessor.model';
import { SERV } from '../_services/main.config';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';
import { JCrackerBinaryType } from '@src/app/core/_models/cracker-binary.model';

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

          this.setPaginationConfig(
            this.pageSize,
            this.currentPage,
            preprocessors.length
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
