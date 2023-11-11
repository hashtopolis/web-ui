import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { HashListFormat } from '../_constants/hashlist.config';
import { Hashlist } from '../_models/hashlist.model';
import { ListResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';

export class HashlistsDataSource extends BaseDataSource<Hashlist> {
  loadAll(isArchived: boolean): void {
    this.loadingSubject.next(true);

    const params = {
      maxResults: this.maxResults,
      expand: 'hashType,accessGroup',
      filter: `isArchived=${isArchived}`
    };

    const hashLists$ = this.service.getAll(SERV.HASHLISTS, params);

    this.subscriptions.push(
      hashLists$
        .pipe(
          catchError(() => of([])),
          finalize(() => this.loadingSubject.next(false))
        )
        .subscribe((response: ListResponseWrapper<Hashlist>) => {
          const rows: Hashlist[] = [];
          response.values.forEach((value: Hashlist) => {
            if (value.format !== HashListFormat.SUPERHASHLIST) {
              const hashlist = value;

              hashlist.hashTypeDescription = hashlist.hashType.description;

              rows.push(hashlist);
            }
          });

          this.setPaginationConfig(
            this.pageSize,
            this.currentPage,
            response.total // TODO: This is incorrect because we exclude superhashlists
          );
          this.setData(rows);
        })
    );
  }

  reload(): void {
    this.reset();
    //this.loadAll();
  }
}
