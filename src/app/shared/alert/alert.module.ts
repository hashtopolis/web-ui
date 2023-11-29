import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ErrorModalComponent } from './error/error.component';
import { CoreFormsModule } from '../forms.module';

@NgModule({
  declarations: [ErrorModalComponent],
  imports: [CommonModule, CoreFormsModule],
  exports: [ErrorModalComponent]
})
export class AlertNavModule {}
