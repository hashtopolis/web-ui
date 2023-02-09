import { Action } from '@ngrx/store';

export const UPDATE_CONFIG = 'UPDATE_CONFIG';

export class UpdateCongif implements Action {
  readonly type = UPDATE_CONFIG;
}
