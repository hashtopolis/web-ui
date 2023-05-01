import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SwitchThemeComponent } from './button/switch-theme.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    FontAwesomeModule
  ],
  exports: [
    SwitchThemeComponent
  ],
  declarations: [
    SwitchThemeComponent
  ]
})
export class SwitchThemeModule { }
