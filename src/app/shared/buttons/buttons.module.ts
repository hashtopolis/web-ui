import { ButtonSubmitComponent } from './button-submit';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    FormsModule,
    CommonModule
  ],
  exports: [
    ButtonSubmitComponent
  ],
  declarations: [
    ButtonSubmitComponent
  ]
})
export class ButtonsModule { }
