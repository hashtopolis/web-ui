import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { HashData } from '../_models/hash.model';
import { Included, ListResponseWrapper } from '../_models/response.model';
import { RequestParams } from '../_models/request-params.model';
import { SERV } from '../_services/main.config';
import { ChunkDataAttributes } from '../_models/chunk.model';
import { HashlistDataAttributes } from '../_models/hashlist.model';

export class CracksDataSource extends BaseDataSource<HashData> {
  loadAll(): void {
    this.loading = true;

    const startAt = this.currentPage * this.pageSize;
    const sorting = this.sortingColumn;

    const params: RequestParams = {
      maxResults: this.pageSize,
      startsAt: startAt,
      filter: 'filter[isCracked__eq]=true',
      include: 'hashlist,chunk'
    };

    if (sorting.dataKey && sorting.isSortable) {
      const order = this.buildSortingParams(sorting);
      params.ordering = order;
    }

    const cracks$ = this.service.getAll(SERV.HASHES, params);

    this.subscriptions.push(
      cracks$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ListResponseWrapper<HashData>) => {
          const rows: HashData[] = [];
          response.data.forEach((value: HashData) => {
            const hashlist: HashData = value;

            let chunkId: number = value.attributes.chunkId;
            let includedChunks: Included[] = response.included.filter((inc) => inc.type === "chunk" && inc.id === chunkId);
            hashlist.attributes.chunk = includedChunks[0].attributes as ChunkDataAttributes;

            let hashlistId: number = value.attributes.hashlistId;
            let includedHashlist: Included[] = response.included.filter((inc) => inc.type === "hashlist" && inc.id === hashlistId);
            hashlist.attributes.hashlist = includedHashlist[0].attributes as HashlistDataAttributes;

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
