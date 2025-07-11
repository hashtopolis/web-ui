import { Filter, FilterType, RequestParams } from '@models/request-params.model';

import { BaseDataSource } from '@datasources/base.datasource';
import { JPretask } from '@models/pretask.model';
import { JSuperTask } from '@models/supertask.model';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { ResponseWrapper } from '@models/response.model';
import { SERV } from '@services/main.config';
import { firstValueFrom } from 'rxjs';

export class PreTasksDataSource extends BaseDataSource<JPretask> {
  private _superTaskId = 0;

  setSuperTaskId(superTaskId: number): void {
    this._superTaskId = superTaskId;
  }

  async loadAll(query?: Filter): Promise<void> {
    this.loading = true;

    try {
      if (this._superTaskId === 0) {
        const params = new RequestParamBuilder().addInitial(this).addInclude('pretaskFiles');
        if (query) {
          params.addFilter(query);
        }
        const pretasks = await this.loadPretasks(params.create());
        this.setData(pretasks);
      } else {
        const params = new RequestParamBuilder().addInitial(this).addInclude('pretasks');
        if (query) {
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
    void this.loadAll();
  }
}
