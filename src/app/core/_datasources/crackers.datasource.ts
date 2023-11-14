import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { CrackerBinaryType } from '../_models/cracker-binary.model';
import { ListResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';

export class CrackersDataSource extends BaseDataSource<CrackerBinaryType> {
  loadAll(): void {
    this.loading = true;

    const params = {
      maxResults: this.pageSize,
      expand: 'crackerVersions'
    };

    const crackers$ = this.service.getAll(SERV.CRACKERS_TYPES, params);

    this.subscriptions.push(
      crackers$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ListResponseWrapper<CrackerBinaryType>) => {
          const crackers: CrackerBinaryType[] = response.values;

          this.setPaginationConfig(
            this.pageSize,
            this.currentPage,
            response.total
          );
          this.setData(crackers);
        })
    );
  }

  reload(): void {
    this.reset();
    this.loadAll();
  }
}
