import { catchError, finalize, of } from 'rxjs';
import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { Log } from '../_models/log.model';
import { SERV } from '../_services/main.config';

export class SearchHashDataSource extends BaseDataSource<Log> {
  private _search: string[];

  setSearch(hashArray: string[]): void {
    this._search = hashArray;
  }

  loadAll(): void {
    this.loading = true;

    const startAt = this.currentPage * this.pageSize;
    const arr = [];

    for (let i = 0; i < this._search.length; i++) {
      const params = {
        maxResults: this.pageSize,
        startAt: startAt,
        filter: `hash=${this._search[i]}`
      };

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
