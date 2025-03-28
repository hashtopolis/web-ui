import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { MatTableDataSourcePaginator } from '@angular/material/table';
import { Pretask } from '../_models/pretask.model';
import { SERV } from '../_services/main.config';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

export class PreTasksDataSource extends BaseDataSource<
  Pretask,
  MatTableDataSourcePaginator
> {
  private _superTaskId = 0;

  setSuperTaskId(superTaskId: number): void {
    this._superTaskId = superTaskId;
  }

  // ToDo supertasks expand pretask doesnt include pretasfiles, so currently we need to make
  // and additional call to pretasks and join arrays. API call expand is needed
  loadAll(): void {
    this.loading = true;

    let pretasks$;

    if (this._superTaskId === 0) {
      const params = new RequestParamBuilder().addInitial(this).addInclude('pretaskFiles').create();
      pretasks$ = this.service.getAll(SERV.PRETASKS, params);
    } else {
      const params = new RequestParamBuilder().addInclude('pretasks').create();
      pretasks$ = this.service.get(SERV.SUPER_TASKS, this._superTaskId, params);
    }

    this.subscriptions.push(
      pretasks$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ListResponseWrapper<Pretask>) => {
          let pretasks: Pretask[];
          if (this._superTaskId === 0) {
            pretasks = response.values;

            this.setPaginationConfig(
              this.pageSize,
              this.currentPage,
              response.total
            );
            this.setData(pretasks);
          } else {
            const superTaskPretasks = response.pretasks || [];

            // Make another request to get pretaskFiles
            this.service
              .getAll(SERV.PRETASKS, {
                include: ['pretaskFiles']
              })
              .subscribe((pretaskFilesResponse: ListResponseWrapper<any>) => {
                const pretaskFiles = pretaskFilesResponse.values || [];

                // Merge pretasks with pretaskFiles
                const pretasks = superTaskPretasks.map((superTaskPretask) => ({
                  ...superTaskPretask,
                  pretaskFiles: pretaskFiles.filter(
                    (pf) => pf.pretaskId === superTaskPretask.pretaskId
                  ),
                  editst: true // Editing Supertask, tracking data
                }));
                this.setData(pretasks);
              });
          }
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
