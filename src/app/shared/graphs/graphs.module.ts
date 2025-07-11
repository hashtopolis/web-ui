import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TaskVisualComponent } from '@src/app/shared/graphs/task-visual/task-visual.component';

@NgModule({
  declarations: [TaskVisualComponent],
  imports: [CommonModule],
  exports: [TaskVisualComponent]
})
export class GraphsModule {}
