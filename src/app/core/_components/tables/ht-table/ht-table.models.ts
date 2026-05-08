import { IconDefinition } from '@fortawesome/angular-fontawesome';
import { Observable } from 'rxjs';

import { SortDirection } from '@angular/material/sort';
import { SafeHtml } from '@angular/platform-browser';

import { BaseModel } from '@models/base.model';

export type DataType =
  | 'agents'
  | 'agents-errors'
  | 'agents-status'
  | 'agents-assign'
  | 'agents-view'
  | 'access-groups'
  | 'access-groups-users'
  | 'access-permission-groups-user'
  | 'access-permission-groups-users'
  | 'access-groups-agents'
  | 'hashlists'
  | 'hashes'
  | 'search-hash'
  | 'chunks'
  | 'hashtypes'
  | 'files'
  | 'files-attack'
  | 'crackers'
  | 'preprocessors'
  | 'users'
  | 'notifications'
  | 'agent-binaries'
  | 'apiTokens'
  | 'health-checks'
  | 'health-check-agents'
  | 'logs'
  | 'permissions'
  | 'cracks'
  | 'vouchers'
  | 'pretasks'
  | 'tasks'
  | 'tasks-chunks'
  | 'tasks-supertasks'
  | 'supertasks'
  | 'supertasks-pretasks'
  | 'superhashlists';

export interface HTTableIcon {
  name: string;
  tooltip?: string;
  cls?: string;
}

export interface HTTableRouterLink {
  label?: string | number | undefined;
  routerLink: Array<string | number> | null;
  tooltip?: string | undefined;
  icon?: { faIcon?: IconDefinition | undefined; tooltip?: string | undefined };
  visualGraph?: {
    enabled: boolean;
    taskId: number;
    imageUrl?: string;
    overallProgress?: number;
    overallProgressLabel?: string;
  };
}

export interface HTTableEditable<T> {
  data: T;
  value: string;
  action: string;
  /** When true, the cell's checkbox renders as disabled and ignores clicks. */
  disabled?: boolean;
  /** Optional matTooltip text for the cell — useful for explaining why a disabled cell can't be toggled. */
  tooltip?: string;
  /**
   * When true, the cell's checkbox renders in indeterminate state (a partial selection
   * representation), regardless of `value`. Used by row-toggle cells in matrix-style
   * tables when only some — but not all — sub-items in the row are selected.
   */
  indeterminate?: boolean;
}

/** Tri-state of a header checkbox driving "select all in column" toggles. */
export const HTTableHeaderCheckboxState = {
  CHECKED: 'checked',
  UNCHECKED: 'unchecked',
  INDETERMINATE: 'indeterminate'
} as const;
export type HTTableHeaderCheckboxState = (typeof HTTableHeaderCheckboxState)[keyof typeof HTTableHeaderCheckboxState];

/**
 * Header-level checkbox descriptor for a column. When a column's
 * `headerCheckbox` callback is supplied, ht-table renders a `<mat-checkbox>`
 * in the column header instead of the static label. Used to drive
 * "select all rows in this column" toggles for matrix-style tables.
 */
export interface HTTableHeaderCheckbox {
  /** Tri-state representing the column's aggregate selection. */
  state: HTTableHeaderCheckboxState;
  /** Invoked when the user clicks the header checkbox. */
  change: (next: boolean) => void;
  /** Optional matTooltip text displayed on the header checkbox. */
  tooltip?: string;
  /** Optional label rendered next to the checkbox (defaults to the column label). */
  label?: string;
}

/** Column type for checkbox toggle events in attack file tables. */
export type CheckboxColumnType = 'CMD' | 'CMD_PREPRO';

export interface CheckboxChangeEvent {
  row: BaseModel;
  columnType: CheckboxColumnType;
  checked: boolean;
}

export interface CheckboxFiles {
  [key: string]: boolean;
}

export type HTTableColumnType = 'default' | 'link' | 'editable';

export interface HTTableColumn {
  type?: HTTableColumnType;
  id: number;
  dataKey?: string;
  position?: 'right' | 'left';
  isSortable?: boolean;
  isSearchable?: boolean;
  render?(data: BaseModel): SafeHtml;
  async?(data: BaseModel): Promise<SafeHtml>;
  export?(data: BaseModel): Promise<string>;
  truncate?(data: BaseModel): boolean;
  editable?(data: BaseModel): HTTableEditable<BaseModel>;
  checkbox?(data: BaseModel): HTTableEditable<BaseModel>;
  customCellColor?: customCellColorInput;
  routerLink?(data: BaseModel): Observable<HTTableRouterLink[]>;
  icon?(data: BaseModel): HTTableIcon;
  isCopy?: boolean;
  parent?: string; //parent is to build relation sort query in format "task.taskName"
  /**
   * When supplied, the column header renders a mat-checkbox bound to the returned
   * descriptor instead of (or in addition to) the static label. Used by matrix-style
   * tables to expose a "select all rows in this column" toggle.
   */
  headerCheckbox?(): HTTableHeaderCheckbox;
  /**
   * When true, this column is treated as structural: it is always rendered (regardless
   * of the user's stored column-visibility config) and is hidden from the column-selection
   * dialog. Use for control columns like a per-row toggle that the form depends on.
   */
  alwaysShown?: boolean;
}

/** Stringified column enum value used as mat-table column identifier */
export type ColumnDefId = string;

/** Column def for selectable checkbox */
export const COL_SELECT = 100;
/** Column def for row action */
export const COL_ROW_ACTION = 200;
export interface customCellColorInput {
  value(data: BaseModel): number;
  treshold1: number;
  treshold2: number;
  type: number;
  isActive(data: BaseModel): boolean;
  lastTime(data: BaseModel): number;
}

export interface SortingColumn {
  id?: number;
  dataKey: string;
  direction: SortDirection | string;
  isSortable: boolean;
  parent?: string | undefined; // Parent is in order to build sort queries for relationships
}
