import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { HashListFormat } from '../_constants/hashlist.config';
import { JHashlist, HashlistRelationshipAttributesData } from '../_models/hashlist.model';
import { IncludedAttributes, ListResponseWrapper, ResponseWrapper } from '../_models/response.model';
import { Filter, RequestParams } from '../_models/request-params.model';
import { SERV } from '../_services/main.config';
import { JsonAPISerializer } from '../_services/api/serializer-service';

export class SuperHashlistsDataSource extends BaseDataSource<JHashlist> {
  private isArchived = false;

  setIsArchived(isArchived: boolean): void {
    this.isArchived = isArchived;
  }

  loadAll(): void {
    this.loading = true;

    const startAt = this.currentPage * this.pageSize;
    const sorting = this.sortingColumn;

    const params: RequestParams = {
      page: {
        size: this.pageSize,
        after: startAt
      },
      include: ['hashType','hashlists'],
      filter: new Array<Filter>({field: "format", operator: "eq", value: HashListFormat.SUPERHASHLIST})
    };

    if (sorting.dataKey && sorting.isSortable) {
      const order = this.buildSortingParams(sorting);
      params.sort = [order];
    }

    const hashLists$ = this.service.getAll(SERV.HASHLISTS, params);

    this.subscriptions.push(
      hashLists$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const serializer = new JsonAPISerializer();
          const responseData = { data: response.data, included: response.included };
          const superHashlists = serializer.deserialize<JHashlist[]>(responseData);

          const rows: JHashlist[] = [];
          superHashlists.forEach((value) => {
            const superHashlist = value;
            superHashlist.hashTypeDescription = superHashlist.hashType.description;
            rows.push(superHashlist);
          });

          this.setPaginationConfig(
            this.pageSize,
            this.currentPage,
            superHashlists.length
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
