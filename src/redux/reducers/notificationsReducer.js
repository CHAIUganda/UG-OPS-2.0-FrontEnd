import * as types from '../actions/actionTypes';
import initialState from './initialState';

const notificationsReducer = (state = initialState.notifications, action) => {
  switch (action.type) {
  case types.INITIAL_NOTIFICATIONS:
    return {
      ...state,
      ...action.notifications
    };

  default:
    return state;
  }
};

export default notificationsReducer;
