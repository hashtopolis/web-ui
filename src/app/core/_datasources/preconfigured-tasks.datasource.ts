import { firstValueFrom, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { ResponseWrapper } from '../_models/response.model';
import { MatTableDataSourcePaginator } from '@angular/material/table';
import { JPretask } from '../_models/pretask.model';
import { SERV } from '../_services/main.config';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';
import { JSuperTask } from '@models/supertask.model';
import { FilterType } from '@models/request-params.model';

export class PreTasksDataSource extends BaseDataSource<JPretask, MatTableDataSourcePaginator> {
  private _superTaskId = 0;

  setSuperTaskId(superTaskId: number): void {
    this._superTaskId = superTaskId;
  }

  async loadAll(): Promise<void> {
    this.loading = true;

    //ToDo: Reactivate sorting
    this.sortingColumn.isSortable = false;

    if (this._superTaskId === 0) {
      const params = new RequestParamBuilder().addInitial(this).addInclude('pretaskFiles').create();
      const pretasks = await this.loadPretasks(params);
      this.setData(pretasks);
    } else {
      const params = new RequestParamBuilder().addInitial(this).addInclude('pretasks').create();
      const supertask = await this.loadSupertask(this._superTaskId, params);

      const superTaskPreTaskIds = supertask.pretasks.map((superTaskPretask) => superTaskPretask.id);

      const test = await this.loadPretaskFiles(superTaskPreTaskIds);

      this.setData(test);
    }
  }

  private async loadPretasks(params): Promise<JPretask[]> {
    const response = await firstValueFrom<ResponseWrapper>(this.service.getAll(SERV.PRETASKS, params));

    const responseData = { data: response.data, included: response.included };
    const pretasks = this.serializer.deserialize<JPretask[]>(responseData);

    return pretasks;
  }

  private async loadSupertask(superTaskId: number, params): Promise<JSuperTask> {
    const response = await firstValueFrom<ResponseWrapper>(this.service.get(SERV.SUPER_TASKS.URL, superTaskId, params));

    const responseData = { data: response.data, included: response.included };
    const supertask = this.serializer.deserialize<JSuperTask>(responseData);

    return supertask;
  }

  private async loadPretaskFiles(pretaskIds: number[]): Promise<JPretask[]> {
    let response: ResponseWrapper = undefined;

    if (pretaskIds.length === 1) {
      const paramsPretaskFiles = new RequestParamBuilder()
        .addInitial(this)
        .addInclude('pretaskFiles')
        .addFilter({ field: 'pretaskId', operator: FilterType.EQUAL, value: pretaskIds })
        .create();

      response = await firstValueFrom<ResponseWrapper>(this.service.getAll(SERV.PRETASKS, paramsPretaskFiles));
    } else {
      const paramsPretaskFiles = new RequestParamBuilder()
        .addInitial(this)
        .addInclude('pretaskFiles')
        .addFilter({ field: 'pretaskId', operator: FilterType.IN, value: pretaskIds })
        .create();

      response = await firstValueFrom<ResponseWrapper>(this.service.getAll(SERV.PRETASKS, paramsPretaskFiles));
    }

    const responseData = { data: response.data, included: response.included };
    const pretaskFiles = this.serializer.deserialize<JPretask[]>(responseData);

    return pretaskFiles;
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
