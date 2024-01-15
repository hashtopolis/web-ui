import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule
} from '@angular/material/snack-bar';

import { AccessGroupsTableComponent } from './tables/access-groups-table/access-groups-table.component';
import { ActionMenuComponent } from './menus/action-menu/action-menu.component';
import { AgentBinariesTableComponent } from './tables/agent-binaries-table/agent-binaries-table.component';
import { AgentsTableComponent } from './tables/agents-table/agents-table.component';
import { BaseMenuComponent } from './menus/base-menu/base-menu.component';
import { BaseTableComponent } from './tables/base-table/base-table.component';
import { BulkActionMenuComponent } from './menus/bulk-action-menu/bulk-action-menu.component';
import { ChunksTableComponent } from './tables/chunks-table/chunks-table.component';
import { ColumnSelectionDialogComponent } from './tables/column-selection-dialog/column-selection-dialog.component';
import { CommonModule } from '@angular/common';
import { CrackersTableComponent } from './tables/crackers-table/crackers-table.component';
import { CracksTableComponent } from './tables/cracks-table/cracks-table.component';
import { ExportMenuComponent } from './menus/export-menu/export-menu.component';
import { FilesTableComponent } from './tables/files-table/files-table.component';
import { HTTableComponent } from './tables/ht-table/ht-table.component';
import { HTTableTypeDefaultComponent } from './tables/ht-table/type/default/ht-table-type-default.component';
import { HTTableTypeEditableComponent } from './tables/ht-table/type/editable/ht-table-type-editable.component';
import { HTTableTypeLinkComponent } from './tables/ht-table/type/link/ht-table-type-link.component';
import { HashlistsTableComponent } from './tables/hashlists-table/hashlists-table.component';
import { HashtypesTableComponent } from './tables/hashtypes-table/hashtypes-table.component';
import { HealthChecksTableComponent } from './tables/health-checks-table/health-checks-table.component';
import { LogsTableComponent } from './tables/logs-table/logs-table.component';
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
import { NotificationsTableComponent } from './tables/notifications-table/notifications-table.component';
import { PermissionsTableComponent } from './tables/permissions-table/permissions-table.component';
import { PreprocessorsTableComponent } from './tables/preprocessors-table/preprocessors-table.component';
import { PretasksTableComponent } from './tables/pretasks-table/pretasks-table.component';
import { RouterModule } from '@angular/router';
import { RowActionMenuComponent } from './menus/row-action-menu/row-action-menu.component';
import { SuperHashlistsTableComponent } from './tables/super-hashlists-table/super-hashlists-table.component';
import { SuperTasksTableComponent } from './tables/supertasks-table/supertasks-table.component';
import { TableDialogComponent } from './tables/table-dialog/table-dialog.component';
import { TableTruncateComponent } from './tables/table-truncate/table-truncate.component';
import { TasksTableComponent } from './tables/tasks-table/tasks-table.component';
import { UsersTableComponent } from './tables/users-table/users-table.component';
import { VouchersTableComponent } from './tables/vouchers-table/vouchers-table.component';
import { SearchHashTableComponent } from './tables/search-hash-table/search-hash-table.component';
import { SuperTasksPretasksTableComponent } from './tables/supertasks-pretasks-table/supertasks-pretasks-table.component';


@NgModule({
  declarations: [
    TableDialogComponent,
    TableTruncateComponent,
    BaseTableComponent,
    HTTableComponent,
    HTTableTypeLinkComponent,
    HTTableTypeDefaultComponent,
    HTTableTypeEditableComponent,
    BaseMenuComponent,
    ActionMenuComponent,
    RowActionMenuComponent,
    BulkActionMenuComponent,
    ExportMenuComponent,
    ColumnSelectionDialogComponent,
    AgentsTableComponent,
    ChunksTableComponent,
    HashtypesTableComponent,
    HashlistsTableComponent,
    SuperHashlistsTableComponent,
    FilesTableComponent,
    CrackersTableComponent,
    PreprocessorsTableComponent,
    PretasksTableComponent,
    SuperTasksTableComponent,
    SuperTasksPretasksTableComponent,
    AgentBinariesTableComponent,
    HealthChecksTableComponent,
    LogsTableComponent,
    UsersTableComponent,
    AccessGroupsTableComponent,
    NotificationsTableComponent,
    PermissionsTableComponent,
    CracksTableComponent,
    VouchersTableComponent,
    SearchHashTableComponent,
    TasksTableComponent,
    CracksTableComponent
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
    RouterModule,
    FormsModule
  ],
  exports: [
    BaseTableComponent,
    TableTruncateComponent,
    HTTableComponent,
    HTTableTypeLinkComponent,
    HTTableTypeDefaultComponent,
    HTTableTypeEditableComponent,
    ColumnSelectionDialogComponent,
    BaseMenuComponent,
    ActionMenuComponent,
    RowActionMenuComponent,
    BulkActionMenuComponent,
    ExportMenuComponent,
    AgentsTableComponent,
    ChunksTableComponent,
    HashlistsTableComponent,
    HashtypesTableComponent,
    SuperHashlistsTableComponent,
    FilesTableComponent,
    CrackersTableComponent,
    PreprocessorsTableComponent,
    PretasksTableComponent,
    SuperTasksTableComponent,
    SuperTasksPretasksTableComponent,
    AgentBinariesTableComponent,
    HealthChecksTableComponent,
    LogsTableComponent,
    UsersTableComponent,
    AccessGroupsTableComponent,
    NotificationsTableComponent,
    PermissionsTableComponent,
    CracksTableComponent,
    VouchersTableComponent,
    SearchHashTableComponent,
    TasksTableComponent,
    CracksTableComponent
  ],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 2500, verticalPosition: 'top' }
    }
  ]
})
export class CoreComponentsModule {}
