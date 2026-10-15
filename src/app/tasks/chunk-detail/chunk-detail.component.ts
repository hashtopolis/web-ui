import { ChunkState, ChunkStateLabels } from '@constants/chunks.config';
import { zChunkResponse, zSpeedListResponse, zTaskResponse } from '@generated/api/zod';
import { Observable, catchError, finalize, map, of, switchMap } from 'rxjs';

import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { JChunk } from '@models/chunk.model';
import { TableSortDirection } from '@models/config-ui.model';
import { FilterType } from '@models/request-params.model';
import { zIdRouteParams } from '@models/routes.schema';
import { SpeedStat } from '@models/speed-stat.model';
import { JTask } from '@models/task.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { UIConfigService } from '@services/shared/storage.service';

import { ComponentsModule } from '@src/app/shared/components.module';
import { TaskSpeedGraphComponent } from '@src/app/shared/graphs/echarts/task-speed-graph/task-speed-graph.component';
import { PipesModule } from '@src/app/shared/pipes.module';
import { buildChunkCommand } from '@src/app/tasks/chunk-detail/chunk-command';

/** Speed samples are reported every few seconds; allow a little slack around the chunk's time window. */
const SPEED_WINDOW_SLACK_SECONDS = 10;

type CommandVariant = 'standalone' | 'agent';

