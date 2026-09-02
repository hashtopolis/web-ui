import { zCrackerBinaryListResponse } from '@generated/api/zod';
import { firstValueFrom, lastValueFrom } from 'rxjs';

import { HttpHeaders } from '@angular/common/http';
import { Component, DestroyRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PageEvent } from '@angular/material/paginator';

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

import { StaticChunkingMode } from '@src/app/core/_constants/tasks.config';
import { environment } from '@src/environments/environment';

@Component({
  selector: 'app-hashlist-pretask-builder-table',
  templateUrl: './hashlist-pretask-builder-table.component.html',
  styleUrls: ['./hashlist-pretask-builder-table.component.scss'],
  standalone: false
})
export class HashlistPretaskBuilderTableComponent implements OnInit, OnDestroy {
  @Input({ required: true }) hashlistId: number;

  /** Emitted after at least one task is created, so the host can refresh its tasks table. */
  @Output() created = new EventEmitter<void>();

  dataSource: HashlistPretaskBuilderDataSource;
  pretasks: JPretask[] = [];

  readonly pageSizeOptions = [10, 25, 50, 100];

  selectedPretaskIds = new Set<number>();
  isCreating = false;

  // This is a plain selector table (no ht-table), so it owns its own error messaging via
  // the aggregate result below. Suppress the global error dialog on its write/lookup calls.
  private readonly skipErrorDialog = { headers: new HttpHeaders({ 'X-Skip-Error-Dialog': 'true' }) };

  private readonly serializer = new JsonAPISerializer();
  private readonly crackerVersionByType = new Map<number, number>();

  private readonly injector = inject(Injector);
  private readonly gs = inject(GlobalService);
  private readonly alert = inject(AlertService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.dataSource = new HashlistPretaskBuilderDataSource(this.injector);
    this.dataSource.pageSize = this.pageSizeOptions[0];

    // This datasource is driven manually (not bound to a mat-table), so we own connect/disconnect
    // ourselves. connect() exposes the row BehaviorSubject; loadAll() fills it. CollectionViewer is unused.
    this.dataSource
      .connect(null as never)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((rows) => {
        this.pretasks = rows;
        this.retainSelection(rows);
      });
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
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

  /** Colors are stored without a leading '#' (see InputColorComponent), so re-add it and drop invalid values. */
  hexColor(color?: string | null): string | null {
    const hex = (color ?? '').trim().replace(/^#/, '');
    return /^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(hex) ? `#${hex}` : null;
  }

  onPageChange(event: PageEvent): void {
    let pageAfter = this.dataSource.pageAfter;
    let pageBefore = this.dataSource.pageBefore;
    let index = event.pageIndex;

    if (index > this.dataSource.index) {
      pageBefore = null;
    } else if (index < this.dataSource.index) {
      pageAfter = null;
    }

    if (event.pageSize !== this.dataSource.pageSize || index === 0) {
      index = 0;
      pageAfter = null;
      pageBefore = null;
    }

    this.selectedPretaskIds.clear();
    this.dataSource.setPaginationConfig(event.pageSize, this.dataSource.totalItems, pageAfter, pageBefore, index);
    this.dataSource.reload();
  }

  /**
   * Drops selected ids that are no longer among the loaded rows. The HTTP cache serves a stale list and then
   * re-emits the revalidated one, so clearing the whole selection here would wipe picks made in between.
   */
  private retainSelection(rows: JPretask[]): void {
    const loadedIds = new Set(rows.map((pretask) => pretask.id));
    this.selectedPretaskIds = new Set([...this.selectedPretaskIds].filter((id) => loadedIds.has(id)));
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
        this.selectedPretaskIds.clear();
        this.created.emit();
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
        staticChunks: StaticChunkingMode.NONE,
        chunkSize: Number(environment.config.tasks.chunkSize),
        forcePipe: false,
        preprocessorId: 0,
        preprocessorCommand: '',
        files: (pretask.pretaskFiles ?? []).map((file) => file.id),
        hashlistId: this.hashlistId
      };

      await firstValueFrom(this.gs.create(SERV.TASKS, payload, this.skipErrorDialog));
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

      const response: ResponseWrapper = await lastValueFrom(
        this.gs.getAll(SERV.CRACKERS, requestParams, this.skipErrorDialog)
      );
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
