import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule
} from '@angular/material/snack-bar';

import { ActionMenuComponent } from './menus/action-menu/action-menu.component';
import { AgentsTableComponent } from './tables/agents-table/agents-table.component';
import { BaseMenuComponent } from './menus/base-menu/base-menu.component';
import { BaseTableComponent } from './tables/base-table/base-table.component';
import { BulkActionMenuComponent } from './menus/bulk-action-menu/bulk-action-menu.component';
import { ChunksTableComponent } from './tables/chunks-table/chunks-table.component';
import { ColumnSelectionDialogComponent } from './tables/column-selection-dialog/column-selection-dialog.component';
import { CommonModule } from '@angular/common';
import { ExportMenuComponent } from './menus/export-menu/export-menu.component';
import { HTTableComponent } from './tables/ht-table/ht-table.component';
import { HashlistsTableComponent } from './tables/hashlists-table/hashlists-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RowActionMenuComponent } from './menus/row-action-menu/row-action-menu.component';
import { TableDialogComponent } from './tables/table-dialog/table-dialog.component';

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
    AgentsTableComponent,
    ChunksTableComponent,
    HashlistsTableComponent
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
    MatSlideToggleModule,
    MatInputModule,
    RouterModule,
    FormsModule
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
    AgentsTableComponent,
    ChunksTableComponent,
    HashlistsTableComponent
  ],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 2500, verticalPosition: 'top' }
    }
  ]
})
export class CoreComponentsModule {}
