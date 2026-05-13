import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MomentModule } from 'ngx-moment';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { moduleMetadata } from '@storybook/angular';

import { ComponentsModule } from '@src/app/shared/components.module';
import { DirectivesModule } from '@src/app/shared/directives.module';
import { PipesModule } from '@src/app/shared/pipes.module';

export const withSharedModule = moduleMetadata({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MomentModule,
    FontAwesomeModule,
    ComponentsModule,
    DirectivesModule,
    PipesModule
  ]
});
