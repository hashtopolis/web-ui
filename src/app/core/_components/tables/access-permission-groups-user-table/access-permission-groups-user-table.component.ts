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
import { HTTableColumn, HTTableEditable } from '@components/tables/ht-table/ht-table.models';

import { AccessPermissionGroupsExpandDataSource } from '@datasources/access-permission-groups-expand.datasource';

import { PermissionValues } from '@src/app/core/_constants/userpermissions.config';
import { CrudVerb, PERMISSION_DENIED_TOOLTIP, PermissionMatrixRow } from '@src/app/shared/utils/permission-matrix';

export const PermissionTableMode = {
  EDIT: 'edit',
  FORM: 'form',
  /**
   * Read-only matrix. Like FORM, the data source is seeded from {@link granted}
   * and {@link selection} drives which cells render checked. Unlike FORM, every
   * cell is disabled — the table is a static visualization, not an input.
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
   * events emitted.
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
  @Input() selection: PermissionValues[] = [];

  /** Form mode — emitted when the user toggles a cell. */
  @Output() selectionChange = new EventEmitter<PermissionValues[]>();

  tableColumns: HTTableColumn[] = [];
  dataSource: AccessPermissionGroupsExpandDataSource;
  expand = 'userMembers';
  permissions = 1;

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
      // Form / view modes — seed the selection set synchronously.
      this.selected = new Set(this.selection);
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
      this.selected = new Set(this.selection);
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
    return [
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
    ];
  }

  /**
   * Build a single CRUD column descriptor. When the backend has no key for this
   * row × verb the cell renders empty in every mode (see {@link cellCheckbox}).
   * Otherwise the `checkbox` callback shape changes between modes:
   *   - edit: returns `value = row.<verb>`, no disabled/tooltip — the cell flip
   *     drives a PATCH.
   *   - form: returns `value = selection.has(row.keys[verb])`, with `disabled`
   *     and `tooltip` honoring whether the user holds the permission.
   */
  private crudColumn(verb: CrudVerb): HTTableColumn {
    const colId = VERB_TO_COL[verb];
    const action = VERB_TO_ACTION[verb];

    return {
      id: colId,
      dataKey: verb,
      isSortable: this.mode === PermissionTableMode.EDIT,
      checkbox: (perm: UserPermissions) => this.cellCheckbox(perm as PermissionMatrixRow, verb, action),
      export: async (perm: UserPermissions) => (perm[verb] ? 'true' : 'false')
    };
  }

  private cellCheckbox(row: PermissionMatrixRow, verb: CrudVerb, action: string): HTTableEditable<UserPermissions> {
    const key = row.keys?.[verb];
    if (!key) {
      // No backend permission exists for this row × verb — render an empty cell.
      // The editable-checkbox template hides cells whose value is 'undefined'.
      return {
        data: row,
        value: 'undefined',
        action
      };
    }

    if (this.mode === PermissionTableMode.EDIT) {
      return {
        data: row,
        value: row[verb] + '',
        action
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

  // --- Action functions ---
  exportActionClicked(event: ActionMenuEvent<(JUser | UserPermissions)[]>): void {
    const visibleColumnIds = this.table.displayedColumns.map(Number);
    const visibleColumns = this.tableColumns.filter((col) => visibleColumnIds.includes(col.id));
    this.exportService.handleExportAction<UserPermissions>(
      event as ActionMenuEvent<UserPermissions[]>,
      visibleColumns,
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

  private emitSelection(updated: Set<PermissionValues>): void {
    this.selected = updated;
    const next = Array.from(updated);
    // Push fresh rows so cells re-render with the updated selection.
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
    const verb = this.actionToVerb(editable.action);
    if (!verb) return;
    const keyPerm = (editable.data as PermissionMatrixRow).keys?.[verb];
    if (!keyPerm) return;
    const capitalizedPerm = verb.charAt(0).toUpperCase() + verb.slice(1);
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
