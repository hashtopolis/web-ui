import { TaskVisualomponent } from "./task-visual/task-visual.component";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

@NgModule({
  declarations:[
    TaskVisualomponent,
  ],
  imports:[
    CommonModule
  ],
  exports:[
    TaskVisualomponent
  ]
})
export class GraphsModule {}
