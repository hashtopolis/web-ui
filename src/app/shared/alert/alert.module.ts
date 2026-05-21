import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ButtonsModule } from '../buttons/buttons.module';
import { CoreFormsModule } from '../forms.module';
import { BlacklistAttackComponent } from './blacklisted-attack/blacklisted-attack.component';
import { ErrorModalComponent } from './error/error.component';

@NgModule({
  declarations: [ErrorModalComponent, BlacklistAttackComponent],
  imports: [CommonModule, CoreFormsModule, ButtonsModule],
  exports: [ErrorModalComponent, BlacklistAttackComponent]
})
export class AlertNavModule {}
