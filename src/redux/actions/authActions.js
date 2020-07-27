import * as types from './actionTypes';
// import { BASE_URL } from '../../config';

export const login = (user) => ({ type: types.LOGIN, user });

export const logout = () => ({ type: types.LOGOUT });

export const logUserIn = (userObject) => (dispatch, /* getState */) => {
  dispatch(login(userObject));
};

export const logUserOut = () => (dispatch, /* getState */) => {
  dispatch(logout());
};
