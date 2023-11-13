import { HorizontalNavComponent } from './horizontalnav.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [HorizontalNavComponent],
  imports: [CommonModule, MatToolbarModule, MatButtonToggleModule],
  exports: [HorizontalNavComponent]
})
export class HorizontalNavModule {}
