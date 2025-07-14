import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AgentSColorPipe } from '@src/app/core/_pipes/agentstat-color.pipe';
import { AveragePipe } from '@src/app/core/_pipes/average-object.pipe';
import { uiDatePipe } from '@src/app/core/_pipes/date.pipe';
import { FileSizePipe } from '@src/app/core/_pipes/file-size.pipe';
import { FileTypePipe } from '@src/app/core/_pipes/file-type.pipe';
import { FilterItemPipe } from '@src/app/core/_pipes/filter-item.pipe';
import { SearchPipe } from '@src/app/core/_pipes/filter-search.pipe';
import { GroupByPipe } from '@src/app/core/_pipes/groupby.pipe';
import { HashesFilterPipe } from '@src/app/core/_pipes/hashes-filter.pipe';
import { HashRatePipe } from '@src/app/core/_pipes/hashrate-pipe';
import { HealthCheckStatusPipe } from '@src/app/core/_pipes/healthcheck-status.pipe';
import { KeyspaceCalcPipe } from '@src/app/core/_pipes/keyspace-calc.pipe';
import { MaximizePipe } from '@src/app/core/_pipes/maximize-object.pipe';
import { ArraySortPipe } from '@src/app/core/_pipes/orderby-item.pipe';
import { ReplaceStringPipe } from '@src/app/core/_pipes/replace-string.pipe';
import { SecondsToTimePipe } from '@src/app/core/_pipes/secondsto-time.pipe';
import { ShortenStringPipe } from '@src/app/core/_pipes/shorten-string.pipe';
import { SplitPipe } from '@src/app/core/_pipes/split.pipe';
import { StaticArrayPipe } from '@src/app/core/_pipes/static-array.pipe';
import { SumPipe } from '@src/app/core/_pipes/sum-object.pipe';
import { TaskCrackedPipe } from '@src/app/core/_pipes/task-cracked.pipe';
import { TaskDispatchedPipe } from '@src/app/core/_pipes/task-dispatched.pipe';
import { TaskSearchedPipe } from '@src/app/core/_pipes/task-searched.pipe';
import { TaskTimeSpentPipe } from '@src/app/core/_pipes/task-timespent.pipe';
import { WarningColorPipe } from '@src/app/core/_pipes/warning-color.pipe';

@NgModule({
  declarations: [
    HealthCheckStatusPipe,
    TaskDispatchedPipe,
    ReplaceStringPipe,
    TaskTimeSpentPipe,
    ShortenStringPipe,
    SecondsToTimePipe,
    WarningColorPipe,
    KeyspaceCalcPipe,
    TaskSearchedPipe,
    HashesFilterPipe,
    StaticArrayPipe,
    AgentSColorPipe,
    TaskCrackedPipe,
    FilterItemPipe,
    ArraySortPipe,
    FileSizePipe,
    FileTypePipe,
    HashRatePipe,
    MaximizePipe,
    AveragePipe,
    GroupByPipe,
    SearchPipe,
    uiDatePipe,
    SplitPipe,
    SumPipe
  ],
  imports: [CommonModule],
  exports: [
    HealthCheckStatusPipe,
    TaskDispatchedPipe,
    ReplaceStringPipe,
    TaskTimeSpentPipe,
    ShortenStringPipe,
    SecondsToTimePipe,
    WarningColorPipe,
    KeyspaceCalcPipe,
    TaskSearchedPipe,
    HashesFilterPipe,
    StaticArrayPipe,
    AgentSColorPipe,
    TaskCrackedPipe,
    FilterItemPipe,
    ArraySortPipe,
    FileSizePipe,
    HashRatePipe,
    FileTypePipe,
    MaximizePipe,
    AveragePipe,
    GroupByPipe,
    SearchPipe,
    uiDatePipe,
    SplitPipe,
    SumPipe
  ]
})
export class PipesModule {}
