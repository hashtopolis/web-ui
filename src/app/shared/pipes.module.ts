import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { HealthCheckStatusPipe } from "../core/_pipes/healthcheck-status.pipe";
import { TaskDispatchedPipe } from "../core/_pipes/task-dispatched.pipe";
import { ReplaceStringPipe } from "../core/_pipes/replace-string.pipe";
import { ShortenStringPipe } from "../core/_pipes/shorten-string.pipe";
import { SecondsToTimePipe } from "../core/_pipes/secondsto-time.pipe";
import { KeyspaceCalcPipe } from "../core/_pipes/keyspace-calc.pipe";
import { AgentSColorPipe } from "../core/_pipes/agentstat-color.pipe";
import { WarningColorPipe } from "../core/_pipes/warning-color.pipe";
import { TaskSearchedPipe } from "../core/_pipes/task-searched.pipe";
import { StaticArrayPipe } from "../core/_pipes/static-array.pipe";
import { MaximizePipe } from "../core/_pipes/maximize-object.pipe";
import { TaskCrackedPipe } from "../core/_pipes/task-cracked.pipe";
import { ArraySortPipe } from "../core/_pipes/orderby-item.pipe";
import { AveragePipe } from "../core/_pipes/average-object.pipe";
import { FilterItemPipe } from "../core/_pipes/filter-item.pipe";
import { SearchPipe } from "../core/_pipes/filter-search.pipe";
import { FileSizePipe } from "../core/_pipes/file-size.pipe";
import { FileTypePipe } from "../core/_pipes/file-type.pipe";
import { GroupByPipe } from "../core/_pipes/groupby.pipe";
import { SplitPipe } from "../core/_pipes/split.pipe";
import { HashesFilterPipe } from "../core/_pipes/hashes-filter.pipe";

@NgModule({
  declarations: [
    HealthCheckStatusPipe,
    TaskDispatchedPipe,
    ReplaceStringPipe,
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
    MaximizePipe,
    AveragePipe,
    GroupByPipe,
    SearchPipe,
    SplitPipe
  ],
  imports: [CommonModule],
  exports: [
    HealthCheckStatusPipe,
    TaskDispatchedPipe,
    ReplaceStringPipe,
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
    MaximizePipe,
    AveragePipe,
    GroupByPipe,
    SearchPipe,
    SplitPipe
  ]
})
export class PipesModule {}



