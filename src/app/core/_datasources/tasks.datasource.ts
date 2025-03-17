import { catchError, finalize, forkJoin, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { MatTableDataSourcePaginator } from '@angular/material/table';
import { SERV } from '../_services/main.config';
import { TaskWrapperData, TaskWrapperRelationshipAttributesData } from '../_models/task-wrapper.model';
import { HashtypeData } from '../_models/hashtype.model';
import { TaskData } from '../_models/task.model';
import { Filter, RequestParams } from '../_models/request-params.model';
import { ListResponseWrapper } from '../_models/response.model';
import { HashlistData } from '../_models/hashlist.model';
import { AccessGroupData } from '../_models/access-group.model';

export class TasksDataSource extends BaseDataSource<
  TaskWrapperData,
  MatTableDataSourcePaginator
> {
  private _isArchived = false;
  private _hashlistId = 0;

  setIsArchived(isArchived: boolean): void {
    this._isArchived = isArchived;
  }

  setHashlistId(hashlistId: number): void {
    this._hashlistId = hashlistId;
  }

  loadAll(): void {
    this.loading = true;

    const startAt = this.currentPage * this.pageSize;
    const sorting = this.sortingColumn;

    const filters = new Array<Filter>(
      {field: "isArchived", operator: "eq", value: this._isArchived}
    ) 
    if (this._hashlistId) {
      filters.push({field: "hashlistId", operator: "eq", value: this._hashlistId});
    }

    const params: RequestParams = {
      page: {
        size: this.pageSize,
        after: startAt
      },
      include: ['accessGroup','tasks'],
      filter: filters
    };

    if (sorting.dataKey && sorting.isSortable) {
      const order = this.buildSortingParams(sorting);
      if (order.length > 0) {
        params.sort = [order];
      }
    }

    const wrappers$ = this.service.getAll(SERV.TASKS_WRAPPER, params);
    const hashLists$ = this.service.getAll(SERV.HASHLISTS, {
      page:{ size: this.maxResults}
    });
    const hashTypes$ = this.service.getAll(SERV.HASHTYPES, {
      page:{ size: this.maxResults}
    });

    forkJoin([wrappers$, hashLists$, hashTypes$])
      .pipe(
        catchError(() => of([])),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        ([taskWrapperResponse, hashlistResponse, hashtypeResponse]:[ListResponseWrapper<TaskWrapperData>, ListResponseWrapper<HashlistData>, ListResponseWrapper<HashtypeData>]) => {

          let taskWrappers: TaskWrapperData[] = [];

          taskWrapperResponse.data.forEach((value: TaskWrapperData) => {
            const taskWrapper: TaskWrapperData = value;

            let taskId: number = value.relationships.tasks.data[0].id;
            let includedTask: object[] = taskWrapperResponse.included.filter((inc) => inc.type === "task" && inc.id === taskId);
            taskWrapper.attributes.tasks = includedTask as TaskData[];
            taskWrapper.attributes.taskName = taskWrapper.attributes.tasks[0].attributes.taskName;

            let accessGroupId: number = (value.relationships.accessGroup.data as TaskWrapperRelationshipAttributesData).id;
            let includedAccessGroup: object = taskWrapperResponse.included.filter((inc) => inc.type === "accessGroup" && inc.id === accessGroupId);
            taskWrapper.attributes.accessgroup = includedAccessGroup as AccessGroupData;

            const matchingHashList = hashlistResponse.data.find(
                      (hashlist: HashlistData) => hashlist.id === taskWrapper.attributes.hashlistId
                    );
            taskWrapper.attributes.hashlists = [matchingHashList];

            const matchingHashTypes = hashtypeResponse.data.find(
                      (hashtype: HashtypeData) =>
                        hashtype.id === matchingHashList.attributes.hashTypeId
                    );
            taskWrapper.attributes.hashtypes = [matchingHashTypes];

            taskWrappers.push(taskWrapper);
          });

          this.setPaginationConfig(
            this.pageSize,
            this.currentPage,
            taskWrapperResponse.total
          );
          this.setData(taskWrappers);
        }
      );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
