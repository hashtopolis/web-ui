import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { PreprocessorData } from '../_models/preprocessor.model';
import { SERV } from '../_services/main.config';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

export class PreprocessorsDataSource extends BaseDataSource<PreprocessorData> {
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
        .subscribe((response: ListResponseWrapper<PreprocessorData>) => {
          const preprocessors: PreprocessorData[] = response.data;

          this.setPaginationConfig(
            this.pageSize,
            this.currentPage,
            response.total
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
