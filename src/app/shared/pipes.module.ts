import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AgentSColorPipe } from '@src/app/core/_pipes/agentstat-color.pipe';
import { uiDatePipe } from '@src/app/core/_pipes/date.pipe';
import { FileSizePipe } from '@src/app/core/_pipes/file-size.pipe';
import { HashRatePipe } from '@src/app/core/_pipes/hashrate-pipe';
import { HealthCheckStatusPipe } from '@src/app/core/_pipes/healthcheck-status.pipe';
import { SecondsToTimePipe } from '@src/app/core/_pipes/secondsto-time.pipe';
import { StaticArrayPipe } from '@src/app/core/_pipes/static-array.pipe';

@NgModule({
  declarations: [
    HealthCheckStatusPipe,
    SecondsToTimePipe,
    StaticArrayPipe,
    AgentSColorPipe,
    FileSizePipe,
    HashRatePipe,
    uiDatePipe
  ],
  imports: [CommonModule],
  exports: [
    HealthCheckStatusPipe,
    SecondsToTimePipe,
    StaticArrayPipe,
    AgentSColorPipe,
    FileSizePipe,
    HashRatePipe,
    uiDatePipe
  ]
})
export class PipesModule {}
