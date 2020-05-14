import * as types from '../actions/actionTypes';
import initialState from './initialState';

const notificationsReducer = (state = initialState.notifications, action) => {
  switch (action.type) {
  case types.INITIAL_NOTIFICATIONS: {
    return action.notifications;
  }
  case types.REMOVE_NOTIFICATION: {
    const newNotifications = state.filter((n) => n._id !== action.notificationId);
    return newNotifications;
  }
  case types.ADD_NOTIFICATION: {
    const newNotifications = [...state, action.newNotification];
    return newNotifications;
  }
  default: {
    return state;
  }
  }
};

export default notificationsReducer;
