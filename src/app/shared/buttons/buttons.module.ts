import { ButtonSubmitComponent } from './button-submit';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GridButtonsComponent } from './grid-cancel';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatGridListModule,
    MatDividerModule,
    MatCardModule
  ],
  exports: [
    ButtonSubmitComponent,
    GridButtonsComponent
  ],
  declarations: [
    ButtonSubmitComponent,
    GridButtonsComponent
  ]
})
export class ButtonsModule {}
