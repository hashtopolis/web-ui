import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  imports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatOptionModule,
    MatSelectModule,
    MatDividerModule,
    MatCheckboxModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatChipsModule,
    MatProgressBarModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatTooltipModule,
    MatFormFieldModule,
    FlexLayoutModule,
    MatInputModule,
    MatIconModule
  ],
  exports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatOptionModule,
    MatSelectModule,
    MatDividerModule,
    MatCheckboxModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatChipsModule,
    MatProgressBarModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatTooltipModule,
    MatFormFieldModule,
    FlexLayoutModule,
    MatInputModule,
    MatIconModule
  ]
})
export class CoreFormsModule {}
