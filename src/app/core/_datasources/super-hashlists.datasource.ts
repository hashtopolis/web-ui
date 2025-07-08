import { Filter, FilterType } from '../_models/request-params.model';
import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { HashListFormat } from '../_constants/hashlist.config';
import { JHashlist } from '../_models/hashlist.model';
import { JsonAPISerializer } from '../_services/api/serializer-service';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';
import { ResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';

export class SuperHashlistsDataSource extends BaseDataSource<JHashlist> {
  private isArchived = false;

  setIsArchived(isArchived: boolean): void {
    this.isArchived = isArchived;
  }

  loadAll(query?: Filter): void {
    this.loading = true;
    const params = new RequestParamBuilder()
      .addInitial(this)
      .addInclude('hashType')
      .addInclude('hashlists')
      .addFilter({
        field: 'format',
        operator: FilterType.EQUAL,
        value: HashListFormat.SUPERHASHLIST
      })
          if (query) {
      params.addFilter(query);
    }
     

    const hashLists$ = this.service.getAll(SERV.HASHLISTS, params.create());

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

          const length = response.meta.page.total_elements;

          this.setPaginationConfig(this.pageSize, length, this.pageAfter, this.pageBefore, this.index);
          this.setData(rows);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
