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
  disabled?: boolean;
  // Optional matTooltip text for the cell — useful for explaining why a disabled cell can't be toggled.
  tooltip?: string;
  // indeterminate if checkbox is half filled (instead of full check) so we know that only some and not all entries are checked
  indeterminate?: boolean;
}

// indeterminate means some are checked, dash line in checkbox instead of checkmark
export const HTTableHeaderCheckboxState = {
  CHECKED: 'checked',
  UNCHECKED: 'unchecked',
  INDETERMINATE: 'indeterminate'
} as const;
export type HTTableHeaderCheckboxState = (typeof HTTableHeaderCheckboxState)[keyof typeof HTTableHeaderCheckboxState];

// allow rendering checkbox in the header instead of just label
export interface HTTableHeaderCheckbox {
  // state of checkbox based on column if all are selected, none are selected or some
  state: HTTableHeaderCheckboxState;
  // invoked when user clicks on the header checkbox
  change: (next: boolean) => void;
  tooltip?: string;
  // optional label shown next to the checkbox (column label)
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
  // if passed render a checkbox in the header instead of just label
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
