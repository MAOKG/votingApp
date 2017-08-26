// @flow

import { combineReducers } from 'redux';
import { SET_USER } from './actions';

const user = (state = null, action: Action) => {
  if (action.type === SET_USER) {
    return action.payload;
  }
  return state;
};

const rootReducer = combineReducers({ user });

export default rootReducer;
