import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { JHash } from '../_models/hash.model';
import { JsonAPISerializer } from '../_services/api/serializer-service';
import { ResponseWrapper } from '../_models/response.model';
import { FilterType } from '../_models/request-params.model';
import { SERV } from '../_services/main.config';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

export class CracksDataSource extends BaseDataSource<JHash> {
  loadAll(): void {
    this.loading = true;
    const params = new RequestParamBuilder().addInitial(this).addInclude('hashlist').addInclude('chunk').addFilter({
      field: 'isCracked',
      operator: FilterType.EQUAL,
      value: true
    }).create();

    const cracks$ = this.service.getAll(SERV.HASHES, params);
    this.subscriptions.push(
      cracks$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const serializer = new JsonAPISerializer();
          const responseData = { data: response.data, included: response.included };
          const crackedHashes = serializer.deserialize<JHash[]>(responseData);
          const rows: JHash[] = [];
          crackedHashes.forEach((crackedHash) => {
            rows.push(crackedHash);
          });

          this.setPaginationConfig(
            this.pageSize,
            this.currentPage,
            crackedHashes.length
          );
          this.setData(rows);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
