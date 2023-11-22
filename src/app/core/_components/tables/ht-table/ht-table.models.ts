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
  | 'agent-binaries'
  | 'health-checks'
  | 'logs'
  | 'permissions'
  | 'cracks'
  | 'vouchers'
  | 'superhashlists';

export interface HTTableIcon {
  name: string;
  tooltip?: string;
  cls?: string;
}

export interface HTTableRouterLink {
  label?: string;
  routerLink: any[];
}

export interface HTTableColumn {
  name: string;
  dataKey: string;
  position?: 'right' | 'left';
  isSortable?: boolean;
  icons?: (data: any) => Promise<HTTableIcon[]>;
  render?: (data: any) => SafeHtml;
  async?: (data: any) => Promise<SafeHtml>;
  routerLink?: (data: any) => Promise<HTTableRouterLink[]>;
  export?: (data: any) => Promise<string>;
  truncate?: boolean;
}
