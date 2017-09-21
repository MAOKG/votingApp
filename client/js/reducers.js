// @flow

import { combineReducers } from 'redux';
import { SET_USER, SET_ALL_POLLS, ADD_POLL_DETAIL } from './actions';

const user = (state = null, action: Action) => {
  if (action.type === SET_USER) {
    return action.payload;
  }
  return state;
};

const allPolls = (state = null, action: Action) => {
  if (action.type === SET_ALL_POLLS) {
    return action.payload;
  }
  return state;
};

const pollDetail = (state = {}, action: Action) => {
  if (action.type === ADD_POLL_DETAIL) {
    if (!action.payload.error) {
      return Object.assign({}, state, { [action.payload.poll._id]: action.payload });
    }
  }
  return state;
};

const rootReducer = combineReducers({ user, allPolls, pollDetail });

export default rootReducer;
