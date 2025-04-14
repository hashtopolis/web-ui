import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { JCrackerBinaryType } from '../_models/cracker-binary.model';
import { ResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

export class CrackersDataSource extends BaseDataSource<JCrackerBinaryType> {
  loadAll(): void {
    this.loading = true;
    const params = new RequestParamBuilder().addInitial(this).addInclude('crackerVersions').create();
    const crackers$ = this.service.getAll(SERV.CRACKERS_TYPES, params);
    this.subscriptions.push(
      crackers$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {

          const responseData = { data: response.data, included: response.included };
          const crackers = this.serializer.deserialize<JCrackerBinaryType[]>(responseData);

          this.setPaginationConfig(
            this.pageSize,
            this.currentPage,
            crackers.length,
          );
          this.setData(crackers);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
