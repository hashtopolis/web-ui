import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormComponent } from 'src/app/core/_components/forms/simple-forms/form.component';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FormConfigComponent } from '@components/forms/simple-forms/formconfig.component';

import { ServerActionsComponent } from '@src/app/config/server-actions/server-actions.component';
import { ButtonsModule } from '@src/app/shared/buttons/buttons.module';
import { DynamicFormComponent } from '@src/app/shared/dynamic-form-builder/dynamicform.component';
import { CoreFormsModule } from '@src/app/shared/forms.module';
import { GridModule } from '@src/app/shared/grid-containers/grid.module';
import { HorizontalNavModule } from '@src/app/shared/navigation/navigation.module';
import { PageTitleModule } from '@src/app/shared/page-headers/page-title.module';
import { PipesModule } from '@src/app/shared/pipes.module';

@NgModule({
  declarations: [DynamicFormComponent, FormConfigComponent, FormComponent],
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule,
    MatChipsModule,
    MatOptionModule,
    CommonModule,
    CoreFormsModule,
    MatAutocompleteModule,
    FontAwesomeModule,
    FormsModule,
    PipesModule,
    GridModule,
    NgbModule,
    PageTitleModule,
    ReactiveFormsModule,
    HorizontalNavModule,
    ButtonsModule,
    ServerActionsComponent
  ],
  exports: [DynamicFormComponent, FormConfigComponent, FormComponent],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' }
    }
  ]
})
export class DynamicFormModule {}
