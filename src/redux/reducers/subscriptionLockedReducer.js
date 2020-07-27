import * as types from '../actions/actionTypes';
import initialState from './initialState';

const subscriptionLockReducer = (state = initialState.subscriptionLocked, action) => {
  switch (action.type) {
  case types.CHANGE_SUBSRIPTION_LOCK: {
    return action.bool;
  }
  default: {
    return state;
  }
  }
};

export default subscriptionLockReducer;
