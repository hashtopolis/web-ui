import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';
import { ActionMenuComponent } from '@components/menus/action-menu/action-menu.component';
import { BaseMenuComponent } from '@components/menus/base-menu/base-menu.component';
import { BulkActionMenuComponent } from '@components/menus/bulk-action-menu/bulk-action-menu.component';
import { ExportMenuComponent } from '@components/menus/export-menu/export-menu.component';
import { RowActionMenuComponent } from '@components/menus/row-action-menu/row-action-menu.component';
import { AccessGroupsAgentsTableComponent } from '@components/tables/access-groups-agents-table/access-groups-agents-table.component';
import { AccessGroupsTableComponent } from '@components/tables/access-groups-table/access-groups-table.component';
import { AccessGroupsUserTableComponent } from '@components/tables/access-groups-users-table/access-groups-users-table.component';
import { AccessPermissionGroupsUserTableComponent } from '@components/tables/access-permission-groups-user-table/access-permission-groups-user-table.component';
import { AccessPermissionGroupsUsersTableComponent } from '@components/tables/access-permission-groups-users-table/access-permission-groups-users-table.component';
import { AgentBinariesTableComponent } from '@components/tables/agent-binaries-table/agent-binaries-table.component';
import { AgentErrorTableComponent } from '@components/tables/agent-error-table/agent-error-table.component';
import { AgentsStatusTableComponent } from '@components/tables/agents-status-table/agents-status-table.component';
import { AgentsTableComponent } from '@components/tables/agents-table/agents-table.component';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { ChunksTableComponent } from '@components/tables/chunks-table/chunks-table.component';
import { ColumnSelectionDialogComponent } from '@components/tables/column-selection-dialog/column-selection-dialog.component';
import { CrackersTableComponent } from '@components/tables/crackers-table/crackers-table.component';
import { CracksTableComponent } from '@components/tables/cracks-table/cracks-table.component';
import { FilesAttackTableComponent } from '@components/tables/files-attack-table/files-attack-table.component';
import { FilesTableComponent } from '@components/tables/files-table/files-table.component';
import { HashesTableComponent } from '@components/tables/hashes-table/hashes-table.component';
import { HashlistsTableComponent } from '@components/tables/hashlists-table/hashlists-table.component';
import { HashtypesTableComponent } from '@components/tables/hashtypes-table/hashtypes-table.component';
import { HealthCheckAgentsTableComponent } from '@components/tables/health-check-agents-table/health-check-agents-table.component';
import { HealthChecksTableComponent } from '@components/tables/health-checks-table/health-checks-table.component';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { HTTableTypeDefaultComponent } from '@components/tables/ht-table/type/default/ht-table-type-default.component';
import { HTTableTypeEditableCheckboxComponent } from '@components/tables/ht-table/type/editable/editable-checkbox/ht-table-type-editable-checkbox.component';
import { HTTableTypeEditableComponent } from '@components/tables/ht-table/type/editable/editable-text/ht-table-type-editable.component';
import { HTTableTypeLinkComponent } from '@components/tables/ht-table/type/link/ht-table-type-link.component';
import { LogsTableComponent } from '@components/tables/logs-table/logs-table.component';
import { NotificationsTableComponent } from '@components/tables/notifications-table/notifications-table.component';
import { PermissionsTableComponent } from '@components/tables/permissions-table/permissions-table.component';
import { PreprocessorsTableComponent } from '@components/tables/preprocessors-table/preprocessors-table.component';
import { PretasksTableComponent } from '@components/tables/pretasks-table/pretasks-table.component';
import { SearchHashTableComponent } from '@components/tables/search-hash-table/search-hash-table.component';
import { SuperHashlistsHashlistsTableComponent } from '@components/tables/super-hashlist-hashlist-table/super-hashlist-hashlist-table.component';
import { SuperHashlistsTableComponent } from '@components/tables/super-hashlists-table/super-hashlists-table.component';
import { SuperTasksPretasksTableComponent } from '@components/tables/supertasks-pretasks-table/supertasks-pretasks-table.component';
import { SuperTasksTableComponent } from '@components/tables/supertasks-table/supertasks-table.component';
import { TableDialogComponent } from '@components/tables/table-dialog/table-dialog.component';
import { TableTruncateComponent } from '@components/tables/table-truncate/table-truncate.component';
import { TasksAgentsTableComponent } from '@components/tables/tasks-agents-table/tasks-agents-table.component';
import { TasksChunksTableComponent } from '@components/tables/tasks-chunks-table/tasks-chunks-table.component';
import { TasksFilesTableComponent } from '@components/tables/tasks-files-table/tasks-files-table.component';
import { TasksSupertasksTableComponent } from '@components/tables/tasks-supertasks-table/tasks-supertasks-table.component';
import { TasksTableComponent } from '@components/tables/tasks-table/tasks-table.component';
import { UsersTableComponent } from '@components/tables/users-table/users-table.component';
import { VouchersTableComponent } from '@components/tables/vouchers-table/vouchers-table.component';

import { DebounceDirective } from '@src/app/core/_directives/debounce.directive';
import { PipesModule } from '@src/app/shared/pipes.module';
import { LastUpdatedComponent } from '@src/app/shared/widgets/last-updated/last-updated.component';

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
    AgentErrorTableComponent,
    ChunksTableComponent,
    HashtypesTableComponent,
    HashlistsTableComponent,
    SuperHashlistsHashlistsTableComponent,
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
    TasksAgentsTableComponent,
    TasksChunksTableComponent,
    TasksFilesTableComponent,
    TasksSupertasksTableComponent,
    CracksTableComponent,
    ConfirmDialogComponent
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
    PipesModule,
    DebounceDirective,
    LastUpdatedComponent
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
    AgentErrorTableComponent,
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
    SuperHashlistsHashlistsTableComponent,
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
    TasksAgentsTableComponent,
    TasksChunksTableComponent,
    TasksFilesTableComponent,
    TasksSupertasksTableComponent,
    CracksTableComponent,
    ConfirmDialogComponent
  ],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 2500, verticalPosition: 'top' }
    }
  ]
})
export class CoreComponentsModule {}
