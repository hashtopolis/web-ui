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
  label?: string | number;
  routerLink: Array<string | number> | null;
  tooltip?: string;
  icon?: { faIcon?: IconDefinition; tooltip?: string };
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
}

export interface CheckboxChangeEvent {
  row: BaseModel;
  columnType: string;
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
  parent?: string; // Parent is in order to build sort queries for relationships
}
