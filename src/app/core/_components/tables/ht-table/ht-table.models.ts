import { IconDefinition } from '@fortawesome/angular-fontawesome';
import { Observable } from 'rxjs';

import { SafeHtml } from '@angular/platform-browser';

import { BaseModel } from '@models/base.model';
import { TableSortDirection } from '@models/config-ui.model';

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
  // click handler for cells that trigger an action
  onClick?: () => void;
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
  // Optional display string - useful if text for displaying and value for editing differ, e.g. to show values with units
  display?: string;
  // Optional flag to hide value when not in editing mode - useful for only showing the edit icon
  hidden?: boolean;
}

/** Column type for checkbox toggle events in attack file tables. */
export const CheckboxColumnType = {
  CMD: 'CMD',
  CMD_PREPRO: 'CMD_PREPRO'
} as const;
export type CheckboxColumnType = (typeof CheckboxColumnType)[keyof typeof CheckboxColumnType];

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
  /**
   * Marks the column as numeric — right-aligns the cell and applies
   * tabular-nums so digits stack with consistent place-value alignment.
   * Use for counts, sizes, speeds, IDs, priorities, etc.
   */
  isNumeric?: boolean;
  isSortable?: boolean;
  isSearchable?: boolean;
  /**
   * Extra class applied to the column's th/td cells. Stable styling hook,
   * unlike the generated mat-column-<id> classes which shift when column
   * enum values are renumbered.
   */
  cssClass?: string;
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
  direction: TableSortDirection;
  isSortable: boolean;
  parent?: string | undefined; // Parent is in order to build sort queries for relationships
}
