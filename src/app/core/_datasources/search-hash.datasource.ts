import { catchError, finalize, of } from 'rxjs';
import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { Log } from '../_models/log.model';
import { SERV } from '../_services/main.config';
import { RequestParams } from '../_models/request-params.model';

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
        filter: `hash=${this._search[i]}`
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
          .subscribe((response: ListResponseWrapper<any>) => {
            const hashs: any[] = response.values;

            if (hashs[0]) {
              arr.push(hashs[0]);
            } else {
              arr.push({ hash: this._search[i], isCracked: 3 });
            }
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
