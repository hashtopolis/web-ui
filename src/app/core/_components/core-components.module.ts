import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule
} from '@angular/material/snack-bar';

import { AccessGroupsAgentsTableComponent } from './tables/access-groups-agents-table/access-groups-agents-table.component';
import { AccessGroupsTableComponent } from './tables/access-groups-table/access-groups-table.component';
import { AccessGroupsUserTableComponent } from './tables/access-groups-users-table/access-groups-users-table.component';
import { AccessPermissionGroupsUserTableComponent } from './tables/access-permission-groups-user-table/access-permission-groups-user-table.component';
import { AccessPermissionGroupsUsersTableComponent } from './tables/access-permission-groups-users-table/access-permission-groups-users-table.component';
import { ActionMenuComponent } from './menus/action-menu/action-menu.component';
import { AgentBinariesTableComponent } from './tables/agent-binaries-table/agent-binaries-table.component';
import { AgentViewTableComponent } from './tables/agent-view-table/agent-view-table.component';
import { AgentsStatusTableComponent } from './tables/agents-status-table/agents-status-table.component';
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
import { FilesAttackTableComponent } from './tables/files-attack-table/files-attack-table.component';
import { FilesTableComponent } from './tables/files-table/files-table.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HTTableComponent } from './tables/ht-table/ht-table.component';
import { HTTableTypeDefaultComponent } from './tables/ht-table/type/default/ht-table-type-default.component';
import { HTTableTypeEditableCheckboxComponent } from './tables/ht-table/type/editable/editable-checkbox/ht-table-type-editable-checkbox.component';
import { HTTableTypeEditableComponent } from './tables/ht-table/type/editable/editable-text/ht-table-type-editable.component';
import { HTTableTypeLinkComponent } from './tables/ht-table/type/link/ht-table-type-link.component';
import { HashesTableComponent } from './tables/hashes-table/hashes-table.component';
import { HashlistsTableComponent } from './tables/hashlists-table/hashlists-table.component';
import { HashtypesTableComponent } from './tables/hashtypes-table/hashtypes-table.component';
import { HealthCheckAgentsTableComponent } from './tables/health-check-agents-table/health-check-agents-table.component';
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
import { PipesModule } from "../../shared/pipes.module";
import { PreprocessorsTableComponent } from './tables/preprocessors-table/preprocessors-table.component';
import { PretasksTableComponent } from './tables/pretasks-table/pretasks-table.component';
import { RouterModule } from '@angular/router';
import { RowActionMenuComponent } from './menus/row-action-menu/row-action-menu.component';
import { SearchHashTableComponent } from './tables/search-hash-table/search-hash-table.component';
import { SuperHashlistsTableComponent } from './tables/super-hashlists-table/super-hashlists-table.component';
import { SuperTasksPretasksTableComponent } from './tables/supertasks-pretasks-table/supertasks-pretasks-table.component';
import { SuperTasksTableComponent } from './tables/supertasks-table/supertasks-table.component';
import { TableDialogComponent } from './tables/table-dialog/table-dialog.component';
import { TableTruncateComponent } from './tables/table-truncate/table-truncate.component';
import { TasksChunksTableComponent } from './tables/tasks-chunks-table/tasks-chunks-table.component';
import { TasksSupertasksTableComponent } from './tables/tasks-supertasks-table/tasks-supertasks-table.component';
import { TasksTableComponent } from './tables/tasks-table/tasks-table.component';
import { UsersTableComponent } from './tables/users-table/users-table.component';
import { VouchersTableComponent } from './tables/vouchers-table/vouchers-table.component';

@NgModule({
  declarations: [
    TableDialogComponent,
    TableTruncateComponent,
    BaseTableComponent,
    HTTableComponent,
    HTTableTypeLinkComponent,
    HTTableTypeDefaultComponent,
    HTTableTypeEditableComponent,
    HTTableTypeEditableCheckboxComponent,
    BaseMenuComponent,
    ActionMenuComponent,
    RowActionMenuComponent,
    BulkActionMenuComponent,
    ExportMenuComponent,
    ColumnSelectionDialogComponent,
    AgentsTableComponent,
    AgentsStatusTableComponent,
    ChunksTableComponent,
    HashtypesTableComponent,
    HashlistsTableComponent,
    HashesTableComponent,
    SuperHashlistsTableComponent,
    FilesAttackTableComponent,
    FilesTableComponent,
    CrackersTableComponent,
    PreprocessorsTableComponent,
    PretasksTableComponent,
    SuperTasksTableComponent,
    SuperTasksPretasksTableComponent,
    AgentBinariesTableComponent,
    HealthChecksTableComponent,
    HealthCheckAgentsTableComponent,
    LogsTableComponent,
    UsersTableComponent,
    AccessGroupsTableComponent,
    AccessGroupsUserTableComponent,
    AccessGroupsAgentsTableComponent,
    AccessPermissionGroupsUserTableComponent,
    AccessPermissionGroupsUsersTableComponent,
    NotificationsTableComponent,
    PermissionsTableComponent,
    CracksTableComponent,
    VouchersTableComponent,
    SearchHashTableComponent,
    TasksTableComponent,
    TasksChunksTableComponent,
    TasksSupertasksTableComponent,
    CracksTableComponent,
    AgentViewTableComponent
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
    FormsModule,
    FontAwesomeModule,
    PipesModule
],
  exports: [
    BaseTableComponent,
    TableTruncateComponent,
    HTTableComponent,
    HTTableTypeLinkComponent,
    HTTableTypeDefaultComponent,
    HTTableTypeEditableComponent,
    HTTableTypeEditableCheckboxComponent,
    ColumnSelectionDialogComponent,
    BaseMenuComponent,
    ActionMenuComponent,
    RowActionMenuComponent,
    BulkActionMenuComponent,
    ExportMenuComponent,
    AgentsTableComponent,
    AgentsStatusTableComponent,
    ChunksTableComponent,
    HashlistsTableComponent,
    HashesTableComponent,
    HashtypesTableComponent,
    SuperHashlistsTableComponent,
    FilesAttackTableComponent,
    FilesTableComponent,
    CrackersTableComponent,
    PreprocessorsTableComponent,
    PretasksTableComponent,
    SuperTasksTableComponent,
    SuperTasksPretasksTableComponent,
    AgentBinariesTableComponent,
    HealthChecksTableComponent,
    HealthCheckAgentsTableComponent,
    LogsTableComponent,
    UsersTableComponent,
    AccessGroupsTableComponent,
    AccessGroupsUserTableComponent,
    AccessGroupsAgentsTableComponent,
    AccessPermissionGroupsUserTableComponent,
    AccessPermissionGroupsUsersTableComponent,
    NotificationsTableComponent,
    PermissionsTableComponent,
    CracksTableComponent,
    VouchersTableComponent,
    SearchHashTableComponent,
    TasksTableComponent,
    TasksChunksTableComponent,
    TasksSupertasksTableComponent,
    CracksTableComponent,
    AgentViewTableComponent
  ],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 2500, verticalPosition: 'top' }
    }
  ]
})
export class CoreComponentsModule {}
