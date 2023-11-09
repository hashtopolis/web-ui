import { ButtonsModule } from '../buttons/buttons.module';
import { CommonModule } from "@angular/common";
import { DynamicFormComponent } from "./dynamicform.component";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormComponent } from './form.component';
import { FormConfigComponent } from './formconfig.component';
import { FormUIsettingsComponent } from './formuisettings.component';
import { GridModule } from '../grid-containers/grid.module';
import { HorizontalNavModule } from '../navigation/navigation.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from "@angular/material/button";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageTitleModule } from '../page-headers/page-title.module';

@NgModule({
  declarations: [
    FormUIsettingsComponent,
    DynamicFormComponent,
    FormConfigComponent,
    FormComponent
  ],
  imports: [
    ReactiveFormsModule,
    HorizontalNavModule,
    FontAwesomeModule,
    PageTitleModule,
    ButtonsModule,
    FormsModule,
    GridModule,
    NgbModule,
    CommonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule
  ],
  exports: [
    FormUIsettingsComponent,
    DynamicFormComponent,
    FormConfigComponent,
    FormComponent
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}
  ]
})
export class DynamicFormModule {}
