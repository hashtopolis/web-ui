import { NgModule } from '@angular/core';

import { TasksComponentsModule } from '@src/app/tasks/tasks-components.module';
import { TasksRoutingModule } from '@src/app/tasks/tasks-routing.module';

@NgModule({
  imports: [TasksComponentsModule, TasksRoutingModule],
  exports: [TasksComponentsModule]
})
export class TasksModule {}
