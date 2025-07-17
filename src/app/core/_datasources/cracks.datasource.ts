import { firstValueFrom } from 'rxjs';

import { JHash } from '@models/hash.model';
import { FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';
import { JTask } from '@models/task.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

import { BaseDataSource } from '@datasources/base.datasource';

export class CracksDataSource extends BaseDataSource<JHash> {
  public length = 0;
  /**
   * Set table rows loaded from server
   */
  async loadAll() {
    this.loading = true;
    try {
      const crackedHashes = await this.loadCrackedHashes();

      const rows: JHash[] = await Promise.all(
        crackedHashes
          .filter((element) => element.chunk)
          .map(async (crackedHash) => {
            const task = await this.loadTask(crackedHash.chunk.taskId);
            crackedHash.chunk.taskName = task.taskName;
            return crackedHash;
          })
      );

      this.setData(rows);
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
  async loadCrackedHashes() {
    const params = new RequestParamBuilder()
      .addInitial(this)
      .addInclude('hashlist')
      .addInclude('chunk')
      .addFilter({
        field: 'isCracked',
        operator: FilterType.EQUAL,
        value: true
      })
      .create();

    const response: ResponseWrapper = await firstValueFrom(this.service.getAll(SERV.HASHES, params));
    const length = response.meta.page.total_elements;
    const nextLink = response.links.next;
    const prevLink = response.links.prev;
    const after = nextLink ? new URL(nextLink).searchParams.get("page[after]") : null;
    const before = prevLink ? new URL(prevLink).searchParams.get("page[before]") : null;

    this.setPaginationConfig(
      this.pageSize,
      length,
      after,
      before,
      this.index
    );
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
