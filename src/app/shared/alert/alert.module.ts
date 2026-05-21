import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BlacklistAttackComponent } from '@src/app/shared/alert/blacklisted-attack/blacklisted-attack.component';
import { ErrorModalComponent } from '@src/app/shared/alert/error/error.component';
import { ButtonsModule } from '@src/app/shared/buttons/buttons.module';
import { CoreFormsModule } from '@src/app/shared/forms.module';

@NgModule({
  declarations: [ErrorModalComponent, BlacklistAttackComponent],
  imports: [CommonModule, CoreFormsModule, ButtonsModule],
  exports: [ErrorModalComponent, BlacklistAttackComponent]
})
export class AlertNavModule {}
