import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { CrackerBinaryData, CrackerBinaryTypeData } from '../_models/cracker-binary.model';
import { ListResponseWrapper } from '../_models/response.model';
import { RequestParams } from '../_models/request-params.model';
import { SERV } from '../_services/main.config';

export class CrackersDataSource extends BaseDataSource<CrackerBinaryTypeData> {
  loadAll(): void {
    this.loading = true;

    const startAt = this.currentPage * this.pageSize;
    const sorting = this.sortingColumn;

    const params: RequestParams = {
      maxResults: this.pageSize,
      startsAt: startAt,
      include: 'crackerVersions'
    };

    if (sorting.dataKey && sorting.isSortable) {
      const order = this.buildSortingParams(sorting);
      params.ordering = order;
    }

    const crackers$ = this.service.getAll(SERV.CRACKERS_TYPES, params);

    this.subscriptions.push(
      crackers$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ListResponseWrapper<CrackerBinaryTypeData>) => {

          const crackers: CrackerBinaryTypeData[] = [];

          response.data.forEach((value: CrackerBinaryTypeData) => {
            const cracker: CrackerBinaryTypeData = value;

            let crackerBinaryTypeId: number = cracker.id;
            let crackerBinary: object[] = response.included.filter((inc) => inc.type === "crackerBinary" && inc.attributes.crackerBinaryTypeId === crackerBinaryTypeId);

            cracker.attributes.crackerVersions = crackerBinary as CrackerBinaryData[];

            crackers.push(cracker);
          });

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
    this.clearSelection();
    this.loadAll();
  }
}
