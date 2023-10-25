import { ButtonSubmitComponent } from './button-submit';
import { GridButtonsComponent } from './grid-cancel';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    FormsModule,
    CommonModule
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
export class ButtonsModule { }
