import { Filter, FilterType } from '@models/request-params.model';

import { BaseDataSource } from '@datasources/base.datasource';
import { JHash } from '@models/hash.model';
import { JTask } from '@models/task.model';
import { JsonAPISerializer } from '@services/api/serializer-service';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { ResponseWrapper } from '@models/response.model';
import { SERV } from '@services/main.config';
import { firstValueFrom } from 'rxjs';

export class CracksDataSource extends BaseDataSource<JHash> {
  public length = 0;
  /**
   * Set table rows loaded from server
   */
  async loadAll(query?: Filter) {
    this.loading = true;
    try {
      const crackedHashes = await this.loadCrackedHashes(query);

      this.setPaginationConfig(this.pageSize, this.length, this.pageAfter, this.pageBefore, this.index);
      this.setData(crackedHashes);
    } catch (error) {
      console.error('Error loading data', error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Load cracked hashes from server
   * @return Promise of cracked hashes
   */
  async loadCrackedHashes(query?: Filter) {
    const params = new RequestParamBuilder().addInitial(this).addInclude('hashlist').addInclude('chunk').addFilter({
      field: 'isCracked',
      operator: FilterType.EQUAL,
      value: true
    });
    if (query) {
      params.addFilter(query);
    }
    const response: ResponseWrapper = await firstValueFrom(this.service.getAll(SERV.HASHES, params.create()));
    this.length = response.meta.page.total_elements;
    const serializer = new JsonAPISerializer();
    return serializer.deserialize<JHash[]>({ data: response.data, included: response.included });
  }

  /**
   * Load task from server
   * @param taskId ID of task
   * @return Promise of task
   */
  async loadTask(taskId: number) {
    const response = await firstValueFrom<ResponseWrapper>(this.service.get(SERV.TASKS, taskId));
    return new JsonAPISerializer().deserialize<JTask>({ data: response.data, included: response.included });
  }

  reload() {
    this.clearSelection();
    this.loadAll();
  }
}
