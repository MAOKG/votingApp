// @flow

import axios from 'axios';
import { SET_USER, SET_ALL_POLLS, ADD_POLL_DETAIL, SET_LOGIN_MODAL, SET_SIGNUP_MODAL } from './actions';

export function setLoginModal(isOpen: boolean) {
  return { type: SET_LOGIN_MODAL, payload: isOpen };
}

export function setSignupModal(isOpen: boolean) {
  return { type: SET_SIGNUP_MODAL, payload: isOpen };
}

export function setUser(user: User) {
  return { type: SET_USER, payload: user };
}
export function fetchUser() {
  return (dispatch: Function) => {
    axios
      .get('/api/auth/current_user')
      .then(res => {
        dispatch(setUser(res.data.user ? res.data.user : false));
      })
      .catch(error => {
        console.log('axios error', error); // eslint-disable-line no-console
      });
  };
}

export function setAllPolls(polls: Polls) {
  return { type: SET_ALL_POLLS, payload: polls };
}

export function fetchAllPolls() {
  return (dispatch: Function) => {
    axios
      .get('/api/polls')
      .then(res => {
        dispatch(setAllPolls(res.data));
      })
      .catch(error => {
        console.log('axios error', error); // eslint-disable-line no-console
      });
  };
}

export function addPollDetail(poll: PollDetail) {
  return { type: ADD_POLL_DETAIL, payload: poll };
}

export function fetchPollDetail(id: string) {
  return (dispatch: Function) => {
    axios
      .get(`/api/polls/${id}`)
      .then(res => {
        dispatch(addPollDetail(res.data));
      })
      .catch(error => {
        console.log('axios error', error); // eslint-disable-line no-console
      });
  };
}
