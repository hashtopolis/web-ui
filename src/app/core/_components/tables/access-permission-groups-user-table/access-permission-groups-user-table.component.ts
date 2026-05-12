import { catchError } from 'rxjs';

import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';

import { DynamicModel } from '@models/base.model';
import { Permission, UserPermissions } from '@models/global-permission-group.model';
import { JUser } from '@models/user.model';

import { SERV } from '@services/main.config';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import {
  APGUTableEditableAction,
  AccessPermissionGroupsUserTableCol,
  AccessPermissionGroupsUserTableColumnLabel
} from '@components/tables/access-permission-groups-user-table/access-permission-groups-user-table.constants';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import {
  HTTableColumn,
  HTTableEditable,
  HTTableHeaderCheckbox,
  HTTableHeaderCheckboxState
} from '@components/tables/ht-table/ht-table.models';

import { AccessPermissionGroupsExpandDataSource } from '@datasources/access-permission-groups-expand.datasource';

import { PermissionValues } from '@src/app/core/_constants/userpermissions.config';
import {
  CrudVerb,
  PERMISSION_DENIED_TOOLTIP,
  PERMISSION_NOT_APPLICABLE_TOOLTIP,
  PermissionMatrixRow,
  buildPermissionMatrix
} from '@src/app/shared/utils/permission-matrix';

export const PermissionTableMode = {
  EDIT: 'edit',
  FORM: 'form',
  /**
   * Read-only matrix. Like FORM, the data source is seeded from {@link granted}
   * and {@link selection} drives which cells render checked. Unlike FORM, every
   * cell is disabled, the row-toggle column is hidden, and no header checkboxes
   * are exposed — the table is a static visualization, not an input.
   */
  VIEW: 'view'
} as const;
export type PermissionTableMode = (typeof PermissionTableMode)[keyof typeof PermissionTableMode];

const VERB_TO_COL: Record<CrudVerb, AccessPermissionGroupsUserTableCol> = {
  [CrudVerb.CREATE]: AccessPermissionGroupsUserTableCol.CREATE,
  [CrudVerb.READ]: AccessPermissionGroupsUserTableCol.READ,
  [CrudVerb.UPDATE]: AccessPermissionGroupsUserTableCol.UPDATE,
  [CrudVerb.DELETE]: AccessPermissionGroupsUserTableCol.DELETE
};

const VERB_TO_ACTION: Record<CrudVerb, string> = {
  [CrudVerb.CREATE]: APGUTableEditableAction.CHANGE_CREATE_PERMISSION,
  [CrudVerb.READ]: APGUTableEditableAction.CHANGE_READ_PERMISSION,
  [CrudVerb.UPDATE]: APGUTableEditableAction.CHANGE_UPDATE_PERMISSION,
  [CrudVerb.DELETE]: APGUTableEditableAction.CHANGE_DELETE_PERMISSION
};

