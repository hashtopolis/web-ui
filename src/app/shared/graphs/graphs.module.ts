import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { EchartsComponent } from "./echarts/echarts.component";

@NgModule({
  declarations:[
    EchartsComponent,
  ],
  imports:[
    CommonModule
  ],
  exports:[
    EchartsComponent
  ]
})
export class GraphsModule {}
