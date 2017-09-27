// @flow

import { combineReducers } from 'redux';
import {
  SET_USER,
  SET_ALL_POLLS,
  ADD_POLL_DETAIL,
  SET_LOGIN_MODAL,
  SET_SIGNUP_MODAL,
  SET_ADD_POLL_MODAL,
  SET_SEARCH_TERM
} from './actions';

const loginModal = (state = false, action: Action) => {
  if (action.type === SET_LOGIN_MODAL) {
    return action.payload;
  }
  return state;
};

const signupModal = (state = false, action: Action) => {
  if (action.type === SET_SIGNUP_MODAL) {
    return action.payload;
  }
  return state;
};

const addPollModal = (state = false, action: Action) => {
  if (action.type === SET_ADD_POLL_MODAL) {
    return action.payload;
  }
  return state;
};

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
    return Object.assign({}, state, { [action.payload.poll._id]: action.payload });
  }
  return state;
};

const searchTerm = (state = '', action: Action) => {
  if (action.type === SET_SEARCH_TERM) {
    return action.payload;
  }
  return state;
};

const rootReducer = combineReducers({ user, allPolls, pollDetail, loginModal, signupModal, addPollModal, searchTerm });

export default rootReducer;