@Component({
  selector: 'access-permission-groups-user-table',
  templateUrl: './access-permission-groups-user-table.component.html',
  standalone: false
})
export class AccessPermissionGroupsUserTableComponent
  extends BaseTableComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit
{
  /**
   * `'edit'` (default): live-edit a persisted access-permission group. Loads via
   * the datasource and PATCHes the backend on each cell flip.
   *
   * `'form'`: data source seeded from {@link granted}; cell flips mutate the
   * selection list and emit {@link selectionChange} for a parent reactive form
   * to consume. No backend writes.
   *
   * `'view'`: data source seeded from {@link granted}; every cell renders
   * disabled and reflects whether its key is in {@link selection}. No
   * row-toggle column, no header checkboxes, no events emitted.
   */
  @Input() mode: PermissionTableMode = PermissionTableMode.EDIT;

  /** Edit mode — id of the permission group to load. */
  @Input() accesspermgroupId = 0;

  /**
   * Form mode — the current user's permission map (the value returned by
   * {@link PermissionService.loadPermissions}). Drives the matrix rows and the
   * `disabled` state of cells the user does not hold.
   */
  @Input() granted?: Permission;

  /** Form mode — currently-selected permission keys. */
  @Input() selection: string[] = [];

  /** Form mode — emitted when the user toggles a cell or a column header. */
  @Output() selectionChange = new EventEmitter<string[]>();

  tableColumns: HTTableColumn[] = [];
  dataSource: AccessPermissionGroupsExpandDataSource;
  expand = 'userMembers';
  permissions = 1;

  /** Form mode — matrix rows, kept here so column-toggle helpers can iterate them. */
  private rows: PermissionMatrixRow[] = [];
  /** Form mode — fast lookup for `selection.includes(key)` during render. */
  private selected: Set<PermissionValues> = new Set();

  ngOnInit(): void {
    this.setColumnLabels(AccessPermissionGroupsUserTableColumnLabel);
    this.dataSource = new AccessPermissionGroupsExpandDataSource(this.injector);
    this.tableColumns = this.getColumns();
    this.dataSource.setColumns(this.tableColumns);

    if (this.mode === PermissionTableMode.EDIT) {
      if (this.accesspermgroupId) {
        this.dataSource.setAccessPermGroupId(this.accesspermgroupId);
        this.dataSource.setAccessPermGroupExpand(this.expand);
        this.dataSource.setPermissions(this.permissions);
      }
    } else {
      // Form / view modes — seed the selection set and matrix rows synchronously.
      this.selected = new Set(this.selection as PermissionValues[]);
      if (this.granted) {
        this.rows = buildPermissionMatrix(this.granted);
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.mode === PermissionTableMode.EDIT) {
      this.dataSource.loadAll();
    } else if (this.granted) {
      this.dataSource.loadFromMap(this.granted);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.mode === PermissionTableMode.EDIT || !this.dataSource) {
      return;
    }
    if (changes['selection']) {
      this.selected = new Set(this.selection as PermissionValues[]);
    }
    if (changes['granted'] && this.granted) {
      this.rows = buildPermissionMatrix(this.granted);
    }
    if ((changes['selection'] || changes['granted']) && this.granted) {
      // Push fresh rows so ht-table's OnPush cells re-instantiate with the
      // latest derived `value`/`disabled`/`tooltip` from their checkbox callbacks.
      this.dataSource.loadFromMap(this.granted);
    }
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  getColumns(): HTTableColumn[] {
    const columns: HTTableColumn[] = [];
    if (this.mode === PermissionTableMode.FORM) {
      columns.push(this.rowToggleColumn());
    }
    columns.push(
      {
        id: AccessPermissionGroupsUserTableCol.NAME,
        dataKey: 'name',
        isSortable: this.mode === PermissionTableMode.EDIT,
        export: async (perm: UserPermissions) => perm.name + ''
      },
      this.crudColumn(CrudVerb.CREATE),
      this.crudColumn(CrudVerb.READ),
      this.crudColumn(CrudVerb.UPDATE),
      this.crudColumn(CrudVerb.DELETE)
    );
    return columns;
  }

  /**
   * Form-mode-only leading column with a tri-state checkbox per row that toggles every
   * CRUD permission on that resource the user holds. Mirrors the column-header
   * "select all in column" affordance, but on the row axis. Marked `alwaysShown`
   * so it can't be hidden by the table's column-selection dialog.
   */
  private rowToggleColumn(): HTTableColumn {
    return {
      id: AccessPermissionGroupsUserTableCol.ROW_TOGGLE,
      isSortable: false,
      alwaysShown: true,
      checkbox: (perm: UserPermissions) => this.rowToggleCellCheckbox(perm as PermissionMatrixRow),
      headerCheckbox: () => this.matrixHeaderCheckbox()
    };
  }

  /**
   * Form-mode-only master toggle living in the ROW_TOGGLE column header. Flips
   * every grantable cell in the matrix on or off in a single click — the row
   * axis of the existing column-header "select all" affordance, generalized to
   * the full grid. Mirrors {@link columnHeaderCheckbox}: only grantable cells
   * count toward the tri-state, so selecting every cell the user is allowed to
   * grant promotes the master toggle to CHECKED.
   */
  private matrixHeaderCheckbox(): HTTableHeaderCheckbox {
    const grantedKeys: PermissionValues[] = [];
    for (const row of this.rows) {
      for (const k of Object.values(row.keys ?? {})) {
        if (k && this.granted?.[k]) grantedKeys.push(k);
      }
    }

    return {
      state: getHeaderCheckboxState(grantedKeys, this.selected),
      change: (next) => this.toggleColumn(grantedKeys, next),
      tooltip: 'Toggle all permissions'
    };
  }

  private rowToggleCellCheckbox(row: PermissionMatrixRow): HTTableEditable<UserPermissions> {
    // Only grantable cells (defined for this resource AND held by the current user) count
    // toward the row toggle. N/A and denied cells are excluded from the population, so
    // selecting every cell the user can grant promotes the row to fully checked.
    const grantedKeys = Object.values(row.keys ?? {})
      .filter((k): k is PermissionValues => Boolean(k))
      .filter((k) => Boolean(this.granted?.[k]));
    if (grantedKeys.length === 0) {
      // The user holds no CRUD permissions for this resource — nothing to toggle.
      return {
        data: row,
        value: 'false',
        action: APGUTableEditableAction.CHANGE_ROW_PERMISSION,
        disabled: true,
        tooltip: PERMISSION_DENIED_TOOLTIP
      };
    }
    const selectedCount = grantedKeys.filter((k) => this.selected.has(k)).length;
    // "Fully filled" means every grantable cell on this row is selected. N/A and denied cells
    // are excluded from the population entirely, so they no longer block the checked state —
    // otherwise indeterminate would be a dead-end: the user can never toggle the row "full."
    const fullyChecked = selectedCount === grantedKeys.length;
    const partial = selectedCount > 0 && !fullyChecked;
    return {
      data: row,
      value: fullyChecked ? 'true' : 'false',
      action: APGUTableEditableAction.CHANGE_ROW_PERMISSION,
      indeterminate: partial,
      tooltip: 'Toggle all permissions for this resource'
    };
  }

  /**
   * Build a single CRUD column descriptor. The descriptor's `checkbox` callback
   * shape changes between modes:
   *   - edit: returns `value = row.<verb>`, no disabled/tooltip — the cell flip
   *     drives a PATCH.
   *   - form: returns `value = selection.has(row.keys[verb])`, with `disabled`
   *     and `tooltip` honoring whether the user holds the permission and
   *     whether the permission exists for this resource at all.
   *
   * In form mode the column also exposes a `headerCheckbox` callback that
   * drives the column-level toggle.
   */
  private crudColumn(verb: CrudVerb): HTTableColumn {
    const colId = VERB_TO_COL[verb];
    const action = VERB_TO_ACTION[verb];

    const column: HTTableColumn = {
      id: colId,
      dataKey: verb,
      isSortable: this.mode === PermissionTableMode.EDIT,
      checkbox: (perm: UserPermissions) => this.cellCheckbox(perm as PermissionMatrixRow, verb, action),
      export: async (perm: UserPermissions) => (perm[verb] ? 'true' : 'false')
    };

    if (this.mode === PermissionTableMode.FORM) {
      column.headerCheckbox = () => this.columnHeaderCheckbox(verb);
    }

    return column;
  }

  private cellCheckbox(row: PermissionMatrixRow, verb: CrudVerb, action: string): HTTableEditable<UserPermissions> {
    if (this.mode === PermissionTableMode.EDIT) {
      return {
        data: row,
        value: row[verb] + '',
        action
      };
    }

    const key = row.keys?.[verb];
    if (!key) {
      // No backend permission exists for this row × verb.
      return {
        data: row,
        value: 'false',
        action,
        disabled: true,
        tooltip: PERMISSION_NOT_APPLICABLE_TOOLTIP
      };
    }

    if (this.mode === PermissionTableMode.VIEW) {
      // Read-only: cell reflects selection without regard to `granted`, and is
      // always disabled. No tooltip — the page-level explanation handles intent.
      return {
        data: row,
        value: this.selected.has(key) + '',
        action,
        disabled: true
      };
    }

    // Form mode
    const userHolds = Boolean(this.granted?.[key]);
    const checked = this.selected.has(key);
    return {
      data: row,
      value: checked + '',
      action,
      disabled: !userHolds,
      tooltip: userHolds ? '' : PERMISSION_DENIED_TOOLTIP
    };
  }

  private columnHeaderCheckbox(verb: CrudVerb): HTTableHeaderCheckbox {
    // Mirror rowToggleCellCheckbox on the column axis: only grantable cells count toward the
    // header state. Rows where the verb is N/A or denied are excluded from the population,
    // so selecting every cell the user is allowed to grant promotes the header to CHECKED.
    const grantedKeys = this.rows
      .map((row) => row.keys?.[verb])
      .filter((k): k is PermissionValues => Boolean(k))
      .filter((k) => Boolean(this.granted?.[k]));

    return {
      state: getHeaderCheckboxState(grantedKeys, this.selected),
      change: (next) => this.toggleColumn(grantedKeys, next),
      label: AccessPermissionGroupsUserTableColumnLabel[VERB_TO_COL[verb]]
    };
  }

  private toggleColumn(grantedKeys: PermissionValues[], next: boolean): void {
    const updated = new Set(this.selected);
    for (const key of grantedKeys) {
      if (next) {
        updated.add(key);
      } else {
        updated.delete(key);
      }
    }
    this.emitSelection(updated);
  }

  // --- Action functions ---
  exportActionClicked(event: ActionMenuEvent<(JUser | UserPermissions)[]>): void {
    this.exportService.handleExportAction<UserPermissions>(
      event as ActionMenuEvent<UserPermissions[]>,
      this.tableColumns,
      AccessPermissionGroupsUserTableColumnLabel,
      'hashtopolis-access-permission-groups-user'
    );
  }

  /**
   * Update Permissions on checkbox change event
   * @param editable Editable object containing current permission, action and changed value
   */
  onCheckboxChange(editable: HTTableEditable<JUser | UserPermissions>): void {
    if (this.mode === PermissionTableMode.VIEW) {
      // All cells are disabled in view mode — mat-checkbox shouldn't fire here,
      // but guard explicitly so a stray event can't silently mutate state.
      return;
    }
    if (this.mode === PermissionTableMode.FORM) {
      if (editable.action === APGUTableEditableAction.CHANGE_ROW_PERMISSION) {
        this.handleRowToggle(editable as HTTableEditable<PermissionMatrixRow>);
        return;
      }
      this.handleFormCellToggle(editable as HTTableEditable<PermissionMatrixRow>);
      return;
    }
    this.changePermision(editable as HTTableEditable<UserPermissions>, editable.value);
  }

  private handleFormCellToggle(editable: HTTableEditable<PermissionMatrixRow>): void {
    const verb = this.actionToVerb(editable.action);
    if (!verb) return;
    const key = editable.data.keys?.[verb];
    if (!key || !this.granted?.[key]) {
      // Disabled cell — should not have fired, ignore defensively.
      return;
    }
    const checked = editable.value === 'true';
    const updated = new Set(this.selected);
    if (checked) {
      updated.add(key);
    } else {
      updated.delete(key);
    }
    this.emitSelection(updated);
  }

  private handleRowToggle(editable: HTTableEditable<PermissionMatrixRow>): void {
    const row = editable.data;
    const grantedKeys = Object.values(row.keys ?? {}).filter(
      (k): k is PermissionValues => Boolean(k) && Boolean(this.granted?.[k])
    );
    if (grantedKeys.length === 0) return;
    // mat-checkbox flips its value before the (change) event fires — `value` here is post-flip.
    const next = editable.value === 'true';
    const updated = new Set(this.selected);
    for (const key of grantedKeys) {
      if (next) {
        updated.add(key);
      } else {
        updated.delete(key);
      }
    }
    this.emitSelection(updated);
  }

  private emitSelection(updated: Set<PermissionValues>): void {
    this.selected = updated;
    const next = Array.from(updated);
    // Push fresh rows so cells re-render with the updated selection / header state.
    if (this.granted) {
      this.dataSource.loadFromMap(this.granted);
    }
    this.selectionChange.emit(next);
  }

  private actionToVerb(action: string): CrudVerb | null {
    const match = action.match(/-(create|read|update|delete)-/i);
    return match ? (match[1].toLowerCase() as CrudVerb) : null;
  }

  /**
   * Updates the permission for a specific user permission.
   * @param editable Editable object containing current permission, action and changed value.
   * @param value The new value for the permission (as a string).
   */
  private changePermision(editable: HTTableEditable<UserPermissions>, value: string): void {
    const capitalizedPerm = (editable['action'].match(/-(.*?)-/)?.[1] || '')
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase());
    const keyPerm = String((editable.data as unknown as DynamicModel)['originalName']) + capitalizedPerm;
    const boolValue = value === 'true' ? true : value === 'false' ? false : Boolean(value);
    // Payload
    const payload = {
      permissions: { [keyPerm]: boolValue }
    };

    const request$ = this.gs.update(SERV.ACCESS_PERMISSIONS_GROUPS, this.accesspermgroupId, payload);
    this.subscriptions.push(
      request$
        .pipe(
          catchError((error) => {
            this.alertService.showErrorMessage(`Failed to update permission!`);
            console.error('Failed to update permission:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.alertService.showSuccessMessage(
            `Changed permission in ${capitalizedPerm} on Permission Group #${this.accesspermgroupId}!`
          );
          this.reload();
        })
    );
  }
}

function getHeaderCheckboxState(
  grantedKeys: PermissionValues[],
  selected: Set<PermissionValues>
): HTTableHeaderCheckboxState {
  if (grantedKeys.length === 0) return HTTableHeaderCheckboxState.UNCHECKED;
  const selectedCount = grantedKeys.filter((k) => selected.has(k)).length;
  if (selectedCount === 0) return HTTableHeaderCheckboxState.UNCHECKED;
  if (selectedCount === grantedKeys.length) return HTTableHeaderCheckboxState.CHECKED;
  return HTTableHeaderCheckboxState.INDETERMINATE;
}
