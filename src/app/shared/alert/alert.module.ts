import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ErrorModalComponent } from './error/error.component';
import { CoreFormsModule } from '../forms.module';
import { BlacklistAttackComponent } from './blacklisted-attack/blacklisted-attack.component';

@NgModule({
  declarations: [ErrorModalComponent, BlacklistAttackComponent],
  imports: [CommonModule, CoreFormsModule],
  exports: [ErrorModalComponent, BlacklistAttackComponent]
})
export class AlertNavModule {}
