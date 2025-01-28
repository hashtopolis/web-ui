import { catchError, finalize, of } from 'rxjs';
import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { Log } from '../_models/log.model';
import { SERV } from '../_services/main.config';
import { RequestParams } from '../_models/request-params.model';
import { HashData } from '../_models/hash.model';
import { HashlistDataAttributes } from '../_models/hashlist.model';

export class SearchHashDataSource extends BaseDataSource<Log> {
  private _search: string[];

  setSearch(hashArray: string[]): void {
    this._search = hashArray;
  }

  loadAll(): void {
    this.loading = true;

    const startAt = this.currentPage * this.pageSize;
    const sorting = this.sortingColumn;
    const arr = [];

    for (let i = 0; i < this._search.length; i++) {
      const params: RequestParams = {
        maxResults: this.pageSize,
        startsAt: startAt,
        filter: `filter[hash__eq]=${this._search[i]}`,
        include: "hashlist"
      };

      if (sorting.dataKey && sorting.isSortable) {
        const order = this.buildSortingParams(sorting);
        params.ordering = order;
      }

      const hashs$ = this.service.getAll(SERV.HASHES, params);

      this.subscriptions.push(
        hashs$
          .pipe(
            catchError((error) => {
              console.error(`Error loading hash: ${this._search[i]}`, error);
              return of([]);
            }),
            finalize(() => {
              if (i === this._search.length - 1) {
                this.loading = false;
                this.setData(arr);
              }
            })
          )
          .subscribe((response: ListResponseWrapper<HashData>) => {
            const hashs: HashData[] = response.data;

            if (hashs[0]) {
              let includedAttributes = response.included.find((item) => item.id === hashs[0].attributes.hashlistId).attributes as HashlistDataAttributes;
              hashs[0].attributes.hashlist = includedAttributes;
            } else {
              hashs.push({ type: 'hash', id: undefined, attributes: {hashlistId: undefined, hash: this._search[i][0], salt: undefined, plaintext: undefined, timeCracked: undefined, chunkId: undefined, isCracked: undefined, crackPos: undefined } });
            }

            arr.push(hashs[0]);

            this.setPaginationConfig(
              this.pageSize,
              this.currentPage,
              response.total
            );
            this.setData(arr);
          })
      );
    }
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
