import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { Preprocessor } from '../_models/preprocessor.model';
import { SERV } from '../_services/main.config';

export class PreprocessorsDataSource extends BaseDataSource<Preprocessor> {
  loadAll(): void {
    this.loading = true;

    const params = {
      maxResults: this.pageSize
    };

    const preprocessors$ = this.service.getAll(SERV.PREPROCESSORS, params);

    this.subscriptions.push(
      preprocessors$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ListResponseWrapper<Preprocessor>) => {
          const preprocessors: Preprocessor[] = response.values;

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
    this.loadAll();
  }
}
