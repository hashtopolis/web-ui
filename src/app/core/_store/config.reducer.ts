import * as ConfigListActions from './config.actions'

export function configReducer(state, action: ConfigListActions.UpdateCongif){
  switch (action.type){
    case ConfigListActions.UPDATE_CONFIG:
      return {
        ...state,
      };
  }
}
