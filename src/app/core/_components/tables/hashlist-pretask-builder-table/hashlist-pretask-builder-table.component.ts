import { zCrackerBinaryListResponse } from '@generated/api/zod';
import { firstValueFrom } from 'rxjs';
import { Subscription } from 'rxjs';

import { Component, Injector, Input, OnDestroy, OnInit, inject } from '@angular/core';

import { JCrackerBinary } from '@models/cracker-binary.model';
import { JPretask } from '@models/pretask.model';
import { FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { AlertService } from '@services/shared/alert.service';

import { HashlistPretaskBuilderDataSource } from '@datasources/hashlist-pretask-builder.datasource';

import { environment } from '@src/environments/environment';

@Component({
  selector: 'app-hashlist-pretask-builder-table',
  templateUrl: './hashlist-pretask-builder-table.component.html',
  styleUrls: ['./hashlist-pretask-builder-table.component.scss'],
  standalone: false
})
export class HashlistPretaskBuilderTableComponent implements OnInit, OnDestroy {
  @Input({ required: true }) hashlistId: number;

  dataSource: HashlistPretaskBuilderDataSource;
  pretasks: JPretask[] = [];

  selectedPretaskIds = new Set<number>();
  isCreating = false;

  private readonly serializer = new JsonAPISerializer();
  private readonly crackerVersionByType = new Map<number, number>();
  private tableSubscription?: Subscription;

  private readonly injector = inject(Injector);
  private readonly gs = inject(GlobalService);
  private readonly alert = inject(AlertService);

  ngOnInit(): void {
    this.dataSource = new HashlistPretaskBuilderDataSource(this.injector);

    this.tableSubscription = this.dataSource.connect(null as never).subscribe((rows) => {
      this.pretasks = rows;
      this.selectedPretaskIds.clear();
    });
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    this.tableSubscription?.unsubscribe();
    this.dataSource.disconnect(null as never);
  }

  toggleSelectAll(checked: boolean): void {
    if (checked) {
      this.selectedPretaskIds = new Set(this.pretasks.map((pretask) => pretask.id));
      return;
    }

    this.selectedPretaskIds.clear();
  }

  togglePretaskSelection(pretaskId: number, checked: boolean): void {
    if (checked) {
      this.selectedPretaskIds.add(pretaskId);
      return;
    }

    this.selectedPretaskIds.delete(pretaskId);
  }

  isAllSelected(): boolean {
    return this.pretasks.length > 0 && this.selectedPretaskIds.size === this.pretasks.length;
  }

  async createTasksFromSelection(): Promise<void> {
    const selectedPretasks = this.pretasks.filter((pretask) => this.selectedPretaskIds.has(pretask.id));

    if (!selectedPretasks.length) {
      this.alert.showErrorMessage('Select at least one pre-configured task.');
      return;
    }

    this.isCreating = true;

    try {
      let created = 0;

      for (const pretask of selectedPretasks) {
        const createdTask = await this.createTaskFromPretask(pretask);
        if (createdTask) {
          created++;
        }
      }

      if (created > 0) {
        this.alert.showSuccessMessage(`Created ${created} task(s) from pre-configured tasks.`);
      }

      if (created < selectedPretasks.length) {
        this.alert.showErrorMessage(`Failed to create ${selectedPretasks.length - created} task(s).`);
      }
    } finally {
      this.isCreating = false;
    }
  }

  private async createTaskFromPretask(pretask: JPretask): Promise<boolean> {
    try {
      const crackerBinaryId = await this.getCrackerVersionIdForType(pretask.crackerBinaryTypeId);
      if (!crackerBinaryId) {
        return false;
      }

      const payload = {
        taskName: pretask.taskName,
        attackCmd: pretask.attackCmd,
        chunkTime: pretask.chunkTime,
        statusTimer: pretask.statusTimer,
        priority: pretask.priority,
        maxAgents: pretask.maxAgents,
        color: pretask.color ?? '',
        isSmall: pretask.isSmall,
        isCpuTask: pretask.isCpuTask,
        useNewBench: pretask.useNewBench,
        skipKeyspace: 0,
        crackerBinaryId,
        isArchived: false,
        notes: '',
        staticChunks: 0,
        chunkSize: Number(environment.config.tasks.chunkSize),
        forcePipe: false,
        preprocessorId: 0,
        preprocessorCommand: '',
        files: (pretask.pretaskFiles ?? []).map((file) => file.id),
        hashlistId: this.hashlistId
      };

      await firstValueFrom(this.gs.create(SERV.TASKS, payload));
      return true;
    } catch (error) {
      console.error(`Failed to create task from pretask #${pretask.id}:`, error);
      return false;
    }
  }

  private async getCrackerVersionIdForType(crackerBinaryTypeId: number): Promise<number | null> {
    const cached = this.crackerVersionByType.get(crackerBinaryTypeId);
    if (cached) {
      return cached;
    }

    try {
      const requestParams = new RequestParamBuilder()
        .addFilter({ field: 'crackerBinaryTypeId', operator: FilterType.EQUAL, value: crackerBinaryTypeId })
        .create();

      const response: ResponseWrapper = await firstValueFrom(this.gs.getAll(SERV.CRACKERS, requestParams));
      const crackers: JCrackerBinary[] = this.serializer.deserialize(response, zCrackerBinaryListResponse);

      const selectedCracker = crackers.slice(-1)[0];
      if (!selectedCracker?.id) {
        this.alert.showErrorMessage(`No binary version found for pretask type #${crackerBinaryTypeId}.`);
        return null;
      }

      this.crackerVersionByType.set(crackerBinaryTypeId, selectedCracker.id);
      return selectedCracker.id;
    } catch (error) {
      console.error('Failed to load cracker versions:', error);
      this.alert.showErrorMessage(`Failed loading binary versions for type #${crackerBinaryTypeId}.`);
      return null;
    }
  }
}
