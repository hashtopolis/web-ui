import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from '@datasources/base.datasource';
import { Filter } from '@models/request-params.model';
import { JNotification } from '@models/notification.model';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { ResponseWrapper } from '@models/response.model';
import { SERV } from '@services/main.config';

export class NotificationsDataSource extends BaseDataSource<JNotification> {
  loadAll(query?: Filter): void {
    this.loading = true;
    const params = new RequestParamBuilder().addInitial(this);
    if (query) {
      params.addFilter(query);
    }
    const notifications$ = this.service.getAll(SERV.NOTIFICATIONS, params.create());

    this.subscriptions.push(
      notifications$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const responseData = { data: response.data, included: response.included };
          const notifications = this.serializer.deserialize<JNotification[]>(responseData);

          const length = response.meta.page.total_elements;
          const nextLink = response.links.next;
          const prevLink = response.links.prev;
          const after = nextLink ? new URL(response.links.next).searchParams.get("page[after]") : null;
          const before = prevLink ? new URL(response.links.prev).searchParams.get("page[before]") : null;

          this.setPaginationConfig(
            this.pageSize,
            length,
            after,
            before,
            this.index
          );
          this.setData(notifications);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
