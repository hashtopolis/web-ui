/* eslint-disable @typescript-eslint/no-explicit-any */
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
  routerLink: Array<string | number>;
  tooltip?: string;
  icon?: { faIcon: IconDefinition; tooltip?: string };
}

export interface HTTableEditable<T> {
  data: T;
  value: string;
  action: string;
}

export interface CheckboxChangeEvent {
  row: any;
  columnType: string;
  checked: boolean;
}

export interface CheckboxFiles {
  [key: string]: boolean;
}

export type HTTableColumnType = 'dafeult | link | editable';

export interface HTTableColumn {
  type?: HTTableColumnType;
  id: number;
  dataKey?: string;
  position?: 'right' | 'left';
  isSortable?: boolean;
  isSearchable?: boolean;
  render?: (data: any) => SafeHtml;
  async?: (data: any) => Promise<SafeHtml>;
  export?: (data: any) => Promise<string>;
  truncate?: (data: any) => boolean;
  editable?: (data: any) => HTTableEditable<any>;
  checkbox?: (data: any) => HTTableEditable<any>;
  customCellColor?: customCellColorInput;
  routerLink?: (data: BaseModel) => Observable<HTTableRouterLink[]>;
  icon?: (data: BaseModel) => HTTableIcon;
  isCopy?: boolean;
}

/** Column def for selectable checkbox */
export const COL_SELECT = 100;
/** Column def for row action */
export const COL_ROW_ACTION = 200;
export interface customCellColorInput {
  value: (data: any) => number;
  treshold1: number;
  treshold2: number;
  type: number;
  isActive: (data: any) => boolean;
  lastTime: (data: any) => number;
}

export interface SortingColumn {
  dataKey: string;
  direction: SortDirection;
  isSortable: boolean;
}
