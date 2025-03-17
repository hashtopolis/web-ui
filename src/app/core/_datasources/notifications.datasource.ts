import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { NotificationData } from '../_models/notification.model';
import { RequestParams } from '../_models/request-params.model';
import { SERV } from '../_services/main.config';

export class NotificationsDataSource extends BaseDataSource<NotificationData> {
  loadAll(): void {
    this.loading = true;

    const startAt = this.currentPage * this.pageSize;
    const sorting = this.sortingColumn;

    const params: RequestParams = {
      page: {
        size: this.pageSize,
        after: startAt
      },
    };

    if (sorting.dataKey && sorting.isSortable) {
      const order = this.buildSortingParams(sorting);
      params.sort = [order];
    }

    const notifications$ = this.service.getAll(SERV.NOTIFICATIONS, params);

    this.subscriptions.push(
      notifications$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ListResponseWrapper<NotificationData>) => {
          const notifications: NotificationData[] = response.data;

          this.setPaginationConfig(
            this.pageSize,
            this.currentPage,
            response.total
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