@Component({
  selector: 'app-chunk-detail',
  templateUrl: './chunk-detail.component.html',
  styleUrls: ['./chunk-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    ComponentsModule,
    PipesModule,
    MatButtonToggle,
    MatButtonToggleGroup,
    TaskSpeedGraphComponent
  ]
})
export class ChunkDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private gs = inject(GlobalService);
  private serializer = inject(JsonAPISerializer);
  private clipboard = inject(Clipboard);
  private alertService = inject(AlertService);
  private uiService = inject(UIConfigService);
  private titleService = inject(AutoTitleService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  chunkId: number;
  chunk: JChunk | null = null;
  task: JTask | null = null;
  speeds: SpeedStat[] = [];
  isLoading = true;
  notFound = false;

  commandVariant: CommandVariant = 'standalone';
  command = '';

  protected readonly ChunkState = ChunkState;

  ngOnInit(): void {
    this.chunkId = zIdRouteParams.parse(this.route.snapshot.params).id;
    this.titleService.set([`Chunk #${this.chunkId}`]);

    this.loadChunk()
      .pipe(
        switchMap((chunk) => {
          this.chunk = chunk;
          return chunk ? this.loadTask(chunk.taskId) : of(null);
        }),
        switchMap((task) => {
          this.task = task;
          this.updateCommand();
          return this.chunk ? this.loadSpeeds(this.chunk) : of([]);
        }),
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((speeds) => {
        this.speeds = speeds;
        this.notFound = !this.chunk;
        this.cdr.markForCheck();
      });
  }

  /* ---------- Derived values ---------- */

  get stateLabel(): string {
    return this.chunk ? (ChunkStateLabels[this.chunk.state] ?? String(this.chunk.state)) : '';
  }

  get stateClass(): string {
    return `pill pill-${this.stateLabel.toLowerCase().replace(/[^a-z]/g, '')}`;
  }

  /** Progress through the chunk in percent. The API reports progress in hundredths of a percent. */
  get progressPercent(): number {
    if (!this.chunk) return 0;
    if (this.chunk.progress > 0) return Math.min(100, this.chunk.progress / 100);
    if (this.chunk.length > 0 && this.chunk.checkpoint > this.chunk.skip) {
      return Math.min(100, ((this.chunk.checkpoint - this.chunk.skip) / this.chunk.length) * 100);
    }
    return 0;
  }

  /** Keyspace positions covered so far, derived from the checkpoint. */
  get processed(): number {
    if (!this.chunk || this.chunk.checkpoint <= this.chunk.skip) return 0;
    return Math.min(this.chunk.length, this.chunk.checkpoint - this.chunk.skip);
  }

  get chunkEnd(): number {
    return this.chunk ? this.chunk.skip + this.chunk.length : 0;
  }

  get timeSpent(): number {
    if (!this.chunk || !this.chunk.dispatchTime || !this.chunk.solveTime) return 0;
    return Math.max(0, this.chunk.solveTime - this.chunk.dispatchTime);
  }

  /** Average throughput over the chunk's lifetime (keyspace positions per second). */
  get averageRate(): number {
    return this.timeSpent > 0 ? this.processed / this.timeSpent : 0;
  }

  /** Total keyspace of the task, used to place the chunk on the task's keyspace bar. */
  get taskKeyspace(): number {
    return Math.max(this.task?.keyspace ?? 0, this.chunkEnd);
  }

  /** Offset/width (percent) of the chunk inside the task keyspace bar, kept wide enough to stay visible. */
  get chunkSegment(): { left: number; width: number } {
    if (!this.chunk || !this.taskKeyspace) return { left: 0, width: 0 };
    const left = (this.chunk.skip / this.taskKeyspace) * 100;
    const width = Math.max(0.6, (this.chunk.length / this.taskKeyspace) * 100);
    return { left: Math.min(left, 100 - width), width };
  }

  get taskDispatchedPercent(): number {
    if (!this.task || !this.taskKeyspace) return 0;
    return Math.min(100, (this.task.keyspaceProgress / this.taskKeyspace) * 100);
  }

  get isActive(): boolean {
    return this.chunk?.state === ChunkState.RUNNING || this.chunk?.state === ChunkState.INIT;
  }

  get usesPipe(): boolean {
    return !!this.task?.forcePipe;
  }

  get usesPreprocessor(): boolean {
    return !!this.task?.preprocessorId;
  }

  /* ---------- Actions ---------- */

  setCommandVariant(variant: CommandVariant): void {
    this.commandVariant = variant;
    this.updateCommand();
  }

  copyCommand(): void {
    if (this.clipboard.copy(this.command)) {
      this.alertService.showSuccessMessage('Command copied to clipboard');
    }
  }

  /* ---------- Loading ---------- */

  private updateCommand(): void {
    if (!this.chunk) {
      this.command = '';
      return;
    }
    this.command = buildChunkCommand({
      skip: this.chunk.skip,
      length: this.chunk.length,
      attackCmd: this.task?.attackCmd ?? '',
      hashlistAlias: this.uiService.getUISettings()?.hashlistAlias ?? '#HL#',
      hashlistId: this.task?.hashlist?.id,
      hashTypeId: this.task?.hashlist?.hashTypeId,
      fileNames: (this.task?.files ?? []).map((file) => file.filename),
      agentCmdPars: this.chunk.agent?.cmdPars,
      usePipe: this.usesPipe,
      agentFlags: this.commandVariant === 'agent',
      statusTimer: this.task?.statusTimer
    });
  }

  private loadChunk(): Observable<JChunk | null> {
    const params = new RequestParamBuilder().addInclude('task').addInclude('agent').create();
    return this.gs.get(SERV.CHUNKS, this.chunkId, params).pipe(
      map((response) => this.serializer.deserialize(response, zChunkResponse, params) as unknown as JChunk),
      catchError(() => of(null))
    );
  }

  private loadTask(taskId: number): Observable<JTask | null> {
    const params = new RequestParamBuilder()
      .addInclude('hashlist')
      .addInclude('crackerBinary')
      .addInclude('files')
      .create();
    // Cast: task relationship includes aren't schema-typed yet, JTask's hand-typed relationships are authoritative.
    return this.gs.get(SERV.TASKS, taskId, params).pipe(
      map((response) => this.serializer.deserialize(response, zTaskResponse, params) as unknown as JTask),
      // A user without access to e.g. the hashlist would fail the includes; fall back to the bare task.
      catchError(() =>
        this.gs.get(SERV.TASKS, taskId).pipe(
          map((response) => this.serializer.deserialize(response, zTaskResponse) as unknown as JTask),
          catchError(() => of(null))
        )
      )
    );
  }

  /** Speed samples the chunk's agent reported for this task while the chunk was being worked on. */
  private loadSpeeds(chunk: JChunk): Observable<SpeedStat[]> {
    if (chunk.agentId === null || !chunk.dispatchTime) {
      return of([]);
    }
    const end = chunk.solveTime > 0 ? chunk.solveTime : Math.floor(Date.now() / 1000);
    const params = new RequestParamBuilder()
      .addFilter({ field: 'taskId', operator: FilterType.EQUAL, value: chunk.taskId })
      .addFilter({ field: 'agentId', operator: FilterType.EQUAL, value: chunk.agentId })
      .addFilter({
        field: 'time',
        operator: FilterType.GREATER,
        value: chunk.dispatchTime - SPEED_WINDOW_SLACK_SECONDS
      })
      .addFilter({ field: 'time', operator: FilterType.LESSER, value: end + SPEED_WINDOW_SLACK_SECONDS })
      .addSorting({ dataKey: 'time', direction: TableSortDirection.ASC, isSortable: true })
      .setPageSize(2000)
      .create();
    return this.gs.getAll(SERV.SPEEDS, params).pipe(
      map((response) => this.serializer.deserialize(response, zSpeedListResponse) as SpeedStat[]),
      catchError(() => of([]))
    );
  }
}
