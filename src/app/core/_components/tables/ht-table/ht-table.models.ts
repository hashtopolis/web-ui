/* eslint-disable @typescript-eslint/no-explicit-any */
import { SafeHtml } from '@angular/platform-browser';

export type DataType =
  | 'agents'
  | 'hashlists'
  | 'chunks'
  | 'hashtypes'
  | 'files'
  | 'crackers'
  | 'preprocessors'
  | 'users'
  | 'access-groups'
  | 'notifications'
  | 'agent-binaries'
  | 'health-checks'
  | 'logs'
  | 'permissions'
  | 'cracks'
  | 'tasks'
  | 'superhashlists';

export interface HTTableIcon {
  name: string;
  tooltip?: string;
  cls?: string;
}

export interface HTTableRouterLink {
  label?: string;
  routerLink: any[];
  tooltip?: string;
}

export interface HTTableEditable<T> {
  data: T;
  value: string;
  action: string;
}

export type HTTableColumnType = 'dafeult | link | editable';

export interface HTTableColumn {
  type?: HTTableColumnType;
  id: number;
  dataKey: string;
  position?: 'right' | 'left';
  isSortable?: boolean;
  icons?: (data: any) => Promise<HTTableIcon[]>;
  render?: (data: any) => SafeHtml;
  async?: (data: any) => Promise<SafeHtml>;
  routerLink?: (data: any) => Promise<HTTableRouterLink[]>;
  export?: (data: any) => Promise<string>;
  truncate?: boolean;
  editable?: (data: any) => HTTableEditable<any>;
}
