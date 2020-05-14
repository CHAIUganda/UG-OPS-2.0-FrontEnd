import * as types from './actionTypes';

export const setInitialNotifications = (notifications) => (dispatch) => {
  dispatch({
    type: types.INITIAL_NOTIFICATIONS,
    notifications
  });
};

export const removeNotification = (notificationId) => (dispatch) => {
  dispatch({
    type: types.REMOVE_NOTIFICATION,
    notificationId
  });
};

export const AddNotification = (newNotification) => (dispatch) => {
  dispatch({
    type: types.ADD_NOTIFICATION,
    newNotification
  });
};
