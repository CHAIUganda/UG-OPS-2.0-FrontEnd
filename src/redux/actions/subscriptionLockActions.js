/* eslint-disable import/prefer-default-export */
import * as types from './actionTypes';

export const changeLock = (bool) => (dispatch) => {
  dispatch({
    type: types.CHANGE_SUBSRIPTION_LOCK,
    bool
  });
};
