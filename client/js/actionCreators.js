// @flow

import axios from 'axios';
import { SET_USER } from './actions';

export function setUser(user: User) {
  return { type: SET_USER, payload: user };
}
export function fetchUser() {
  return (dispatch: Function) => {
    axios
      .get('/api/current_user')
      .then(res => {
        dispatch(setUser(res.data ? res.data : false));
      })
      .catch(error => {
        console.log('axios error', error); // eslint-disable-line no-console
      });
  };
}
