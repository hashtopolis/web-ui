import { Action } from '@ngrx/store';

import * as ConfigListActions from './config.actions'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function configReducer(state: any, action: Action): any {
  switch (action.type){
    case ConfigListActions.UPDATE_CONFIG:
      return {
        ...state,
      };
    default:
      return state;
  }
}
