import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { HealthCheckStatusPipe } from "../core/_pipes/healthcheck-status.pipe";
import { FileTypeEditPipe } from "../core/_pipes/file-type-edit.pipe";
import { ReplaceStringPipe } from "../core/_pipes/replace-string.pipe";
import { ShortenStringPipe } from "../core/_pipes/shorten-string.pipe";
import { SecondsToTimePipe } from "../core/_pipes/secondsto-time.pipe";
import { KeyspaceCalcPipe } from "../core/_pipes/keyspace-calc.pipe";
import { AgentSColorPipe } from "../core/_pipes/agentstat-color.pipe";
import { WarningColorPipe } from "../core/_pipes/warning-color.pipe";
import { StaticArrayPipe } from "../core/_pipes/static-array.pipe";
import { MaximizePipe } from "../core/_pipes/maximize-object.pipe";
import { ArraySortPipe } from "../core/_pipes/orderby-item.pipe";
import { AveragePipe } from "../core/_pipes/average-object.pipe";
import { FilterItemPipe } from "../core/_pipes/filter-item.pipe";
import { SearchPipe } from "../core/_pipes/filter-search.pipe";
import { FileSizePipe } from "../core/_pipes/file-size.pipe";
import { FileTypePipe } from "../core/_pipes/file-type.pipe";
import { GroupByPipe } from "../core/_pipes/groupby.pipe";

@NgModule({
  declarations: [
    HealthCheckStatusPipe,
    ReplaceStringPipe,
    ShortenStringPipe,
    SecondsToTimePipe,
    WarningColorPipe,
    KeyspaceCalcPipe,
    FileTypeEditPipe,
    StaticArrayPipe,
    AgentSColorPipe,
    FilterItemPipe,
    ArraySortPipe,
    FileSizePipe,
    FileTypePipe,
    MaximizePipe,
    AveragePipe,
    GroupByPipe,
    SearchPipe,
  ],
  imports: [CommonModule],
  exports: [
    HealthCheckStatusPipe,
    ReplaceStringPipe,
    ShortenStringPipe,
    SecondsToTimePipe,
    WarningColorPipe,
    KeyspaceCalcPipe,
    FileTypeEditPipe,
    StaticArrayPipe,
    AgentSColorPipe,
    FilterItemPipe,
    ArraySortPipe,
    FileSizePipe,
    FileTypePipe,
    MaximizePipe,
    AveragePipe,
    GroupByPipe,
    SearchPipe,
  ]
})
export class PipesModule {}







