import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HTTableComponent } from "./ht-table/ht-table.component";
import { ActionMenuComponent } from "./menus/action-menu/action-menu.component";
import { BaseMenuComponent } from "./menus/base-menu/base-menu.component";
import { BulkActionMenuComponent } from "./menus/bulk-action-menu/bulk-action-menu.component";
import { RowActionMenuComponent } from "./menus/row-action-menu/row-action-menu.component";
import { TableDialogComponent } from "./table-dialog/table-dialog.component";
import { BaseTableComponent } from "./base-table/base-table.component";
import { ColumnSelectionDialogComponent } from "./column-selection-dialog/column-selection-dialog.component";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { ExportMenuComponent } from "./menus/export-menu/export-menu.component";


@NgModule({
  declarations: [
    TableDialogComponent,
    BaseTableComponent,
    HTTableComponent,
    BaseMenuComponent,
    ActionMenuComponent,
    RowActionMenuComponent,
    BulkActionMenuComponent,
    ExportMenuComponent,
    ColumnSelectionDialogComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatDialogModule,
    MatTooltipModule,
    MatDividerModule,
    RouterModule,
    FormsModule,
  ],
  exports: [
    BaseTableComponent,
    HTTableComponent,
    ColumnSelectionDialogComponent,
    BaseMenuComponent,
    ActionMenuComponent,
    RowActionMenuComponent,
    BulkActionMenuComponent,
    ExportMenuComponent,
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } }
  ]
})
export class CoreComponentsModule { }