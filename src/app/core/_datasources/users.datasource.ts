import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';
import { User } from '../_models/user.model';

export class UsersDataSource extends BaseDataSource<User> {
  loadAll(): void {
    this.loading = true;

    const startAt = this.currentPage * this.pageSize;
    const params = {
      maxResults: this.pageSize,
      startAt: startAt,
      expand: 'globalPermissionGroup'
    };

    const users$ = this.service.getAll(SERV.USERS, params);

    this.subscriptions.push(
      users$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ListResponseWrapper<User>) => {
          const users: User[] = response.values;

          users.map((user: User) => {
            user.globalPermissionGroupName = user.globalPermissionGroup.name;
          });

          this.setPaginationConfig(
            this.pageSize,
            this.currentPage,
            response.total
          );
          this.setData(users);
        })
    );
  }

  reload(): void {
    this.reset();
    this.loadAll();
  }
}
