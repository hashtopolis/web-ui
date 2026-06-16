import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ButtonSubmitComponent } from '@src/app/shared/buttons/button-submit';
import { GridButtonsComponent } from '@src/app/shared/buttons/grid-cancel';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatGridListModule,
    MatDividerModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  exports: [ButtonSubmitComponent, GridButtonsComponent],
  declarations: [ButtonSubmitComponent, GridButtonsComponent]
})
export class ButtonsModule {}
