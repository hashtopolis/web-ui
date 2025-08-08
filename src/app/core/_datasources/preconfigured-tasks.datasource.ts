import { Filter, FilterType, RequestParams } from '@models/request-params.model';
import { catchError, finalize, firstValueFrom, of } from 'rxjs';

import { BaseDataSource } from '@datasources/base.datasource';
import { JPretask } from '@models/pretask.model';
import { JSuperTask } from '@models/supertask.model';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { ResponseWrapper } from '@models/response.model';
import { SERV } from '@services/main.config';

export class PreTasksDataSource extends BaseDataSource<JPretask> {
  private _superTaskId = 0;
  private filterQuery: Filter;
  private isFirstSearch = true;

  setFilterQuery(filter: Filter): void {
    // Detect filter changes that require pagination reset
    const filterChanged = !this.filterQuery || filter?.value !== this.filterQuery?.value;

    if (filterChanged && filter?.value) {
      // Reset pagination when filter changes
      console.log('Filter changed, resetting pagination');
      this.setPaginationConfig(this.pageSize, null, null, null, 0);
    }

    this.filterQuery = filter;
  }
  setSuperTaskId(superTaskId: number): void {
    this._superTaskId = superTaskId;
  }

  async loadAll(query?: Filter): Promise<void> {
    this.loading = true;

    try {
      if (this._superTaskId === 0) {
        const params = new RequestParamBuilder().addInitial(this).addInclude('pretaskFiles');

        // If this is a filter query
        if (query?.value.toString().length > 0) {
          // Always reset pagination when filter changes
          if (this.filterQuery?.value !== query.value) {
            console.log('2 Filter changed, resetting pagination');
            this.setPaginationConfig(this.pageSize, null, null, null, 0);
            params.setPageAfter(undefined);
            params.setPageBefore(undefined);
          }

          params.addFilter(query);
        }

        const pretasks = await this.loadPretasks(params.create());
        this.setData(pretasks);
      } else {
        // Similar logic for supertasks
        const params = new RequestParamBuilder().addInitial(this).addInclude('pretasks');

        if (query?.value.toString().length > 0) {
          // Always reset pagination when filter changes
          if (this.filterQuery?.value !== query.value) {
            this.setPaginationConfig(this.pageSize, null, null, null, 0);
            params.setPageAfter(undefined);
            params.setPageBefore(undefined);
          }

          params.addFilter(query);
        }

        const supertask = await this.loadSupertask(this._superTaskId, params.create());
        const superTaskPreTaskIds = supertask.pretasks.map((p) => p.id);
        const pretaskFiles = await this.loadPretaskFiles(superTaskPreTaskIds);
        this.setData(pretaskFiles);
      }
    } finally {
      this.loading = false;
    }
  }

  private async loadPretasks(params: RequestParams): Promise<JPretask[]> {
    const response = await firstValueFrom<ResponseWrapper>(this.service.getAll(SERV.PRETASKS, params));

    const length = response.meta.page.total_elements;
    const nextLink = response.links.next;
    const prevLink = response.links.prev;
    const after = nextLink ? new URL(response.links.next).searchParams.get('page[after]') : null;
    const before = prevLink ? new URL(response.links.prev).searchParams.get('page[before]') : null;

    this.setPaginationConfig(this.pageSize, length, after, before, this.index);
    const responseData = { data: response.data, included: response.included };
    return this.serializer.deserialize<JPretask[]>(responseData);
  }

  private async loadSupertask(superTaskId: number, params: RequestParams): Promise<JSuperTask> {
    const response = await firstValueFrom<ResponseWrapper>(this.service.get(SERV.SUPER_TASKS, superTaskId, params));

    const responseData = { data: response.data, included: response.included };
    return this.serializer.deserialize<JSuperTask>(responseData);
  }

  private async loadPretaskFiles(pretaskIds: number[]): Promise<JPretask[]> {
    if (pretaskIds && pretaskIds.length > 0) {
      const paramsPretaskFiles = new RequestParamBuilder()
        .addInitial(this)
        .addInclude('pretaskFiles')
        .addFilter({ field: 'pretaskId', operator: FilterType.IN, value: pretaskIds })
        .create();
      const response = await firstValueFrom<ResponseWrapper>(this.service.getAll(SERV.PRETASKS, paramsPretaskFiles));
      const responseData = { data: response.data, included: response.included };
      return this.serializer.deserialize<JPretask[]>(responseData);
    }
    return [];
  }

  reload(): void {
    this.clearSelection();
    console.log('reloaded', this.filterQuery);
    if (this.filterQuery && this.filterQuery.value) {
      this.loadAll(this.filterQuery);
    } else {
      this.loadAll();
    }
  }
}
