import { TaskVisualComponent } from "./task-visual/task-visual.component";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

@NgModule({
  declarations:[
    TaskVisualComponent,
  ],
  imports:[
    CommonModule
  ],
  exports:[
    TaskVisualComponent
  ]
})
export class GraphsModule {}
