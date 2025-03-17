import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { HashListFormat } from '../_constants/hashlist.config';
import { HashlistData, HashlistRelationshipAttributesData } from '../_models/hashlist.model';
import { IncludedAttributes, ListResponseWrapper } from '../_models/response.model';
import { Filter, RequestParams } from '../_models/request-params.model';
import { SERV } from '../_services/main.config';

export class SuperHashlistsDataSource extends BaseDataSource<HashlistData> {
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
        .subscribe((response: ListResponseWrapper<HashlistData>) => {
          const rows: HashlistData[] = [];
          response.data.forEach((value: HashlistData) => {
            const hashlist:HashlistData = value;

            let hashTypeId: number = value.attributes.hashTypeId;

            let includedHashType: IncludedAttributes = response.included.find((inc) => inc.type === "hashType" && inc.id === hashTypeId)?.attributes;
            hashlist.attributes.hashTypeDescription = includedHashType.description;

            //Resolve hashlist information from the relationships section
            let relationshipsHashlistData: HashlistRelationshipAttributesData[] = value.relationships.hashlists.data;
            let includedHashlistInformations = [];
            relationshipsHashlistData.forEach((value: HashlistRelationshipAttributesData) => {
              includedHashlistInformations.push(response.included.find((inc) => inc.type === "hashlist" && inc.id === value.id));
            });
            hashlist.attributes.hashlists = includedHashlistInformations;

            rows.push(hashlist);
          });

          this.setPaginationConfig(
            this.pageSize,
            this.currentPage,
            response.total
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
